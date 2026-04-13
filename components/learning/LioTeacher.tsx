'use client'

/**
 * LioTeacher — bulă extinsă de "profesor AI"
 * Apare după greșeli repetate pe același item.
 * Arată explicația Gemini (teach/hint/socratic).
 */

interface LioTeacherProps {
  message: string | null
  isLoading: boolean
  mode?: 'teach' | 'hint' | 'socratic'
  onDismiss?: () => void
}

const MODE_STYLE = {
  teach: {
    bg: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
    border: '#90CAF9',
    label: '🎓 Lio explică',
    labelColor: '#1565C0',
    btnBg: '#1565C0',
  },
  hint: {
    bg: 'linear-gradient(135deg, #FFF9C4 0%, #FFF176 100%)',
    border: '#FFD54F',
    label: '💡 Indiciu',
    labelColor: '#F57F17',
    btnBg: '#F57F17',
  },
  socratic: {
    bg: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
    border: '#CE93D8',
    label: '🤔 Lio întreabă',
    labelColor: '#6A1B9A',
    btnBg: '#6A1B9A',
  },
}

export default function LioTeacher({
  message,
  isLoading,
  mode = 'teach',
  onDismiss,
}: LioTeacherProps) {
  const style = MODE_STYLE[mode]

  if (!isLoading && !message) return null

  return (
    <div
      className="w-full rounded-3xl flex flex-col gap-3"
      style={{
        background: style.bg,
        border: `2px solid ${style.border}`,
        padding: 'clamp(14px, 3vw, 20px)',
        animation: 'pop 0.3s ease',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        {/* Lio mini */}
        <svg width="36" height="36" viewBox="0 0 100 100" aria-hidden="true" style={{ flexShrink: 0 }}>
          <circle cx="50" cy="38" r="22" fill="#4FC3F7" />
          <ellipse cx="32" cy="20" rx="8" ry="10" fill="#4FC3F7" />
          <ellipse cx="68" cy="20" rx="8" ry="10" fill="#4FC3F7" />
          <ellipse cx="32" cy="20" rx="5" ry="7" fill="#FF7043" opacity="0.7" />
          <ellipse cx="68" cy="20" rx="5" ry="7" fill="#FF7043" opacity="0.7" />
          <circle cx="43" cy="36" r="6" fill="white" />
          <circle cx="57" cy="36" r="6" fill="white" />
          <circle cx="44" cy="36" r="3.5" fill="#212121" />
          <circle cx="58" cy="36" r="3.5" fill="#212121" />
          <circle cx="45" cy="35" r="1.2" fill="white" />
          <circle cx="59" cy="35" r="1.2" fill="white" />
          <path d="M 43 46 Q 50 52 57 46" stroke="#212121" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
        <span
          className="font-fredoka font-semibold"
          style={{ fontSize: '14px', color: style.labelColor }}
        >
          {style.label}
        </span>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center gap-2 px-1">
          <span className="font-nunito text-sm" style={{ color: style.labelColor, opacity: 0.7 }}>
            Lio se gândește
          </span>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: style.labelColor,
                opacity: 0.6,
                animation: `bounce-soft 1s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      ) : (
        <p
          className="font-nunito leading-relaxed"
          style={{
            fontSize: 'clamp(13px, 1.5vw, 15px)',
            color: '#212121',
            lineHeight: 1.6,
          }}
        >
          {message}
        </p>
      )}

      {/* Dismiss button — only when message loaded */}
      {!isLoading && message && onDismiss && (
        <button
          onClick={onDismiss}
          className="self-end font-fredoka font-semibold text-white rounded-2xl px-4 py-2 active:scale-95 transition-transform"
          style={{
            fontSize: '13px',
            background: style.btnBg,
            touchAction: 'manipulation',
          }}
        >
          Am înțeles! 👍
        </button>
      )}
    </div>
  )
}
