'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword]         = useState('')
  const [confirm, setConfirm]           = useState('')
  const [status, setStatus]             = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg]         = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    if (password.length < 6) {
      setErrorMsg('Parola trebuie să aibă cel puțin 6 caractere.')
      setStatus('error')
      return
    }
    if (password !== confirm) {
      setErrorMsg('Parolele nu coincid.')
      setStatus('error')
      return
    }

    setStatus('loading')
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setErrorMsg(error.message || 'Ceva nu a funcționat. Încearcă din nou.')
      setStatus('error')
    } else {
      setStatus('success')
      setTimeout(() => router.replace('/parents/dashboard'), 2000)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-fredoka text-3xl font-semibold text-[var(--dark)] mb-1">
          Parolă nouă
        </h1>
        <p className="font-nunito text-sm text-[var(--gray)]">
          Alege o parolă nouă pentru contul tău Playlio.
        </p>
      </div>

      {status === 'success' ? (
        <div className="flex flex-col items-center gap-4 text-center py-4">
          <span className="text-5xl">✅</span>
          <p className="font-fredoka text-xl font-semibold text-[var(--dark)]">
            Parola a fost schimbată!
          </p>
          <p className="font-nunito text-sm text-[var(--gray)]">
            Te redirecționăm spre dashboard…
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-nunito text-sm font-semibold text-[var(--dark)]">
              Parola nouă
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Minimum 6 caractere"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-2xl border border-black/10 px-4 py-3 font-nunito text-sm outline-none focus:border-[var(--sky)] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-nunito text-sm font-semibold text-[var(--dark)]">
              Confirmă parola
            </label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Repetă parola nouă"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-2xl border border-black/10 px-4 py-3 font-nunito text-sm outline-none focus:border-[var(--sky)] transition-colors"
            />
          </div>

          {status === 'error' && (
            <p className="font-nunito text-sm font-semibold rounded-2xl px-4 py-3"
               style={{ backgroundColor: 'rgba(239,83,80,0.1)', color: '#C62828' }}>
              ⚠️ {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-full font-nunito font-bold text-lg text-white px-6 py-4 min-h-[56px] transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
            style={{ backgroundColor: 'var(--coral)', boxShadow: 'var(--shadow-coral)' }}
          >
            {status === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Se schimbă…
              </span>
            ) : (
              'Setează parola nouă'
            )}
          </button>
        </form>
      )}
    </div>
  )
}
