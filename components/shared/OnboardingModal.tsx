'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ChildData {
  name: string
  age: number
  avatarPreset: number
}

const AVATAR_PRESETS = [
  { id: 0, name: 'Exploratorul', hairColor: '#3E2723', skinTone: '#FFAB76', outfitColor: '#4FC3F7', emoji: '🧭' },
  { id: 1, name: 'Prințesa', hairColor: '#F9A825', skinTone: '#FFCCBC', outfitColor: '#F48FB1', emoji: '👑' },
  { id: 2, name: 'Artistul', hairColor: '#CE93D8', skinTone: '#D4845A', outfitColor: '#CE93D8', emoji: '🎨' },
  { id: 3, name: 'Eroul', hairColor: '#212121', skinTone: '#8D5524', outfitColor: '#66BB6A', emoji: '⚡' },
]

const LIO_MESSAGES = [
  'Bun venit în Playlio! Hai să creăm profilul primului tău copil! 🌟',
  'Super alegere! Acum să alegem cum arată aventurierul tău! 🎭',
  '', // step 3 dinamic
]

interface Props {
  parentId: string
  onComplete: () => void
}

export function OnboardingModal({ parentId, onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<ChildData>({ name: '', age: 6, avatarPreset: 0 })

  async function handleFinish() {
    if (!data.name.trim()) return
    setSaving(true)

    const supabase = createClient()
    const preset = AVATAR_PRESETS[data.avatarPreset]

    // Username unic: prenume + timestamp scurt
    const username = `${data.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now().toString(36)}`

    // Creare profil copil
    const { data: childProfile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: crypto.randomUUID(),
        username,
        full_name: data.name.trim(),
        role: 'child',
        parent_id: parentId,
        coins: 50, // bonus de bun venit!
      })
      .select()
      .single()

    if (profileError || !childProfile) {
      setSaving(false)
      return
    }

    // Creare avatar cu preset-ul ales
    await supabase.from('avatars').insert({
      user_id: childProfile.id,
      hair_color: preset.hairColor,
      skin_tone: preset.skinTone,
      outfit_color: preset.outfitColor,
    })

    // Adaugă tranzacția de welcome coins
    await supabase.from('coin_transactions').insert({
      user_id: childProfile.id,
      amount: 50,
      reason: 'Bun venit în Playlio! 🎉',
    })

    setSaving(false)
    setStep(2)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(33,33,33,0.5)', backdropFilter: 'blur(4px)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="w-full max-w-md rounded-3xl bg-white shadow-[var(--shadow-lg)] p-8 flex flex-col gap-6 animate-slide-up">

        {/* Lio + Mesaj */}
        <div className="flex items-start gap-4">
          <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true" className="flex-shrink-0" style={{ animation: 'bounce-soft 2s ease-in-out infinite' }}>
            <circle cx="32" cy="36" r="26" fill="#FFD54F" />
            <circle cx="24" cy="32" r="4" fill="#212121" />
            <circle cx="40" cy="32" r="4" fill="#212121" />
            <circle cx="25" cy="30" r="1.5" fill="white" />
            <circle cx="41" cy="30" r="1.5" fill="white" />
            <path d="M 22 42 Q 32 50 42 42" stroke="#212121" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="20" cy="12" r="5" fill="var(--sky)" />
            <circle cx="44" cy="10" r="4" fill="var(--coral)" />
          </svg>
          <div className="flex-1 rounded-2xl rounded-tl-none bg-[var(--light)] px-4 py-3">
            <p className="font-nunito text-sm font-medium text-[var(--dark)] leading-relaxed">
              {step < 2
                ? LIO_MESSAGES[step]
                : `🎉 Gata! ${data.name} poate începe aventura! Am pregătit și 50 coins bonus de bun venit!`}
            </p>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2" aria-label={`Pasul ${step + 1} din 3`}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === step ? 24 : 8,
                height: 8,
                backgroundColor: i === step ? 'var(--coral)' : 'var(--light)',
              }}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Step 1 — Date copil */}
        {step === 0 && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="child-name" className="font-nunito text-sm font-bold text-[var(--dark)]">
                Cum îl cheamă pe copilul tău?
              </label>
              <input
                id="child-name"
                type="text"
                placeholder="ex: Andrei"
                autoComplete="off"
                value={data.name}
                onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
                className="w-full rounded-2xl border border-black/10 bg-white font-nunito text-base text-[var(--dark)] min-h-[48px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--sky)] transition-all"
                aria-required="true"
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label htmlFor="child-age" className="font-nunito text-sm font-bold text-[var(--dark)]">
                  Câți ani are?
                </label>
                <span
                  className="font-fredoka text-2xl font-semibold"
                  style={{ color: 'var(--coral)' }}
                  aria-live="polite"
                >
                  {data.age} ani
                </span>
              </div>
              <input
                id="child-age"
                type="range"
                min={3}
                max={10}
                value={data.age}
                onChange={(e) => setData((d) => ({ ...d, age: Number(e.target.value) }))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: 'var(--coral)' }}
                aria-valuemin={3}
                aria-valuemax={10}
                aria-valuenow={data.age}
                aria-valuetext={`${data.age} ani`}
              />
              <div className="flex justify-between font-nunito text-xs text-[var(--gray)]">
                <span>3 ani</span><span>10 ani</span>
              </div>
            </div>

            <button
              onClick={() => data.name.trim().length >= 2 && setStep(1)}
              disabled={data.name.trim().length < 2}
              className="inline-flex items-center justify-center w-full rounded-full font-nunito font-bold text-base text-white px-6 py-4 min-h-[52px] transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--coral)', boxShadow: 'var(--shadow-coral)' }}
            >
              Continuă →
            </button>
          </div>
        )}

        {/* Step 2 — Avatar rapid */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <p className="font-nunito text-sm text-[var(--gray)]">
              {data.name} poate personaliza avatarul mai târziu din profilul său.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {AVATAR_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setData((d) => ({ ...d, avatarPreset: preset.id }))}
                  className="flex flex-col items-center gap-2 rounded-2xl p-4 border-2 transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    borderColor: data.avatarPreset === preset.id ? 'var(--coral)' : 'var(--light)',
                    backgroundColor: data.avatarPreset === preset.id ? 'rgba(255,112,67,0.06)' : 'var(--light)',
                    boxShadow: data.avatarPreset === preset.id ? 'var(--shadow-coral)' : 'none',
                  }}
                  aria-pressed={data.avatarPreset === preset.id}
                  aria-label={`Avatar ${preset.name}`}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: preset.outfitColor + '30' }}
                    aria-hidden="true"
                  >
                    {preset.emoji}
                  </div>
                  <span className="font-nunito text-sm font-semibold text-[var(--dark)]">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={handleFinish}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 w-full rounded-full font-nunito font-bold text-base text-white px-6 py-4 min-h-[52px] transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
              style={{ backgroundColor: 'var(--coral)', boxShadow: 'var(--shadow-coral)' }}
            >
              {saving ? (
                <><span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />Se salvează...</>
              ) : 'Creează profilul lui ' + data.name}
            </button>
          </div>
        )}

        {/* Step 3 — Succes */}
        {step === 2 && (
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="text-6xl" style={{ animation: 'wiggle 0.6s ease-in-out 2' }} aria-hidden="true">🎉</div>
            <div>
              <p className="font-fredoka text-2xl font-semibold text-[var(--dark)] mb-1">
                {data.name} e gata de aventură!
              </p>
              <p className="font-nunito text-sm text-[var(--gray)]">
                50 coins bonus te așteaptă în portofel ✨
              </p>
            </div>
            <button
              onClick={onComplete}
              className="inline-flex items-center justify-center w-full rounded-full font-nunito font-bold text-lg text-white px-6 py-4 min-h-[56px] transition-all hover:opacity-90 active:scale-95 shimmer-bg"
            >
              Hai să explorăm! 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
