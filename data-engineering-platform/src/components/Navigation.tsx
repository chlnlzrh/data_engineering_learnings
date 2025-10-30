"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ThemeToggle"
import { 
  Home, 
  Map, 
  FolderOpen, 
  MessageCircle, 
  BookOpen, 
  ChevronRight,
  Menu,
  X
} from "lucide-react"

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  children?: NavigationItem[]
}

const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    label: "My Dashboard",
    icon: Home,
    href: "/",
  },
  {
    id: "learning-path",
    label: "Learning Path",
    icon: Map,
    href: "/learning-path",
    children: [
      { id: "module-1", label: "Module 1: Database Fundamentals", icon: BookOpen, href: "/learning-path/module-1" },
      { id: "module-2", label: "Module 2: SQL & ELT Concepts", icon: BookOpen, href: "/learning-path/module-2" },
      { id: "module-3", label: "Module 3: Data Warehousing Principles", icon: BookOpen, href: "/learning-path/module-3" },
      { id: "module-4", label: "Module 4: Data Modeling", icon: BookOpen, href: "/learning-path/module-4" },
      { id: "module-5", label: "Module 5: Snowflake-Specific Knowledge", icon: BookOpen, href: "/learning-path/module-5" },
      { id: "module-6", label: "Module 6: ETL/ELT Design & Best Practices", icon: BookOpen, href: "/learning-path/module-6" },
      { id: "module-7", label: "Module 7: Data Governance & Quality", icon: BookOpen, href: "/learning-path/module-7" },
      { id: "module-8", label: "Module 8: Snowflake Security & Access Control", icon: BookOpen, href: "/learning-path/module-8" },
      { id: "module-9", label: "Module 9: Reporting & BI Concepts", icon: BookOpen, href: "/learning-path/module-9" },
      { id: "module-10", label: "Module 10: Unix/Linux & File Handling", icon: BookOpen, href: "/learning-path/module-10" },
      { id: "module-11", label: "Module 11: Version Control & Collaboration", icon: BookOpen, href: "/learning-path/module-11" },
      { id: "module-12", label: "Module 12: Performance & Troubleshooting", icon: BookOpen, href: "/learning-path/module-12" },
      { id: "module-13", label: "Module 13: CI/CD & Deployment", icon: BookOpen, href: "/learning-path/module-13" },
      { id: "module-14", label: "Module 14: Monitoring & Observability", icon: BookOpen, href: "/learning-path/module-14" },
      { id: "module-15", label: "Module 15: Orchestration & Scheduling", icon: BookOpen, href: "/learning-path/module-15" },
      { id: "module-16", label: "Module 16: Data Transformation with dbt", icon: BookOpen, href: "/learning-path/module-16" },
      { id: "module-17", label: "Module 17: Soft Skills & Professional Practices", icon: BookOpen, href: "/learning-path/module-17" },
      { id: "module-18", label: "Module 18: Business & Domain Knowledge", icon: BookOpen, href: "/learning-path/module-18" },
      { id: "module-19", label: "Module 19: Additional Technical Skills", icon: BookOpen, href: "/learning-path/module-19" },
      { id: "module-20", label: "Module 20: Emerging Topics & Advanced Concepts", icon: BookOpen, href: "/learning-path/module-20" },
    ]
  },
  {
    id: "projects",
    label: "Projects",
    icon: FolderOpen,
    href: "/projects",
    children: [
      { id: "capstone", label: "Capstone Project", icon: FolderOpen, href: "/projects/capstone" },
      { id: "mini-projects", label: "Mini-Projects", icon: FolderOpen, href: "/projects/mini" },
      { id: "portfolio", label: "Portfolio Gallery", icon: FolderOpen, href: "/projects/portfolio" },
      { id: "case-studies", label: "Case Studies", icon: FolderOpen, href: "/projects/case-studies" },
    ]
  },
  {
    id: "community",
    label: "Help & Community",
    icon: MessageCircle,
    href: "/community",
    children: [
      { id: "forum", label: "Community Forum", icon: MessageCircle, href: "/community/forum" },
      { id: "office-hours", label: "Office Hours", icon: MessageCircle, href: "/community/office-hours" },
      { id: "faq", label: "FAQ", icon: MessageCircle, href: "/community/faq" },
      { id: "support", label: "Contact Support", icon: MessageCircle, href: "/community/support" },
    ]
  },
  {
    id: "resources",
    label: "Resource Library",
    icon: BookOpen,
    href: "/resources",
    children: [
      { id: "tooling", label: "Tooling Guides", icon: BookOpen, href: "/resources/tooling" },
      { id: "cheatsheets", label: "Cheat Sheets", icon: BookOpen, href: "/resources/cheatsheets" },
      { id: "glossary", label: "Glossary", icon: BookOpen, href: "/resources/glossary" },
      { id: "reading", label: "Reading List", icon: BookOpen, href: "/resources/reading" },
    ]
  },
]

