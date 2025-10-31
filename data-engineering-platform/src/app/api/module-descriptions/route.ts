import { NextResponse } from 'next/server'
import { loadAllModuleDescriptions } from '@/lib/module-description-parser'

export async function GET() {
  try {
    const descriptions = loadAllModuleDescriptions()
    
    // Convert Map to object for JSON serialization
    const descriptionsObj = Object.fromEntries(descriptions)
    
    return NextResponse.json({
      success: true,
      count: descriptions.size,
      descriptions: descriptionsObj
    })
  } catch (error) {
    console.error('Error loading module descriptions:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to load module descriptions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}