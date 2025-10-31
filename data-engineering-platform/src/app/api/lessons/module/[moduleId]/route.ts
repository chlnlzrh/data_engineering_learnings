import { NextResponse } from 'next/server'
import { getLessonsByModule } from '@/lib/lesson-parser'
import { join } from 'path'

/**
 * GET /api/lessons/module/[moduleId]
 * Returns all lessons for a specific module
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const { moduleId } = await params
    const decodedModuleId = decodeURIComponent(moduleId)
    
    // Lessons directory is at root level: ../../lessons from src/app/api
    const lessonsDir = join(process.cwd(), '..', '..', 'lessons')
    
    const lessons = await getLessonsByModule(decodedModuleId, lessonsDir)
    
    return NextResponse.json({
      success: true,
      moduleId: decodedModuleId,
      count: lessons.length,
      lessons,
    })
  } catch (error) {
    console.error('Error fetching module lessons:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

