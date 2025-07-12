import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      digital_assets: {
        Row: {
          id: string
          user_id: string
          platform_name: string
          action: 'Delete' | 'Transfer' | 'Archive'
          recipient_email: string | null
          time_delay: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform_name: string
          action: 'Delete' | 'Transfer' | 'Archive'
          recipient_email?: string | null
          time_delay?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform_name?: string
          action?: 'Delete' | 'Transfer' | 'Archive'
          recipient_email?: string | null
          time_delay?: string
          created_at?: string
          updated_at?: string
        }
      }
      checkins: {
        Row: {
          id: string
          user_id: string
          last_checkin_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          last_checkin_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          last_checkin_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          username: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}