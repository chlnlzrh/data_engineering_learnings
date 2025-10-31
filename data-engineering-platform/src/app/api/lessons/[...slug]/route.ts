import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Lesson content parser
function parseLessonContent(content: string) {
  // Normalize line endings first
  const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const lines = normalizedContent.split('\n')
  
  // Extract title (first # heading)
  const titleMatch = normalizedContent.match(/^#\s+(.+)$/m)
  const title = titleMatch ? titleMatch[1] : 'Untitled Lesson'
  
  // Extract complexity level
  const complexityMatch = normalizedContent.match(/\*\*Complexity Level:\*\*\s*\[([FIA])\]/i)
  const complexity = complexityMatch ? complexityMatch[1] : 'F'
  
  // Estimate reading time (average 200 words per minute)
  const wordCount = normalizedContent.split(/\s+/).length
  const estimatedTime = Math.ceil(wordCount / 200)
  
  return {
    title,
    complexity,
    estimatedTime,
    content: normalizedContent
  }
}

// Find lesson file by matching parts of the slug
function findLessonFile(slug: string[]): string | null {
  const lessonsDir = path.join(process.cwd(), '..', 'lessons')
  
  if (!fs.existsSync(lessonsDir)) {
    return null
  }
  
  const files = fs.readdirSync(lessonsDir)
  const mdFiles = files.filter(file => file.endsWith('.md'))
  
  // Try to match the slug parts to find the right lesson file
  const slugStr = slug.join('-').toLowerCase()
  
  // Look for exact match first
  let matchedFile = mdFiles.find(file => {
    const fileNameLower = file.toLowerCase()
    return fileNameLower.includes(slugStr) || 
           slug.some(part => fileNameLower.includes(part.toLowerCase()))
  })
  
  // If no match found, try partial matching
  if (!matchedFile) {
    matchedFile = mdFiles.find(file => {
      const fileNameLower = file.toLowerCase()
      return slug.some(part => 
        part.length > 3 && fileNameLower.includes(part.toLowerCase())
      )
    })
  }
  
  return matchedFile ? path.join(lessonsDir, matchedFile) : null
}

// Determine module ID from lesson filename or content
function extractModuleId(filename: string, content: string): string {
  // Try to extract from filename patterns
  const modulePatterns = [
    /module-(\d+)/i,
    /(Data-and-Database-Fundamentals|SQL-ELT-Concepts|Data-Warehousing-Principles|Data-Modeling|Snowflake-Specific-Knowledge|ETLELT-Design-Best-Practices|Data-Governance-Quality-Metadata|Performance-Optimization-Troubleshooting|Reporting-BI-Concepts|UnixLinux-File-Handling|Version-Control-Team-Collaboration|Orchestration-Scheduling-Tools|CI-CD-and-Deployment-Practices|Monitoring-Observability|Cloud-Computing-Fundamentals|Additional-Technical-Skills|Data-Transformation-with-dbt|Soft-Skills-Professional-Practices|Capstone-Projects)/i
  ]
  
  // Module topic to ID mapping
  const topicToModule: { [key: string]: string } = {
    'data-and-database-fundamentals': 'module-1',
    'sql-elt-concepts': 'module-2', 
    'data-warehousing-principles': 'module-3',
    'data-modeling': 'module-4',
    'snowflake-specific-knowledge': 'module-5',
    'etlelt-design-best-practices': 'module-6',
    'data-governance-quality-metadata': 'module-7',
    'performance-optimization-troubleshooting': 'module-8',
    'reporting-bi-concepts': 'module-9',
    'unixlinux-file-handling': 'module-10',
    'version-control-team-collaboration': 'module-11',
    'orchestration-scheduling-tools': 'module-12',
    'ci-cd-and-deployment-practices': 'module-13',
    'monitoring-observability': 'module-14',
    'cloud-computing-fundamentals': 'module-15',
    'additional-technical-skills': 'module-16',
    'data-transformation-with-dbt': 'module-17',
    'soft-skills-professional-practices': 'module-18',
    'capstone-projects': 'module-19'
  }
  
  // Check filename for topic match
  const filenameLower = filename.toLowerCase()
  for (const [topic, moduleId] of Object.entries(topicToModule)) {
    if (filenameLower.includes(topic)) {
      return moduleId
    }
  }
  
  // Default fallback
  return 'module-1'
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    const { slug } = params
    
    if (!slug || slug.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Lesson path required' },
        { status: 400 }
      )
    }
    
    // Find the lesson file
    const lessonFilePath = findLessonFile(slug)
    
    if (!lessonFilePath || !fs.existsSync(lessonFilePath)) {
      return NextResponse.json(
        { success: false, error: 'Lesson not found' },
        { status: 404 }
      )
    }
    
    // Read and parse the lesson content
    const content = fs.readFileSync(lessonFilePath, 'utf-8')
    const lessonData = parseLessonContent(content)
    
    // Extract module ID
    const filename = path.basename(lessonFilePath)
    const moduleId = extractModuleId(filename, content)
    
    const lesson = {
      ...lessonData,
      moduleId,
      filename
    }
    
    return NextResponse.json({
      success: true,
      lesson
    })
    
  } catch (error) {
    console.error('Error fetching lesson:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}