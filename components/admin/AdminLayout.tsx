"use client"

import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardOverview } from "@/components/admin/dashboard/DashboardOverview"
import { UsersTable } from "@/components/admin/users/UsersTable"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { useState } from "react"

export function AdminLayout() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-gradient-to-br from-aleen-light to-white">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Admin Header */}
        <AdminHeader />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white border-0 shadow-xl rounded-2xl p-1 max-w-md mx-auto">
            <TabsTrigger
              value="dashboard"
              className="text-xs font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-aleen-primary data-[state=active]:to-aleen-secondary data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="text-xs font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-aleen-primary data-[state=active]:to-aleen-secondary data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              Users
            </TabsTrigger>
            <TabsTrigger
              value="agents"
              className="text-xs font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-aleen-primary data-[state=active]:to-aleen-secondary data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              AI Agents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UsersTable />
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-xl border-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Agents</h3>
              <p className="text-gray-600">Em desenvolvimento...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
