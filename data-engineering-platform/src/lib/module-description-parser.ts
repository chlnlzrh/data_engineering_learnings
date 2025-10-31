import fs from 'fs'
import path from 'path'

export interface ModuleDescription {
  id: string
  title: string
  description: string
  duration: number
  lessons: number
  labs: number
  prerequisites: string[]
  learningObjectives: string[]
  topicCategories: {
    [category: string]: string[]
  }
  skillsAssessment: string[]
  nextSteps: string[]
}

export interface ParsedModuleContent {
  metadata: {
    title: string
    description: string
    duration: number
    lessons: number
    labs: number
  }
  prerequisites: string[]
  learningObjectives: string[]
  topicCategories: { [category: string]: string[] }
  skillsAssessment: string[]
  nextSteps: string[]
}

/**
 * Parse a module description markdown file and extract structured content
 */
export function parseModuleDescription(filePath: string): ParsedModuleContent | null {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`Module description file not found: ${filePath}`)
      return null
    }

    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')
    
    // Extract title and basic info
    const title = lines.find(line => line.startsWith('# '))?.replace('# ', '').trim() || ''
    const description = lines[2]?.trim() || ''
    
    // Extract duration, lessons, labs from the metadata section
    const durationMatch = content.match(/\*\*Duration:\*\*\s*(\d+)\s*hours?/i)
    const lessonsMatch = content.match(/\*\*Lessons:\*\*\s*(\d+)\s*lessons?/i)
    const labsMatch = content.match(/\*\*Labs:\*\*\s*(\d+)\s*labs?/i)
    
    const duration = durationMatch ? parseInt(durationMatch[1]) : 0
    const lessons = lessonsMatch ? parseInt(lessonsMatch[1]) : 0
    const labs = labsMatch ? parseInt(labsMatch[1]) : 0

    // Extract prerequisites
    const prerequisites: string[] = []
    const prereqSection = extractSection(content, '## Prerequisites')
    if (prereqSection) {
      const prereqLines = prereqSection.split('\n')
      for (const line of prereqLines) {
        if (line.trim().startsWith('- **') && line.includes('**')) {
          const prereq = line.replace(/- \*\*(.*?)\*\*.*/, '$1').trim()
          if (prereq && prereq !== 'None - This is a foundational module') {
            prerequisites.push(prereq)
          }
        }
      }
    }

    // Extract learning objectives
    const learningObjectives: string[] = []
    const objectivesSection = extractSection(content, '## Learning Objectives')
    if (objectivesSection) {
      const objLines = objectivesSection.split('\n')
      for (const line of objLines) {
        if (line.trim().startsWith('- ') && !line.includes('**')) {
          learningObjectives.push(line.replace('- ', '').trim())
        }
      }
    }

    // Extract topic categories
    const topicCategories: { [category: string]: string[] } = {}
    const topicsSection = extractSection(content, '## Topics Covered')
    if (topicsSection) {
      const sections = topicsSection.split(/### (.+)/g)
      for (let i = 1; i < sections.length; i += 2) {
        const categoryName = sections[i].trim()
        const categoryContent = sections[i + 1] || ''
        const topics: string[] = []
        
        const categoryLines = categoryContent.split('\n')
        for (const line of categoryLines) {
          if (line.trim().startsWith('- **') && line.includes('**')) {
            const topic = line.replace(/- \*\*(.*?)\*\*.*/, '$1').trim()
            if (topic) {
              topics.push(topic)
            }
          }
        }
        
        if (topics.length > 0) {
          topicCategories[categoryName] = topics
        }
      }
    }

    // Extract skills assessment
    const skillsAssessment: string[] = []
    const skillsSection = extractSection(content, '## Skills Assessment')
    if (skillsSection) {
      const skillLines = skillsSection.split('\n')
      for (const line of skillLines) {
        if (line.trim().startsWith('- ✅')) {
          skillsAssessment.push(line.replace('- ✅ ', '').trim())
        }
      }
    }

    // Extract next steps (placeholder for now)
    const nextSteps: string[] = []

    return {
      metadata: {
        title,
        description,
        duration,
        lessons,
        labs
      },
      prerequisites,
      learningObjectives,
      topicCategories,
      skillsAssessment,
      nextSteps
    }
  } catch (error) {
    console.error(`Error parsing module description ${filePath}:`, error)
    return null
  }
}

/**
 * Extract a section from markdown content between headings
 */
function extractSection(content: string, sectionHeading: string): string | null {
  const lines = content.split('\n')
  let inSection = false
  let sectionContent: string[] = []
  
  for (const line of lines) {
    if (line.trim() === sectionHeading) {
      inSection = true
      continue
    }
    
    if (inSection) {
      // Stop at next heading of same or higher level
      if (line.startsWith('## ') && line.trim() !== sectionHeading) {
        break
      }
      sectionContent.push(line)
    }
  }
  
  return inSection ? sectionContent.join('\n').trim() : null
}

// Cache for module descriptions to avoid repeated file reads
let descriptionsCache: Map<string, ParsedModuleContent> | null = null
let cacheTimestamp: number = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * Load all module descriptions from the descriptions directory with caching
 */
export function loadAllModuleDescriptions(): Map<string, ParsedModuleContent> {
  const now = Date.now()
  
  // Return cached version if still valid
  if (descriptionsCache && (now - cacheTimestamp) < CACHE_TTL) {
    return descriptionsCache
  }
  
  const descriptionsMap = new Map<string, ParsedModuleContent>()
  
  // Try multiple possible paths for modules-descriptions directory
  const possiblePaths = [
    path.join(process.cwd(), 'modules-descriptions'),
    path.join(process.cwd(), '..', 'modules-descriptions'),
    path.join(process.cwd(), '..', '..', 'modules-descriptions'),
  ]
  
  let descriptionsDir: string | null = null
  for (const dirPath of possiblePaths) {
    if (fs.existsSync(dirPath)) {
      descriptionsDir = dirPath
      break
    }
  }
  
  if (!descriptionsDir) {
    console.warn('modules-descriptions directory not found in any of the expected paths')
    return descriptionsMap
  }
  
  try {

    const files = fs.readdirSync(descriptionsDir)
    const mdFiles = files.filter(file => file.endsWith('.md'))
    
    for (const file of mdFiles) {
      // Extract module ID from filename (e.g., "module-1-data-and-database-fundamentals--2024-10-30.md")
      const moduleIdMatch = file.match(/^(module-\d+)/)
      if (!moduleIdMatch) continue
      
      const moduleId = moduleIdMatch[1]
      const filePath = path.join(descriptionsDir, file)
      const parsed = parseModuleDescription(filePath)
      
      if (parsed) {
        descriptionsMap.set(moduleId, parsed)
      }
    }
    
    // Update cache
    descriptionsCache = descriptionsMap
    cacheTimestamp = now
    
    console.log(`Loaded ${descriptionsMap.size} module descriptions`)
  } catch (error) {
    console.error('Error loading module descriptions:', error)
  }
  
  return descriptionsMap
}

/**
 * Get module description by ID
 */
export function getModuleDescription(moduleId: string): ParsedModuleContent | null {
  const descriptions = loadAllModuleDescriptions()
  return descriptions.get(moduleId) || null
}