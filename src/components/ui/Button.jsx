import { cn } from '../../lib/utils'
import { Loader2 } from 'lucide-react'

export default function Button({
  children,
  variant = 'primary',   // primary | gold | outline | ghost | danger
  size = 'md',           // sm | md | lg
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100'

  const variants = {
    primary: 'bg-forest-600 hover:bg-forest-700 text-white shadow-md hover:shadow-lg',
    gold:    'bg-gold-500 hover:bg-gold-600 text-white shadow-md hover:shadow-lg',
    outline: 'border-2 border-forest-600 text-forest-600 hover:bg-forest-600 hover:text-white',
    ghost:   'text-forest-600 hover:bg-forest-50 border border-transparent',
    danger:  'bg-red-50 hover:bg-red-100 text-red-600 border border-red-100',
  }

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  )
}