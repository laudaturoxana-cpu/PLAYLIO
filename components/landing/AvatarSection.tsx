'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AVATAR_HAIR_COLORS, AVATAR_SKIN_TONES, AVATAR_EYE_COLORS, AVATAR_OUTFIT_COLORS } from '@/lib/utils/constants'

interface AvatarConfig {
  hairColor: string
  skinTone: string
  eyeColor: string
  outfitColor: string
}

const DEFAULT: AvatarConfig = {
  hairColor: '#3E2723',
  skinTone: '#FFCCBC',
  eyeColor: '#1565C0',
  outfitColor: '#4FC3F7',
}

function ColorDots({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string
  options: readonly { value: string; label: string }[]
  selected: string
  onSelect: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <span
        className="font-nunito font-bold uppercase"
        style={{ fontSize: '11px', letterSpacing: '0.08em', color: '#757575' }}
      >
        {label}
      </span>
      <div className="flex items-center gap-2 flex-wrap">
        {options.map(({ value, label: dotLabel }) => (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className="relative flex items-center justify-center rounded-full transition-all duration-200"
            style={{
              width: 36,
              height: 36,
              backgroundColor: value,
              transform: selected === value ? 'scale(1.2)' : 'scale(1)',
              boxShadow: selected === value
                ? `0 0 0 3px white, 0 0 0 5px ${value}`
                : '0 2px 8px rgba(0,0,0,0.10)',
            }}
            aria-label={`${dotLabel}${selected === value ? ' — selectat' : ''}`}
            aria-pressed={selected === value}
          />
        ))}
      </div>
    </div>
  )
}

