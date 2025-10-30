import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects",
  description: "Build your data engineering portfolio with hands-on capstone projects, mini-projects, and real-world case studies.",
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}