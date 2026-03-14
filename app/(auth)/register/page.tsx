'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'

const schema = z
  .object({
    full_name: z.string().min(2, 'Prenumele trebuie să aibă cel puțin 2 caractere'),
    email: z.string().email('Adresă de email invalidă'),
    password: z
      .string()
      .min(8, 'Parola trebuie să aibă cel puțin 8 caractere')
      .regex(/\d/, 'Parola trebuie să conțină cel puțin o cifră'),
    confirm_password: z.string(),
    terms: z.boolean().refine((v) => v, 'Trebuie să accepți termenii pentru a continua'),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: 'Parolele nu se potrivesc',
    path: ['confirm_password'],
  })

type FormValues = z.infer<typeof schema>

const SUPABASE_ERRORS: Record<string, string> = {
  'User already registered': 'Există deja un cont cu acest email. Încearcă să te autentifici.',
  'Invalid email': 'Adresa de email nu este validă.',
  'Signup requires a valid password': 'Parola nu este validă.',
}

function getErrorMessage(msg: string): string {
  return SUPABASE_ERRORS[msg] ?? 'Ceva nu a mers. Încearcă din nou.'
}

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    setServerError('')
    const supabase = createClient()

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.full_name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setServerError(getErrorMessage(error.message))
      return
    }

    // Dacă sesiunea există imediat (email confirm dezactivat în Supabase dev)
    if (data.session) {
      window.location.href = '/parents/dashboard?onboarding=true'
      return
    }

    // Email de confirmare trimis
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-6 text-center py-4">
        <div
          className="text-6xl"
          style={{ animation: 'bounce-soft 2s ease-in-out infinite' }}
          aria-hidden="true"
        >
          📧
        </div>
        <h1 className="font-fredoka text-2xl font-semibold text-[var(--dark)]">
          Verifică email-ul!
        </h1>
        <p className="font-nunito text-base text-[var(--gray)] leading-relaxed">
          Am trimis un link de confirmare la adresa ta. Apasă pe el și intri direct în
          Playlio!
        </p>
        <p className="font-nunito text-sm text-[var(--gray)]">
          Nu ai primit nimic?{' '}
          <button
            onClick={() => setSuccess(false)}
            className="font-semibold underline"
            style={{ color: 'var(--coral)' }}
          >
            Încearcă din nou
          </button>
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="font-fredoka text-3xl font-semibold text-[var(--dark)] mb-1">
          Creează cont gratuit
        </h1>
        <p className="font-nunito text-sm text-[var(--gray)]">
          Ai deja cont?{' '}
          <Link
            href="/login"
            className="font-semibold hover:underline"
            style={{ color: 'var(--coral)' }}
          >
            Autentifică-te
          </Link>
        </p>
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
          label="Prenumele tău"
          placeholder="ex: Maria"
          autoComplete="given-name"
          error={errors.full_name?.message}
          {...register('full_name')}
        />

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
            placeholder="Minim 8 caractere + o cifră"
            autoComplete="new-password"
            error={errors.password?.message}
            hint="Minim 8 caractere și cel puțin o cifră"
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

        <div className="relative">
          <Input
            type={showConfirm ? 'text' : 'password'}
            label="Confirmă parola"
            placeholder="Repetă parola"
            autoComplete="new-password"
            error={errors.confirm_password?.message}
            {...register('confirm_password')}
          />
          <button
            type="button"
            aria-label={showConfirm ? 'Ascunde parola' : 'Arată parola'}
            onClick={() => setShowConfirm((p) => !p)}
            className="absolute right-3 top-9 flex items-center justify-center w-8 h-8 text-[var(--gray)]"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Checkbox termeni */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 flex-shrink-0 rounded accent-[var(--coral)]"
            {...register('terms')}
          />
          <span className="font-nunito text-sm text-[var(--gray)]">
            Accept{' '}
            <Link href="#" className="underline font-semibold text-[var(--dark)]">
              termenii și condițiile
            </Link>{' '}
            și confirm că am minim 18 ani
          </span>
        </label>
        {errors.terms && (
          <p role="alert" className="font-nunito text-xs font-medium" style={{ color: 'var(--coral)' }}>
            ⚠ {errors.terms.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex items-center justify-center gap-2 w-full rounded-full font-nunito font-bold text-lg text-white px-6 py-4 min-h-[56px] transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--coral)', boxShadow: 'var(--shadow-coral)' }}
        >
          {isSubmitting ? (
            <>
              <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Se creează contul...
            </>
          ) : (
            'Creează cont gratuit'
          )}
        </button>
      </form>
    </div>
  )
}
