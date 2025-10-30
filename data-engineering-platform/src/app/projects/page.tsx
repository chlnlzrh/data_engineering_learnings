import Navigation from "@/components/Navigation"
import Projects from "@/components/Projects"

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="ml-12 lg:ml-12 transition-all duration-300">
        <Projects />
      </main>
    </div>
  )
}