'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { setActiveChild } from '@/app/actions/setActiveChild'
import { setLanguage } from '@/app/actions/setLanguage'
import type { Lang } from '@/lib/i18n/translations'

interface ChildData {
  name: string
  age: number
  avatarPreset: number
  lang: Lang
}

const AVATAR_PRESETS = [
  { id: 0, name: 'Explorator', hairColor: '#3E2723', skinTone: '#FFAB76', outfitColor: '#4FC3F7', emoji: '🧭' },
  { id: 1, name: 'Prințesă',   hairColor: '#F9A825', skinTone: '#FFCCBC', outfitColor: '#F48FB1', emoji: '👑' },
  { id: 2, name: 'Artist',     hairColor: '#CE93D8', skinTone: '#D4845A', outfitColor: '#CE93D8', emoji: '🎨' },
  { id: 3, name: 'Erou',       hairColor: '#212121', skinTone: '#8D5524', outfitColor: '#66BB6A', emoji: '⚡' },
]

const AGE_OPTIONS = [
  { age: 3, emoji: '🐣', color: '#FF8A65' },
  { age: 4, emoji: '🐥', color: '#FFB300' },
  { age: 5, emoji: '🌱', color: '#66BB6A' },
  { age: 6, emoji: '⭐', color: '#29B6F6' },
  { age: 7, emoji: '🌟', color: '#9C27B0' },
  { age: 8, emoji: '🦋', color: '#E91E63' },
  { age: 9, emoji: '🚀', color: '#FF5722' },
  { age: 10, emoji: '🏆', color: '#F57F17' },
]

interface Props {
  parentId: string
  parentName?: string
  onComplete: () => void
}

// ─── Lio SVG ─────────────────────────────────────────────────────────────────
function LioSVG({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true">
      {/* Mane */}
      <circle cx="40" cy="44" r="30" fill="#F9A825" />
      <circle cx="40" cy="44" r="24" fill="#FFD54F" />
      {/* Ears */}
      <circle cx="18" cy="24" r="7" fill="#F9A825" />
      <circle cx="62" cy="24" r="7" fill="#F9A825" />
      <circle cx="18" cy="24" r="4" fill="#FFCA28" />
      <circle cx="62" cy="24" r="4" fill="#FFCA28" />
      {/* Face */}
      <circle cx="40" cy="46" r="18" fill="#FFD54F" />
      {/* Eyes */}
      <circle cx="33" cy="42" r="4" fill="#212121" />
      <circle cx="47" cy="42" r="4" fill="#212121" />
      <circle cx="34.2" cy="40.8" r="1.5" fill="white" />
      <circle cx="48.2" cy="40.8" r="1.5" fill="white" />
      {/* Nose */}
      <ellipse cx="40" cy="49" rx="3" ry="2" fill="#E65100" />
      {/* Smile */}
      <path d="M 33 54 Q 40 61 47 54" stroke="#212121" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Whiskers */}
      <line x1="22" y1="50" x2="34" y2="51" stroke="#212121" strokeWidth="1" opacity="0.4" />
      <line x1="22" y1="54" x2="34" y2="53" stroke="#212121" strokeWidth="1" opacity="0.4" />
      <line x1="46" y1="51" x2="58" y2="50" stroke="#212121" strokeWidth="1" opacity="0.4" />
      <line x1="46" y1="53" x2="58" y2="54" stroke="#212121" strokeWidth="1" opacity="0.4" />
    </svg>
  )
}

