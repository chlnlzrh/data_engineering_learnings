"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  BookOpen, 
  Clock, 
  Filter,
  Database,
  Code,
  Cloud,
  Workflow,
  Cog,
  Shield,
  BarChart3,
  Terminal,
  GitBranch,
  Gauge,
  Eye,
  Settings,
  Wrench,
  Users,
  Briefcase,
  Sparkles,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { LessonMetadata } from "@/lib/lesson-parser"

// Module icon mapping
const moduleIcons = {
  "module-1": Database,
  "module-2": Code,
  "module-3": Cloud,
  "module-4": Workflow,
  "module-5": Cloud,
  "module-6": Cog,
  "module-7": Shield,
  "module-8": Shield,
  "module-9": BarChart3,
  "module-10": Terminal,
  "module-11": GitBranch,
  "module-12": Gauge,
  "module-13": Settings,
  "module-14": Eye,
  "module-15": Workflow,
  "module-16": Wrench,
  "module-17": Users,
  "module-18": Briefcase,
  "module-19": Code,
  "module-20": Sparkles,
}

const complexityLabels = {
  F: "Foundational",
  I: "Intermediate", 
  A: "Advanced",
  E: "Expert"
}

const complexityColors = {
  F: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  I: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", 
  A: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  E: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<LessonMetadata[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedModule, setSelectedModule] = useState("all")
  const [selectedComplexity, setSelectedComplexity] = useState("all")

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('[Lessons Page] Fetching lessons from /api/lessons')
        const response = await fetch('/api/lessons')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('[Lessons Page] Received response:', { success: data.success, count: data.count })
        
        if (data.success) {
          const lessonsData = data.lessons || []
          console.log(`[Lessons Page] Loaded ${lessonsData.length} lessons`)
          setLessons(lessonsData)
        } else {
          const errorMsg = data.error || 'Failed to load lessons'
          console.error('[Lessons Page] API returned error:', errorMsg)
          setError(errorMsg)
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load lessons'
        console.error('[Lessons Page] Fetch error:', err)
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }
    
    fetchLessons()
  }, [])

  const filteredLessons = useMemo(() => {
    return lessons.filter(lesson => {
      const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lesson.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lesson.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesModule = selectedModule === "all" || lesson.moduleId === selectedModule
      const matchesComplexity = selectedComplexity === "all" || lesson.complexity === selectedComplexity
      
      return matchesSearch && matchesModule && matchesComplexity
    })
  }, [lessons, searchQuery, selectedModule, selectedComplexity])

  // Get unique modules from lessons
  const moduleOptions = useMemo(() => {
    const modules = new Map<string, string>()
    lessons.forEach(lesson => {
      if (!modules.has(lesson.moduleId)) {
        modules.set(lesson.moduleId, lesson.module)
      }
    })
    
    return [
      { value: "all", label: "All Modules" },
      ...Array.from(modules.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([id, name]) => ({ value: id, label: name }))
    ]
  }, [lessons])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">All Lessons</h1>
          <p className="text-muted-foreground">
            Browse and search through {lessons.length > 0 ? `${lessons.length}` : 'all'} lessons in the data engineering curriculum.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search lessons by title or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm bg-background"
            >
              {moduleOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <select
              value={selectedComplexity}
              onChange={(e) => setSelectedComplexity(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm bg-background"
            >
              <option value="all">All Levels</option>
              <option value="F">Foundational</option>
              <option value="I">Intermediate</option>
              <option value="A">Advanced</option>
              <option value="E">Expert</option>
            </select>
          </div>
        </div>

        {/* Results summary */}
        {!loading && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {searchQuery || selectedModule !== "all" || selectedComplexity !== "all" ? (
                <>
                  Showing <span className="font-medium">{filteredLessons.length}</span> of <span className="font-medium">{lessons.length}</span> lessons
                </>
              ) : (
                <>
                  Total: <span className="font-medium">{lessons.length}</span> lessons
                </>
              )}
            </p>
            {(searchQuery || selectedModule !== "all" || selectedComplexity !== "all") && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedModule("all")
                  setSelectedComplexity("all")
                }}
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading lessons...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-12 space-y-4">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Failed to load lessons</h3>
            <p className="text-sm text-destructive max-w-md mx-auto">{error}</p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
            <Button variant="outline" onClick={() => {
              setError(null)
              setLoading(true)
              fetch('/api/lessons')
                .then(res => res.json())
                .then(data => {
                  if (data.success) {
                    setLessons(data.lessons || [])
                  } else {
                    setError(data.error || 'Failed to load lessons')
                  }
                })
                .catch(err => {
                  setError(err instanceof Error ? err.message : 'Failed to load lessons')
                })
                .finally(() => setLoading(false))
            }}>
              Refresh
            </Button>
          </div>
        </div>
      )}

      {/* Lessons Grid */}
      {!loading && !error && filteredLessons.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLessons.map((lesson) => {
            const ModuleIcon = moduleIcons[lesson.moduleId as keyof typeof moduleIcons] || BookOpen
            
            return (
              <Card key={lesson.id} className="transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <ModuleIcon className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-sm leading-5 line-clamp-2">
                        {lesson.title}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {lesson.module}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {lesson.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {lesson.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={cn("text-xs", complexityColors[lesson.complexity])}
                      >
                        {complexityLabels[lesson.complexity]}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{lesson.estimatedTime}m</span>
                      </div>
                    </div>
                  </div>
                  
                  <Link href={`/lessons/${lesson.slug}`} className="block">
                    <Button size="sm" className="w-full">
                      <BookOpen className="w-3 h-3 mr-2" />
                      Open Lesson
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredLessons.length === 0 && lessons.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No lessons available</h3>
          <p className="text-muted-foreground mb-4">
            No lessons found. Please check back later or contact support.
          </p>
        </div>
      )}

      {/* Filtered Empty State */}
      {!loading && !error && filteredLessons.length === 0 && lessons.length > 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No lessons match your filters</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or filters to find more lessons.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery("")
              setSelectedModule("all")
              setSelectedComplexity("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}