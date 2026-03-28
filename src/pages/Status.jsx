import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    Phone, Search, ChevronLeft, AlertCircle,
    Loader2, XCircle, Clock, CheckCircle,
    MessageCircle, IndianRupee, Info
} from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import { StatusBadge, PaymentBadge } from '../components/StatusBadge'
import { usePatientAppointments } from '../hooks/useAppointments'
import {
    isValidIndianPhone,
    normalizePhone,
    formatDisplayDate,
    formatShortDate,
    formatDateTime,
} from '../lib/utils'
import { cancelAppointment } from '../lib/api'
import {
    buildCancellationRequestURL,
} from '../lib/whatsapp'
import { CLINIC_PHONE, SERVICES } from '../lib/constants'

// ─── Helpers ──────────────────────────────────────────────────
function getServiceDeposit(name) {
    return SERVICES.find((s) => s.label === name)?.deposit || 0
}
function getServicePrice(name) {
    return SERVICES.find((s) => s.label === name)?.price || 0
}

function getRefundInfo(appointment) {
    const apptTime = new Date(appointment.date).getTime()
    const now = Date.now()
    const hoursLeft = (apptTime - now) / (1000 * 60 * 60)

    if (hoursLeft > 24) {
        return {
            eligible: true,
            label: 'Full refund eligible',
            detail: 'Cancel 24+ hours before → full deposit refunded within 3–5 business days.',
            color: 'text-green-700',
            bg: 'bg-green-50',
            border: 'border-green-200',
            icon: '✅',
        }
    }
    if (hoursLeft > 0) {
        return {
            eligible: false,
            label: 'No refund',
            detail: 'Cancellations within 24 hours of appointment are non-refundable.',
            color: 'text-red-700',
            bg: 'bg-red-50',
            border: 'border-red-200',
            icon: '❌',
        }
    }
    return null
}

