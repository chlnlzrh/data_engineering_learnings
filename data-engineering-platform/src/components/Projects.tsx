"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Trophy, 
  FolderOpen, 
  Users, 
  FileText, 
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  Upload
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Project {
  id: string
  title: string
  description: string
  type: "capstone" | "mini" | "case-study"
  status: "not-started" | "in-progress" | "submitted" | "completed"
  dueDate?: string
  estimatedHours: number
  difficulty: "beginner" | "intermediate" | "advanced"
  technologies: string[]
  requirements: string[]
}

const projects: Project[] = [
  {
    id: "capstone-1",
    title: "End-to-End Data Pipeline",
    description: "Build a complete data pipeline from raw data ingestion to visualization, incorporating all course concepts",
    type: "capstone",
    status: "not-started",
    dueDate: "Dec 15, 2024",
    estimatedHours: 40,
    difficulty: "advanced",
    technologies: ["Python", "SQL", "dbt", "Airflow", "Snowflake", "Tableau"],
    requirements: [
      "Data ingestion from multiple sources",
      "Data transformation and modeling",
      "Quality checks and monitoring",
      "Automated orchestration",
      "Documentation and presentation"
    ]
  },
  {
    id: "mini-1",
    title: "E-commerce Schema Design",
    description: "Design a dimensional model for an e-commerce store with fact and dimension tables",
    type: "mini",
    status: "completed",
    estimatedHours: 6,
    difficulty: "beginner",
    technologies: ["SQL", "ERD Tools"],
    requirements: [
      "Identify business processes",
      "Design fact tables with proper grain",
      "Create dimension tables",
      "Implement slowly changing dimensions"
    ]
  },
  {
    id: "mini-2", 
    title: "API Data Pipeline",
    description: "Build a Python script to pull data from a public API and save to database",
    type: "mini",
    status: "in-progress",
    dueDate: "Nov 8, 2024",
    estimatedHours: 8,
    difficulty: "intermediate",
    technologies: ["Python", "Pandas", "SQLAlchemy", "PostgreSQL"],
    requirements: [
      "Connect to REST API",
      "Transform and clean data",
      "Handle errors and retries", 
      "Store in normalized database schema"
    ]
  },
  {
    id: "mini-3",
    title: "dbt Data Transformation",
    description: "Use dbt to model and transform raw data inside a data warehouse",
    type: "mini",
    status: "not-started",
    dueDate: "Nov 22, 2024",
    estimatedHours: 10,
    difficulty: "intermediate",
    technologies: ["dbt", "SQL", "Snowflake", "Git"],
    requirements: [
      "Create staging models",
      "Build dimensional models", 
      "Implement data tests",
      "Document models and columns"
    ]
  }
]

const portfolioProjects = [
  {
    id: "portfolio-1",
    title: "Real-time Cryptocurrency Analytics",
    author: "Sarah Chen",
    description: "Stream processing pipeline for real-time crypto price analysis using Kafka and Spark",
    technologies: ["Kafka", "Spark", "Python", "Redis"],
    rating: 4.8,
    views: 234
  },
  {
    id: "portfolio-2", 
    title: "Healthcare Data Warehouse",
    author: "Mike Johnson",
    description: "HIPAA-compliant data warehouse for patient analytics with automated reporting",
    technologies: ["Snowflake", "dbt", "Airflow", "Tableau"],
    rating: 4.9,
    views: 189
  },
  {
    id: "portfolio-3",
    title: "IoT Sensor Data Platform", 
    author: "Anna Rodriguez",
    description: "Scalable platform for processing millions of IoT sensor readings per day",
    technologies: ["AWS", "Kinesis", "Lambda", "DynamoDB"],
    rating: 4.7,
    views: 156
  }
]

const caseStudies = [
  {
    id: "case-1",
    title: "Netflix Data Infrastructure",
    description: "How Netflix handles petabytes of data for content recommendations and streaming analytics",
    industry: "Entertainment",
    concepts: ["Data Lakes", "Real-time Processing", "Machine Learning Pipelines"]
  },
  {
    id: "case-2",
    title: "Spotify's Data Platform Evolution", 
    description: "The journey from traditional ETL to modern event-driven architecture",
    industry: "Music/Audio",
    concepts: ["Event Streaming", "Microservices", "Data Mesh"]
  },
  {
    id: "case-3",
    title: "Uber's Real-time Data Platform",
    description: "Building reliable real-time data pipelines for ride matching and pricing",
    industry: "Transportation",
    concepts: ["Stream Processing", "Data Quality", "Monitoring"]
  }
]

const getStatusIcon = (status: Project["status"]) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-4 h-4 text-green-600" />
    case "submitted":
      return <Upload className="w-4 h-4 text-blue-600" />
    case "in-progress":
      return <AlertCircle className="w-4 h-4 text-yellow-600" />
    case "not-started":
      return <Clock className="w-4 h-4 text-gray-400" />
  }
}

const getDifficultyColor = (difficulty: Project["difficulty"]) => {
  switch (difficulty) {
    case "beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "advanced":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  }
}

export default function Projects() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="text-muted-foreground">
          Build your portfolio with hands-on projects that demonstrate real-world data engineering skills.
        </p>
      </div>

      {/* My Projects */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5" />
          <h2 className="text-xl font-semibold">My Projects</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id} className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      {getStatusIcon(project.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-1 text-xs rounded capitalize",
                        getDifficultyColor(project.difficulty)
                      )}>
                        {project.difficulty}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {project.estimatedHours}h
                      </span>
                      {project.dueDate && (
                        <span className="text-xs text-muted-foreground">
                          Due: {project.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                  {project.type === "capstone" && (
                    <Trophy className="w-5 h-5 text-yellow-600" />
                  )}
                </div>
                <CardDescription className="text-sm">
                  {project.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Technologies:</h4>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Requirements:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {project.requirements.slice(0, 3).map((req, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-primary">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                    {project.requirements.length > 3 && (
                      <li className="text-muted-foreground">
                        +{project.requirements.length - 3} more...
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex gap-2 pt-2">
                  {project.status === "completed" && (
                    <Button variant="outline" size="sm">
                      View Submission
                    </Button>
                  )}
                  {project.status === "in-progress" && (
                    <Button size="sm">
                      Continue
                    </Button>
                  )}
                  {project.status === "not-started" && (
                    <Button size="sm">
                      Start Project
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
      </section>

      {/* Portfolio Gallery */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Portfolio Gallery</h2>
          <span className="text-sm text-muted-foreground">- Featured student projects</span>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          {portfolioProjects.map((project) => (
            <Card key={project.id} className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{project.title}</CardTitle>
                <CardDescription className="text-sm">
                  by {project.author}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{project.rating}</span>
                  </div>
                  <span className="text-muted-foreground">{project.views} views</span>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  View Project
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Case Studies */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Case Studies</h2>
          <span className="text-sm text-muted-foreground">- Real-world data engineering solutions</span>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <Card key={study.id} className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{study.title}</CardTitle>
                <CardDescription className="text-sm">
                  {study.industry}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {study.description}
                </p>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Key Concepts:</h4>
                  <div className="flex flex-wrap gap-1">
                    {study.concepts.map((concept, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs bg-primary/10 text-primary rounded"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  Read Case Study
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}