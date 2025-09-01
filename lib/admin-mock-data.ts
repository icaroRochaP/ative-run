// Mock data for admin panel development

export interface MockUser {
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

export const mockUsers: MockUser[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "+55 11 99999-1111",
    subscription_status: "active",
    created_at: "2024-01-15T10:30:00Z",
    onboarding: true,
    new_account: false,
    last_login: "2024-08-27T14:22:00Z"
  },
  {
    id: "2", 
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "+55 11 99999-2222",
    subscription_status: "trial",
    created_at: "2024-08-20T09:15:00Z",
    onboarding: true,
    new_account: true,
    last_login: "2024-08-27T16:45:00Z"
  },
  {
    id: "3",
    name: "Pedro Costa",
    email: "pedro.costa@email.com", 
    phone: "+55 11 99999-3333",
    subscription_status: "active",
    created_at: "2024-02-10T14:20:00Z",
    onboarding: true,
    new_account: false,
    last_login: "2024-08-26T11:30:00Z"
  },
  {
    id: "4",
    name: "Ana Oliveira",
    email: "ana.oliveira@email.com",
    phone: "+55 11 99999-4444", 
    subscription_status: "cancelled",
    created_at: "2024-03-05T16:45:00Z",
    onboarding: true,
    new_account: false,
    last_login: "2024-08-15T08:20:00Z"
  },
  {
    id: "5",
    name: "Carlos Rodrigues",
    email: "carlos.rodrigues@email.com",
    phone: "+55 11 99999-5555",
    subscription_status: "active",
    created_at: "2024-07-12T11:10:00Z",
    onboarding: true,
    new_account: false,
    last_login: "2024-08-28T09:15:00Z"
  },
  {
    id: "6",
    name: "Lucia Ferreira",
    email: "lucia.ferreira@email.com",
    phone: "+55 11 99999-6666",
    subscription_status: "inactive",
    created_at: "2024-04-18T13:25:00Z",
    onboarding: false,
    new_account: false,
    last_login: "2024-08-10T15:30:00Z"
  },
  {
    id: "7",
    name: "Roberto Lima",
    email: "roberto.lima@email.com",
    phone: "+55 11 99999-7777",
    subscription_status: "trial",
    created_at: "2024-08-25T08:40:00Z",
    onboarding: true,
    new_account: true,
    last_login: "2024-08-28T10:20:00Z"
  },
  {
    id: "8",
    name: "Patricia Alves",
    email: "patricia.alves@email.com",
    phone: "+55 11 99999-8888",
    subscription_status: "active",
    created_at: "2024-01-30T12:15:00Z",
    onboarding: true,
    new_account: false,
    last_login: "2024-08-27T18:45:00Z"
  }
]

export const mockDashboardMetrics = {
  totalUsers: 1247,
  activeSubscriptions: 892,
  totalRevenue: 45780,
  monthlyGrowth: 12.5,
  newUsersThisMonth: 156,
  activeAgents: 8
}
