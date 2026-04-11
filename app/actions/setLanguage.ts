'use server'

import { cookies } from 'next/headers'
import type { Lang } from '@/lib/i18n/translations'

export async function setLanguage(lang: Lang) {
  const cookieStore = await cookies()
  cookieStore.set('playlio_lang', lang, {
    path: '/',
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365, // 1 an
    sameSite: 'lax',
  })
}
