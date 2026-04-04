'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
}

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  size?: keyof typeof sizeStyles
  children: React.ReactNode
  className?: string
  /** When false, backdrop clicks do not dismiss (e.g. required account gate). */
  closeOnBackdrop?: boolean
  /** When false, no header/footer close control. */
  showCloseButton?: boolean
  /** When false, Escape does not dismiss. */
  closeOnEscape?: boolean
}

export function Modal({
  open,
  onClose,
  title,
  size = 'md',
  children,
  className,
  closeOnBackdrop = true,
  showCloseButton = true,
  closeOnEscape = true,
}: ModalProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) onClose()
    }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose, closeOnEscape])

  if (!mounted || !open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      <div
        className={cn(
          'relative w-full overflow-hidden rounded-panel card-surface shadow-depth-lg',
          'animate-in fade-in-0 zoom-in-95 duration-200',
          sizeStyles[size],
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-md font-semibold text-text-primary">{title}</h2>
            {showCloseButton ? (
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-text-muted transition-colors duration-200 hover:bg-muted hover:text-text-primary"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <span className="w-8" aria-hidden />
            )}
          </div>
        )}

        <div className={cn(!title && 'pt-4', 'max-h-[80vh] overflow-y-auto')}>
          {!title && showCloseButton ? (
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-xl text-text-muted transition-colors duration-200 hover:bg-muted hover:text-text-primary"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

export function ModalBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-6 py-5', className)}>{children}</div>
}

export function ModalFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-2 border-t border-border px-6 py-4',
        className
      )}
    >
      {children}
    </div>
  )
}
