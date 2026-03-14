'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useGameStore } from '@/lib/store/gameStore'
import type { Profile } from '@/types'

interface UseUserReturn {
  profile: Profile | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  signOut: () => Promise<void>
}

export function useUser(): UseUserReturn {
  const { profile, setProfile } = useGameStore()
  const [loading, setLoading] = useState(!profile)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(
    async (userId: string) => {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (fetchError) {
        // Profil inexistent — nu e o eroare critică, poate fi în creare
        if (fetchError.code !== 'PGRST116') {
          setError('Nu am putut încărca profilul')
        }
        return
      }

      setProfile(data as Profile)
      setError(null)
    },
    [setProfile]
  )

  const refetch = useCallback(async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      await fetchProfile(user.id)
    }
  }, [fetchProfile])

  const signOut = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setProfile(null)
    window.location.href = '/'
  }, [setProfile])

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    // Verifică sesiunea inițială
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!mounted) return
      if (user) {
        fetchProfile(user.id).finally(() => {
          if (mounted) setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })

    // Ascultă schimbările de autentificare
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      if (event === 'SIGNED_OUT') {
        setProfile(null)
        setLoading(false)
        return
      }

      if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Sesiunea a fost reîmprospătată — profilul e deja încărcat
        return
      }

      if (session?.user) {
        await fetchProfile(session.user.id)
      }

      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile, setProfile])

  return { profile, loading, error, refetch, signOut }
}
