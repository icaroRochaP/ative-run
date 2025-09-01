"use client"

import { useState } from "react"
import { mockUsers, type MockUser } from "@/lib/admin-mock-data"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Edit, Eye, UserX, Trash2 } from "lucide-react"
import { UserEditModal } from "./UserEditModal"
import { UserDeleteConfirmModal } from "./UserDeleteConfirmModal"

export function UsersTable() {
  const [users, setUsers] = useState<MockUser[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editMode, setEditMode] = useState<'view' | 'edit'>('view')

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      trial: "secondary", 
      inactive: "outline",
      cancelled: "destructive"
    } as const

    const colors = {
      active: "bg-green-100 text-green-800 hover:bg-green-100",
      trial: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      inactive: "bg-gray-100 text-gray-800 hover:bg-gray-100", 
      cancelled: "bg-red-100 text-red-800 hover:bg-red-100"
    } as const

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    })
  }

  const handleView = (user: MockUser) => {
    setSelectedUser(user)
    setEditMode('view')
    setShowEditModal(true)
  }

  const handleEdit = (user: MockUser) => {
    setSelectedUser(user)
    setEditMode('edit')
    setShowEditModal(true)
  }

  const handleDelete = (user: MockUser) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const handleSaveUser = (updatedUser: MockUser) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u))
    setShowEditModal(false)
    setSelectedUser(null)
  }

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id))
      setShowDeleteModal(false)
      setSelectedUser(null)
    }
  }

  const handleDeactivate = (user: MockUser) => {
    const updatedUser = { ...user, subscription_status: 'inactive' as const }
    setUsers(users.map(u => u.id === user.id ? updatedUser : u))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Users Management</CardTitle>
          <CardDescription>
            Manage platform users and their subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.name || 'No name'}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {getStatusBadge(user.subscription_status)}
                    </TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {user.subscription_status === 'active' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeactivate(user)}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found matching your search.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <UserEditModal
        user={selectedUser}
        mode={editMode}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedUser(null)
        }}
        onSave={handleSaveUser}
      />

      <UserDeleteConfirmModal
        user={selectedUser}
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedUser(null)
        }}
        onConfirm={handleDeleteUser}
      />
    </div>
  )
}
