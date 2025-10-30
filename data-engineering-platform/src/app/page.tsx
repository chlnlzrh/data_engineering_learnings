import Navigation from "@/components/Navigation"
import Dashboard from "@/components/Dashboard"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>
      <Navigation />
      <main id="main-content" role="main" aria-label="Dashboard content" className="ml-12 lg:ml-12 transition-all duration-300">
        <Dashboard />
      </main>
    </div>
  )
}