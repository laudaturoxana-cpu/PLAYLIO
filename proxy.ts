import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Aplică middleware pe toate rutele EXCEPTÂND:
     * - _next/static (fișiere statice)
     * - _next/image (optimizare imagini)
     * - favicon.ico
     * - Fișiere publice cu extensii comune
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp3|wav)$).*)',
  ],
}
