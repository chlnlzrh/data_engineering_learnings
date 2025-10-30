import { NextResponse } from 'next/server'
import { parseAllLessons } from '@/lib/lesson-parser'
import { join } from 'path'
import { existsSync } from 'fs'

/**
 * GET /api/lessons
 * Returns all lessons parsed in parallel
 */
export async function GET() {
  try {
    // Try multiple possible paths for lessons directory
    const possiblePaths = [
      join(process.cwd(), '..', '..', 'lessons'), // From data-engineering-platform/src/app/api
      join(process.cwd(), 'lessons'), // If running from root
      join(process.cwd(), '..', 'lessons'), // Alternative path
    ]
    
    let lessonsDir: string | null = null
    for (const path of possiblePaths) {
      if (existsSync(path)) {
        lessonsDir = path
        console.log(`[Lessons API] Found lessons directory at: ${path}`)
        break
      }
    }
    
    if (!lessonsDir) {
      console.error(`[Lessons API] Lessons directory not found. Tried paths:`, possiblePaths)
      return NextResponse.json(
        {
          success: false,
          error: 'Lessons directory not found. Checked paths: ' + possiblePaths.join(', '),
        },
        { status: 500 }
      )
    }
    
    console.log(`[Lessons API] Starting to parse lessons from: ${lessonsDir}`)
    const lessons = await parseAllLessons(lessonsDir)
    console.log(`[Lessons API] Successfully parsed ${lessons.length} lessons`)
    
    return NextResponse.json({
      success: true,
      count: lessons.length,
      lessons,
    })
  } catch (error) {
    console.error('[Lessons API] Error fetching lessons:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error('[Lessons API] Error stack:', errorStack)
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: errorStack,
      },
      { status: 500 }
    )
  }
}

