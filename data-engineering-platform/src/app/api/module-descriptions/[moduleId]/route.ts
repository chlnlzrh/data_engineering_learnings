import { NextResponse } from 'next/server'
import { getModuleDescription } from '@/lib/module-description-parser'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const { moduleId } = await params
    
    if (!moduleId) {
      return NextResponse.json(
        { success: false, error: 'Module ID is required' },
        { status: 400 }
      )
    }

    const description = getModuleDescription(moduleId)
    
    if (!description) {
      return NextResponse.json(
        { success: false, error: `Module description not found for ${moduleId}` },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      moduleId,
      description
    })
  } catch (error) {
    console.error(`Error loading module description:`, error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to load module description',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}