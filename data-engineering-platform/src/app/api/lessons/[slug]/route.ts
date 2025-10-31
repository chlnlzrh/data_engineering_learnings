import { NextResponse } from 'next/server'
import { getLessonBySlug } from '@/lib/lesson-parser'
import { join } from 'path'

/**
 * GET /api/lessons/[slug]
 * Returns a single lesson by slug
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const decodedSlug = decodeURIComponent(slug)
    
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
    
    const lesson = await getLessonBySlug(decodedSlug, lessonsDir)
    
    if (!lesson) {
      return NextResponse.json(
        {
          success: false,
          error: 'Lesson not found',
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      lesson,
    })
  } catch (error) {
    console.error('Error fetching lesson:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

