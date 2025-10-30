"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle, 
  Circle, 
  Lock, 
  Clock, 
  BookOpen, 
  Code, 
  Database,
  Cloud,
  Workflow,
  Zap,
  GitBranch,
  Search,
  Shield,
  BarChart3,
  Terminal,
  Users,
  Gauge,
  Eye,
  Cog,
  Wrench,
  TrendingUp,
  Briefcase,
  Settings,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Module {
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

const modules: Module[] = [
  {
    id: "module-1",
    title: "Module 1: Data & Database Fundamentals",
    description: "Relational database concepts, data types, schema design, indexes and ACID properties",
    icon: Database,
    status: "completed",
    progress: 100,
    estimatedHours: 12,
    lessons: 8,
    labs: 3,
    topics: ["ACID Properties", "Normalization", "Data Types", "Indexes", "OLTP vs OLAP"]
  },
  {
    id: "module-2", 
    title: "Module 2: SQL & ELT Concepts",
    description: "SQL fundamentals, advanced queries, window functions, and ELT paradigm",
    icon: Code,
    status: "current",
    progress: 30,
    estimatedHours: 16,
    lessons: 12,
    labs: 5,
    topics: ["SQL Joins", "Window Functions", "CTEs", "Performance", "ELT vs ETL"]
  },
  {
    id: "module-3",
    title: "Module 3: Data Warehousing Principles",
    description: "Data warehouse architecture, loading patterns, and data quality principles",
    icon: Cloud,
    status: "locked",
    progress: 0,
    estimatedHours: 10,
    lessons: 7,
    labs: 3,
    topics: ["DW Architecture", "Loading Patterns", "Data Quality", "Batch Processing"]
  },
  {
    id: "module-4",
    title: "Module 4: Data Modeling",
    description: "Dimensional modeling, star schemas, slowly changing dimensions, and ERDs",
    icon: Workflow,
    status: "locked",
    progress: 0,
    estimatedHours: 14,
    lessons: 10,
    labs: 4,
    topics: ["Star Schema", "SCD Types", "Fact Tables", "Dimension Tables", "ERDs"]
  },
  {
    id: "module-5", 
    title: "Module 5: Snowflake-Specific Knowledge",
    description: "Snowflake architecture, virtual warehouses, data loading, and optimization",
    icon: Cloud,
    status: "locked",
    progress: 0,
    estimatedHours: 18,
    lessons: 15,
    labs: 6,
    topics: ["Snowflake Architecture", "Virtual Warehouses", "Data Loading", "Performance"]
  },
  {
    id: "module-6",
    title: "Module 6: ETL/ELT Design & Best Practices",
    description: "Pipeline design principles, transformation patterns, and incremental loading",
    icon: Cog,
    status: "locked",
    progress: 0,
    estimatedHours: 12,
    lessons: 9,
    labs: 4,
    topics: ["Pipeline Design", "Transformations", "Incremental Loading", "Data Lineage"]
  },
  {
    id: "module-7",
    title: "Module 7: Data Governance, Quality & Metadata",
    description: "Data governance principles, quality implementation, and testing strategies",
    icon: Shield,
    status: "locked",
    progress: 0,
    estimatedHours: 10,
    lessons: 8,
    labs: 3,
    topics: ["Data Governance", "Quality Checks", "Testing", "Metadata Management"]
  },
  {
    id: "module-8",
    title: "Module 8: Snowflake Security & Access Control",
    description: "Authentication, authorization, RBAC, and security best practices",
    icon: Shield,
    status: "locked", 
    progress: 0,
    estimatedHours: 8,
    lessons: 6,
    labs: 2,
    topics: ["RBAC", "Access Control", "Security Policies", "Authentication"]
  },
  {
    id: "module-9",
    title: "Module 9: Reporting & BI Concepts",
    description: "BI tools, ThoughtSpot, visualization design, and semantic layers",
    icon: BarChart3,
    status: "locked", 
    progress: 0,
    estimatedHours: 12,
    lessons: 10,
    labs: 4,
    topics: ["ThoughtSpot", "Visualization", "Dashboards", "Semantic Layer"]
  },
  {
    id: "module-10",
    title: "Module 10: Unix/Linux & File Handling",
    description: "Unix fundamentals, shell scripting, file processing, and log analysis",
    icon: Terminal,
    status: "locked", 
    progress: 0,
    estimatedHours: 8,
    lessons: 6,
    labs: 3,
    topics: ["Shell Commands", "File Operations", "Scripting", "Log Analysis"]
  },
  {
    id: "module-11",
    title: "Module 11: Version Control & Team Collaboration",
    description: "Git fundamentals, branching strategies, and collaboration workflows",
    icon: GitBranch,
    status: "locked", 
    progress: 0,
    estimatedHours: 6,
    lessons: 5,
    labs: 2,
    topics: ["Git Basics", "Branching", "Pull Requests", "Collaboration"]
  },
  {
    id: "module-12",
    title: "Module 12: Performance Optimization & Troubleshooting",
    description: "Query performance analysis, optimization techniques, and cost management",
    icon: Gauge,
    status: "locked", 
    progress: 0,
    estimatedHours: 14,
    lessons: 11,
    labs: 5,
    topics: ["Query Optimization", "Performance Analysis", "Cost Management", "Troubleshooting"]
  },
  {
    id: "module-13",
    title: "Module 13: CI/CD & Deployment Practices",
    description: "Environment management, deployment automation, and testing in pipelines",
    icon: Settings,
    status: "locked", 
    progress: 0,
    estimatedHours: 8,
    lessons: 6,
    labs: 3,
    topics: ["Environment Management", "Deployment", "Testing", "Automation"]
  },
  {
    id: "module-14",
    title: "Module 14: Monitoring & Observability",
    description: "Pipeline monitoring, data quality tracking, and alerting systems",
    icon: Eye,
    status: "locked", 
    progress: 0,
    estimatedHours: 8,
    lessons: 6,
    labs: 2,
    topics: ["Pipeline Monitoring", "Quality Monitoring", "Alerting", "Metrics"]
  },
  {
    id: "module-15",
    title: "Module 15: Orchestration & Scheduling Tools",
    description: "Workflow orchestration, DAG design, and scheduling best practices",
    icon: Workflow,
    status: "locked", 
    progress: 0,
    estimatedHours: 10,
    lessons: 7,
    labs: 3,
    topics: ["DAG Design", "Airflow", "Scheduling", "Error Handling"]
  },
  {
    id: "module-16",
    title: "Module 16: Data Transformation with dbt",
    description: "dbt core concepts, testing, documentation, and advanced features",
    icon: Wrench,
    status: "locked", 
    progress: 0,
    estimatedHours: 12,
    lessons: 9,
    labs: 4,
    topics: ["dbt Models", "Testing", "Documentation", "Incremental Models"]
  },
  {
    id: "module-17",
    title: "Module 17: Soft Skills & Professional Practices",
    description: "Communication, documentation, collaboration, and professional development",
    icon: Users,
    status: "locked", 
    progress: 0,
    estimatedHours: 6,
    lessons: 8,
    labs: 2,
    topics: ["Communication", "Documentation", "Teamwork", "Problem-Solving"]
  },
  {
    id: "module-18",
    title: "Module 18: Business & Domain Knowledge",
    description: "Business metrics, requirements gathering, and industry knowledge",
    icon: Briefcase,
    status: "locked", 
    progress: 0,
    estimatedHours: 8,
    lessons: 6,
    labs: 3,
    topics: ["Business Metrics", "Requirements", "Domain Knowledge", "KPIs"]
  },
  {
    id: "module-19",
    title: "Module 19: Additional Technical Skills",
    description: "JSON handling, APIs, data formats, and Python for data engineering",
    icon: Code,
    status: "locked", 
    progress: 0,
    estimatedHours: 10,
    lessons: 8,
    labs: 4,
    topics: ["JSON/APIs", "Data Formats", "Python", "File Processing"]
  },
  {
    id: "module-20",
    title: "Module 20: Emerging Topics & Advanced Concepts",
    description: "Data mesh, DataOps, real-time streaming, and modern architectures",
    icon: Sparkles,
    status: "locked", 
    progress: 0,
    estimatedHours: 12,
    lessons: 10,
    labs: 3,
    topics: ["Data Mesh", "DataOps", "Streaming", "Cloud Platforms", "ML Integration"]
  }
]

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

export default function LearningPath() {
  const totalProgress = Math.round(
    modules.reduce((acc, module) => acc + module.progress, 0) / modules.length
  )

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Learning Path</h1>
          <p className="text-muted-foreground">
            Your guided journey through data engineering concepts, from foundations to advanced topics.
          </p>
        </div>

        {/* Overall Progress */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Your Progress</CardTitle>
            <CardDescription>
              Complete all modules to become job-ready in data engineering
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Completion</span>
                <span className="font-medium">{totalProgress}%</span>
              </div>
              <Progress value={totalProgress} />
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <p className="font-medium text-lg">{modules.filter(m => m.status === "completed").length}</p>
                <p className="text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-lg">{modules.filter(m => m.status === "current").length}</p>
                <p className="text-muted-foreground">In Progress</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-lg">{modules.length}</p>
                <p className="text-muted-foreground">Total Modules</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Cards */}
      <div className="space-y-4">
        {modules.map((module) => (
          <Card 
            key={module.id} 
            className={cn(
              "transition-all duration-200",
              module.status === "current" && "border-primary/40 shadow-md",
              module.status === "locked" && "opacity-60"
            )}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-2">
                    {getStatusIcon(module.status, module.progress)}
                    <module.icon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {module.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{module.estimatedHours}h</span>
                  </div>
                  {module.status === "current" && module.progress > 0 && (
                    <div className="text-sm font-medium text-primary">
                      {module.progress}% complete
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {module.status === "current" && (
                <div className="space-y-2">
                  <Progress value={module.progress} />
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center p-2 bg-muted/30 rounded">
                  <p className="font-medium">{module.lessons}</p>
                  <p className="text-muted-foreground">Lessons</p>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded">
                  <p className="font-medium">{module.labs}</p>
                  <p className="text-muted-foreground">Labs</p>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded">
                  <p className="font-medium">{module.estimatedHours}</p>
                  <p className="text-muted-foreground">Hours</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Key Topics:</h4>
                <div className="flex flex-wrap gap-1">
                  {module.topics.map((topic, topicIndex) => (
                    <span 
                      key={topicIndex}
                      className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                {module.status === "completed" && (
                  <Button variant="outline" size="sm">
                    Review Module
                  </Button>
                )}
                {module.status === "current" && (
                  <Button size="sm">
                    {module.progress > 0 ? "Continue" : "Start Module"}
                  </Button>
                )}
                {module.status === "locked" && (
                  <Button variant="ghost" size="sm" disabled>
                    Locked
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}