// ─── Progress dots ────────────────────────────────────────────────────────────
function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex justify-center gap-2" aria-label={`Pasul ${current + 1} din ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === current ? 24 : 8,
            height: 8,
            backgroundColor: i === current ? '#FF7043' : i < current ? '#FFAB91' : '#E0E0E0',
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export function OnboardingModal({ parentId, parentName, onComplete }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [createdChildId, setCreatedChildId] = useState<string | null>(null)
  const [data, setData] = useState<ChildData>({ name: '', age: 6, avatarPreset: 0, lang: 'ro' })

  const firstName = parentName?.split(' ')[0] ?? 'Părinte'
  const TOTAL_STEPS = 6

  async function handleFinish() {
    if (!data.name.trim()) return
    setSaving(true)

    const supabase = createClient()
    const preset = AVATAR_PRESETS[data.avatarPreset]
    const username = `${data.name.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now().toString(36)}`

    const { data: childProfile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: crypto.randomUUID(),
        username,
        full_name: data.name.trim(),
        role: 'child',
        parent_id: parentId,
        coins: 50,
        age: data.age,
      })
      .select()
      .single()

    if (profileError || !childProfile) {
      setSaving(false)
      return
    }

    setCreatedChildId(childProfile.id)

    await supabase.from('avatars').insert({
      user_id: childProfile.id,
      hair_color: preset.hairColor,
      skin_tone: preset.skinTone,
      outfit_color: preset.outfitColor,
    })

    await supabase.from('coin_transactions').insert({
      user_id: childProfile.id,
      amount: 50,
      reason: 'Bun venit în Playlio! 🎉',
    })

    // Save language preference as cookie (app will read this on next render)
    await setLanguage(data.lang)

    setSaving(false)
    setStep(5)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(33,33,33,0.55)', backdropFilter: 'blur(6px)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white shadow-[var(--shadow-lg)] flex flex-col overflow-hidden"
        style={{ maxHeight: '92dvh' }}
      >
        {/* ── Colorful top stripe ── */}
        <div
          style={{
            height: 6,
            background: 'linear-gradient(90deg, #FF7043, #FFD54F, #66BB6A, #29B6F6, #CE93D8)',
          }}
        />

        <div className="flex flex-col gap-5 p-7 overflow-y-auto">
          <ProgressDots current={step} total={TOTAL_STEPS} />

          {/* ─── STEP 0: Welcome ─────────────────────────────────────────── */}
          {step === 0 && (
            <div className="flex flex-col items-center gap-5 text-center">
              <div style={{ animation: 'bounce-soft 2s ease-in-out infinite' }}>
                <LioSVG size={100} />
              </div>
              <div>
                <h1
                  id="onboarding-title"
                  className="font-fredoka font-semibold"
                  style={{ fontSize: '1.75rem', color: '#212121', lineHeight: 1.2 }}
                >
                  Bun venit, {firstName}! 👋
                </h1>
                <p className="font-nunito mt-2 leading-relaxed" style={{ fontSize: '1rem', color: '#757575' }}>
                  Sunt <strong style={{ color: '#FF7043' }}>Lio</strong>, ghidul tău din Playlio!
                  Hai să creăm profilul copilului tău ca să personalizăm aventura pentru el. 🌟
                </p>
              </div>
              <div
                className="w-full rounded-2xl px-4 py-3 flex items-start gap-3 text-left"
                style={{ background: 'rgba(255,213,79,0.12)', border: '1.5px solid rgba(255,193,7,0.3)' }}
              >
                <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>⏱️</span>
                <p className="font-nunito text-sm" style={{ color: '#5D4037' }}>
                  Durează doar <strong>un minut</strong> să configurezi profilul!
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center justify-center w-full rounded-full font-nunito font-bold text-lg text-white px-6 py-4 min-h-[56px] transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: '#FF7043', boxShadow: '0 6px 20px rgba(255,112,67,0.40)' }}
              >
                Să începem! 🚀
              </button>
            </div>
          )}

          {/* ─── STEP 1: Child's name ─────────────────────────────────────── */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              {/* Lio message */}
              <div className="flex items-start gap-3">
                <div style={{ flexShrink: 0 }}>
                  <LioSVG size={52} />
                </div>
                <div
                  className="flex-1 rounded-2xl rounded-tl-none px-4 py-3"
                  style={{ background: '#F5F5F5' }}
                >
                  <p className="font-nunito text-sm font-medium" style={{ color: '#212121', lineHeight: 1.5 }}>
                    Cum îl/o cheamă pe copilul tău? 😊
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="child-name" className="font-nunito text-sm font-bold" style={{ color: '#212121' }}>
                  Prenumele copilului
                </label>
                <input
                  id="child-name"
                  type="text"
                  placeholder="ex: Ana, Matei, Sofia..."
                  autoComplete="off"
                  autoFocus
                  value={data.name}
                  onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && data.name.trim().length >= 2 && setStep(2)}
                  className="w-full rounded-2xl border font-nunito text-base min-h-[52px] px-4 py-3 focus:outline-none transition-all"
                  style={{
                    borderColor: data.name.trim().length >= 2 ? '#FF7043' : 'rgba(0,0,0,0.15)',
                    boxShadow: data.name.trim().length >= 2 ? '0 0 0 3px rgba(255,112,67,0.12)' : 'none',
                    color: '#212121',
                    background: 'white',
                  }}
                  aria-required="true"
                />
                {data.name.trim().length > 0 && data.name.trim().length < 2 && (
                  <p className="font-nunito text-xs" style={{ color: '#EF5350' }}>
                    Prenumele trebuie să aibă cel puțin 2 caractere
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(0)}
                  className="flex items-center justify-center rounded-full font-nunito font-semibold text-base px-5 py-3 min-h-[48px] border border-black/10 transition-all active:scale-95"
                  style={{ color: '#757575', background: 'white' }}
                >
                  ←
                </button>
                <button
                  onClick={() => data.name.trim().length >= 2 && setStep(2)}
                  disabled={data.name.trim().length < 2}
                  className="flex-1 inline-flex items-center justify-center rounded-full font-nunito font-bold text-base text-white px-6 py-3 min-h-[48px] transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#FF7043', boxShadow: '0 4px 16px rgba(255,112,67,0.35)' }}
                >
                  Continuă →
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 2: Child's age ─────────────────────────────────────── */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              {/* Lio message */}
              <div className="flex items-start gap-3">
                <div style={{ flexShrink: 0 }}>
                  <LioSVG size={52} />
                </div>
                <div
                  className="flex-1 rounded-2xl rounded-tl-none px-4 py-3"
                  style={{ background: '#F5F5F5' }}
                >
                  <p className="font-nunito text-sm font-medium" style={{ color: '#212121', lineHeight: 1.5 }}>
                    Câți ani are <strong style={{ color: '#FF7043' }}>{data.name || 'copilul tău'}</strong>?
                    Asta mă ajută să potrivesc jocurile exact pentru vârsta lui! 🎯
                  </p>
                </div>
              </div>

              {/* Visual age picker */}
              <div className="grid grid-cols-4 gap-2">
                {AGE_OPTIONS.map(({ age, emoji, color }) => (
                  <button
                    key={age}
                    onClick={() => setData((d) => ({ ...d, age }))}
                    className="flex flex-col items-center gap-1 rounded-2xl py-3 px-1 border-2 transition-all active:scale-90 hover:scale-105"
                    style={{
                      borderColor: data.age === age ? color : 'rgba(0,0,0,0.08)',
                      background: data.age === age ? `${color}18` : '#FAFAFA',
                      boxShadow: data.age === age ? `0 4px 14px ${color}40` : 'none',
                    }}
                    aria-pressed={data.age === age}
                    aria-label={`${age} ani`}
                  >
                    <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{emoji}</span>
                    <span
                      className="font-fredoka font-semibold"
                      style={{
                        fontSize: '1.2rem',
                        color: data.age === age ? color : '#424242',
                        lineHeight: 1,
                      }}
                    >
                      {age}
                    </span>
                    <span className="font-nunito text-[9px]" style={{ color: '#9E9E9E' }}>
                      ani
                    </span>
                  </button>
                ))}
              </div>

              {/* Selected age confirm */}
              <div
                className="rounded-2xl px-4 py-3 text-center"
                style={{ background: 'rgba(255,112,67,0.08)', border: '1.5px solid rgba(255,112,67,0.2)' }}
              >
                <p className="font-nunito text-sm font-semibold" style={{ color: '#E64A19' }}>
                  {data.name || 'Copilul tău'} are{' '}
                  <span className="font-fredoka text-xl">{data.age}</span> ani{' '}
                  {AGE_OPTIONS.find(o => o.age === data.age)?.emoji}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center rounded-full font-nunito font-semibold text-base px-5 py-3 min-h-[48px] border border-black/10 transition-all active:scale-95"
                  style={{ color: '#757575', background: 'white' }}
                >
                  ←
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 inline-flex items-center justify-center rounded-full font-nunito font-bold text-base text-white px-6 py-3 min-h-[48px] transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: '#FF7043', boxShadow: '0 4px 16px rgba(255,112,67,0.35)' }}
                >
                  Continuă →
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 3: Avatar ──────────────────────────────────────────── */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              {/* Lio message */}
              <div className="flex items-start gap-3">
                <div style={{ flexShrink: 0 }}>
                  <LioSVG size={52} />
                </div>
                <div
                  className="flex-1 rounded-2xl rounded-tl-none px-4 py-3"
                  style={{ background: '#F5F5F5' }}
                >
                  <p className="font-nunito text-sm font-medium" style={{ color: '#212121', lineHeight: 1.5 }}>
                    Super! Acum alege un personaj pentru{' '}
                    <strong style={{ color: '#FF7043' }}>{data.name}</strong>!
                    Poate fi schimbat mai târziu. 🎭
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setData((d) => ({ ...d, avatarPreset: preset.id }))}
                    className="flex flex-col items-center gap-2 rounded-2xl p-4 border-2 transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                      borderColor: data.avatarPreset === preset.id ? preset.outfitColor : 'rgba(0,0,0,0.08)',
                      backgroundColor: data.avatarPreset === preset.id ? `${preset.outfitColor}18` : '#FAFAFA',
                      boxShadow: data.avatarPreset === preset.id ? `0 4px 16px ${preset.outfitColor}50` : 'none',
                    }}
                    aria-pressed={data.avatarPreset === preset.id}
                    aria-label={`Personaj ${preset.name}`}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{
                        background: `${preset.outfitColor}25`,
                        fontSize: '2rem',
                      }}
                      aria-hidden="true"
                    >
                      {preset.emoji}
                    </div>
                    <span className="font-nunito text-sm font-semibold" style={{ color: '#212121' }}>
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center justify-center rounded-full font-nunito font-semibold text-base px-5 py-3 min-h-[48px] border border-black/10 transition-all active:scale-95"
                  style={{ color: '#757575', background: 'white' }}
                >
                  ←
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 inline-flex items-center justify-center rounded-full font-nunito font-bold text-base text-white px-6 py-3 min-h-[48px] transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: '#FF7043', boxShadow: '0 4px 16px rgba(255,112,67,0.35)' }}
                >
                  Continuă →
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 4: Language ────────────────────────────────────────── */}
          {step === 4 && (
            <div className="flex flex-col gap-5">
              {/* Lio message */}
              <div className="flex items-start gap-3">
                <div style={{ flexShrink: 0 }}>
                  <LioSVG size={52} />
                </div>
                <div
                  className="flex-1 rounded-2xl rounded-tl-none px-4 py-3"
                  style={{ background: '#F5F5F5' }}
                >
                  <p className="font-nunito text-sm font-medium" style={{ color: '#212121', lineHeight: 1.5 }}>
                    Ultima întrebare! 🌍 În ce limbă vrei să se joace{' '}
                    <strong style={{ color: '#FF7043' }}>{data.name}</strong>?
                  </p>
                </div>
              </div>

              {/* Language buttons */}
              <div className="grid grid-cols-2 gap-3">
                {/* Romanian */}
                <button
                  onClick={() => setData((d) => ({ ...d, lang: 'ro' }))}
                  className="flex flex-col items-center gap-3 rounded-3xl p-5 border-2 transition-all active:scale-95 hover:scale-105"
                  style={{
                    borderColor: data.lang === 'ro' ? '#FF7043' : 'rgba(0,0,0,0.08)',
                    background: data.lang === 'ro' ? 'rgba(255,112,67,0.08)' : '#FAFAFA',
                    boxShadow: data.lang === 'ro' ? '0 6px 20px rgba(255,112,67,0.25)' : 'none',
                  }}
                  aria-pressed={data.lang === 'ro'}
                >
                  <span style={{ fontSize: '2.8rem', lineHeight: 1 }}>🇷🇴</span>
                  <div className="text-center">
                    <p
                      className="font-fredoka font-semibold"
                      style={{ fontSize: '1.1rem', color: data.lang === 'ro' ? '#FF7043' : '#212121' }}
                    >
                      Română
                    </p>
                    <p className="font-nunito text-xs mt-0.5" style={{ color: '#9E9E9E' }}>
                      Romanian
                    </p>
                  </div>
                  {data.lang === 'ro' && (
                    <span
                      className="font-nunito text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: '#FF7043', color: 'white' }}
                    >
                      ✓ Ales
                    </span>
                  )}
                </button>

                {/* English */}
                <button
                  onClick={() => setData((d) => ({ ...d, lang: 'en' }))}
                  className="flex flex-col items-center gap-3 rounded-3xl p-5 border-2 transition-all active:scale-95 hover:scale-105"
                  style={{
                    borderColor: data.lang === 'en' ? '#29B6F6' : 'rgba(0,0,0,0.08)',
                    background: data.lang === 'en' ? 'rgba(41,182,246,0.08)' : '#FAFAFA',
                    boxShadow: data.lang === 'en' ? '0 6px 20px rgba(41,182,246,0.25)' : 'none',
                  }}
                  aria-pressed={data.lang === 'en'}
                >
                  <span style={{ fontSize: '2.8rem', lineHeight: 1 }}>🇬🇧</span>
                  <div className="text-center">
                    <p
                      className="font-fredoka font-semibold"
                      style={{ fontSize: '1.1rem', color: data.lang === 'en' ? '#29B6F6' : '#212121' }}
                    >
                      English
                    </p>
                    <p className="font-nunito text-xs mt-0.5" style={{ color: '#9E9E9E' }}>
                      Engleză
                    </p>
                  </div>
                  {data.lang === 'en' && (
                    <span
                      className="font-nunito text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: '#29B6F6', color: 'white' }}
                    >
                      ✓ Chosen
                    </span>
                  )}
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center justify-center rounded-full font-nunito font-semibold text-base px-5 py-3 min-h-[48px] border border-black/10 transition-all active:scale-95"
                  style={{ color: '#757575', background: 'white' }}
                >
                  ←
                </button>
                <button
                  onClick={handleFinish}
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full font-nunito font-bold text-base text-white px-6 py-3 min-h-[48px] transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                  style={{ backgroundColor: '#FF7043', boxShadow: '0 4px 16px rgba(255,112,67,0.35)' }}
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      {data.lang === 'en' ? 'Saving...' : 'Se salvează...'}
                    </>
                  ) : (
                    data.lang === 'en'
                      ? `Create ${data.name}'s profile 🎉`
                      : `Creează profilul lui ${data.name} 🎉`
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 5: Success ─────────────────────────────────────────── */}
          {step === 5 && (
            <div className="flex flex-col items-center gap-5 text-center">
              <div style={{ animation: 'wiggle 0.6s ease-in-out 2' }} aria-hidden="true">
                <LioSVG size={90} />
              </div>
              <div>
                <div className="text-4xl mb-3" aria-hidden="true">🎉</div>
                <h2
                  className="font-fredoka font-semibold"
                  style={{ fontSize: '1.6rem', color: '#212121', lineHeight: 1.2 }}
                >
                  {data.lang === 'en'
                    ? `${data.name} is ready for adventure!`
                    : `${data.name} e gata de aventură!`}
                </h2>
                <p className="font-nunito mt-2 leading-relaxed" style={{ fontSize: '0.9rem', color: '#757575' }}>
                  {data.lang === 'en'
                    ? <>All games personalized for age <strong style={{ color: '#FF7043' }}>{data.age}</strong>. Welcome gift of <strong style={{ color: '#F57F17' }}>50 coins</strong> 🪙 waiting!</>
                    : <>Am personalizat jocurile pentru <strong style={{ color: '#FF7043' }}>{data.age} ani</strong>. Un cadou de <strong style={{ color: '#F57F17' }}>50 monede</strong> 🪙 te așteaptă!</>}
                </p>
              </div>

              {/* Profile summary */}
              <div
                className="w-full rounded-2xl px-4 py-3 flex flex-col gap-2"
                style={{ background: 'rgba(102,187,106,0.10)', border: '1.5px solid rgba(102,187,106,0.25)' }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: '1.2rem' }}>✅</span>
                  <p className="font-nunito text-sm font-semibold text-left" style={{ color: '#2E7D32' }}>
                    {data.name}, {data.age} {data.lang === 'en' ? 'years old' : 'ani'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: '1.2rem' }}>{AVATAR_PRESETS[data.avatarPreset].emoji}</span>
                  <p className="font-nunito text-sm text-left" style={{ color: '#757575' }}>
                    {AVATAR_PRESETS[data.avatarPreset].name}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: '1.2rem' }}>{data.lang === 'ro' ? '🇷🇴' : '🇬🇧'}</span>
                  <p className="font-nunito text-sm text-left" style={{ color: '#757575' }}>
                    {data.lang === 'ro' ? 'Română' : 'English'}
                  </p>
                </div>
              </div>

              <button
                onClick={async () => {
                  if (createdChildId) {
                    await setActiveChild(createdChildId)
                    router.push('/worlds')
                  } else {
                    onComplete()
                  }
                }}
                className="inline-flex items-center justify-center w-full rounded-full font-nunito font-bold text-lg text-white px-6 py-4 min-h-[56px] transition-all hover:opacity-90 active:scale-95 shimmer-bg"
              >
                {data.lang === 'en' ? "Let's explore! 🚀" : 'Să explorăm! 🚀'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
