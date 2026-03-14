'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ChildSettings {
  dyslexiaMode: boolean       // Font OpenDyslexic
  highContrast: boolean       // Contrast înalt
  extendedTime: boolean       // Timp dublu la răspunsuri
  reducedMotion: boolean      // Respectă prefers-reduced-motion (display only)
  textToSpeech: boolean       // Lio citește instrucțiunile cu voce
  soundEnabled: boolean       // Sunete joc activate
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
}

export default function SettingsClient({ childId, childName }: SettingsClientProps) {
  const [settings, setSettings] = useState<ChildSettings>(DEFAULT_SETTINGS)
  const [saved, setSaved] = useState(false)

  const storageKey = `child_settings_${childId}`

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) setSettings(JSON.parse(raw) as ChildSettings)
    } catch {
      // silențios
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
      // silențios
    }
  }

  const settingsGroups: {
    title: string
    emoji: string
    description: string
    items: { key: keyof ChildSettings; label: string; note?: string; readOnly?: boolean }[]
  }[] = [
    {
      title: 'Accesibilitate',
      emoji: '♿',
      description: 'Opțiuni pentru copii cu nevoi speciale',
      items: [
        {
          key: 'dyslexiaMode',
          label: 'Mod dislexie',
          note: 'Activează fontul OpenDyslexic — mai ușor de citit pentru copiii cu dislexie',
        },
        {
          key: 'highContrast',
          label: 'Contrast înalt',
          note: 'Culori mai puternice pentru copiii cu deficiențe de vedere',
        },
        {
          key: 'extendedTime',
          label: 'Timp extins',
          note: 'Răspunsurile au timp dublu — recomandat pentru copiii care au nevoie de mai mult timp',
        },
        {
          key: 'reducedMotion',
          label: 'Animații reduse',
          note: 'Setat automat din preferințele sistemului de operare (prefers-reduced-motion)',
          readOnly: true,
        },
      ],
    },
    {
      title: 'Experiență de joc',
      emoji: '🎮',
      description: 'Personalizează experiența copilului',
      items: [
        {
          key: 'textToSpeech',
          label: 'Vocea lui Lio',
          note: 'Lio citește instrucțiunile cu voce — recomandat pentru copiii de 3-5 ani',
        },
        {
          key: 'soundEnabled',
          label: 'Sunete joc',
          note: 'Efectele sonore: ding! la corect, whomp moale la greșit',
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
            aria-label="Înapoi"
          >
            ←
          </Link>
          <div className="text-center">
            <h1 className="font-fredoka text-xl font-semibold text-[var(--sky-dark)]">
              ⚙️ Setări
            </h1>
            <p className="font-inter text-xs text-[var(--gray)]">{childName}</p>
          </div>
          <div className="w-10" />
        </div>

        {/* Grupuri de setări */}
        {settingsGroups.map(group => (
          <div key={group.title} className="rounded-3xl bg-white border border-black/5 shadow-sm mb-4 overflow-hidden">
            {/* Header grup */}
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

        {/* Notă dislexie */}
        {settings.dyslexiaMode && (
          <div
            className="rounded-2xl bg-[var(--purple)]/08 border border-[var(--purple)]/20 p-4 mb-4"
            style={{ animation: 'slide-up 0.3s ease' }}
          >
            <p className="font-inter text-xs text-[var(--purple)] font-semibold mb-1">
              📖 Mod dislexie activ
            </p>
            <p className="font-inter text-xs text-[var(--dark)]">
              Fontul OpenDyslexic va fi aplicat în toată aplicația pentru {childName}.
              Asigurați-vă că fontul e instalat sau că aveți conexiune internet activă.
            </p>
          </div>
        )}

        {/* Notă timp extins */}
        {settings.extendedTime && (
          <div
            className="rounded-2xl bg-[var(--mint)]/20 border border-[var(--mint-dark)]/25 p-4 mb-4"
            style={{ animation: 'slide-up 0.3s ease' }}
          >
            <p className="font-inter text-xs text-[var(--mint-dark)] font-semibold mb-1">
              ⏱️ Timp extins activ
            </p>
            <p className="font-inter text-xs text-[var(--dark)]">
              {childName} va avea de 2× mai mult timp pentru fiecare răspuns.
              Nivelul adaptiv se ajustează automat.
            </p>
          </div>
        )}

        {/* Buton salvare */}
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
          {saved ? '✅ Salvat!' : '💾 Salvează setările'}
        </button>

        <Link
          href="/parents/dashboard"
          className="flex items-center justify-center gap-2 w-full rounded-full border-2 border-[rgba(0,0,0,0.08)] py-3 font-inter text-base font-semibold text-[var(--gray)] active:scale-95 transition-transform"
          style={{ touchAction: 'manipulation' }}
        >
          ← Dashboard
        </Link>

        <p className="font-inter text-xs text-[var(--gray)] text-center mt-6">
          Setările sunt salvate local pe acest dispozitiv
        </p>
      </div>
    </div>
  )
}
