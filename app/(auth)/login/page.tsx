'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'

const schema = z.object({
  email: z.string().email('Adresă de email invalidă'),
  password: z.string().min(1, 'Parola este obligatorie'),
  remember_me: z.boolean().optional(),
})

type FormValues = z.infer<typeof schema>

const SUPABASE_ERRORS: Record<string, string> = {
  'Invalid login credentials': 'Email sau parolă incorecte. Încearcă din nou.',
  'Email not confirmed': 'Trebuie să confirmi email-ul înainte de a te autentifica.',
  'Too many requests': 'Prea multe încercări. Încearcă din nou în câteva minute.',
}

function getErrorMessage(msg: string): string {
  return SUPABASE_ERRORS[msg] ?? 'Ceva nu a mers. Încearcă din nou.'
}

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false)
  const [serverError, setServerError] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    setServerError('')
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      setServerError(getErrorMessage(error.message))
      return
    }

    // Redirecționare în funcție de rol
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profile?.role === 'parent') {
      window.location.href = '/parents/dashboard'
    } else {
      window.location.href = '/worlds'
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    // Pagina se redirecționează automat — nu mai ajungem aici
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="font-fredoka text-3xl font-semibold text-[var(--dark)] mb-1">
          Bine ai revenit!
        </h1>
        <p className="font-nunito text-sm text-[var(--gray)]">
          Nu ai cont?{' '}
          <Link
            href="/register"
            className="font-semibold hover:underline"
            style={{ color: 'var(--coral)' }}
          >
            Creează unul gratuit
          </Link>
        </p>
      </div>

      {/* Google OAuth */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        className="inline-flex items-center justify-center gap-3 w-full rounded-full font-nunito font-semibold text-base text-[var(--dark)] px-6 py-3 min-h-[48px] border-2 border-black/10 bg-white transition-all hover:border-[var(--sky)] hover:shadow-[var(--shadow-sm)] active:scale-95 disabled:opacity-60"
        aria-label="Autentifică-te cu Google"
      >
        {googleLoading ? (
          <span className="h-5 w-5 rounded-full border-2 border-[var(--gray)] border-t-transparent animate-spin" />
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        Continuă cu Google
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-black/8" />
        <span className="font-nunito text-sm text-[var(--gray)]">sau cu email</span>
        <div className="flex-1 h-px bg-black/8" />
      </div>

      {serverError && (
        <div
          role="alert"
          className="rounded-2xl bg-[#FBE9E7] border border-[var(--coral-light)] px-4 py-3 font-nunito text-sm font-medium"
          style={{ color: 'var(--coral-dark)' }}
        >
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input
          type="email"
          label="Email"
          placeholder="parinte@email.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="relative">
          <Input
            type={showPass ? 'text' : 'password'}
            label="Parolă"
            placeholder="Parola ta"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            aria-label={showPass ? 'Ascunde parola' : 'Arată parola'}
            onClick={() => setShowPass((p) => !p)}
            className="absolute right-3 top-9 flex items-center justify-center w-8 h-8 text-[var(--gray)]"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded accent-[var(--coral)]"
              {...register('remember_me')}
            />
            <span className="font-nunito text-sm text-[var(--gray)]">Ține-mă minte</span>
          </label>
          <Link
            href="/forgot-password"
            className="font-nunito text-sm font-semibold hover:underline"
            style={{ color: 'var(--coral)' }}
          >
            Ai uitat parola?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex items-center justify-center gap-2 w-full rounded-full font-nunito font-bold text-lg text-white px-6 py-4 min-h-[56px] transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--coral)', boxShadow: 'var(--shadow-coral)' }}
        >
          {isSubmitting ? (
            <>
              <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Se autentifică...
            </>
          ) : (
            'Intră în Playlio'
          )}
        </button>
      </form>
    </div>
  )
}
