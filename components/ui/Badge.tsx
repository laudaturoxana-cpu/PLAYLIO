import { cn } from '@/lib/utils/cn'
import type { BadgeVariant } from '@/types'

const BADGE_STYLES: Record<BadgeVariant, string> = {
  sky: 'bg-sky-light text-sky-dark',
  coral: 'bg-[#FBE9E7] text-coral-dark',
  mint: 'bg-mint-light text-mint-dark',
  sun: 'bg-[#FFF9C4] text-[#F57F17]',
  purple: 'bg-purple-light text-purple-dark',
  pink: 'bg-pink-light text-pink-dark',
  teal: 'bg-teal-light text-teal-dark',
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: 'sm' | 'md'
}

function Badge({
  variant = 'sky',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-nunito font-semibold',
        size === 'sm' && 'px-2 py-0.5 text-xs',
        size === 'md' && 'px-3 py-1 text-sm',
        BADGE_STYLES[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export { Badge }
export type { BadgeProps }
