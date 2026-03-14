'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'

const schema = z.object({
  email: z.string().email('Adresă de email invalidă'),
})

type FormValues = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    const supabase = createClient()
    // Trimitem email indiferent dacă există sau nu (securitate)
    await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    })
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-6 text-center py-4">
        <div
          className="text-6xl"
          style={{ animation: 'bounce-soft 2s ease-in-out infinite' }}
          aria-hidden="true"
        >
          ✉️
        </div>
        <h1 className="font-fredoka text-2xl font-semibold text-[var(--dark)]">
          Email trimis!
        </h1>
        <p className="font-nunito text-base text-[var(--gray)] leading-relaxed">
          Dacă adresa există în Playlio, vei primi un link pentru resetarea parolei în
          câteva minute.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 font-nunito text-sm font-semibold hover:underline"
          style={{ color: 'var(--coral)' }}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Înapoi la autentificare
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 font-nunito text-sm font-semibold mb-4 hover:underline"
          style={{ color: 'var(--gray)' }}
          aria-label="Înapoi la autentificare"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Înapoi
        </Link>
        <h1 className="font-fredoka text-3xl font-semibold text-[var(--dark)] mb-1">
          Resetare parolă
        </h1>
        <p className="font-nunito text-sm text-[var(--gray)]">
          Introdu email-ul contului tău și îți trimitem un link de resetare.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input
          type="email"
          label="Email"
          placeholder="parinte@email.com"
          autoComplete="email"
          error={errors.email?.message}
          required
          {...register('email')}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex items-center justify-center gap-2 w-full rounded-full font-nunito font-bold text-lg text-white px-6 py-4 min-h-[56px] transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--coral)', boxShadow: 'var(--shadow-coral)' }}
        >
          {isSubmitting ? (
            <>
              <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Se trimite...
            </>
          ) : (
            'Trimite link de resetare'
          )}
        </button>
      </form>
    </div>
  )
}
