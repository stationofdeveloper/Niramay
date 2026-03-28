import { useState, useEffect } from 'react'
import { User, Phone, Mail, Calendar, FileText, RefreshCw } from 'lucide-react'
import Modal from './ui/Modal'
import Button from './ui/Button'
import { Select } from './ui/Input'
import { SERVICES, TIME_SLOTS } from '../lib/constants'
import {
  isValidIndianPhone,
  normalizePhone,
  cn,
} from '../lib/utils'
import { createAppointment, fetchAvailability } from '../lib/api'
import toast from 'react-hot-toast'

const SERVICE_OPTIONS = SERVICES.map((s) => ({
  value: s.label,
  label: `${s.icon} ${s.label} — ₹${s.price.toLocaleString('en-IN')}`,
}))

const STATUS_OPTIONS = [
  { value: 'CONFIRMED', label: '✅ Confirmed'   },
  { value: 'PENDING',   label: '⏳ Pending'     },
]

const PAYMENT_OPTIONS = [
  { value: 'NONE',    label: '⬜ No Payment'             },
  { value: 'DEPOSIT', label: '🟡 Deposit Received'       },
  { value: 'FULL',    label: '🟢 Full Payment Received'  },
]

// ─── Admin slot picker — shows available + booked ─────────────
function AdminSlotPicker({ date, selected, onSelect }) {
  const [slotStatuses, setSlotStatuses] = useState({})
  const [loading, setLoading]           = useState(false)

  // Fetch slot availability when date changes
  useEffect(() => {
    if (!date) {
      setSlotStatuses({})
      return
    }

    setLoading(true)
    const loadingMap = {}
    TIME_SLOTS.forEach((s) => { loadingMap[s] = 'loading' })
    setSlotStatuses(loadingMap)

    fetchAvailability(date)
      .then((data) => {
        const map = {}
        TIME_SLOTS.forEach((slot) => {
          // Admin can see booked slots but NOT blocked by past time
          // Admin CAN book any slot (even past time on today)
          map[slot] = (data.bookedSlots || []).includes(slot)
            ? 'booked'
            : 'available'
        })
        setSlotStatuses(map)
      })
      .catch(() => {
        const fallback = {}
        TIME_SLOTS.forEach((s) => { fallback[s] = 'available' })
        setSlotStatuses(fallback)
        toast.error('Could not load slot availability.')
      })
      .finally(() => setLoading(false))
  }, [date])

  const availableCount = Object.values(slotStatuses).filter((v) => v === 'available').length
  const bookedCount    = Object.values(slotStatuses).filter((v) => v === 'booked').length

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-forest-700">
          Time Slot *
        </label>
        {date && !loading && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-600 font-medium">{availableCount} free</span>
            <span className="text-gray-300">·</span>
            <span className="text-red-500 font-medium">{bookedCount} booked</span>
          </div>
        )}
        {loading && (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Checking...
          </span>
        )}
      </div>

      {!date ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs">Select a date first to see slot availability</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((slot) => {
              const status      = slotStatuses[slot] || 'loading'
              const isSelected  = selected === slot
              const isAvailable = status === 'available'
              const isBooked    = status === 'booked'
              const isLoading   = status === 'loading'

              return (
                <button
                  key={slot}
                  type="button"
                  // Admin can select ANY slot including booked ones (override)
                  onClick={() => onSelect(slot)}
                  className={cn(
                    'relative py-2.5 px-2 rounded-xl text-xs font-medium transition-all border',
                    isLoading   && 'shimmer border-cream-200 text-transparent cursor-wait',
                    isSelected  && 'bg-forest-600 border-forest-600 text-white shadow-md',
                    isBooked    && !isSelected && 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100',
                    isAvailable && !isSelected && 'bg-white border-forest-200 text-forest-700 hover:border-forest-400 hover:bg-forest-50',
                  )}
                >
                  <span className={isLoading ? 'invisible' : ''}>{slot}</span>

                  {/* Booked indicator */}
                  {isBooked && !isSelected && (
                    <span className="absolute top-0.5 right-0.5 text-[8px] text-red-400 leading-none">●</span>
                  )}
                  {/* Selected indicator */}
                  {isSelected && (
                    <span className="absolute top-0.5 right-0.5 text-[8px] text-gold-300 leading-none">✓</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-forest-600 rounded-sm inline-block" />
              Selected
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-white border border-forest-200 rounded-sm inline-block" />
              Available
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-red-50 border border-red-200 rounded-sm inline-block" />
              Booked (override possible)
            </span>
          </div>

          {/* Override warning */}
          {selected && slotStatuses[selected] === 'booked' && (
            <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl p-2.5">
              <p className="text-xs text-amber-700">
                ⚠️ This slot is already booked. Adding an appointment here will
                create a double-booking. Proceed only if intended.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function AddAppointmentModal({ isOpen, onClose, onAdded }) {
  const emptyForm = {
    name:     '',
    phone:    '',
    email:    '',
    service:  SERVICES[0].label,
    date:     '',
    timeSlot: '',
    notes:    '',
    status:   'CONFIRMED',
    payment:  'NONE',
  }

  const [form, setForm]           = useState(emptyForm)
  const [errors, setErrors]       = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm(emptyForm)
      setErrors({})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const set = (field) => (e) => {
    const val = field === 'phone'
      ? e.target.value.replace(/\D/g, '').slice(0, 10)
      : e.target.value
    setForm((p) => ({ ...p, [field]: val }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim() || form.name.trim().length < 2)
      errs.name = 'Enter full name (min 2 characters)'
    if (!isValidIndianPhone(form.phone))
      errs.phone = 'Enter valid 10-digit Indian number'
    if (!form.date)
      errs.date = 'Select appointment date'
    if (!form.timeSlot)
      errs.timeSlot = 'Select a time slot'
    return errs
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSubmitting(true)
    try {
      await createAppointment({
        ...form,
        phone: normalizePhone(form.phone),
      })
      toast.success(`✅ Appointment added for ${form.name}!`)
      onAdded()
      onClose()
    } catch (err) {
      if (err.message?.includes('slot')) {
        toast.error('That slot is already taken. Choose a different time or override carefully.')
        setErrors({ timeSlot: 'Slot conflict — consider overriding' })
      } else {
        toast.error(err.message || 'Failed to add appointment.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Patient Appointment"
      size="xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            loading={submitting}
            onClick={handleSubmit}
          >
            <User className="w-4 h-4" />
            Add Appointment
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 h-[70vh] overflow-y-scroll px-2">
        <div className="grid sm:grid-cols-2 gap-4 ">

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-forest-700">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Patient full name"
                value={form.name}
                onChange={set('name')}
                className={`form-input pl-10 ${errors.name ? 'border-red-400' : ''}`}
              />
            </div>
            {errors.name && <p className="text-xs text-red-500">⚠ {errors.name}</p>}
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-forest-700">
              Phone / WhatsApp *
            </label>
            <div className="relative flex items-center">
              <Phone className="absolute left-3.5 w-4 h-4 text-forest-400 pointer-events-none" />
              <span className="absolute left-10 text-gray-400 text-sm pointer-events-none">+91</span>
              <input
                type="tel"
                placeholder="9876543210"
                value={form.phone}
                onChange={set('phone')}
                maxLength={10}
                className={`form-input pl-16 ${errors.phone ? 'border-red-400' : ''}`}
              />
            </div>
            {errors.phone && <p className="text-xs text-red-500">⚠ {errors.phone}</p>}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-forest-700">
              Email (optional)
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400 pointer-events-none" />
              <input
                type="email"
                placeholder="patient@gmail.com"
                value={form.email}
                onChange={set('email')}
                className="form-input pl-10"
              />
            </div>
          </div>

          {/* Service */}
          <Select
            label="Service *"
            name="service"
            value={form.service}
            onChange={set('service')}
            options={SERVICE_OPTIONS}
          />

          {/* Status */}
          <Select
            label="Booking Status"
            name="status"
            value={form.status}
            onChange={set('status')}
            options={STATUS_OPTIONS}
          />

          {/* Payment */}
          <Select
            label="Payment Status"
            name="payment"
            value={form.payment}
            onChange={set('payment')}
            options={PAYMENT_OPTIONS}
          />

          {/* Date — admin can pick any date including past */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-forest-700">
              Date *
              <span className="ml-2 text-xs text-forest-400 font-normal">
                (past dates allowed for admin)
              </span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400 pointer-events-none" />
              <input
                type="date"
                value={form.date}
                onChange={(e) => {
                  setForm((p) => ({ ...p, date: e.target.value, timeSlot: '' }))
                  if (errors.date) setErrors((p) => ({ ...p, date: '' }))
                }}
                className={`form-input pl-10 cursor-pointer ${errors.date ? 'border-red-400' : ''}`}
              />
            </div>
            {errors.date && <p className="text-xs text-red-500">⚠ {errors.date}</p>}
          </div>
        </div>

        {/* Slot Picker — full width */}
        <div>
          <AdminSlotPicker
            date={form.date}
            selected={form.timeSlot}
            onSelect={(slot) => {
              setForm((p) => ({ ...p, timeSlot: slot }))
              if (errors.timeSlot) setErrors((p) => ({ ...p, timeSlot: '' }))
            }}
          />
          {errors.timeSlot && (
            <p className="text-xs text-red-500 mt-1">⚠ {errors.timeSlot}</p>
          )}
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-forest-700">
            Notes (optional)
          </label>
          <div className="relative">
            <FileText className="absolute left-3.5 top-3 w-4 h-4 text-forest-400 pointer-events-none" />
            <textarea
              rows={2}
              placeholder="Any health concerns, special requirements..."
              value={form.notes}
              onChange={set('notes')}
              maxLength={500}
              className="form-input pl-10 resize-none"
            />
          </div>
        </div>
      </form>
    </Modal>
  )
}