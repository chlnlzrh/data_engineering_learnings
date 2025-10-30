import Navigation from "@/components/Navigation"
import Community from "@/components/Community"

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="ml-12 lg:ml-12 transition-all duration-300">
        <Community />
      </main>
    </div>
  )
}