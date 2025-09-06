import { AdminGuard } from "@/components/admin/AdminGuard"
import { AdminLayout } from "@/components/admin/AdminLayout"

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminLayout />
    </AdminGuard>
  )
}
