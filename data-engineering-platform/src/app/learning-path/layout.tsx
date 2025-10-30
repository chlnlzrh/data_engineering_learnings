import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Learning Path",
  description: "Master data engineering through our structured 8-module curriculum covering SQL, Python, cloud platforms, and real-time data processing.",
}

export default function LearningPathLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}