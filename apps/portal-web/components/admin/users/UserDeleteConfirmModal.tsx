"use client"

import { MockUser } from "@/lib/admin-mock-data"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface UserDeleteConfirmModalProps {
  user: MockUser | null
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function UserDeleteConfirmModal({ 
  user, 
  isOpen, 
  onClose, 
  onConfirm 
}: UserDeleteConfirmModalProps) {
  
  if (!user) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{user.name || user.email}</strong>? 
            This action cannot be undone and will permanently remove all user data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete User
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
