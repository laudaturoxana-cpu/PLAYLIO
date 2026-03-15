'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'
import type { ButtonVariant, ButtonSize } from '@/types'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'bg-coral text-white',
    'hover:bg-coral-dark active:scale-95',
    'shadow-[0_4px_20px_rgba(255,112,67,0.35)]',
    'hover:shadow-[0_6px_24px_rgba(255,112,67,0.45)]',
    'disabled:bg-[#ccc] disabled:shadow-none',
  ].join(' '),

  secondary: [
    'bg-transparent text-coral',
    'border-2 border-coral',
    'hover:bg-coral hover:text-white active:scale-95',
    'disabled:border-[#ccc] disabled:text-[#ccc]',
  ].join(' '),

  ghost: [
    'bg-transparent text-[var(--dark)]',
    'border-2 border-[var(--dark)]',
    'hover:bg-[var(--dark)] hover:text-white active:scale-95',
    'disabled:border-[#ccc] disabled:text-[#ccc]',
  ].join(' '),

  reward: [
    'text-white font-bold',
    'bg-[length:200%_auto]',
    'bg-gradient-to-r from-coral via-sun to-coral-light',
    'animate-shimmer',
    'shadow-[0_4px_20px_rgba(255,112,67,0.4)]',
    'hover:shadow-[0_6px_28px_rgba(255,112,67,0.55)] active:scale-95',
    'disabled:opacity-50',
  ].join(' '),
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm min-h-[36px]',
  md: 'px-6 py-3 text-base min-h-[44px]',
  lg: 'px-8 py-4 text-lg min-h-[56px]',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'rounded-full font-nunito font-semibold',
          'transition-all duration-[var(--t-spring)]',
          'focus-visible:outline-2 focus-visible:outline-sky focus-visible:outline-offset-2',
          'cursor-pointer select-none',
          'disabled:cursor-not-allowed disabled:opacity-60',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <span
              className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
              aria-hidden="true"
            />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
export type { ButtonProps }
