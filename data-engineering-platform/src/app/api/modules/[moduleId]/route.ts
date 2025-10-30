import { NextResponse } from 'next/server'
import { MODULE_MAPPING, parseAllLessons } from '@/lib/lesson-parser'
import { join } from 'path'

/**
 * GET /api/modules/[moduleId]
 * Returns a single module with its lessons (uses cached/parallel parsing)
 */
export async function GET(
  request: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    const moduleId = decodeURIComponent(params.moduleId)
    const startTime = Date.now()
    
    // Check if module exists
    const moduleInfo = Object.values(MODULE_MAPPING).find(m => m.id === moduleId)
    if (!moduleInfo) {
      return NextResponse.json(
        {
          success: false,
          error: 'Module not found',
        },
        { status: 404 }
      )
    }
    
    // Try multiple possible paths for lessons directory
    const { existsSync } = await import('fs')
    const possiblePaths = [
      join(process.cwd(), '..', '..', 'lessons'),
      join(process.cwd(), 'lessons'),
      join(process.cwd(), '..', 'lessons'),
    ]
    
    let lessonsDir: string | null = null
    for (const path of possiblePaths) {
      if (existsSync(path)) {
        lessonsDir = path
        break
      }
    }
    
    if (!lessonsDir) {
      return NextResponse.json(
        {
          success: false,
          error: 'Lessons directory not found',
        },
        { status: 500 }
      )
    }
    const allLessons = await parseAllLessons(lessonsDir)
    
    // Filter lessons for this module (fast operation after parallel parsing)
    const lessons = allLessons.filter(lesson => lesson.moduleId === moduleId)
    
    // Process module metadata in parallel with lesson extraction
    const [moduleData] = await Promise.all([
      Promise.resolve({
        id: moduleInfo.id,
        title: moduleInfo.name,
        description: getModuleDescription(moduleInfo.id),
        icon: getModuleIcon(moduleInfo.id),
        estimatedHours: calculateEstimatedHours(lessons),
        lessons: lessons.length,
        labs: Math.ceil(lessons.length / 10),
        topics: extractTopicsFromLessons(lessons),
        prerequisites: getPrerequisites(moduleInfo.id),
        learningObjectives: getLearningObjectives(moduleInfo.id),
      })
    ])
    
    const duration = Date.now() - startTime
    console.log(`[Modules API] Module ${moduleId} processed in ${duration}ms`)
    
    return NextResponse.json({
      success: true,
      module: moduleData,
      lessons: lessons.slice(0, 50), // Return first 50 lessons for preview
    })
  } catch (error) {
    console.error('Error fetching module:', error)
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
  return Math.ceil(lessons.reduce((total, lesson) => total + (lesson.estimatedTime || 30), 0) / 60)
}

function extractTopicsFromLessons(lessons: any[]): string[] {
  const topics = new Set<string>()
  lessons.forEach(lesson => {
    lesson.topics?.forEach((topic: string) => topics.add(topic))
  })
  return Array.from(topics).slice(0, 15)
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

function getLearningObjectives(moduleId: string): string[] {
  const objectives: Record<string, string[]> = {
    'module-8': [
      'Understand Snowflake authentication methods and best practices',
      'Master role-based access control (RBAC) implementation',
      'Implement security policies and data masking',
      'Configure network policies and secure data sharing',
    ],
  }
  
  // Generate default objectives if not defined
  if (!objectives[moduleId]) {
    return [
      `Master key concepts in ${MODULE_MAPPING[Object.keys(MODULE_MAPPING).find(k => MODULE_MAPPING[k].id === moduleId) || '']?.name || 'this module'}`,
      'Apply best practices in real-world scenarios',
      'Build practical skills through hands-on exercises',
    ]
  }
  
  return objectives[moduleId]
}

