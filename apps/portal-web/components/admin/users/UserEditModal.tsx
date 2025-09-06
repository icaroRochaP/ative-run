"use client"

import { useState, useEffect } from "react"
import { MockUser } from "@/lib/admin-mock-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface UserEditModalProps {
  user: MockUser | null
  mode: 'view' | 'edit'
  isOpen: boolean
  onClose: () => void
  onSave: (user: MockUser) => void
}

export function UserEditModal({ user, mode, isOpen, onClose, onSave }: UserEditModalProps) {
  const [formData, setFormData] = useState<MockUser | null>(null)

  useEffect(() => {
    if (user) {
      setFormData({ ...user })
    }
  }, [user])

  const handleSave = () => {
    if (formData) {
      onSave(formData)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      trial: "bg-blue-100 text-blue-800",
      inactive: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800"
    } as const

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (!user || !formData) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'view' ? 'View User' : 'Edit User'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'view' 
              ? 'User details and information'
              : 'Update user information and subscription status'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="col-span-3"
              disabled={mode === 'view'}
            />
          </div>

          {/* Email */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="col-span-3"
              disabled={mode === 'view'}
            />
          </div>

          {/* Phone */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input
              id="phone"
              value={formData.phone || ''}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="col-span-3"
              disabled={mode === 'view'}
            />
          </div>

          {/* Subscription Status */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Status
            </Label>
            <div className="col-span-3">
              {mode === 'view' ? (
                getStatusBadge(formData.subscription_status)
              ) : (
                <Select
                  value={formData.subscription_status}
                  onValueChange={(value) => 
                    setFormData({
                      ...formData, 
                      subscription_status: value as MockUser['subscription_status']
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Created Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Created
            </Label>
            <div className="col-span-3 text-sm text-gray-600">
              {formatDate(formData.created_at)}
            </div>
          </div>

          {/* Last Login */}
          {formData.last_login && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Last Login
              </Label>
              <div className="col-span-3 text-sm text-gray-600">
                {formatDate(formData.last_login)}
              </div>
            </div>
          )}

          {/* Onboarding Status */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Onboarding
            </Label>
            <div className="col-span-3">
              <Badge variant={formData.onboarding ? "default" : "secondary"}>
                {formData.onboarding ? "Completed" : "Pending"}
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {mode === 'edit' && (
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
