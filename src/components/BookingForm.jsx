import { useState } from 'react'
import { User, Phone, Mail, ChevronDown, Info } from 'lucide-react'
import Input, { Textarea } from './ui/Input'
import Button from './ui/Button'
import { SERVICES } from '../lib/constants'
import { isValidIndianPhone, normalizePhone } from '../lib/utils'

export default function BookingForm({ initialService = '', onNext }) {
  const defaultService = SERVICES.find(
    (s) => s.label === initialService
  ) || SERVICES[0]

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: defaultService.label,
    notes: '',
  })

  const [errors, setErrors] = useState({})

  const selectedService = SERVICES.find((s) => s.label === form.service) || SERVICES[0]

  const set = (field) => (e) => {
    let val = e.target.value
    if (field === 'phone') {
      val = val.replace(/\D/g, '').slice(0, 10)
    }
    setForm((prev) => ({ ...prev, [field]: val }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}

    // Name validation
    if (!form.name.trim() || form.name.trim().length < 2) {
      errs.name = 'Please enter your full name (minimum 2 characters).'
    } else if (!/^[a-zA-Z\s]+$/.test(form.name.trim())) {
      errs.name = 'Name should contain only letters and spaces.'
    }

    // Phone validation — Indian mobile numbers start with 6,7,8,9
    if (!form.phone || form.phone.length < 10) {
      errs.phone = 'Please enter a 10-digit mobile number.'
    } else if (!isValidIndianPhone(form.phone)) {
      errs.phone = 'Enter a valid Indian mobile number starting with 6, 7, 8, or 9.'
    }

    // Email validation — only Gmail allowed
    if (!form.email.trim()) {
      errs.email = 'Email is required.'
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(form.email.trim())) {
      errs.email = 'Please enter a valid Gmail address (must end with @gmail.com).'
    }

    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onNext({
      ...form,
      phone: normalizePhone(form.phone),
      deposit: selectedService.deposit,
      price: selectedService.price,
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">

      {/* Name */}
      <Input
        label="Full Name"
        name="name"
        placeholder="Enter your full name"
        value={form.name}
        onChange={set('name')}
        icon={User}
        required
        error={errors.name}
      />

      {/* Phone */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-forest-700">
          WhatsApp / Phone Number <span className="text-red-400">*</span>
        </label>
        <div className="relative flex items-center">
          <Phone className="absolute left-3.5 w-4 h-4 text-forest-400 pointer-events-none" />
          <span className="absolute left-10 text-gray-400 text-sm pointer-events-none">
            +91
          </span>
          <input
            type="tel"
            placeholder="9876543210"
            value={form.phone}
            onChange={set('phone')}
            maxLength={10}
            className={`form-input pl-16 ${errors.phone ? 'border-red-400 focus:ring-red-400' : ''}`}
          />
        </div>
        {errors.phone && (
          <p className="text-xs text-red-500">⚠ {errors.phone}</p>
        )}
        <p className="text-xs text-gray-400">
          Appointment confirmations and reminders will be sent here
        </p>
      </div>

      {/* Email — Gmail only */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-forest-700">
          Gmail Address <span className="text-red-400">*</span>
        </label>
        <div className="relative flex items-center">
          <Mail className="absolute left-3.5 w-4 h-4 text-forest-400 pointer-events-none" />
          <input
            type="email"
            placeholder="yourname@gmail.com"
            value={form.email}
            onChange={set('email')}
            className={`form-input pl-10 ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500">⚠ {errors.email}</p>
        )}
        {/* Show checkmark when valid gmail */}
        {!errors.email && /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(form.email) && (
          <p className="text-xs text-green-600">✓ Valid Gmail address</p>
        )}
      </div>

      {/* Service dropdown with prices */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-forest-700">
          Service <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <select
            value={form.service}
            onChange={set('service')}
            className="form-input appearance-none pr-10 cursor-pointer "
          >
            {SERVICES.map((s) => (
              <option key={s.id} value={s.label} className="flex items-center justify-between">
                {s.icon}  {s.label}  —  ₹{s.price.toLocaleString('en-IN')}
                <div className="text-xs text-gray-400">
                  (Deposit: ₹{s.deposit})
                </div>
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Price info card */}
        <div className="bg-forest-50 border border-forest-100 rounded-xl p-4 mt-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-forest-800 font-semibold text-sm">
                {selectedService.icon} {selectedService.label}
              </p>
              <p className="text-gray-500 text-xs mt-0.5">
                Duration: {selectedService.duration}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-forest-900 font-bold text-lg">
                ₹{selectedService.price.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-gray-400">Total fee</p>
            </div>
          </div>

          {/* Deposit highlight */}
          <div className="mt-3 pt-3 border-t border-forest-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-gold-600" />
              <span className="text-xs text-gold-700 font-medium">
                Refundable deposit to confirm booking
              </span>
            </div>
            <span className="text-gold-700 font-bold text-base">
              ₹{selectedService.deposit.toLocaleString('en-IN')}
            </span>
          </div>

          <p className="text-xs text-gray-400 mt-2">
            ✓ Deposit is fully refundable if cancelled 24hrs before appointment
          </p>
        </div>
      </div>

      {/* Notes */}
      <Textarea
        label="Health Concerns / Notes"
        name="notes"
        placeholder="E.g. chronic constipation, back pain, first visit..."
        value={form.notes}
        onChange={set('notes')}
        rows={3}
        maxLength={500}
        hint="Optional — helps us prepare better for your session"
      />

      <Button type="submit" variant="primary" fullWidth size="lg">
        Next: Choose Date & Time →
      </Button>
    </form>
  )
}