export default function Navigation() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const NavigationContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h1 className={cn(
            "font-bold transition-opacity duration-300",
            isExpanded || isMobileOpen ? "text-xs opacity-100" : "text-xs opacity-0 lg:opacity-100"
          )}>
            <span data-testid="site-logo">Data Engineering Platform</span>
          </h1>
          <div className={cn(
            "transition-opacity duration-300",
            isExpanded || isMobileOpen ? "opacity-100" : "opacity-0 lg:opacity-100"
          )}>
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      <nav role="navigation" aria-label="Main navigation" className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => (
          <div key={item.id} className="menu-section">
            <button
              onClick={() => item.children && toggleSection(item.id)}
              className={cn(
                "w-full flex items-center gap-3 menu-item",
                "hover:bg-accent/50 rounded-md px-2 transition-colors duration-300",
                !item.children && "cursor-pointer"
              )}
              aria-expanded={item.children ? expandedSections.includes(item.id) : undefined}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className={cn(
                "transition-opacity duration-300 truncate",
                isExpanded || isMobileOpen ? "opacity-100" : "opacity-0 lg:opacity-100"
              )}>
                {item.label}
              </span>
              {item.children && (
                <ChevronRight 
                  className={cn(
                    "w-3 h-3 ml-auto transition-transform duration-300",
                    expandedSections.includes(item.id) && "rotate-90",
                    isExpanded || isMobileOpen ? "opacity-100" : "opacity-0 lg:opacity-100"
                  )}
                />
              )}
            </button>
            
            {item.children && expandedSections.includes(item.id) && (
              <div className={cn(
                "ml-4 mt-1 space-y-0.5 animate-fade-in",
                isExpanded || isMobileOpen ? "block" : "hidden lg:block"
              )}>
                {item.children.map((child) => (
                  <button
                    key={child.id}
                    className="w-full flex items-center gap-2 menu-item hover:bg-accent/30 rounded-md px-2 transition-colors duration-300"
                  >
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40 flex-shrink-0" />
                    <span className="truncate text-left">{child.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        id="mobile-menu-button"
        data-testid="mobile-menu-trigger"
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background border rounded-md shadow-md"
        aria-label="Open navigation menu"
        aria-expanded={isMobileOpen}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Navigation */}
      <div className={cn(
        "lg:hidden fixed top-0 left-0 h-full w-80 bg-background border-r shadow-lg z-50 transform transition-transform duration-300",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xs font-bold">Data Engineering Platform</h1>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1 hover:bg-accent rounded-md"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <NavigationContent />
      </div>

      {/* Desktop Navigation */}
      <aside 
        id="desktop-sidebar"
        data-testid="desktop-navigation"
        role="complementary"
        aria-label="Site navigation"
        className={cn(
          "hidden lg:block fixed top-0 left-0 h-full bg-background border-r shadow-sm transition-all duration-300 z-30",
          isExpanded ? "w-64" : "w-12"
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <NavigationContent />
      </aside>
    </>
  )
}