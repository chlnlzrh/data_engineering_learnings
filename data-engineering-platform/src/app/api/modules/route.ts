import { NextResponse } from 'next/server'
import { MODULE_MAPPING } from '@/lib/lesson-parser'
import { parseAllLessons } from '@/lib/lesson-parser'
import { join } from 'path'

/**
 * GET /api/modules
 * Returns all modules with their metadata (processed in parallel)
 */
export async function GET() {
  try {
    const startTime = Date.now()
    console.log(`[Modules API] Starting parallel module processing...`)
    
    // Try multiple possible paths for lessons directory
    const possiblePaths = [
      join(process.cwd(), '..', '..', 'lessons'),
      join(process.cwd(), 'lessons'),
      join(process.cwd(), '..', 'lessons'),
    ]
    
    const { existsSync } = await import('fs')
    let lessonsDir: string | null = null
    for (const path of possiblePaths) {
      if (existsSync(path)) {
        lessonsDir = path
        break
      }
    }
    
    if (!lessonsDir) {
      console.error(`[Modules API] Lessons directory not found. Tried paths:`, possiblePaths)
      return NextResponse.json(
        {
          success: false,
          error: 'Lessons directory not found',
        },
        { status: 500 }
      )
    }
    
    // Parse all lessons in parallel (uses 20 threads)
    const allLessons = await parseAllLessons(lessonsDir)
    console.log(`[Modules API] Parsed ${allLessons.length} lessons`)
    
    // Group lessons by module ID (parallel processing)
    const lessonsByModule = new Map<string, typeof allLessons>()
    allLessons.forEach(lesson => {
      const existing = lessonsByModule.get(lesson.moduleId) || []
      existing.push(lesson)
      lessonsByModule.set(lesson.moduleId, existing)
    })
    
    // Process all modules in parallel batches (20 at a time)
    const moduleEntries = Object.entries(MODULE_MAPPING)
    const batchSize = 20 // Process all 20 modules in parallel
    
    const modulesPromises = moduleEntries.map(async ([prefix, moduleInfo]) => {
      const moduleLessons = lessonsByModule.get(moduleInfo.id) || []
      
      return {
        id: moduleInfo.id,
        title: moduleInfo.name,
        description: getModuleDescription(moduleInfo.id),
        icon: getModuleIcon(moduleInfo.id),
        estimatedHours: calculateEstimatedHours(moduleLessons),
        lessons: moduleLessons.length,
        labs: Math.ceil(moduleLessons.length / 10), // Estimate: ~1 lab per 10 lessons
        topics: extractTopicsFromLessons(moduleLessons),
        prerequisites: getPrerequisites(moduleInfo.id),
      }
    })
    
    // Execute all module processing in parallel
    const modules = await Promise.all(modulesPromises)
    
    const duration = Date.now() - startTime
    console.log(`[Modules API] Processed ${modules.length} modules in ${duration}ms`)
    
    return NextResponse.json({
      success: true,
      count: modules.length,
      modules,
    })
  } catch (error) {
    console.error('Error fetching modules:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

function getModuleDescription(moduleId: string): string {
  const descriptions: Record<string, string> = {
    'module-1': 'Master the foundational concepts of relational databases, data types, schema design, and ACID properties essential for data engineering.',
    'module-2': 'Dive deep into SQL fundamentals, advanced queries, window functions, and understand the ELT paradigm for modern data processing.',
    'module-3': 'Learn data warehouse architecture, loading patterns, and data quality principles for enterprise-scale analytics.',
    'module-4': 'Master dimensional modeling, star schemas, slowly changing dimensions, and entity relationship diagrams.',
    'module-5': 'Deep dive into Snowflake architecture, virtual warehouses, data loading, and platform-specific optimizations.',
    'module-6': 'Pipeline design principles, transformation patterns, and incremental loading strategies.',
    'module-7': 'Data governance principles, quality implementation, and testing strategies for data pipelines.',
    'module-8': 'Authentication, authorization, RBAC, and security best practices in Snowflake.',
    'module-9': 'BI tools, ThoughtSpot, visualization design, and semantic layers for analytics.',
    'module-10': 'Unix fundamentals, shell scripting, file processing, and log analysis techniques.',
    'module-11': 'Git fundamentals, branching strategies, and collaboration workflows for data engineering teams.',
    'module-12': 'Query performance analysis, optimization techniques, and cost management strategies.',
    'module-13': 'Environment management, deployment automation, and testing in CI/CD pipelines.',
    'module-14': 'Pipeline monitoring, data quality tracking, and alerting systems for observability.',
    'module-15': 'Workflow orchestration, DAG design, and scheduling best practices with modern tools.',
    'module-16': 'dbt core concepts, testing, documentation, and advanced features for data transformation.',
    'module-17': 'Communication, documentation, collaboration, and professional development skills.',
    'module-18': 'Business metrics, requirements gathering, and industry knowledge for data engineers.',
    'module-19': 'JSON handling, APIs, data formats, and Python for data engineering workflows.',
    'module-20': 'Data mesh, DataOps, real-time streaming, and modern data architecture patterns.',
  }
  return descriptions[moduleId] || 'Learn essential data engineering concepts and practices.'
}

function getModuleIcon(moduleId: string): string {
  // Return icon name for client-side mapping
  const iconMap: Record<string, string> = {
    'module-1': 'Database',
    'module-2': 'Code',
    'module-3': 'Cloud',
    'module-4': 'Workflow',
    'module-5': 'Cloud',
    'module-6': 'Cog',
    'module-7': 'Shield',
    'module-8': 'Shield',
    'module-9': 'BarChart3',
    'module-10': 'Terminal',
    'module-11': 'GitBranch',
    'module-12': 'Gauge',
    'module-13': 'Settings',
    'module-14': 'Eye',
    'module-15': 'Workflow',
    'module-16': 'Wrench',
    'module-17': 'Users',
    'module-18': 'Briefcase',
    'module-19': 'Code',
    'module-20': 'Sparkles',
  }
  return iconMap[moduleId] || 'BookOpen'
}

function calculateEstimatedHours(lessons: any[]): number {
  return lessons.reduce((total, lesson) => total + (lesson.estimatedTime || 30), 0) / 60
}

function extractTopicsFromLessons(lessons: any[]): string[] {
  const topics = new Set<string>()
  lessons.forEach(lesson => {
    lesson.topics?.forEach((topic: string) => topics.add(topic))
  })
  return Array.from(topics).slice(0, 10) // Limit to top 10 topics
}

function getPrerequisites(moduleId: string): string[] {
  const prereqs: Record<string, string[]> = {
    'module-2': ['module-1'],
    'module-3': ['module-1', 'module-2'],
    'module-4': ['module-1', 'module-2', 'module-3'],
    'module-5': ['module-1', 'module-2', 'module-3', 'module-4'],
    'module-6': ['module-1', 'module-2', 'module-3'],
    'module-7': ['module-1', 'module-2'],
    'module-8': ['module-5'],
    'module-9': ['module-4'],
    'module-13': ['module-6'],
    'module-14': ['module-13'],
    'module-15': ['module-6'],
    'module-16': ['module-4'],
  }
  return prereqs[moduleId] || []
}

