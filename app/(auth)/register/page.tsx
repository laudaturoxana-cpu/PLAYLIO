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
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/\d/, 'Password must contain at least one number'),
    confirm_password: z.string(),
    terms: z.boolean().refine((v) => v, 'You must accept the terms to continue'),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

type FormValues = z.infer<typeof schema>

const SUPABASE_ERRORS: Record<string, string> = {
  'User already registered': 'An account with this email already exists. Try logging in.',
  'Invalid email': 'The email address is not valid.',
  'Signup requires a valid password': 'The password is not valid.',
}

function getErrorMessage(msg: string): string {
  return SUPABASE_ERRORS[msg] ?? 'Something went wrong. Please try again.'
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
          Check your email!
        </h1>
        <p className="font-nunito text-base text-[var(--gray)] leading-relaxed">
          We sent a confirmation link to your email. Click it to enter Playlio!
        </p>
        <p className="font-nunito text-sm text-[var(--gray)]">
          Didn&apos;t receive anything?{' '}
          <button
            onClick={() => setSuccess(false)}
            className="font-semibold underline"
            style={{ color: 'var(--coral)' }}
          >
            Try again
          </button>
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="font-fredoka text-3xl font-semibold text-[var(--dark)] mb-1">
          Create free account
        </h1>
        <p className="font-nunito text-sm text-[var(--gray)]">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold hover:underline"
            style={{ color: 'var(--coral)' }}
          >
            Log in
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
          label="Your name"
          placeholder="e.g. Maria"
          autoComplete="given-name"
          error={errors.full_name?.message}
          {...register('full_name')}
        />

        <Input
          type="email"
          label="Email"
          placeholder="parent@email.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="relative">
          <Input
            type={showPass ? 'text' : 'password'}
            label="Password"
            placeholder="Min 8 characters + a number"
            autoComplete="new-password"
            error={errors.password?.message}
            hint="Min 8 characters and at least one number"
            {...register('password')}
          />
          <button
            type="button"
            aria-label={showPass ? 'Hide password' : 'Show password'}
            onClick={() => setShowPass((p) => !p)}
            className="absolute right-3 top-9 flex items-center justify-center w-8 h-8 text-[var(--gray)]"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="relative">
          <Input
            type={showConfirm ? 'text' : 'password'}
            label="Confirm password"
            placeholder="Repeat password"
            autoComplete="new-password"
            error={errors.confirm_password?.message}
            {...register('confirm_password')}
          />
          <button
            type="button"
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
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
            I accept the{' '}
            <Link href="#" className="underline font-semibold text-[var(--dark)]">
              terms and conditions
            </Link>{' '}
            and confirm I am at least 18 years old
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
              Creating account...
            </>
          ) : (
            'Create free account'
          )}
        </button>
      </form>
    </div>
  )
}
