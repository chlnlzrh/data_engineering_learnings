"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BookOpen,
  FileText,
  Code,
  Search,
  Download,
  ExternalLink,
  Star,
  Clock
} from "lucide-react"

const toolingGuides = [
  {
    id: "docker",
    title: "Docker Installation & Setup",
    description: "Complete guide to installing and configuring Docker for data engineering workflows",
    type: "Installation Guide",
    difficulty: "Beginner",
    estimatedTime: "30 minutes",
    downloads: 1243,
    rating: 4.8
  },
  {
    id: "airflow",
    title: "Apache Airflow Setup Guide", 
    description: "Step-by-step setup for Airflow on local and cloud environments",
    type: "Setup Guide",
    difficulty: "Intermediate", 
    estimatedTime: "1 hour",
    downloads: 987,
    rating: 4.6
  },
  {
    id: "dbt",
    title: "dbt (Data Build Tool) Getting Started",
    description: "Initialize your first dbt project and understand core concepts",
    type: "Tutorial",
    difficulty: "Beginner",
    estimatedTime: "45 minutes", 
    downloads: 1567,
    rating: 4.9
  },
  {
    id: "snowflake",
    title: "Snowflake Configuration Guide",
    description: "Connect to Snowflake, set up warehouses, and manage permissions",
    type: "Configuration",
    difficulty: "Intermediate",
    estimatedTime: "20 minutes",
    downloads: 834,
    rating: 4.7
  }
]

const cheatSheets = [
  {
    id: "sql-joins",
    title: "SQL Joins Cheat Sheet",
    description: "Visual guide to INNER, LEFT, RIGHT, FULL OUTER joins with examples",
    category: "SQL",
    pages: 2,
    downloads: 2341,
    lastUpdated: "Oct 2024"
  },
  {
    id: "pandas-operations",
    title: "Python Pandas Operations",
    description: "Essential DataFrame operations, filtering, grouping, and transformations",
    category: "Python",
    pages: 4,
    downloads: 1876,
    lastUpdated: "Sep 2024"
  },
  {
    id: "shell-commands",
    title: "Essential Shell Commands",
    description: "Must-know Linux/Unix commands for data engineers",
    category: "Shell",
    pages: 3,
    downloads: 1432,
    lastUpdated: "Oct 2024"
  },
  {
    id: "git-workflow",
    title: "Git Workflow for Data Projects",
    description: "Branching strategies, commits, and collaboration patterns",
    category: "Git",
    pages: 3,
    downloads: 1654,
    lastUpdated: "Oct 2024"
  },
  {
    id: "airflow-operators",
    title: "Airflow Operators Reference",
    description: "Common operators, sensors, and task patterns",
    category: "Airflow",
    pages: 5,
    downloads: 923,
    lastUpdated: "Sep 2024"
  },
  {
    id: "dbt-functions",
    title: "dbt Functions & Macros",
    description: "Built-in functions, Jinja templating, and custom macros",
    category: "dbt",
    pages: 4,
    downloads: 1287,
    lastUpdated: "Oct 2024"
  }
]

const glossaryTerms = [
  {
    term: "ETL",
    definition: "Extract, Transform, Load - traditional data integration pattern",
    category: "Data Integration"
  },
  {
    term: "ELT", 
    definition: "Extract, Load, Transform - modern cloud-native data integration pattern",
    category: "Data Integration"
  },
  {
    term: "Data Lake",
    definition: "Storage repository that holds vast amounts of raw data in its native format",
    category: "Storage"
  },
  {
    term: "Data Warehouse",
    definition: "Central repository of integrated data from multiple sources, optimized for analysis",
    category: "Storage"
  },
  {
    term: "Dimensional Modeling",
    definition: "Data modeling technique optimized for data warehouse queries and reporting",
    category: "Modeling"
  },
  {
    term: "OLAP",
    definition: "Online Analytical Processing - systems optimized for complex analytical queries",
    category: "Architecture"
  }
]

