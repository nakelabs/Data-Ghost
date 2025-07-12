import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

interface CheckinData {
  id: string
  last_checkin_at: string
  created_at: string
  updated_at: string
}

export function useCheckins() {
  const [checkin, setCheckin] = useState<CheckinData | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchCheckin()
    }
  }, [user])

  const fetchCheckin = async () => {
    try {
      const { data, error } = await supabase
        .from('checkins')
        .select('*')
        .eq('user_id', user!.id)
        .order('last_checkin_at', { ascending: false })
        .limit(1)

      if (error) {
        throw error
      }
      
      setCheckin(data && data.length > 0 ? data[0] : null)
    } catch (error) {
      console.error('Error fetching checkin:', error)
    } finally {
      setLoading(false)
    }
  }

  const performCheckin = async () => {
    try {
      const now = new Date().toISOString()
      
      if (checkin) {
        const { data, error } = await supabase
          .from('checkins')
          .update({ last_checkin_at: now })
          .eq('id', checkin.id)
          .select()
          .single()

        if (error) throw error
        setCheckin(data)
      } else {
        const { data, error } = await supabase
          .from('checkins')
          .insert([{ user_id: user!.id, last_checkin_at: now }])
          .select()
          .single()

        if (error) throw error
        setCheckin(data)
      }
    } catch (error) {
      console.error('Error performing checkin:', error)
      throw error
    }
  }

  const getStatus = () => {
    if (!checkin) return 'never'
    
    const lastCheckin = new Date(checkin.last_checkin_at)
    const now = new Date()
    const diffMinutes = (now.getTime() - lastCheckin.getTime()) / (1000 * 60)
    
    // For demo purposes, consider "triggered" if no checkin in 5 minutes
    return diffMinutes > 5 ? 'triggered' : 'alive'
  }

  return {
    checkin,
    loading,
    performCheckin,
    getStatus,
    refetch: fetchCheckin
  }
}