"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  PlayCircle,
  Clock,
  BookOpen,
  CheckCircle2,
  Circle,
  Star,
  Users,
  MessageSquare,
  Target,
  TrendingUp,
  Award,
  Lightbulb,
  Code,
  FileText,
  Video,
  Download,
  Share2,
  Bookmark,
  ChevronRight,
  Zap,
  BarChart3,
  Calendar,
  Filter,
  Search,
  SortAsc
} from "lucide-react"

interface Lesson {
  id: string
  title: string
  description: string
  complexity: 'F' | 'I' | 'A' // Fundamental, Intermediate, Advanced
  estimatedTime: number
  completed?: boolean
  bookmarked?: boolean
  type: 'lesson' | 'lab' | 'exercise'
}

interface LearningObjective {
  id: string
  objective: string
  completed: boolean
  progress: number
}

interface ModuleLandingPageProps {
  moduleId: string
  lessons: Lesson[]
  labs: any[]
  progress: {
    lessonsCompleted: number
    labsCompleted: number
    overallProgress: number
  }
}

export default function EnhancedModuleLandingPage({ 
  moduleId, 
  lessons, 
  labs, 
  progress 
}: ModuleLandingPageProps) {
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'F' | 'I' | 'A'>('all')
  const [sortBy, setSortBy] = useState<'default' | 'time' | 'complexity'>('default')
  const [searchTerm, setSearchTerm] = useState('')

  // Function to generate lesson slug for navigation
  const generateLessonSlug = (lesson: Lesson): string => {
    // Create a URL-friendly slug from the lesson title
    const slug = lesson.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
    
    return slug
  }

  // Function to navigate to lesson
  const navigateToLesson = (lesson: Lesson) => {
    const slug = generateLessonSlug(lesson)
    router.push(`/lessons/${slug}`)
  }
  
  // Mock learning objectives with progress
  const [learningObjectives, setLearningObjectives] = useState<LearningObjective[]>([
    { id: '1', objective: 'Understand Snowflake authentication methods', completed: true, progress: 100 },
    { id: '2', objective: 'Master role-based access control (RBAC)', completed: false, progress: 65 },
    { id: '3', objective: 'Implement security policies and data masking', completed: false, progress: 30 },
    { id: '4', objective: 'Configure network policies', completed: false, progress: 0 },
  ])

  // Filter and sort lessons
  const filteredLessons = lessons
    .filter(lesson => {
      const matchesFilter = filter === 'all' || lesson.complexity === filter
      const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesFilter && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'time':
          return a.estimatedTime - b.estimatedTime
        case 'complexity':
          const complexityOrder = { 'F': 1, 'I': 2, 'A': 3 }
          return complexityOrder[a.complexity] - complexityOrder[b.complexity]
        default:
          return 0
      }
    })

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'F': return 'bg-green-100 text-green-800 border-green-200'
      case 'I': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'A': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getComplexityLabel = (complexity: string) => {
    switch (complexity) {
      case 'F': return 'Fundamental'
      case 'I': return 'Intermediate' 
      case 'A': return 'Advanced'
      default: return 'Unknown'
    }
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Lessons Progress</p>
                <p className="text-2xl font-bold text-blue-900">{progress.lessonsCompleted}/{lessons.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <Progress value={(progress.lessonsCompleted / lessons.length) * 100} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Labs Completed</p>
                <p className="text-2xl font-bold text-green-900">{progress.labsCompleted}/{labs.length}</p>
              </div>
              <Code className="w-8 h-8 text-green-600" />
            </div>
            <Progress value={(progress.labsCompleted / labs.length) * 100} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Overall Progress</p>
                <p className="text-2xl font-bold text-purple-900">{progress.overallProgress}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <Progress value={progress.overallProgress} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      {/* Learning Objectives Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Learning Objectives Progress
          </CardTitle>
          <CardDescription>
            Track your progress towards mastering this module's key concepts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {learningObjectives.map((objective) => (
              <div key={objective.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {objective.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400" />
                    )}
                    <span className={`text-sm ${objective.completed ? 'text-green-900' : 'text-gray-700'}`}>
                      {objective.objective}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {objective.progress}%
                  </span>
                </div>
                <Progress value={objective.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="lessons" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="lessons" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Lessons
          </TabsTrigger>
          <TabsTrigger value="labs" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Labs
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Community
          </TabsTrigger>
        </TabsList>

        {/* Lessons Tab */}
        <TabsContent value="lessons" className="space-y-6">
          {/* Lesson Filters and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search lessons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-1 border rounded-md text-sm"
                  />
                </div>
                
                <div className="flex gap-2">
                  <div className="flex items-center gap-1">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <select 
                      value={filter} 
                      onChange={(e) => setFilter(e.target.value as any)}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      <option value="all">All Levels</option>
                      <option value="F">Fundamental</option>
                      <option value="I">Intermediate</option>
                      <option value="A">Advanced</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <SortAsc className="w-4 h-4 text-muted-foreground" />
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      <option value="default">Default Order</option>
                      <option value="time">By Duration</option>
                      <option value="complexity">By Complexity</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lessons List */}
          <div className="grid gap-4">
            {filteredLessons.map((lesson, index) => (
              <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{lesson.title}</h3>
                          <p className="text-muted-foreground text-sm mt-1">{lesson.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Badge className={getComplexityColor(lesson.complexity)}>
                          {getComplexityLabel(lesson.complexity)}
                        </Badge>
                        
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {lesson.estimatedTime} min
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <FileText className="w-4 h-4" />
                          {lesson.type}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {/* Toggle bookmark */}}
                      >
                        <Bookmark className={`w-4 h-4 ${lesson.bookmarked ? 'fill-current' : ''}`} />
                      </Button>
                      
                      <Button 
                        size="sm"
                        onClick={() => navigateToLesson(lesson)}
                      >
                        {lesson.completed ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Review
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Start
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Labs Tab */}
        <TabsContent value="labs" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {labs.map((lab, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-orange-600" />
                      Lab {index + 1}: Hands-on Practice
                    </CardTitle>
                    <Badge variant="outline">
                      <Calendar className="w-3 h-3 mr-1" />
                      2-3 hours
                    </Badge>
                  </div>
                  <CardDescription>
                    Apply the concepts from this module in a real-world scenario with guided exercises.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      Practical Application
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      Certificate Eligible
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button className="w-full">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Start Lab
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Learning Velocity</CardTitle>
                <CardDescription>Your progress over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted/30 rounded flex items-center justify-center">
                  <p className="text-muted-foreground">Progress chart would go here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Time Distribution</CardTitle>
                <CardDescription>How you spend your learning time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Reading</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <Progress value={45} />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Hands-on Labs</span>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                  <Progress value={35} />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Practice Exercises</span>
                    <span className="text-sm font-medium">20%</span>
                  </div>
                  <Progress value={20} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Module Discussion
                </CardTitle>
                <CardDescription>
                  Connect with other learners and share insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">JS</span>
                      </div>
                      <span className="font-medium">John Smith</span>
                      <span className="text-sm text-muted-foreground">2 hours ago</span>
                    </div>
                    <p className="text-sm">
                      Just completed the RBAC lesson - the practical examples really helped me understand 
                      the role hierarchy concepts. Anyone else working on the network policies section?
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <button className="hover:text-foreground">💬 Reply</button>
                      <button className="hover:text-foreground">👍 Like (3)</button>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Join Discussion
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Study Groups
                </CardTitle>
                <CardDescription>
                  Find study partners and collaborative learning opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Snowflake Security Study Group</p>
                      <p className="text-sm text-muted-foreground">5 members • Next session: Tomorrow 2PM</p>
                    </div>
                    <Button size="sm" variant="outline">Join</Button>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Create Study Group
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions Footer */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold">Ready to continue your learning journey?</h3>
              <p className="text-sm text-muted-foreground">
                Pick up where you left off or explore related modules
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share Progress
              </Button>
              <Button>
                <ChevronRight className="w-4 h-4 mr-2" />
                Continue Learning
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}