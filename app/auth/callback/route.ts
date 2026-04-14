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

  const username =
    user.email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9]/g, '') ??
    `user_${user.id.slice(0, 8)}`

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', user.id)
    .single()

  const isNewUser = !existingProfile

  if (isNewUser) {
    // Profile missing — insert fresh (trigger didn't run or failed for OAuth)
    await supabase.from('profiles').upsert({
      id: user.id,
      username,
      full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
      role: 'parent',
      coins: 0,
      level: 1,
      xp: 0,
    }, { onConflict: 'id' })
  } else if (!existingProfile.role || existingProfile.role !== 'parent') {
    // Profile exists but role is wrong or null (partial trigger)
    await supabase
      .from('profiles')
      .update({ role: 'parent' })
      .eq('id', user.id)
  }

  // New users go directly to dashboard with onboarding (skip /worlds redirect loop)
  return NextResponse.redirect(
    isNewUser
      ? `${origin}/parents/dashboard?onboarding=true`
      : `${origin}/worlds`
  )
}
