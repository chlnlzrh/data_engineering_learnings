"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  MessageCircle,
  Calendar,
  HelpCircle,
  Mail,
  Users,
  Clock,
  MessageSquare,
  Video,
  FileQuestion,
  Send
} from "lucide-react"

const forumChannels = [
  {
    id: "help",
    name: "#help",
    description: "Get help with assignments and technical issues",
    members: 156,
    lastActivity: "2 minutes ago",
    unread: 3
  },
  {
    id: "module-1",
    name: "#module-1",
    description: "Discuss Module 1: Data Engineering Foundations",
    members: 89,
    lastActivity: "15 minutes ago",
    unread: 0
  },
  {
    id: "module-2",
    name: "#module-2", 
    description: "SQL & Data Modeling discussions",
    members: 67,
    lastActivity: "1 hour ago",
    unread: 1
  },
  {
    id: "career-talk",
    name: "#career-talk",
    description: "Career advice, job postings, and industry insights",
    members: 203,
    lastActivity: "30 minutes ago",
    unread: 5
  },
  {
    id: "random",
    name: "#random",
    description: "General discussions and community chat",
    members: 145,
    lastActivity: "5 minutes ago",
    unread: 0
  }
]

const officeHours = [
  {
    id: "1",
    instructor: "Dr. Sarah Chen",
    topic: "SQL Performance Optimization",
    date: "Thursday, Nov 2",
    time: "3:00 PM - 4:00 PM EST",
    spots: "3/8 available",
    type: "group"
  },
  {
    id: "2", 
    instructor: "Mike Rodriguez",
    topic: "1:1 Career Guidance",
    date: "Friday, Nov 3",
    time: "2:00 PM - 2:30 PM EST", 
    spots: "Available",
    type: "individual"
  },
  {
    id: "3",
    instructor: "Dr. Sarah Chen", 
    topic: "Python Data Pipeline Troubleshooting",
    date: "Monday, Nov 6",
    time: "7:00 PM - 8:00 PM EST",
    spots: "1/6 available", 
    type: "group"
  }
]

const faqCategories = [
  {
    id: "technical-setup",
    title: "Technical Setup Issues",
    description: "Common problems with environment setup and tooling",
    questions: [
      "How do I install Docker on Windows?",
      "PostgreSQL connection errors",
      "Python virtual environment setup",
      "Git authentication issues"
    ]
  },
  {
    id: "program-logistics",
    title: "Program & Logistics", 
    description: "Questions about course structure and requirements",
    questions: [
      "How are assignments graded?",
      "Can I extend project deadlines?",
      "What happens if I miss a module?",
      "Certificate requirements"
    ]
  },
  {
    id: "assignments",
    title: "Assignment Questions",
    description: "Help with specific assignments and projects",
    questions: [
      "Module 2 Lab clarifications",
      "Capstone project scope",
      "SQL query optimization tips",
      "dbt model best practices"
    ]
  }
]

const recentActivity = [
  {
    id: "1",
    user: "Alex Thompson",
    action: "asked a question in",
    channel: "#help",
    content: "Getting a connection timeout error with Snowflake...",
    time: "2 minutes ago",
    replies: 2
  },
  {
    id: "2",
    user: "Maria Santos", 
    action: "shared a resource in",
    channel: "#career-talk",
    content: "Great article on data engineering interview prep",
    time: "15 minutes ago",
    replies: 8
  },
  {
    id: "3",
    user: "David Kim",
    action: "completed Module 2 in",
    channel: "#module-2", 
    content: "Finally finished the dimensional modeling lab!",
    time: "1 hour ago",
    replies: 5
  }
]

export default function Community() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Help & Community</h1>
        <p className="text-muted-foreground">
          Connect with instructors and fellow students, get help, and share your learning journey.
        </p>
      </div>

      {/* Community Forum */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Community Forum</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {forumChannels.map((channel) => (
            <Card key={channel.id} className="transition-all duration-200 hover:shadow-md cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      {channel.name}
                      {channel.unread > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                          {channel.unread}
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {channel.description}
                    </CardDescription>
                  </div>
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>{channel.members} members</span>
                  </div>
                  <span className="text-muted-foreground">{channel.lastActivity}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Join Channel
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Office Hours */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Book Office Hours</h2>
          </div>
          <Button size="sm">
            View All Sessions
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {officeHours.map((session) => (
            <Card key={session.id} className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{session.topic}</CardTitle>
                    <CardDescription className="text-sm">
                      with {session.instructor}
                    </CardDescription>
                  </div>
                  <Video className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span>{session.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span>{session.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <span>{session.spots}</span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="w-full"
                  variant={session.spots.includes("Available") || session.spots.includes("/") ? "default" : "outline"}
                  disabled={!session.spots.includes("Available") && !session.spots.includes("/")}
                >
                  {session.spots.includes("Available") || session.spots.includes("/") ? "Book Session" : "Fully Booked"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {faqCategories.map((category) => (
            <Card key={category.id} className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{category.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {category.description}
                    </CardDescription>
                  </div>
                  <FileQuestion className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {category.questions.slice(0, 3).map((question, index) => (
                    <button 
                      key={index}
                      className="text-sm text-left text-primary hover:underline block"
                    >
                      {question}
                    </button>
                  ))}
                  {category.questions.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{category.questions.length - 3} more questions
                    </p>
                  )}
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View All FAQs
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Activity & Contact Support */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircle className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        <span className="text-muted-foreground"> {activity.action} </span>
                        <span className="text-primary">{activity.channel}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageSquare className="w-3 h-3" />
                    <span>{activity.replies} replies</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="w-5 h-5" />
              Contact Support
            </CardTitle>
            <CardDescription>
              Need technical help or have administrative questions?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-muted/30 rounded">
                <h4 className="text-sm font-medium">Technical Issues</h4>
                <p className="text-xs text-muted-foreground">
                  Platform bugs, login problems, or tool access issues
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded">
                <h4 className="text-sm font-medium">Academic Support</h4>
                <p className="text-xs text-muted-foreground">
                  Assignment clarifications, grade inquiries, or course policies
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded">
                <h4 className="text-sm font-medium">General Inquiries</h4>
                <p className="text-xs text-muted-foreground">
                  Program information, certificates, or other questions
                </p>
              </div>
            </div>
            <Button className="w-full">
              <Send className="w-4 h-4 mr-2" />
              Submit Support Ticket
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}