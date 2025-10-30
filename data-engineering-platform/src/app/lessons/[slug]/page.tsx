"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Download,
  Share2,
  Star,
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
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

interface LessonData {
  title: string
  module: string
  moduleId: string
  complexity: "F" | "I" | "A" | "E"
  estimatedTime: number
  content: string
  topics: string[]
  lastUpdated: string
}

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

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const [lesson, setLesson] = useState<LessonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadLesson = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const slug = params.slug as string
        const response = await fetch(`/api/lessons/${encodeURIComponent(slug)}`)
        const data = await response.json()
        
        if (data.success && data.lesson) {
          // Convert API lesson to component format
          const lessonData: LessonData = {
            title: data.lesson.title,
            module: data.lesson.module,
            moduleId: data.lesson.moduleId,
            complexity: data.lesson.complexity,
            estimatedTime: data.lesson.estimatedTime,
            lastUpdated: data.lesson.lastUpdated,
            topics: data.lesson.topics || [],
            content: data.lesson.content,
          }
          setLesson(lessonData)
        } else {
          setError(data.error || 'Lesson not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load lesson content')
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      loadLesson()
    }
  }, [params.slug])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !lesson) {
    return (
      <div className="p-6 text-center">
        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Lesson not found</h2>
        <p className="text-muted-foreground mb-4">
          {error || "The requested lesson could not be loaded."}
        </p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    )
  }

  const ModuleIcon = moduleIcons[lesson.moduleId as keyof typeof moduleIcons] || BookOpen

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.back()}
              className="mt-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex-1 space-y-3">
              <div className="flex items-start gap-3">
                <ModuleIcon className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-1" />
                <div className="space-y-1 flex-1">
                  <h1 className="text-2xl font-bold leading-tight">{lesson.title}</h1>
                  <p className="text-muted-foreground">{lesson.module}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge 
                  variant="secondary" 
                  className={cn("text-sm", complexityColors[lesson.complexity])}
                >
                  {complexityLabels[lesson.complexity]}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{lesson.estimatedTime} minutes</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Updated: {lesson.lastUpdated}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Star className="w-4 h-4 mr-2" />
                  Bookmark
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div 
                className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-code:text-sm prose-pre:bg-muted prose-pre:text-foreground prose-pre:rounded-lg prose-pre:p-4"
                dangerouslySetInnerHTML={{ 
                  __html: lesson.content
                    .split('\n\n')
                    .map((para) => {
                      // Code blocks
                      if (para.includes('```')) {
                        return para
                          .replace(/```sql\n?([\s\S]*?)```/gim, '<pre><code class="language-sql">$1</code></pre>')
                          .replace(/```\n?([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
                      }
                      // Headers
                      para = para.replace(/^### (.*$)/gim, '<h3>$1</h3>')
                      para = para.replace(/^## (.*$)/gim, '<h2>$1</h2>')
                      para = para.replace(/^# (.*$)/gim, '<h1>$1</h1>')
                      // Horizontal rules
                      para = para.replace(/^-----$/gim, '<hr/>')
                      // Bold
                      para = para.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
                      // Inline code
                      para = para.replace(/`([^`]+)`/gim, '<code>$1</code>')
                      // Lists
                      if (para.trim().startsWith('-')) {
                        const items = para.split('\n').filter(l => l.trim().startsWith('-'))
                        return `<ul>${items.map(item => `<li>${item.replace(/^-\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul>`
                      }
                      // Paragraph
                      if (para.trim() && !para.startsWith('<')) {
                        return `<p>${para}</p>`
                      }
                      return para
                    })
                    .join('')
                    .replace(/✅/g, '✓')
                    .replace(/❌/g, '✗')
                }}
              />
            </CardContent>
          </Card>
          
          {/* Topics */}
          {lesson.topics.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Related Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {lesson.topics.map((topic, index) => (
                    <Badge key={index} variant="outline">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}