const readingList = [
  {
    id: "1",
    title: "The Data Engineering Cookbook",
    author: "Andreas Kretz",
    type: "Book",
    description: "Comprehensive guide to modern data engineering practices and architectures",
    url: "https://github.com/andkret/Cookbook",
    rating: 4.7,
    category: "Fundamentals"
  },
  {
    id: "2", 
    title: "Building Data-Intensive Applications",
    author: "Martin Kleppmann",
    type: "Book",
    description: "Deep dive into scalable, reliable, and maintainable data systems",
    url: "https://dataintensive.net/",
    rating: 4.9,
    category: "Architecture"
  },
  {
    id: "3",
    title: "The Rise of the Data Engineer",
    author: "Maxime Beauchemin",
    type: "Blog Post",
    description: "Foundational article that defined the modern data engineer role",
    url: "https://medium.com/@maximebeauchemin/the-rise-of-the-data-engineer-91be18f1e603",
    rating: 4.8,
    category: "Career"
  },
  {
    id: "4",
    title: "Modern Data Stack Explained",
    author: "dbt Labs",
    type: "Article",
    description: "Understanding the components and benefits of the modern data stack",
    url: "https://www.getdbt.com/blog/future-of-the-modern-data-stack/",
    rating: 4.6,
    category: "Tools"
  },
  {
    id: "5",
    title: "Data Engineering Weekly",
    author: "Ananth Packkildurai",
    type: "Newsletter",
    description: "Weekly curated articles, tools, and insights for data engineers",
    url: "https://www.dataengineering.wiki/",
    rating: 4.7,
    category: "News"
  }
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "advanced":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

const getCategoryColor = (category: string) => {
  const colors = {
    "SQL": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "Python": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "Shell": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    "Git": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    "Airflow": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    "dbt": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
  }
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
}

export default function Resources() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Resource Library</h1>
        <p className="text-muted-foreground">
          Your go-to collection of guides, cheat sheets, and curated learning materials.
        </p>
      </div>

      {/* Search Bar */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search resources, guides, or topics..."
              className="flex-1 bg-transparent border-none outline-none text-sm"
            />
            <Button variant="outline" size="sm">
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tooling Guides */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Tooling Guides</h2>
          <span className="text-sm text-muted-foreground">- Setup and configuration</span>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {toolingGuides.map((guide) => (
            <Card key={guide.id} className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{guide.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {guide.description}
                    </CardDescription>
                  </div>
                  <Download className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-1 rounded ${getDifficultyColor(guide.difficulty)}`}>
                    {guide.difficulty}
                  </span>
                  <span className="text-muted-foreground">{guide.type}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{guide.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{guide.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{guide.downloads} downloads</span>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="w-3 h-3 mr-2" />
                  Download Guide
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Cheat Sheets */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Tech Cheat Sheets</h2>
          <span className="text-sm text-muted-foreground">- Quick reference guides</span>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cheatSheets.map((sheet) => (
            <Card key={sheet.id} className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{sheet.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {sheet.description}
                    </CardDescription>
                  </div>
                  <FileText className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <span className={`inline-block px-2 py-1 text-xs rounded ${getCategoryColor(sheet.category)}`}>
                  {sheet.category}
                </span>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{sheet.pages} pages</span>
                  <span className="text-muted-foreground">{sheet.lastUpdated}</span>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {sheet.downloads} downloads
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="w-3 h-3 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Glossary Preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Glossary of Terms</h2>
            <span className="text-sm text-muted-foreground">- Data engineering vocabulary</span>
          </div>
          <Button variant="outline" size="sm">
            View All Terms
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {glossaryTerms.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{item.term}</h4>
                    <span className="px-2 py-0.5 text-xs bg-secondary text-secondary-foreground rounded">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.definition}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Curated Reading List */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Curated Reading List</h2>
          <span className="text-sm text-muted-foreground">- Essential articles and books</span>
        </div>
        
        <div className="space-y-3">
          {readingList.map((item) => (
            <Card key={item.id} className="transition-all duration-200 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm">{item.title}</h3>
                      <span className="px-2 py-0.5 text-xs bg-secondary text-secondary-foreground rounded">
                        {item.type}
                      </span>
                      <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">by {item.author}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{item.rating}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-3 h-3 mr-2" />
                    Read
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}