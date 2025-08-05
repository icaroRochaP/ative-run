export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          age: number | null
          gender: string | null
          weight: string | null
          height: string | null
          primary_goal: string | null
          subscription_status: string
          next_renewal: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          age?: number | null
          gender?: string | null
          weight?: string | null
          height?: string | null
          primary_goal?: string | null
          subscription_status?: string
          next_renewal?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          age?: number | null
          gender?: string | null
          weight?: string | null
          height?: string | null
          primary_goal?: string | null
          subscription_status?: string
          next_renewal?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      onboarding_questions: {
        Row: {
          id: string
          step_number: number
          question_type: string
          title: string
          subtitle: string | null
          emoji: string | null
          icon: string | null
          field_name: string
          placeholder: string | null
          required: boolean
          options: string[] | null
          validation: Record<string, any> | null
          conditional_logic: Record<string, any> | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          step_number: number
          question_type: string
          title: string
          subtitle?: string | null
          emoji?: string | null
          icon?: string | null
          field_name: string
          placeholder?: string | null
          required?: boolean
          options?: string[] | null
          validation?: Record<string, any> | null
          conditional_logic?: Record<string, any> | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          step_number?: number
          question_type?: string
          title?: string
          subtitle?: string | null
          emoji?: string | null
          icon?: string | null
          field_name?: string
          placeholder?: string | null
          required?: boolean
          options?: string[] | null
          validation?: Record<string, any> | null
          conditional_logic?: Record<string, any> | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      onboarding_responses: {
        Row: {
          id: string
          user_id: string
          question_id: string
          response_value: string | null
          response_array: string[] | null
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          question_id: string
          response_value?: string | null
          response_array?: string[] | null
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          question_id?: string
          response_value?: string | null
          response_array?: string[] | null
          completed_at?: string
        }
      }
      weight_updates: {
        Row: {
          id: string
          user_id: string
          weight: number
          date: string
          change: number | null
          has_photo: boolean
          photo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          weight: number
          date?: string
          change?: number | null
          has_photo?: boolean
          photo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          weight?: number
          date?: string
          change?: number | null
          has_photo?: boolean
          photo_url?: string | null
          created_at?: string
        }
      }
      workouts: {
        Row: {
          id: string
          user_id: string
          title: string
          emoji: string | null
          exercises: number
          total_sets: number
          duration: number | null
          completed: boolean
          workout_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          emoji?: string | null
          exercises?: number
          total_sets?: number
          duration?: number | null
          completed?: boolean
          workout_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          emoji?: string | null
          exercises?: number
          total_sets?: number
          duration?: number | null
          completed?: boolean
          workout_date?: string
          created_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          workout_id: string
          name: string
          sets: number
          reps: string | null
          weight: string | null
          completed: boolean
          video_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workout_id: string
          name: string
          sets?: number
          reps?: string | null
          weight?: string | null
          completed?: boolean
          video_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workout_id?: string
          name?: string
          sets?: number
          reps?: string | null
          weight?: string | null
          completed?: boolean
          video_id?: string | null
          created_at?: string
        }
      }
      meal_plans: {
        Row: {
          id: string
          user_id: string
          day_of_week: string
          meal_type: string
          calories: number
          protein: string | null
          carbs: string | null
          fat: string | null
          foods: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          day_of_week: string
          meal_type: string
          calories: number
          protein?: string | null
          carbs?: string | null
          fat?: string | null
          foods?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          day_of_week?: string
          meal_type?: string
          calories?: number
          protein?: string | null
          carbs?: string | null
          fat?: string | null
          foods?: string[] | null
          created_at?: string
        }
      }
      progress_photos: {
        Row: {
          id: string
          user_id: string
          photo_url: string
          weight: number | null
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          photo_url: string
          weight?: number | null
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          photo_url?: string
          weight?: number | null
          date?: string
          created_at?: string
        }
      }
    }
  }
}
