import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { Database } from "./database.types"

export const createServerClient = async () => {
  const cookieStore = await cookies()

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: {
          getItem: (key: string) => {
            const cookie = cookieStore.get(key)
            return cookie?.value ?? null
          },
          setItem: (key: string, value: string) => {
            try {
              cookieStore.set(key, value, {
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                httpOnly: false,
                sameSite: 'lax'
              })
            } catch (error) {
              // Server Components can't set cookies
              console.warn('Cannot set cookie in Server Component:', error)
            }
          },
          removeItem: (key: string) => {
            try {
              cookieStore.delete(key)
            } catch (error) {
              // Server Components can't delete cookies
              console.warn('Cannot delete cookie in Server Component:', error)
            }
          },
        },
      },
    }
  )
}
