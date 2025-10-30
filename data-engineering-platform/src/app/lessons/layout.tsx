import Navigation from "@/components/Navigation"

export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main-content" role="main" aria-label="Lessons content" className="ml-12 lg:ml-12 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}