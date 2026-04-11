'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface AccountClientProps {
  parentName: string | null
  email: string
}

export default function AccountClient({ parentName, email }: AccountClientProps) {
  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword.length < 6) {
      setErrorMsg('Parola trebuie să aibă cel puțin 6 caractere.')
      setStatus('error')
      return
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Parolele nu coincid.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setErrorMsg(error.message || 'Ceva nu a funcționat. Încearcă din nou.')
      setStatus('error')
    } else {
      setStatus('success')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/worlds"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-black/5 text-lg active:scale-95 transition-transform"
          style={{ color: '#757575', touchAction: 'manipulation' }}
          aria-label="Înapoi"
        >
          ←
        </Link>
        <div>
          <h1 className="font-fredoka text-2xl font-semibold" style={{ color: '#212121' }}>
            Contul meu
          </h1>
          <p className="font-nunito text-sm" style={{ color: '#757575' }}>
            Setări și securitate
          </p>
        </div>
      </div>

      {/* Profile info card */}
      <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-5 mb-4">
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center rounded-full text-3xl"
            style={{ width: 56, height: 56, backgroundColor: 'rgba(41,182,246,0.12)' }}
          >
            👤
          </div>
          <div>
            <p className="font-fredoka text-lg font-semibold" style={{ color: '#212121' }}>
              {parentName ?? 'Părinte'}
            </p>
            <p className="font-nunito text-sm" style={{ color: '#757575' }}>
              {email}
            </p>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-5 mb-4">
        <h2 className="font-fredoka text-lg font-semibold mb-4" style={{ color: '#212121' }}>
          🔐 Schimbă parola
        </h2>

        <form onSubmit={handleChangePassword} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="font-nunito text-xs font-semibold" style={{ color: '#757575' }}>
              Parolă nouă
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Minimum 6 caractere"
              required
              minLength={6}
              className="rounded-xl px-4 py-3 font-nunito text-sm border outline-none transition-all"
              style={{
                borderColor: 'rgba(0,0,0,0.12)',
                color: '#212121',
                backgroundColor: 'rgba(0,0,0,0.02)',
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-nunito text-xs font-semibold" style={{ color: '#757575' }}>
              Confirmă parola nouă
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Repetă parola nouă"
              required
              minLength={6}
              className="rounded-xl px-4 py-3 font-nunito text-sm border outline-none transition-all"
              style={{
                borderColor: 'rgba(0,0,0,0.12)',
                color: '#212121',
                backgroundColor: 'rgba(0,0,0,0.02)',
              }}
            />
          </div>

          {status === 'error' && (
            <p className="font-nunito text-xs font-semibold rounded-xl px-4 py-2"
               style={{ backgroundColor: 'rgba(239,83,80,0.1)', color: '#C62828' }}>
              ⚠️ {errorMsg}
            </p>
          )}

          {status === 'success' && (
            <p className="font-nunito text-xs font-semibold rounded-xl px-4 py-2"
               style={{ backgroundColor: 'rgba(102,187,106,0.15)', color: '#2E7D32' }}>
              ✅ Parola a fost schimbată cu succes!
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="rounded-2xl py-3 font-fredoka text-base font-semibold text-white transition-all active:scale-95"
            style={{
              touchAction: 'manipulation',
              background: status === 'loading'
                ? '#B0BEC5'
                : 'linear-gradient(135deg, #29B6F6 0%, #0288D1 100%)',
              boxShadow: status === 'loading' ? 'none' : '0 4px 12px rgba(41,182,246,0.35)',
            }}
          >
            {status === 'loading' ? 'Se schimbă...' : 'Schimbă parola'}
          </button>
        </form>
      </div>

      {/* Danger zone — sign out */}
      <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-5">
        <h2 className="font-fredoka text-lg font-semibold mb-3" style={{ color: '#212121' }}>
          Sesiune
        </h2>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="w-full rounded-2xl py-3 font-fredoka text-base font-semibold transition-all active:scale-95"
            style={{
              touchAction: 'manipulation',
              background: 'rgba(239,83,80,0.1)',
              border: '1.5px solid rgba(239,83,80,0.25)',
              color: '#EF5350',
            }}
          >
            🚪 Deconectare
          </button>
        </form>
      </div>

      <p className="font-nunito text-xs text-center mt-8" style={{ color: '#BDBDBD' }}>
        © 2026 Playlio · Siguranța copilului pe primul loc
      </p>
    </div>
  )
}
