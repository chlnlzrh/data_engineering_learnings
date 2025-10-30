import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Resource Library",
  description: "Access comprehensive learning resources including tooling guides, cheat sheets, glossary terms, and curated reading materials for data engineering.",
}

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}