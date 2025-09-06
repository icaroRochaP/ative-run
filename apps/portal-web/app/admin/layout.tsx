import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Aleen.ai Admin Panel",
  description: "Administrative panel for managing users, AI agents, and platform operations.",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-aleen-light to-white">
      {children}
    </div>
  )
}
