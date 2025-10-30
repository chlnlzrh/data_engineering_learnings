import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Help & Community",
  description: "Connect with instructors and fellow students through our community forums, office hours, and comprehensive support resources.",
}

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}