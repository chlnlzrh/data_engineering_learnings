import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ui/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    template: "%s | Data Engineering Platform",
    default: "Data Engineering Learning Platform"
  },
  description: "Comprehensive data engineering education platform with hands-on projects and structured learning paths. Master SQL, Python, cloud platforms, and build real-world data pipelines.",
  keywords: ["data engineering", "SQL", "Python", "data pipelines", "cloud computing", "ETL", "data warehouse"],
  authors: [{ name: "Data Engineering Learning Platform" }],
  creator: "Data Engineering Learning Platform",
  publisher: "Data Engineering Learning Platform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}