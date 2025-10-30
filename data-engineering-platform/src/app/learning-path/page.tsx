import Navigation from "@/components/Navigation"
import LearningPath from "@/components/LearningPath"

export default function LearningPathPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="ml-12 lg:ml-12 transition-all duration-300">
        <LearningPath />
      </main>
    </div>
  )
}