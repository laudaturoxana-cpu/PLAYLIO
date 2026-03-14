import { cn } from '@/lib/utils/cn'

type ProgressColor = 'coral' | 'sky' | 'mint' | 'sun' | 'purple'

const COLOR_MAP: Record<ProgressColor, string> = {
  coral: 'bg-coral',
  sky: 'bg-sky',
  mint: 'bg-mint',
  sun: 'bg-sun',
  purple: 'bg-purple',
}

interface ProgressBarProps {
  value: number        // 0-100
  max?: number
  color?: ProgressColor
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  label?: string
  animated?: boolean
  className?: string
}

function ProgressBar({
  value,
  max = 100,
  color = 'coral',
  size = 'md',
  showLabel = false,
  label,
  animated = true,
  className,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  const heightMap = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && (
            <span className="text-xs font-semibold font-nunito text-[var(--dark)]">
              {label}
            </span>
          )}
          {showLabel && (
            <span className="text-xs font-semibold font-nunito text-[var(--gray)]">
              {Math.round(percent)}%
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          'w-full rounded-full bg-[var(--light)] overflow-hidden',
          heightMap[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label ?? `Progres: ${Math.round(percent)}%`}
      >
        <div
          className={cn(
            'h-full rounded-full',
            animated && 'transition-all duration-700 ease-out',
            COLOR_MAP[color]
          )}
          style={{ width: `${percent}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

export { ProgressBar }
export type { ProgressBarProps }
