"use client"

import { useState, memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  BookOpen, 
  FlaskConical,
  CheckCircle,
  Circle,
  Lock,
  ArrowRight,
  Target,
  Lightbulb,
  Layers
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ParsedModuleContent } from "@/lib/module-description-parser"

export interface Module {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  status: "completed" | "current" | "locked"
  progress: number
  estimatedHours: number
  lessons: number
  labs: number
  topics: string[]
}

interface EnhancedModuleCardProps {
  module: Module
  moduleDescription?: ParsedModuleContent | null
  isExpanded?: boolean
  onToggleExpand?: () => void
  onStartModule?: () => void
}

const getStatusIcon = (status: Module["status"], progress: number) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-5 h-5 text-green-600" />
    case "current":
      return progress > 0 ? <Circle className="w-5 h-5 text-blue-600 fill-blue-600/20" /> : <Circle className="w-5 h-5 text-blue-600" />
    case "locked":
      return <Lock className="w-5 h-5 text-gray-400" />
  }
}

const getStatusColor = (status: Module["status"]) => {
  switch (status) {
    case "completed":
      return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
    case "current":
      return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
    case "locked":
      return "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950"
  }
}

const getActionButton = (status: Module["status"], onStartModule?: () => void) => {
  switch (status) {
    case "completed":
      return (
        <Button variant="outline" size="sm" onClick={onStartModule}>
          <BookOpen className="w-4 h-4 mr-2" />
          Review Module
        </Button>
      )
    case "current":
      return (
        <Button size="sm" onClick={onStartModule}>
          <ArrowRight className="w-4 h-4 mr-2" />
          Continue Learning
        </Button>
      )
    case "locked":
      return (
        <Button variant="outline" size="sm" disabled>
          <Lock className="w-4 h-4 mr-2" />
          Complete Prerequisites
        </Button>
      )
  }
}

const EnhancedModuleCard = memo(function EnhancedModuleCard({ 
  module, 
  moduleDescription, 
  isExpanded = false, 
  onToggleExpand,
  onStartModule 
}: EnhancedModuleCardProps) {
  const IconComponent = module.icon

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg",
      getStatusColor(module.status),
      isExpanded && "ring-2 ring-blue-200 dark:ring-blue-800"
    )}>
      <CardHeader className="space-y-4">
        {/* Header Section */}
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-3 flex-1">
            <IconComponent className="w-8 h-8 text-muted-foreground flex-shrink-0" />
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg leading-6">{module.title}</CardTitle>
                {getStatusIcon(module.status, module.progress)}
              </div>
              <CardDescription className="text-sm">
                {moduleDescription?.metadata.description || module.description}
              </CardDescription>
            </div>
          </div>
          
          {onToggleExpand && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpand}
              className="flex-shrink-0"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        {module.status === "current" && module.progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{module.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${module.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{moduleDescription?.metadata.duration || module.estimatedHours}h</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{moduleDescription?.metadata.lessons || module.lessons} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <FlaskConical className="w-4 h-4" />
            <span>{moduleDescription?.metadata.labs || module.labs} labs</span>
          </div>
        </div>

        {/* Topic Tags */}
        <div className="flex flex-wrap gap-2">
          {(module.topics || []).slice(0, 4).map((topic, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {topic}
            </Badge>
          ))}
          {module.topics.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{module.topics.length - 4} more
            </Badge>
          )}
        </div>
      </CardHeader>

      {/* Expanded Content */}
      {isExpanded && moduleDescription && (
        <CardContent className="space-y-6 border-t pt-6">
          {/* Prerequisites */}
          {moduleDescription.prerequisites.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-muted-foreground" />
                <h4 className="text-sm font-medium">Prerequisites</h4>
              </div>
              <div className="space-y-2">
                {moduleDescription.prerequisites.map((prereq, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                    <span>{prereq}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learning Objectives */}
          {moduleDescription.learningObjectives.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <h4 className="text-sm font-medium">Learning Objectives</h4>
              </div>
              <div className="space-y-2">
                {moduleDescription.learningObjectives.slice(0, 3).map((objective, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <span>{objective}</span>
                  </div>
                ))}
                {moduleDescription.learningObjectives.length > 3 && (
                  <div className="text-xs text-muted-foreground ml-4">
                    +{moduleDescription.learningObjectives.length - 3} more objectives...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Key Topics */}
          {Object.keys(moduleDescription.topicCategories).length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-muted-foreground" />
                <h4 className="text-sm font-medium">Key Topics</h4>
              </div>
              <div className="space-y-3">
                {Object.entries(moduleDescription.topicCategories).slice(0, 2).map(([category, topics]) => (
                  <div key={category} className="space-y-2">
                    <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {category}
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {topics.slice(0, 3).map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {topics.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{topics.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {Object.keys(moduleDescription.topicCategories).length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{Object.keys(moduleDescription.topicCategories).length - 2} more topic categories...
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      )}

      {/* Action Footer */}
      <CardContent className={cn("pt-4", isExpanded && "border-t")}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {module.status === "current" && (
              <Badge variant="secondary" className="text-xs">
                In Progress
              </Badge>
            )}
            {module.status === "completed" && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Completed
              </Badge>
            )}
          </div>
          {getActionButton(module.status, onStartModule)}
        </div>
      </CardContent>
    </Card>
  )
})

export default EnhancedModuleCard