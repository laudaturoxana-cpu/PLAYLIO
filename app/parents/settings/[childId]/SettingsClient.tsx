'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface ChildSettings {
  dyslexiaMode: boolean       // OpenDyslexic font
  highContrast: boolean       // High contrast
  extendedTime: boolean       // Double time for answers
  reducedMotion: boolean      // Respects prefers-reduced-motion (display only)
  textToSpeech: boolean       // Lio reads instructions aloud
  soundEnabled: boolean       // Game sounds enabled
}

const DEFAULT_SETTINGS: ChildSettings = {
  dyslexiaMode: false,
  highContrast: false,
  extendedTime: false,
  reducedMotion: false,
  textToSpeech: true,
  soundEnabled: true,
}

interface SettingsClientProps {
  childId: string
  childName: string
  childAge: number
  ageNotSet?: boolean
}

export default function SettingsClient({ childId, childName, childAge: initialAge, ageNotSet }: SettingsClientProps) {
  const [settings, setSettings] = useState<ChildSettings>(DEFAULT_SETTINGS)
  const [saved, setSaved] = useState(false)
  const [age, setAge] = useState(initialAge)
  const [ageSaved, setAgeSaved] = useState(false)

  const storageKey = `child_settings_${childId}`

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) setSettings(JSON.parse(raw) as ChildSettings)
    } catch {
      // silent
    }
  }, [storageKey])

  function toggle(key: keyof ChildSettings) {
    setSettings(prev => {
      const next = { ...prev, [key]: !prev[key] }
      localStorage.setItem(storageKey, JSON.stringify(next))
      return next
    })
    setSaved(false)
  }

  function handleSave() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(settings))
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      // silent
    }
  }

  async function handleSaveAge() {
    try {
      const supabase = createClient()
      await supabase.from('profiles').update({ age }).eq('id', childId)
      setAgeSaved(true)
      setTimeout(() => setAgeSaved(false), 2500)
    } catch {
      // silent
    }
  }

  const settingsGroups: {
    title: string
    emoji: string
    description: string
    items: { key: keyof ChildSettings; label: string; note?: string; readOnly?: boolean }[]
  }[] = [
    {
      title: 'Accessibility',
      emoji: '♿',
      description: 'Options for children with special needs',
      items: [
        {
          key: 'dyslexiaMode',
          label: 'Dyslexia mode',
          note: 'Enables OpenDyslexic font — easier to read for children with dyslexia',
        },
        {
          key: 'highContrast',
          label: 'High contrast',
          note: 'Stronger colors for children with visual impairments',
        },
        {
          key: 'extendedTime',
          label: 'Extended time',
          note: 'Double time for answers — recommended for children who need more time',
        },
        {
          key: 'reducedMotion',
          label: 'Reduced motion',
          note: 'Automatically set from operating system preferences (prefers-reduced-motion)',
          readOnly: true,
        },
      ],
    },
    {
      title: 'Game experience',
      emoji: '🎮',
      description: 'Customize your child\'s experience',
      items: [
        {
          key: 'textToSpeech',
          label: 'Lio\'s voice',
          note: 'Lio reads instructions aloud — recommended for children aged 3-5',
        },
        {
          key: 'soundEnabled',
          label: 'Game sounds',
          note: 'Sound effects: ding! for correct, soft whomp for wrong',
        },
      ],
    },
  ]

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, rgba(79,195,247,0.04) 0%, rgba(255,213,79,0.04) 100%)',
        backgroundColor: 'var(--white)',
      }}
    >
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/parents/dashboard"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-black/5 text-[var(--gray)] active:scale-95 transition-transform text-lg"
            style={{ touchAction: 'manipulation' }}
            aria-label="Back"
          >
            ←
          </Link>
          <div className="text-center">
            <h1 className="font-fredoka text-xl font-semibold text-[var(--sky-dark)]">
              ⚙️ Settings
            </h1>
            <p className="font-inter text-xs text-[var(--gray)]">{childName}</p>
          </div>
          <div className="w-10" />
        </div>

        {/* Child age */}
        <div
          className="rounded-3xl bg-white shadow-sm mb-4 overflow-hidden"
          style={{
            border: ageNotSet ? '2px solid rgba(255,112,67,0.5)' : '1px solid rgba(0,0,0,0.05)',
          }}
        >
          {ageNotSet && (
            <div
              className="px-5 py-2.5 flex items-center gap-2 font-inter text-xs font-semibold"
              style={{ background: 'rgba(255,112,67,0.1)', color: '#BF360C' }}
            >
              <span>⚠️</span>
              <span>Age not set — set it below so Lio knows how to talk to {childName}!</span>
            </div>
          )}
          <div className="px-5 py-4 border-b border-black/5">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎂</span>
              <div>
                <p className="font-inter text-sm font-semibold text-[var(--dark)]">Child's age</p>
                <p className="font-inter text-xs text-[var(--gray)]">Lio adapts messages to your child's age</p>
              </div>
            </div>
          </div>
          <div className="px-5 py-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-inter text-sm text-[var(--gray)]">How old is {childName}?</span>
              <span className="font-fredoka text-2xl font-semibold" style={{ color: 'var(--coral)' }}>
                {age} years
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={10}
              value={age}
              onChange={(e) => { setAge(Number(e.target.value)); setAgeSaved(false) }}
              className="w-full h-3 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: 'var(--coral)' }}
              aria-valuemin={3}
              aria-valuemax={10}
              aria-valuenow={age}
              aria-valuetext={`${age} years`}
            />
            <div className="flex justify-between font-inter text-xs text-[var(--gray)]">
              <span>3 yrs</span><span>10 yrs</span>
            </div>
            <button
              onClick={handleSaveAge}
              className="flex items-center justify-center gap-2 w-full rounded-full py-2.5 font-inter text-sm font-semibold text-white shadow-sm active:scale-95 transition-transform"
              style={{
                touchAction: 'manipulation',
                background: ageSaved
                  ? 'linear-gradient(90deg, var(--mint-dark), var(--sky))'
                  : 'linear-gradient(90deg, var(--coral), var(--coral-dark, #e64a19))',
              }}
            >
              {ageSaved ? '✅ Saved!' : '💾 Save age'}
            </button>
          </div>
        </div>

        {/* Settings groups */}
        {settingsGroups.map(group => (
          <div key={group.title} className="rounded-3xl bg-white border border-black/5 shadow-sm mb-4 overflow-hidden">
            {/* Group header */}
            <div className="px-5 py-4 border-b border-black/05">
              <div className="flex items-center gap-2">
                <span className="text-xl">{group.emoji}</span>
                <div>
                  <p className="font-inter text-sm font-semibold text-[var(--dark)]">{group.title}</p>
                  <p className="font-inter text-xs text-[var(--gray)]">{group.description}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-black/05">
              {group.items.map(item => (
                <div key={item.key} className="flex items-center justify-between px-5 py-4 gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-inter text-sm font-semibold text-[var(--dark)]">
                      {item.label}
                    </p>
                    {item.note && (
                      <p className="font-inter text-xs text-[var(--gray)] leading-relaxed mt-0.5">
                        {item.note}
                      </p>
                    )}
                  </div>

                  {/* Toggle switch */}
                  <button
                    onClick={() => !item.readOnly && toggle(item.key)}
                    disabled={item.readOnly}
                    className="relative flex-shrink-0 transition-all"
                    style={{
                      width: '48px',
                      height: '28px',
                      borderRadius: '14px',
                      backgroundColor: settings[item.key] ? 'var(--sky)' : 'rgba(0,0,0,0.12)',
                      opacity: item.readOnly ? 0.5 : 1,
                      cursor: item.readOnly ? 'default' : 'pointer',
                      touchAction: 'manipulation',
                      border: 'none',
                      transition: 'background-color 0.2s',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                    aria-checked={settings[item.key]}
                    role="switch"
                    aria-label={item.label}
                    aria-disabled={item.readOnly}
                  >
                    <span
                      className="absolute top-1 rounded-full bg-white shadow-sm transition-all"
                      style={{
                        width: '20px',
                        height: '20px',
                        left: settings[item.key] ? '24px' : '4px',
                        transition: 'left 0.2s',
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Dyslexia note */}
        {settings.dyslexiaMode && (
          <div
            className="rounded-2xl bg-[var(--purple)]/08 border border-[var(--purple)]/20 p-4 mb-4"
            style={{ animation: 'slide-up 0.3s ease' }}
          >
            <p className="font-inter text-xs text-[var(--purple)] font-semibold mb-1">
              📖 Dyslexia mode active
            </p>
            <p className="font-inter text-xs text-[var(--dark)]">
              OpenDyslexic font will be applied throughout the app for {childName}.
              Make sure the font is installed or you have an active internet connection.
            </p>
          </div>
        )}

        {/* Extended time note */}
        {settings.extendedTime && (
          <div
            className="rounded-2xl bg-[var(--mint)]/20 border border-[var(--mint-dark)]/25 p-4 mb-4"
            style={{ animation: 'slide-up 0.3s ease' }}
          >
            <p className="font-inter text-xs text-[var(--mint-dark)] font-semibold mb-1">
              ⏱️ Extended time active
            </p>
            <p className="font-inter text-xs text-[var(--dark)]">
              {childName} will have 2× more time for each answer.
              The adaptive level adjusts automatically.
            </p>
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 w-full rounded-full py-3 font-inter text-base font-semibold text-white shadow-md active:scale-95 transition-transform mb-4"
          style={{
            touchAction: 'manipulation',
            background: saved
              ? 'linear-gradient(90deg, var(--mint-dark), var(--sky))'
              : 'linear-gradient(90deg, var(--sky), var(--sky-dark))',
          }}
        >
          {saved ? '✅ Saved!' : '💾 Save settings'}
        </button>

        <Link
          href="/parents/dashboard"
          className="flex items-center justify-center gap-2 w-full rounded-full border-2 border-[rgba(0,0,0,0.08)] py-3 font-inter text-base font-semibold text-[var(--gray)] active:scale-95 transition-transform"
          style={{ touchAction: 'manipulation' }}
        >
          ← Dashboard
        </Link>

        <p className="font-inter text-xs text-[var(--gray)] text-center mt-6">
          Settings are saved locally on this device
        </p>
      </div>
    </div>
  )
}
