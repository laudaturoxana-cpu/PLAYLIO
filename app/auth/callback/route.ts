import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/parents/dashboard'

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

  // Verifică dacă profilul există, îl creează dacă nu
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=no_user`)
  }

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', user.id)
    .single()

  if (!existingProfile) {
    // Creare profil părinte — poate fi override de trigger Supabase
    const username =
      user.email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9]/g, '') ??
      `user_${user.id.slice(0, 8)}`

    await supabase.from('profiles').insert({
      id: user.id,
      username,
      full_name: user.user_metadata?.full_name ?? null,
      role: 'parent',
    })

    return NextResponse.redirect(`${origin}/parents/dashboard?onboarding=true`)
  }

  // Profil fără rol (creat de trigger) — set role parent
  if (!existingProfile.role || existingProfile.role === 'parent') {
    if (!existingProfile.role) {
      await supabase
        .from('profiles')
        .update({ role: 'parent' })
        .eq('id', user.id)
    }
    return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/worlds`)
}
