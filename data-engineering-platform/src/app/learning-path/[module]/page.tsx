"use client"

import { useState, useEffect } from "react"
import { useParams, notFound, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import EnhancedModuleLandingPage from "@/components/EnhancedModuleLandingPage"
import { 
  ArrowLeft, 
  Clock, 
  BookOpen, 
  Users, 
  CheckCircle,
  PlayCircle,
  Loader2,
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
  Briefcase,
  Sparkles
} from "lucide-react"

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

interface ModuleData {
  id: string
  title: string
  description: string
  icon: string
  estimatedHours: number
  lessons: number
  labs: number
  topics: string[]
  prerequisites: string[]
  learningObjectives?: string[]
}

export default function ModulePage() {
  const params = useParams()
  const router = useRouter()
  const moduleId = params.module as string
  
  const [module, setModule] = useState<ModuleData | null>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchModule = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/modules/${encodeURIComponent(moduleId)}`)
        const data = await response.json()
        
        if (data.success && data.module) {
          setModule(data.module)
          setLessons(data.lessons || [])
        } else {
          setError(data.error || 'Module not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load module')
      } finally {
        setLoading(false)
      }
    }
    
    if (moduleId) {
      fetchModule()
    }
  }, [moduleId])
  
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }
  
  if (error || !module) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Module not found</h2>
        <p className="text-muted-foreground mb-4">
          {error || "The requested module could not be loaded."}
        </p>
        <Button onClick={() => router.push('/learning-path')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Learning Path
        </Button>
      </div>
    )
  }
  
  const ModuleIcon = moduleIcons[module.id as keyof typeof moduleIcons] || BookOpen

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Link href="/learning-path">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learning Path
            </Button>
          </Link>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <ModuleIcon className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <h1 className="text-3xl font-bold">{module.title}</h1>
            <p className="text-muted-foreground text-lg">{module.description}</p>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{module.estimatedHours} hours</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{module.lessons} lessons</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{module.labs} labs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prerequisites */}
      {module.prerequisites && module.prerequisites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prerequisites</CardTitle>
            <CardDescription>
              Complete these modules before starting this one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {module.prerequisites.map((prereq) => (
                <Badge key={prereq} variant="outline">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {prereq.replace('module-', 'Module ')}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Objectives */}
      {module.learningObjectives && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Learning Objectives</CardTitle>
            <CardDescription>
              What you'll learn in this module
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {module.learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{objective}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Topics Overview */}
      {module.topics && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Topics Covered</CardTitle>
            <CardDescription>
              Key concepts and skills you'll master
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2">
              {module.topics.map((topic, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                  <PlayCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm">{topic}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button 
          size="lg" 
          className="flex-1"
          onClick={() => {
            // Navigate to first lesson if available
            if (lessons.length > 0) {
              const firstLesson = lessons[0]
              const slug = firstLesson.title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim()
              router.push(`/lessons/${slug}`)
            }
          }}
        >
          <PlayCircle className="w-5 h-5 mr-2" />
          Start Module
        </Button>
        <Button size="lg" variant="outline">
          <BookOpen className="w-5 h-5 mr-2" />
          View All Lessons ({module.lessons})
        </Button>
      </div>

      {/* Enhanced Module Landing Page */}
      <EnhancedModuleLandingPage 
        moduleId={moduleId}
        lessons={lessons}
        labs={[{}, {}, {}]} // Mock 3 labs for now
        progress={{
          lessonsCompleted: 0,
          labsCompleted: 0,
          overallProgress: 0
        }}
      />
    </div>
  )
}