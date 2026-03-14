'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, hint, leftIcon, rightIcon, className, id, ...props },
    ref
  ) => {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2, 7)}`

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="font-nunito text-sm font-semibold text-[var(--dark)]"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-coral" aria-label="câmp obligatoriu">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span
              className="pointer-events-none absolute left-3 text-[var(--gray)]"
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-describedby={
              error
                ? `${inputId}-error`
                : hint
                  ? `${inputId}-hint`
                  : undefined
            }
            aria-invalid={error ? true : undefined}
            className={cn(
              'w-full rounded-[12px] border bg-white font-nunito text-base text-[var(--dark)]',
              'placeholder:text-[var(--gray)]',
              'transition-all duration-[var(--t-normal)]',
              'min-h-[48px] px-4 py-3',
              'focus:outline-none focus:ring-2 focus:ring-sky focus:ring-offset-1',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error
                ? 'border-coral ring-1 ring-coral'
                : 'border-black/10 hover:border-sky',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <span
              className="pointer-events-none absolute right-3 text-[var(--gray)]"
              aria-hidden="true"
            >
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="flex items-center gap-1 text-xs font-medium text-coral"
          >
            <span aria-hidden="true">⚠</span> {error}
          </p>
        )}

        {hint && !error && (
          <p
            id={`${inputId}-hint`}
            className="text-xs text-[var(--gray)]"
          >
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
export type { InputProps }
