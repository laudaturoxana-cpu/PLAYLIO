import { cookies } from 'next/headers'
import type { Lang } from './translations'

/** Reads the language preference from the cookie — for use in Server Components. */
export async function getLanguage(): Promise<Lang> {
  const cookieStore = await cookies()
  const value = cookieStore.get('playlio_lang')?.value
  return value === 'en' ? 'en' : 'ro'
}
