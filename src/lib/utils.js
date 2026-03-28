import { format, addDays } from 'date-fns'

// ─── Safe date parser ─────────────────────────────────────────
// Handles: "2025-01-15", "2025-01-15T12:00:00.000Z", Date object
function safeDate(input) {
  if (!input) return new Date()

  // Already a Date object
  if (input instanceof Date) {
    if (isNaN(input.getTime())) return new Date()
    return input
  }

  // String handling
  if (typeof input === 'string') {
    // Plain date string like "2025-01-15" — add time to avoid timezone shift
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
      return new Date(input + 'T12:00:00')
    }
    // Full ISO string — parse directly
    return new Date(input)
  }

  return new Date(input)
}

// ─── Date helpers ─────────────────────────────────────────────
export const todayStr   = () => format(new Date(), 'yyyy-MM-dd')
export const maxDateStr = () => format(addDays(new Date(), 60), 'yyyy-MM-dd')

export const formatDisplayDate = (input) => {
  try {
    return format(safeDate(input), 'EEEE, d MMMM yyyy')
  } catch {
    return 'Invalid date'
  }
}

export const formatShortDate = (input) => {
  try {
    return format(safeDate(input), 'd MMM yyyy')
  } catch {
    return 'Invalid date'
  }
}

export const formatDateTime = (input) => {
  try {
    return format(safeDate(input), 'd MMM yyyy, h:mm a')
  } catch {
    return 'Invalid date'
  }
}

// ─── Phone validation ─────────────────────────────────────────
export const isValidIndianPhone = (phone) => /^[6-9]\d{9}$/.test(phone)

export const normalizePhone = (phone) =>
  phone.replace(/\D/g, '').replace(/^0/, '').replace(/^91/, '').slice(-10)

// ─── Class merge helper ───────────────────────────────────────
export const cn = (...classes) => classes.filter(Boolean).join(' ')

// ─── Local storage helpers ────────────────────────────────────
export const storage = {
  get:    (key)        => JSON.parse(localStorage.getItem(key) || 'null'),
  set:    (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  remove: (key)        => localStorage.removeItem(key),
}