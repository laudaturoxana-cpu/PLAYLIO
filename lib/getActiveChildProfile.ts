import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export interface ActiveChildProfile {
  id: string
  full_name: string | null
  age: number | null
  coins: number
  level: number
  xp: number
  activeChildId: string | null
}

export async function getActiveChildProfile(fallbackUserId: string): Promise<ActiveChildProfile> {
  const cookieStore = await cookies()
  const childId = cookieStore.get('playlio_child_id')?.value

  const supabase = await createClient()

  if (childId) {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, age, coins, level, xp')
      .eq('id', childId)
      .single()

    if (data) {
      return {
        id: data.id,
        full_name: data.full_name,
        age: data.age,
        coins: data.coins ?? 0,
        level: data.level ?? 1,
        xp: data.xp ?? 0,
        activeChildId: childId,
      }
    }
  }

  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, age, coins, level, xp')
    .eq('id', fallbackUserId)
    .single()

  return {
    id: data?.id ?? fallbackUserId,
    full_name: data?.full_name ?? null,
    age: data?.age ?? null,
    coins: data?.coins ?? 0,
    level: data?.level ?? 1,
    xp: data?.xp ?? 0,
    activeChildId: null,
  }
}
