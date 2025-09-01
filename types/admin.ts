// Admin Panel Type Definitions

export interface AdminUser {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  subscription_status: 'active' | 'inactive' | 'cancelled' | 'trial'
  created_at: string
  onboarding: boolean | null
  new_account: boolean | null
  last_login?: string
}

export interface AdminAgent {
  id: string
  name: string | null
  description: string | null
  prompt: string | null
  identifier: string | null
  created_at: string
  updated_at?: string
  is_active?: boolean
}

export interface AdminMetrics {
  totalUsers: number
  activeSubscriptions: number
  totalRevenue: number
  monthlyGrowth: number
  newUsersThisMonth: number
  activeAgents: number
}

export interface ChartDataPoint {
  [key: string]: string | number
}

export interface QuickAction {
  title: string
  description: string
  icon: React.ComponentType
  action: () => void
}

export interface ActivityLog {
  id: string
  type: 'user_registration' | 'agent_update' | 'subscription_change' | 'system_event'
  message: string
  details: string
  timestamp: string
  status: 'success' | 'warning' | 'error' | 'info'
}

export interface AdminTableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
}

export interface PaginationState {
  page: number
  pageSize: number
  total: number
}

export interface AdminFilters {
  search?: string
  status?: string
  dateRange?: {
    from: Date
    to: Date
  }
}

export interface AdminModalState {
  isOpen: boolean
  mode: 'create' | 'edit' | 'view' | 'delete'
  data?: any
}

export interface AdminFormData {
  [key: string]: any
}

export interface AdminError {
  message: string
  code?: string
  field?: string
}
