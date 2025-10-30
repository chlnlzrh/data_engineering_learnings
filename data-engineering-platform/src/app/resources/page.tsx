import Navigation from "@/components/Navigation"
import Resources from "@/components/Resources"

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="ml-12 lg:ml-12 transition-all duration-300">
        <Resources />
      </main>
    </div>
  )
}