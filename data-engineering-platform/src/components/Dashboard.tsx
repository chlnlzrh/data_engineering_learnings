"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Trophy, Calendar, Bookmark, Bell } from "lucide-react"

export default function Dashboard() {
  const progressData = {
    overall: 25,
    modulesCompleted: 2,
    totalModules: 8,
    projectsSubmitted: 1,
    totalProjects: 4
  }

  const nextLesson = {
    module: "Module 2",
    lesson: "Lesson 1",
    title: "Intro to Data Modeling",
    estimatedTime: "45 minutes"
  }

  const upcomingDeadlines = [
    { title: "Module 2 Lab Assignment", dueDate: "Nov 5, 2024", type: "assignment" },
    { title: "SQL Practice Quiz", dueDate: "Nov 8, 2024", type: "quiz" },
    { title: "Mid-term Project Proposal", dueDate: "Nov 15, 2024", type: "project" }
  ]

  const bookmarks = [
    { title: "SQL Joins Cheat Sheet", type: "resource", url: "/resources/sql-joins" },
    { title: "Python Data Types Guide", type: "resource", url: "/resources/python-basics" },
    { title: "Module 1 Review Notes", type: "lesson", url: "/learning-path/module-1/review" }
  ]

  const announcements = [
    {
      title: "New Office Hours Added",
      content: "We've added Tuesday evening office hours to help with SQL concepts.",
      date: "Oct 28, 2024"
    },
    {
      title: "Guest Speaker Next Week",
      content: "Join us for a talk on 'Modern Data Pipelines in Production' with Sarah Chen from Netflix.",
      date: "Oct 25, 2024"
    }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Welcome back, Student!</h1>
        <p className="text-muted-foreground">
          Continue your data engineering journey. You&apos;re making great progress!
        </p>
      </div>

      {/* Continue Learning Section */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="w-5 h-5" />
            Continue Learning
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Next Up:</h3>
            <p className="text-sm text-muted-foreground">
              {nextLesson.module}, {nextLesson.lesson} - {nextLesson.title}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Estimated time: {nextLesson.estimatedTime}</span>
            </div>
          </div>
          <Button className="w-full sm:w-auto">
            Start Lesson
          </Button>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="w-4 h-4" />
              My Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span className="font-medium">{progressData.overall}%</span>
              </div>
              <Progress value={progressData.overall} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Modules</p>
                <p className="font-medium">
                  {progressData.modulesCompleted}/{progressData.totalModules}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Projects</p>
                <p className="font-medium">
                  {progressData.projectsSubmitted}/{progressData.totalProjects}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="w-4 h-4" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="flex justify-between items-start text-sm">
                  <div className="space-y-1">
                    <p className="font-medium">{deadline.title}</p>
                    <p className="text-muted-foreground capitalize">{deadline.type}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{deadline.dueDate}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Bookmarks */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bookmark className="w-4 h-4" />
              My Bookmarks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bookmarks.map((bookmark, index) => (
                <div key={index} className="space-y-1">
                  <button className="text-sm font-medium text-primary hover:underline text-left">
                    {bookmark.title}
                  </button>
                  <p className="text-xs text-muted-foreground capitalize">{bookmark.type}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Announcements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="w-5 h-5" />
            Recent Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <div key={index} className="border-l-2 border-primary/20 pl-4 space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-sm">{announcement.title}</h3>
                  <span className="text-xs text-muted-foreground">{announcement.date}</span>
                </div>
                <p className="text-sm text-muted-foreground">{announcement.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}