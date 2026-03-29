import { STATUS_META, PAYMENT_META } from '../lib/constants'
import { cn } from '../lib/utils'

export function StatusBadge({ status, className = '' }) {
  const meta = STATUS_META[status]
  if (!meta) return null
  return (
    <span className={cn(meta.badgeClass, className)}>
      {meta.icon} {meta.label}
    </span>
  )
}

export function PaymentBadge({ payment, className = '' }) {
  const meta = PAYMENT_META[payment]
  if (!meta) return null
  return (
    <span className={cn(meta.badgeClass, className)}>
      {meta.label}
    </span>
  )
}