function AvatarSVG({ config }: { config: AvatarConfig }) {
  return (
    <svg width="160" height="200" viewBox="0 0 160 200" aria-label="Preview avatar" role="img">
      <ellipse cx="80" cy="175" rx="45" ry="30" fill={config.outfitColor} opacity="0.9" />
      <rect x="40" y="148" width="80" height="40" rx="16" fill={config.outfitColor} />
      <rect x="68" y="125" width="24" height="28" rx="8" fill={config.skinTone} />
      <ellipse cx="80" cy="100" rx="44" ry="46" fill={config.skinTone} />
      <ellipse cx="80" cy="62" rx="44" ry="22" fill={config.hairColor} />
      <rect x="36" y="62" width="18" height="32" rx="9" fill={config.hairColor} />
      <rect x="106" y="62" width="18" height="32" rx="9" fill={config.hairColor} />
      <ellipse cx="63" cy="98" rx="8" ry="9" fill="white" />
      <ellipse cx="97" cy="98" rx="8" ry="9" fill="white" />
      <circle cx="65" cy="99" r="5" fill={config.eyeColor} />
      <circle cx="99" cy="99" r="5" fill={config.eyeColor} />
      <circle cx="66" cy="97" r="1.8" fill="white" />
      <circle cx="100" cy="97" r="1.8" fill="white" />
      <path d="M 55 87 Q 63 83 71 87" stroke={config.hairColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 89 87 Q 97 83 105 87" stroke={config.hairColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="80" cy="110" rx="4" ry="3" fill={config.skinTone} stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
      <path d="M 68 122 Q 80 132 92 122" stroke="#FF7043" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="52" cy="116" rx="9" ry="6" fill="#F48FB1" opacity="0.35" />
      <ellipse cx="108" cy="116" rx="9" ry="6" fill="#F48FB1" opacity="0.35" />
      <text x="10" y="50" fontSize="16" style={{ animation: 'float 3s ease-in-out infinite' }}>⭐</text>
      <text x="132" y="70" fontSize="12" style={{ animation: 'float 4.5s ease-in-out 0.5s infinite' }}>✨</text>
    </svg>
  )
}

export function AvatarSection() {
  const [config, setConfig] = useState<AvatarConfig>(DEFAULT)

  const update = (key: keyof AvatarConfig) => (value: string) =>
    setConfig((prev) => ({ ...prev, [key]: value }))

  return (
    <section
      id="avatar"
      className="px-4"
      style={{ paddingTop: 'clamp(48px, 8vw, 80px)', paddingBottom: 'clamp(48px, 8vw, 80px)' }}
      aria-labelledby="avatar-heading"
    >
      <div style={{ maxWidth: '1152px', margin: '0 auto', width: '100%' }}>
        <div
          className="flex flex-col items-center"
          style={{ gap: 'clamp(32px, 6vw, 64px)' }}
        >
          {/* Top — heading */}
          <div className="text-center">
            <h2
              id="avatar-heading"
              className="font-fredoka font-semibold"
              style={{ fontSize: 'clamp(28px, 5vw, 44px)', color: '#212121', marginBottom: '8px' }}
            >
              Creează-ți personajul
            </h2>
            <p
              className="font-nunito"
              style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#757575' }}
            >
              Fii exact cine vrei în lumea Playlio
            </p>
          </div>

          {/* Two columns on md+, stacked on mobile */}
          <div
            className="flex flex-col md:flex-row items-center"
            style={{ gap: 'clamp(24px, 5vw, 56px)', width: '100%' }}
          >
            {/* Avatar preview */}
            <div className="flex flex-col items-center" style={{ gap: '12px', flexShrink: 0 }}>
              <div
                className="relative flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(79,195,247,0.12), rgba(206,147,216,0.15))',
                  borderRadius: '32px',
                  width: 'clamp(220px, 35vw, 280px)',
                  height: 'clamp(270px, 42vw, 340px)',
                }}
                aria-live="polite"
                aria-atomic="true"
              >
                {['10%', '85%', '50%'].map((left, i) => (
                  <div
                    key={i}
                    className="absolute text-sm"
                    style={{
                      left,
                      top: `${15 + i * 30}%`,
                      animation: `float ${3 + i * 0.7}s ease-in-out ${i * 0.4}s infinite`,
                      opacity: 0.5,
                    }}
                    aria-hidden="true"
                  >
                    ✦
                  </div>
                ))}
                <AvatarSVG config={config} />
              </div>
              <p className="font-fredoka" style={{ fontSize: '16px', color: '#212121' }}>
                Aventurierul tău
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col w-full" style={{ gap: 'clamp(16px, 3vw, 24px)', maxWidth: '480px' }}>
              <ColorDots
                label="Culoarea părului"
                options={AVATAR_HAIR_COLORS}
                selected={config.hairColor}
                onSelect={update('hairColor')}
              />
              <ColorDots
                label="Tonul tenului"
                options={AVATAR_SKIN_TONES}
                selected={config.skinTone}
                onSelect={update('skinTone')}
              />
              <ColorDots
                label="Culoarea ochilor"
                options={AVATAR_EYE_COLORS}
                selected={config.eyeColor}
                onSelect={update('eyeColor')}
              />
              <ColorDots
                label="Culoarea hainelor"
                options={AVATAR_OUTFIT_COLORS}
                selected={config.outfitColor}
                onSelect={update('outfitColor')}
              />

              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full font-nunito font-bold text-white transition-all duration-300 active:scale-95"
                style={{
                  backgroundColor: '#FF7043',
                  boxShadow: '0 6px 24px rgba(255,112,67,0.35)',
                  padding: 'clamp(14px, 2.5vw, 16px) clamp(24px, 4vw, 48px)',
                  fontSize: 'clamp(15px, 2vw, 18px)',
                  width: '100%',
                  maxWidth: '380px',
                  textAlign: 'center',
                  marginTop: '8px',
                }}
              >
                Creează Avatar Gratuit
              </Link>
              <p className="text-center font-nunito" style={{ fontSize: '12px', color: '#9E9E9E' }}>
                Fără cont necesar · Îl salvezi după înregistrare
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
