"use client"

import { useState, useEffect } from "react"
import { useParams, notFound, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { 
  ArrowLeft, 
  Clock, 
  BookOpen, 
  CheckCircle,
  PlayCircle,
  Loader2,
  FileText,
  ArrowRight,
  Home
} from "lucide-react"

interface LessonData {
  title: string
  content: string
  moduleId: string
  complexity: string
  estimatedTime: number
  filename: string
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string[]
  
  const [lesson, setLesson] = useState<LessonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Join the slug array to create the lesson path
        const lessonPath = slug.join('/')
        
        const response = await fetch(`/api/lessons/${encodeURIComponent(lessonPath)}`)
        const data = await response.json()
        
        if (data.success && data.lesson) {
          setLesson(data.lesson)
        } else {
          setError(data.error || 'Lesson not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load lesson')
      } finally {
        setLoading(false)
      }
    }
    
    if (slug && slug.length > 0) {
      fetchLesson()
    }
  }, [slug])
  
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Loading lesson content...</p>
        </div>
      </div>
    )
  }
  
  if (error || !lesson) {
    return (
      <div className="p-6 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-semibold">Lesson not found</h2>
          <p className="text-muted-foreground">
            {error || "The requested lesson could not be loaded."}
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button variant="outline" onClick={() => router.push('/learning-path')}>
              <Home className="w-4 h-4 mr-2" />
              Learning Path
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity?.toLowerCase()) {
      case 'f': case 'foundational': return 'bg-green-100 text-green-800'
      case 'i': case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'a': case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getComplexityLabel = (complexity: string) => {
    switch (complexity?.toLowerCase()) {
      case 'f': return 'Foundational'
      case 'i': return 'Intermediate' 
      case 'a': return 'Advanced'
      default: return complexity || 'Unknown'
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          {lesson.moduleId && (
            <Link href={`/learning-path/${lesson.moduleId}`}>
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                {lesson.moduleId.replace('module-', 'Module ')}
              </Button>
            </Link>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge 
              className={getComplexityColor(lesson.complexity)}
              variant="secondary"
            >
              {getComplexityLabel(lesson.complexity)}
            </Badge>
            
            {lesson.estimatedTime && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{lesson.estimatedTime} min read</span>
              </div>
            )}
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>Lesson</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold leading-tight">{lesson.title}</h1>
        </div>
      </div>

      {/* Lesson Content */}
      <Card>
        <CardContent className="p-12">
          <div className="prose prose-lg prose-gray max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h1:mb-8 prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-base prose-p:leading-relaxed prose-p:mb-6 prose-li:mb-2 prose-ul:mb-6 prose-ol:mb-6 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:my-6 prose-blockquote:italic prose-strong:font-bold prose-strong:text-gray-900 dark:prose-strong:text-gray-100">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                h1: ({ children }) => <h1 className="text-4xl font-bold mt-12 mb-8 first:mt-0 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-800 dark:text-gray-200">{children}</h3>,
                p: ({ children }) => <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed text-base">{children}</p>,
                ul: ({ children }) => <ul className="mb-6 ml-6 space-y-3 list-disc text-gray-700 dark:text-gray-300">{children}</ul>,
                ol: ({ children }) => <ol className="mb-6 ml-6 space-y-3 list-decimal text-gray-700 dark:text-gray-300">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed text-base">{children}</li>,
                pre: ({ children }) => (
                  <pre className="bg-gray-900 dark:bg-gray-800 text-gray-100 p-6 rounded-lg overflow-x-auto mb-8 text-sm border shadow-sm">
                    {children}
                  </pre>
                ),
                code: ({ children, className, ...props }) => {
                  const isInline = !className
                  return isInline ? (
                    <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className={`${className} text-sm leading-relaxed`} {...props}>
                      {children}
                    </code>
                  )
                },
                strong: ({ children }) => <strong className="font-bold text-gray-900 dark:text-gray-100">{children}</strong>,
                em: ({ children }) => <em className="italic text-gray-600 dark:text-gray-400">{children}</em>,
                hr: () => <hr className="my-12 border-gray-200 dark:border-gray-700" />,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-6 my-8 italic text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 py-4 rounded-r-lg">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-8">
                    <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-gray-200 dark:border-gray-700 px-6 py-3 bg-gray-50 dark:bg-gray-800 font-semibold text-left text-gray-900 dark:text-gray-100">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-gray-200 dark:border-gray-700 px-6 py-3 text-gray-700 dark:text-gray-300">
                    {children}
                  </td>
                ),
              }}
            >
              {lesson.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button 
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm text-muted-foreground">Lesson completed</span>
        </div>
        
        <Button>
          Next Lesson
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}