// ─── Single appointment card ──────────────────────────────────
function PatientAppointmentCard({ appointment, onCancelClick }) {
    const [expanded, setExpanded] = useState(false)

    const {
        id, name, date, timeSlot, service,
        status, payment, notes, createdAt, cancelReason,
    } = appointment

    // Only show cancel button if CONFIRMED
    const canCancel = status === 'CONFIRMED'
    const isPast = new Date(date) < new Date()

    return (
        <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all ${status === 'PENDING' ? 'border-amber-200' :
                status === 'CONFIRMED' ? 'border-green-200' :
                    status === 'CANCELLED' ? 'border-red-100' :
                        status === 'COMPLETED' ? 'border-blue-100' :
                            'border-cream-200'
            }`}>

            {/* Main row */}
            <div
                className="p-4 flex items-start justify-between gap-3 cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <p className="font-semibold text-gray-900 text-sm">{service}</p>
                        <StatusBadge status={status} />
                        {payment !== 'NONE' && <PaymentBadge payment={payment} />}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            📅 {formatShortDate(date)}
                        </span>
                        <span className="flex items-center gap-1">
                            ⏰ {timeSlot}
                        </span>
                    </div>
                </div>

                {/* Chevron */}
                <svg
                    className={`w-4 h-4 text-gray-400 flex-shrink-0 mt-1 transition-transform ${expanded ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Expanded content */}
            {expanded && (
                <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-3">

                    {/* Info */}
                    <div className="text-xs text-gray-500 space-y-1">
                        {notes && (
                            <div className="bg-gray-50 rounded-xl p-2.5">
                                <p className="font-medium text-gray-500 mb-0.5">Your notes</p>
                                <p>{notes}</p>
                            </div>
                        )}
                        {cancelReason && (
                            <div className="bg-red-50 rounded-xl p-2.5">
                                <p className="font-medium text-red-500 mb-0.5">Cancellation reason</p>
                                <p className="text-red-600">{cancelReason}</p>
                            </div>
                        )}
                        <p className="text-gray-400">Booked on {formatDateTime(createdAt)}</p>
                    </div>

                    {/* Status messages */}
                    {status === 'PENDING' && (
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2">
                            <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-amber-700 text-xs">
                                Awaiting confirmation from our team. You will receive a WhatsApp
                                notification once confirmed.
                            </p>
                        </div>
                    )}
                    {status === 'CONFIRMED' && !isPast && (
                        <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-green-700 text-xs">
                                Your appointment is confirmed! Reminders will be sent 1 day before
                                and 2 hours before your appointment.
                            </p>
                        </div>
                    )}
                    {status === 'COMPLETED' && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            <p className="text-blue-700 text-xs">
                                Thank you for visiting us! We hope you had a great experience.
                            </p>
                        </div>
                    )}
                    {status === 'CANCELLED' && (
                        <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-red-600 text-xs">
                                This appointment has been cancelled.
                                {payment === 'DEPOSIT' && ' If your refund was approved, it will arrive in 3–5 business days.'}
                            </p>
                        </div>
                    )}

                    {/* Cancel button — ONLY visible if CONFIRMED */}
                    {canCancel && !isPast && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onCancelClick(appointment)
                            }}
                            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition-colors mt-1"
                        >
                            <XCircle className="w-3.5 h-3.5" />
                            Cancel this appointment
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

// ─── Cancel Modal ─────────────────────────────────────────────
function CancelModal({ appointment, onClose, onCancelled }) {
    const [reason, setReason] = useState('')
    const [waSent, setWaSent] = useState(false)
    const [cancelling, setCancelling] = useState(false)

    const price = getServicePrice(appointment.service)
    const deposit = getServiceDeposit(appointment.service)
    const refund = getRefundInfo(appointment)
    const isPast = !refund

    // Has payment been made?
    const hasPaidDeposit = appointment.payment === 'DEPOSIT'
    const hasPaidFull = appointment.payment === 'FULL'
    const hasPaid = hasPaidDeposit || hasPaidFull
    const refundAmount = hasPaidFull ? price : hasPaidDeposit ? deposit : 0

    const waUrl = buildCancellationRequestURL({
        name: appointment.name,
        phone: appointment.phone,
        service: appointment.service,
        date: formatShortDate(appointment.date),
        timeSlot: appointment.timeSlot,
        payment: appointment.payment,
        deposit,
        price,
    })

    const handleOpenWhatsApp = () => {
        window.open(waUrl, '_blank')
        setWaSent(true)
    }

    const handleConfirmCancel = async () => {
        if (!reason.trim()) {
            toast.error('Please provide a reason for cancellation.')
            return
        }
        setCancelling(true)
        try {
            await cancelAppointment(appointment.id, reason)
            toast.success('Appointment cancelled.')
            onCancelled(appointment.id)
            onClose()
        } catch (err) {
            toast.error(err.message || 'Cancellation failed.')
        } finally {
            setCancelling(false)
        }
    }

    if (isPast) {
        return (
            <Modal isOpen onClose={onClose} title="Cannot Cancel" size="sm">
                <p className="text-gray-600 text-sm">
                    This appointment has already passed and cannot be cancelled.
                </p>
                <div className="mt-4">
                    <Button variant="primary" fullWidth onClick={onClose}>Close</Button>
                </div>
            </Modal>
        )
    }

    return (
        <Modal
            isOpen
            onClose={onClose}
            title="Cancel Appointment"
            size="xl"
        >
            <div className="space-y-4 h-[60vh] overflow-y-scroll px-3">

                {/* Appointment summary */}
                <div className="bg-gray-50 rounded-xl p-4">
                    <p className="font-semibold text-gray-800 text-sm mb-1">
                        {appointment.service}
                    </p>
                    <p className="text-gray-500 text-xs">
                        {formatDisplayDate(appointment.date)} at {appointment.timeSlot}
                    </p>
                </div>

                {/* Refund eligibility */}
                {refund && (
                    <div className={`rounded-xl p-4 border ${refund.bg} ${refund.border}`}>
                        <div className="flex items-start gap-2">
                            <span className="text-base flex-shrink-0">{refund.icon}</span>
                            <div>
                                <p className={`font-semibold text-sm ${refund.color}`}>
                                    {refund.label}
                                </p>
                                <p className={`text-xs mt-0.5 ${refund.color} opacity-80`}>
                                    {refund.detail}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment / refund info */}
                {hasPaid && refund?.eligible && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <div className="flex items-start gap-2">
                            <IndianRupee className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-blue-800 font-semibold text-sm">
                                    Refund Request: ₹{refundAmount.toLocaleString('en-IN')}
                                </p>
                                <p className="text-blue-600 text-xs mt-0.5">
                                    {hasPaidFull
                                        ? `Full payment of ₹${price.toLocaleString('en-IN')} will be requested for refund.`
                                        : `Deposit of ₹${deposit.toLocaleString('en-IN')} will be requested for refund.`}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* No refund if within 24h */}
                {hasPaid && refund && !refund.eligible && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                        <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-red-700 text-xs">
                                Since you are cancelling within 24 hours, the{' '}
                                {hasPaidFull
                                    ? `₹${price.toLocaleString('en-IN')} payment`
                                    : `₹${deposit.toLocaleString('en-IN')} deposit`}{' '}
                                is <strong>non-refundable</strong> as per our policy.
                            </p>
                        </div>
                    </div>
                )}

                {/* Reason */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Reason for Cancellation *
                    </label>
                    <textarea
                        rows={3}
                        placeholder="Please tell us why you are cancelling..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        maxLength={300}
                        className="form-input resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">{reason.length}/300</p>
                </div>

                {/* STEP: Send WhatsApp first */}
                <div className={`rounded-xl p-4 border ${waSent ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
                    }`}>
                    <div className="flex items-start gap-2 mb-3">
                        <MessageCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${waSent ? 'text-green-600' : 'text-amber-600'}`} />
                        <div>
                            <p className={`font-semibold text-sm ${waSent ? 'text-green-800' : 'text-amber-800'}`}>
                                {waSent
                                    ? '✅ WhatsApp message sent!'
                                    : `Step 1: ${hasPaid && refund?.eligible ? 'Send refund request to admin' : 'Notify admin on WhatsApp'}`}
                            </p>
                            <p className={`text-xs mt-0.5 ${waSent ? 'text-green-600' : 'text-amber-600'}`}>
                                {waSent
                                    ? 'Now you can confirm the cancellation below.'
                                    : hasPaid && refund?.eligible
                                        ? 'You must inform admin about the cancellation and refund request first.'
                                        : 'Please inform admin about your cancellation first.'}
                            </p>
                        </div>
                    </div>

                    {!waSent && (
                        <button
                            onClick={handleOpenWhatsApp}
                            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                        >
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            {hasPaid && refund?.eligible
                                ? `Send Refund Request (₹${refundAmount.toLocaleString('en-IN')})`
                                : 'Send Cancellation to Admin'}
                        </button>
                    )}

                    {waSent && (
                        <p className="text-xs text-green-600 text-center">
                            Admin has been notified. Please confirm the cancellation below.
                        </p>
                    )}
                </div>

                {/* Warning */}
                <div className="flex items-start gap-2 bg-gray-50 rounded-xl p-3">
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-500">
                        To reschedule instead, call{' '}
                        <a href={`tel:${CLINIC_PHONE}`} className="text-forest-600 font-medium">
                            +91 {CLINIC_PHONE}
                        </a>
                    </p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-1">
                    <Button variant="ghost" fullWidth onClick={onClose} disabled={cancelling}>
                        Keep Appointment
                    </Button>
                    <Button
                        variant="danger"
                        fullWidth
                        loading={cancelling}
                        disabled={!waSent || !reason.trim()}
                        onClick={handleConfirmCancel}
                        title={!waSent ? 'Please send WhatsApp message first' : ''}
                    >
                        <XCircle className="w-4 h-4" />
                        Confirm Cancel
                    </Button>
                </div>

                {!waSent && (
                    <p className="text-center text-xs text-gray-400">
                        You must send the WhatsApp message before confirming cancellation
                    </p>
                )}
            </div>
        </Modal>
    )
}

// ─── Main Status Page ─────────────────────────────────────────
export default function Status() {
    const [rawPhone, setRawPhone] = useState('')
    const [cancelTarget, setCancelTarget] = useState(null)

    const { appointments, loading, searched, search, updateStatus } =
        usePatientAppointments()

    const handleSearch = (e) => {
        e.preventDefault()
        const phone = normalizePhone(rawPhone)
        if (!isValidIndianPhone(phone)) {
            toast.error('Please enter a valid 10-digit mobile number.')
            return
        }
        search(phone)
    }

    const handleCancelled = (id) => {
        updateStatus(id, 'CANCELLED')
        window.scrollTo({ top: 0, behavior: 'smooth' })
        toast.success('Your appointment has been cancelled.')
    }

    return (
        <>
            <Navbar />

            {/* Header */}
            <div className="bg-forest-800 pt-24 pb-10 px-4">
                <div className="max-w-xl mx-auto">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-forest-300 hover:text-white text-sm mb-5 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <h1 className="font-display text-3xl font-bold text-white mb-1">
                        My Appointments
                    </h1>
                    <p className="text-forest-400 text-sm">
                        Enter your WhatsApp number to view and manage your bookings.
                    </p>
                </div>
            </div>

            <div className="max-w-xl mx-auto px-4 py-10 pb-20">

                {/* Search form */}
                <form onSubmit={handleSearch} className="card mb-6">
                    <p className="text-sm font-medium text-forest-700 mb-3">
                        Your WhatsApp / Phone Number
                    </p>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <Input
                                name="phone"
                                type="tel"
                                placeholder="9876543210"
                                value={rawPhone}
                                onChange={(e) =>
                                    setRawPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                                }
                                icon={Phone}
                                prefix="+91"
                                maxLength={10}
                            />
                        </div>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                            disabled={rawPhone.length < 10}
                        >
                            <Search className="w-4 h-4" />
                            Search
                        </Button>
                    </div>
                </form>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
                    </div>
                )}

                {/* Results */}
                {!loading && searched && (
                    <>
                        {appointments.length === 0 ? (
                            <div className="card text-center py-12">
                                <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">No appointments found</p>
                                <p className="text-gray-400 text-sm mt-1 mb-4">
                                    No bookings for +91 {normalizePhone(rawPhone)}
                                </p>
                                <Link to="/book">
                                    <Button variant="primary">Book Now</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-forest-700 font-medium text-sm">
                                    Found {appointments.length} appointment
                                    {appointments.length > 1 ? 's' : ''}
                                </p>

                                {/* Cancel policy note */}
                                <div className="bg-cream-100 border border-cream-200 rounded-xl p-3 flex items-start gap-2">
                                    <Info className="w-4 h-4 text-forest-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-forest-700 text-xs leading-relaxed">
                                        You can cancel a <strong>confirmed</strong> appointment. Cancel
                                        24+ hours before for a full deposit refund.
                                    </p>
                                </div>

                                {appointments.map((appt) => (
                                    <PatientAppointmentCard
                                        key={appt.id}
                                        appointment={appt}
                                        onCancelClick={setCancelTarget}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Empty state */}
                {!loading && !searched && (
                    <div className="text-center text-gray-400 text-sm py-8">
                        <p>Can&apos;t find your appointment?</p>
                        <p className="mt-1">
                            Call us at{' '}
                            <a
                                href={`tel:${CLINIC_PHONE}`}
                                className="text-forest-600 font-medium hover:text-forest-800"
                            >
                                +91 {CLINIC_PHONE}
                            </a>
                        </p>
                    </div>
                )}
            </div>

            {/* Cancel modal */}
            {cancelTarget && (
                <CancelModal
                    appointment={cancelTarget}
                    onClose={() => setCancelTarget(null)}
                    onCancelled={handleCancelled}
                />
            )}

            <Footer />
        </>
    )
}