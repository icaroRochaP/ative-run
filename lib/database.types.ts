export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          name: string | null
          phone: string | null
          nickname: string | null
          email: string | null
          new_account: boolean | null
          onboarding: boolean | null
        }
        Insert: {
          id?: string
          created_at?: string
          name?: string | null
          phone?: string | null
          nickname?: string | null
          email?: string | null
          new_account?: boolean | null
          onboarding?: boolean | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string | null
          phone?: string | null
          nickname?: string | null
          email?: string | null
          new_account?: boolean | null
          onboarding?: boolean | null
        }
      }
      agents: {
        Row: {
          id: string
          created_at: string
          name: string | null
          prompt: string | null
          description: string | null
          identifier: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name?: string | null
          prompt?: string | null
          description?: string | null
          identifier?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string | null
          prompt?: string | null
          description?: string | null
          identifier?: string | null
        }
      }
      leads: {
        Row: {
          id: string
          created_at: string
          name: string | null
          phone: string | null
          user_id: string | null
          onboarding: boolean | null
        }
        Insert: {
          id?: string
          created_at?: string
          name?: string | null
          phone?: string | null
          user_id?: string | null
          onboarding?: boolean | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string | null
          phone?: string | null
          user_id?: string | null
          onboarding?: boolean | null
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
          required: boolean | null
          options: any | null
          validation: any | null
          conditional_logic: any | null
          is_active: boolean | null
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
          required?: boolean | null
          options?: any | null
          validation?: any | null
          conditional_logic?: any | null
          is_active?: boolean | null
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
          required?: boolean | null
          options?: any | null
          validation?: any | null
          conditional_logic?: any | null
          is_active?: boolean | null
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
          user_id: string | null
          weight: number
          date: string | null
          change: number | null
          has_photo: boolean | null
          photo_url: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          weight: number
          date?: string | null
          change?: number | null
          has_photo?: boolean | null
          photo_url?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          weight?: number
          date?: string | null
          change?: number | null
          has_photo?: boolean | null
          photo_url?: string | null
          created_at?: string | null
        }
      }
      workouts: {
        Row: {
          id: string
          user_id: string | null
          title: string
          emoji: string | null
          exercises: number | null
          total_sets: number | null
          duration: number | null
          completed: boolean | null
          workout_date: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          emoji?: string | null
          exercises?: number | null
          total_sets?: number | null
          duration?: number | null
          completed?: boolean | null
          workout_date?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          emoji?: string | null
          exercises?: number | null
          total_sets?: number | null
          duration?: number | null
          completed?: boolean | null
          workout_date?: string | null
          created_at?: string | null
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
