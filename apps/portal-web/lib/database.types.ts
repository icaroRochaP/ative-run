export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          achievement_count: number | null
          ai_analysis: Json | null
          ai_insight: string | null
          athlete_count: number | null
          average_cadence: number | null
          average_heartrate: number | null
          average_speed: number | null
          average_watts: number | null
          comment_count: number | null
          created_at: string | null
          distance: number | null
          elapsed_time: number | null
          end_latlng: unknown | null
          id: string
          kilojoules: number | null
          kudos_count: number | null
          location_city: string | null
          location_country: string | null
          location_state: string | null
          max_heartrate: number | null
          max_speed: number | null
          max_watts: number | null
          moving_time: number | null
          name: string | null
          processed: boolean | null
          raw_data: Json
          sport_type: string | null
          start_date: string | null
          start_date_local: string | null
          start_latlng: unknown | null
          status: string | null
          strava_activity_id: number
          total_elevation_gain: number | null
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          achievement_count?: number | null
          ai_analysis?: Json | null
          ai_insight?: string | null
          athlete_count?: number | null
          average_cadence?: number | null
          average_heartrate?: number | null
          average_speed?: number | null
          average_watts?: number | null
          comment_count?: number | null
          created_at?: string | null
          distance?: number | null
          elapsed_time?: number | null
          end_latlng?: unknown | null
          id?: string
          kilojoules?: number | null
          kudos_count?: number | null
          location_city?: string | null
          location_country?: string | null
          location_state?: string | null
          max_heartrate?: number | null
          max_speed?: number | null
          max_watts?: number | null
          moving_time?: number | null
          name?: string | null
          processed?: boolean | null
          raw_data: Json
          sport_type?: string | null
          start_date?: string | null
          start_date_local?: string | null
          start_latlng?: unknown | null
          status?: string | null
          strava_activity_id: number
          total_elevation_gain?: number | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          achievement_count?: number | null
          ai_analysis?: Json | null
          ai_insight?: string | null
          athlete_count?: number | null
          average_cadence?: number | null
          average_heartrate?: number | null
          average_speed?: number | null
          average_watts?: number | null
          comment_count?: number | null
          created_at?: string | null
          distance?: number | null
          elapsed_time?: number | null
          end_latlng?: unknown | null
          id?: string
          kilojoules?: number | null
          kudos_count?: number | null
          location_city?: string | null
          location_country?: string | null
          location_state?: string | null
          max_heartrate?: number | null
          max_speed?: number | null
          max_watts?: number | null
          moving_time?: number | null
          name?: string | null
          processed?: boolean | null
          raw_data?: Json
          sport_type?: string | null
          start_date?: string | null
          start_date_local?: string | null
          start_latlng?: unknown | null
          status?: string | null
          strava_activity_id?: number
          total_elevation_gain?: number | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      message_logs: {
        Row: {
          activity_id: string | null
          created_at: string | null
          delivered_at: string | null
          error_message: string | null
          evolution_message_id: string | null
          id: string
          message_text: string
          phone_number: string
          sent_at: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          activity_id?: string | null
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          evolution_message_id?: string | null
          id?: string
          message_text: string
          phone_number: string
          sent_at?: string | null
          status: string
          user_id?: string | null
        }
        Update: {
          activity_id?: string | null
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          evolution_message_id?: string | null
          id?: string
          message_text?: string
          phone_number?: string
          sent_at?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_logs_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      prices: {
        Row: {
          active: boolean | null
          created_at: string | null
          currency: string
          id: string
          interval: string | null
          product_id: string | null
          stripe_price_id: string
          type: string
          unit_amount: number
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          currency?: string
          id?: string
          interval?: string | null
          product_id?: string | null
          stripe_price_id: string
          type?: string
          unit_amount: number
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          currency?: string
          id?: string
          interval?: string | null
          product_id?: string | null
          stripe_price_id?: string
          type?: string
          unit_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          stripe_product_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          stripe_product_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          stripe_product_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          phone_number: string | null
          stripe_customer_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          phone_number?: string | null
          stripe_customer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          phone_number?: string | null
          stripe_customer_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      strava_tokens: {
        Row: {
          access_token: string
          athlete_city: string | null
          athlete_country: string | null
          athlete_firstname: string | null
          athlete_id: number | null
          athlete_lastname: string | null
          athlete_profile: string | null
          athlete_sex: string | null
          athlete_state: string | null
          athlete_username: string | null
          created_at: string | null
          expires_at: number
          refresh_token: string
          strava_athlete_id: number | null
          token_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          athlete_city?: string | null
          athlete_country?: string | null
          athlete_firstname?: string | null
          athlete_id?: number | null
          athlete_lastname?: string | null
          athlete_profile?: string | null
          athlete_sex?: string | null
          athlete_state?: string | null
          athlete_username?: string | null
          created_at?: string | null
          expires_at: number
          refresh_token: string
          strava_athlete_id?: number | null
          token_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          athlete_city?: string | null
          athlete_country?: string | null
          athlete_firstname?: string | null
          athlete_id?: number | null
          athlete_lastname?: string | null
          athlete_profile?: string | null
          athlete_sex?: string | null
          athlete_state?: string | null
          athlete_username?: string | null
          created_at?: string | null
          expires_at?: number
          refresh_token?: string
          strava_athlete_id?: number | null
          token_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      strava_webhook_events: {
        Row: {
          aspect_type: string | null
          created_at: string | null
          error_message: string | null
          event_time: string | null
          id: string
          object_id: number | null
          object_type: string | null
          owner_id: number | null
          processed: boolean | null
          processed_at: string | null
          raw_event: Json | null
          subscription_id: number | null
        }
        Insert: {
          aspect_type?: string | null
          created_at?: string | null
          error_message?: string | null
          event_time?: string | null
          id?: string
          object_id?: number | null
          object_type?: string | null
          owner_id?: number | null
          processed?: boolean | null
          processed_at?: string | null
          raw_event?: Json | null
          subscription_id?: number | null
        }
        Update: {
          aspect_type?: string | null
          created_at?: string | null
          error_message?: string | null
          event_time?: string | null
          id?: string
          object_id?: number | null
          object_type?: string | null
          owner_id?: number | null
          processed?: boolean | null
          processed_at?: string | null
          raw_event?: Json | null
          subscription_id?: number | null
        }
        Relationships: []
      }
      strava_webhook_subscriptions: {
        Row: {
          active: boolean | null
          callback_url: string
          created_at: string | null
          hub_challenge: string | null
          id: number
          subscription_id: number
          verify_token: string
        }
        Insert: {
          active?: boolean | null
          callback_url: string
          created_at?: string | null
          hub_challenge?: string | null
          id?: number
          subscription_id: number
          verify_token: string
        }
        Update: {
          active?: boolean | null
          callback_url?: string
          created_at?: string | null
          hub_challenge?: string | null
          id?: number
          subscription_id?: number
          verify_token?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          id: string
          price_id: string | null
          status: string
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          price_id?: string | null
          status: string
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          price_id?: string | null
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
