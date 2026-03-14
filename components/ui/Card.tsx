import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'
import type { CardVariant, World } from '@/types'

const WORLD_GRADIENTS: Record<World, string> = {
  adventure: 'bg-[linear-gradient(135deg,#E8F5E9_0%,#FFF9C4_100%)]',
  builder: 'bg-[linear-gradient(135deg,#E3F2FD_0%,#EDE7F6_100%)]',
  learning: 'bg-[linear-gradient(135deg,#FFF3E0_0%,#E8F5E9_100%)]',
  jump: 'bg-[linear-gradient(135deg,#FCE4EC_0%,#E8EAF6_100%)]',
}

/* ===== BASE CARD ===== */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  world?: World
  noPadding?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { variant = 'default', world, noPadding = false, className, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-[var(--radius-lg,24px)] overflow-hidden',
          'border border-white/60',
          !noPadding && 'p-6',
          // default
          variant === 'default' && [
            'bg-white',
            'shadow-[var(--shadow-sm)]',
          ],
          // hover — lift on hover
          variant === 'hover' && [
            'bg-white',
            'shadow-[var(--shadow-sm)]',
            'transition-all duration-[250ms] ease-out',
            'hover:-translate-y-2 hover:shadow-[var(--shadow-md)]',
            'cursor-pointer',
          ],
          // world — gradient specific lumii
          variant === 'world' && [
            world ? WORLD_GRADIENTS[world] : 'bg-[var(--light)]',
            'shadow-[var(--shadow-sm)]',
            'transition-all duration-[250ms] ease-out',
            'hover:-translate-y-2 hover:shadow-[var(--shadow-md)]',
          ],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

/* ===== CARD HEADER ===== */
const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
)
CardHeader.displayName = 'CardHeader'

/* ===== CARD TITLE ===== */
const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('font-fredoka text-xl text-[var(--dark)]', className)}
      {...props}
    >
      {children}
    </h3>
  )
)
CardTitle.displayName = 'CardTitle'

/* ===== CARD CONTENT ===== */
const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('text-[var(--gray)] text-sm leading-relaxed', className)} {...props}>
      {children}
    </div>
  )
)
CardContent.displayName = 'CardContent'

/* ===== CARD FOOTER ===== */
const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-4 pt-4 border-t border-black/5 flex items-center gap-2', className)}
      {...props}
    >
      {children}
    </div>
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardContent, CardFooter }
export type { CardProps }
