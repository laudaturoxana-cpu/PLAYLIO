import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  }

  // Recovery flow (resetare parolă)
  if (type === 'recovery') {
    return NextResponse.redirect(`${origin}/reset-password`)
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=no_user`)
  }

  // Asigură că profilul există cu role = parent
  // Dacă triggerul l-a creat deja => upsert nu face nimic (ignoreDuplicates)
  const username =
    user.email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9]/g, '') ??
    `user_${user.id.slice(0, 8)}`

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', user.id)
    .single()

  if (!existingProfile) {
    // Triggerul nu a rulat încă — inserăm manual
    await supabase.from('profiles').upsert({
      id: user.id,
      username,
      full_name: user.user_metadata?.full_name ?? null,
      role: 'parent',
    }, { onConflict: 'id', ignoreDuplicates: true })

    return NextResponse.redirect(`${origin}/worlds?onboarding=true`)
  }

  // Profilul există dar poate are role greșit (creat de trigger cu 'child')
  if (existingProfile.role !== 'parent') {
    await supabase
      .from('profiles')
      .update({ role: 'parent' })
      .eq('id', user.id)
  }

  return NextResponse.redirect(`${origin}/worlds`)
}
