import { cn } from '@/lib/utils/cn'

type LoaderSize = 'sm' | 'md' | 'lg' | 'xl'
type LoaderVariant = 'spinner' | 'dots' | 'lio'

const SIZE_MAP: Record<LoaderSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-[3px]',
  lg: 'h-12 w-12 border-4',
  xl: 'h-16 w-16 border-4',
}

interface LoaderProps {
  size?: LoaderSize
  variant?: LoaderVariant
  color?: string
  label?: string
  className?: string
}

function Loader({
  size = 'md',
  variant = 'spinner',
  color = 'var(--coral)',
  label = 'Loading...',
  className,
}: LoaderProps) {
  if (variant === 'dots') {
    return (
      <div
        className={cn('flex items-center gap-1.5', className)}
        role="status"
        aria-label={label}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 rounded-full animate-bounce-soft"
            style={{
              backgroundColor: color,
              animationDelay: `${i * 0.15}s`,
            }}
            aria-hidden="true"
          />
        ))}
        <span className="sr-only">{label}</span>
      </div>
    )
  }

  if (variant === 'lio') {
    return (
      <div
        className={cn('flex flex-col items-center gap-3', className)}
        role="status"
        aria-label={label}
      >
        {/* Lio simplu SVG */}
        <svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          className="animate-bounce-soft"
          aria-hidden="true"
        >
          <circle cx="28" cy="28" r="26" fill="#FFD54F" />
          <circle cx="28" cy="28" r="26" fill="url(#lio-gradient)" opacity="0.3" />
          <circle cx="21" cy="25" r="3.5" fill="#212121" />
          <circle cx="35" cy="25" r="3.5" fill="#212121" />
          <circle cx="22" cy="23.5" r="1.2" fill="white" />
          <circle cx="36" cy="23.5" r="1.2" fill="white" />
          <path
            d="M 20 34 Q 28 40 36 34"
            stroke="#212121"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="20" cy="8" r="4" fill="#4FC3F7" />
          <circle cx="36" cy="6" r="3" fill="#FF7043" />
          <defs>
            <radialGradient id="lio-gradient" cx="60%" cy="40%">
              <stop offset="0%" stopColor="#FF7043" />
              <stop offset="100%" stopColor="#FFD54F" />
            </radialGradient>
          </defs>
        </svg>
        <p className="font-nunito text-sm font-semibold" style={{ color }}>
          {label}
        </p>
      </div>
    )
  }

  // default: spinner
  return (
    <div
      className={cn(
        'rounded-full border-t-transparent animate-spin',
        SIZE_MAP[size],
        className
      )}
      style={{ borderColor: `${color} transparent transparent transparent` }}
      role="status"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
    </div>
  )
}

/* Full-screen loader overlay */
function PageLoader({ message = 'Loading Playlio...' }: { message?: string }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <Loader variant="lio" size="xl" label={message} />
    </div>
  )
}

export { Loader, PageLoader }
export type { LoaderProps }
