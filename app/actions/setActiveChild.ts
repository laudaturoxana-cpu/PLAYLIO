'use server'

import { cookies } from 'next/headers'

export async function setActiveChild(childId: string) {
  const cookieStore = await cookies()
  cookieStore.set('playlio_child_id', childId, {
    path: '/',
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 7, // 7 zile
    sameSite: 'lax',
  })
}
