// import { useState, useEffect } from 'react'
// import { Link, useSearchParams } from 'react-router-dom'
// import {
//     ChevronLeft, Calendar, MessageCircle,
//     CheckCircle, AlertCircle, Loader2, CreditCard
// } from 'lucide-react'
// import PaymentButton from '../components/PaymentButton'
// import toast from 'react-hot-toast'
// import Navbar from '../components/Navbar'
// import Footer from '../components/Footer'
// import BookingForm from '../components/BookingForm'
// import SlotPicker from '../components/SlotPicker'
// import Button from '../components/ui/Button'
// import { useAvailability } from '../hooks/useAvailability'
// import { createAppointment } from '../lib/api'
// import { buildBookingURL } from '../lib/whatsapp'
// import { formatDisplayDate, formatShortDate, todayStr, maxDateStr } from '../lib/utils'

// // ─── Step indicator ───────────────────────────────────────────
// function StepBar({ current }) {
//     const steps = [
//         { n: 1, label: 'Your Details' },
//         { n: 2, label: 'Choose Slot' },
//         { n: 3, label: 'Review' },
//         { n: 4, label: 'Payment' },
//     ]
//     return (
//         <div className="flex items-center gap-2 mt-6">
//             {steps.map(({ n, label }, idx) => (
//                 <div key={n} className="flex items-center gap-2">
//                     <div className="flex items-center gap-2">
//                         <div
//                             className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${current === n
//                                 ? 'bg-gold-500 border-gold-500 text-white'
//                                 : current > n
//                                     ? 'bg-forest-500 border-forest-500 text-white'
//                                     : 'border-forest-500/50 text-forest-400'
//                                 }`}
//                         >
//                             {current > n ? '✓' : n}
//                         </div>
//                         <span
//                             className={`text-sm hidden sm:block transition-colors ${current === n
//                                 ? 'text-gold-300 font-medium'
//                                 : current > n
//                                     ? 'text-forest-300'
//                                     : 'text-forest-500'
//                                 }`}
//                         >
//                             {label}
//                         </span>
//                     </div>
//                     {idx < steps.length - 1 && (
//                         <div className="w-8 h-0.5 bg-forest-600 mx-1" />
//                     )}
//                 </div>
//             ))}
//         </div>
//     )
// }

// // ─── Success screen ───────────────────────────────────────────
// function SuccessScreen({ patientData, selectedDate, selectedSlot, whatsappUrl }) {
//     return (
//         <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-12">
//             <div className="max-w-md w-full">
//                 <div className="card text-center">
//                     <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                         <CheckCircle className="w-10 h-10 text-green-600" />
//                     </div>

//                     <h2 className="font-display text-2xl font-bold text-forest-900 mb-2">
//                         Request Sent! 🌿
//                     </h2>
//                     <p className="text-gray-600 text-sm leading-relaxed mb-2">
//                         Your appointment request for{' '}
//                         <strong>{patientData.service}</strong> on{' '}
//                         <strong>{formatDisplayDate(selectedDate)}</strong> at{' '}
//                         <strong>{selectedSlot}</strong> has been recorded.
//                     </p>
//                     <p className="text-gray-400 text-sm mb-6">
//                         Click below to confirm via WhatsApp. Once our admin confirms,
//                         you will receive a WhatsApp notification.
//                     </p>

//                     <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
//                         <Button variant="gold" fullWidth size="lg" className="mb-3">
//                             <MessageCircle className="w-5 h-5" />
//                             Confirm via WhatsApp
//                         </Button>
//                     </a>

//                     <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-5 text-left">
//                         <div className="flex items-start gap-2">
//                             <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
//                             <p className="text-amber-700 text-xs leading-relaxed">
//                                 Your appointment is <strong>pending confirmation</strong>.
//                                 After sending the WhatsApp message, our team will confirm
//                                 and update you. You can check status using your phone number.
//                             </p>
//                         </div>
//                     </div>

//                     <div className="flex gap-3">
//                         <Link to="/status" className="flex-1">
//                             <Button variant="primary" fullWidth>Check Status</Button>
//                         </Link>
//                         <Link to="/" className="flex-1">
//                             <Button variant="outline" fullWidth>Home</Button>
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// // ─── Main booking page ────────────────────────────────────────
// export default function Book() {
//     const [searchParams] = useSearchParams()
//     const initialService = searchParams.get('service') || ''

//     const [step, setStep] = useState(1)
//     const [patientData, setPatientData] = useState(null)
//     const [selectedDate, setSelectedDate] = useState('')
//     const [selectedSlot, setSelectedSlot] = useState('')
//     const [submitting, setSubmitting] = useState(false)
//     const [done, setDone] = useState(false)
//     const [whatsappUrl, setWhatsappUrl] = useState('')

//     const { slotStatuses } = useAvailability(selectedDate)

//     // Reset slot when date changes
//     useEffect(() => { setSelectedSlot('') }, [selectedDate])

//     // ── Step 1 → 2 ──────────────────────────────────────────────
//     const handleDetailsNext = (data) => {
//         setPatientData(data)
//         setStep(2)
//         window.scrollTo({ top: 0, behavior: 'smooth' })
//     }

//     // ── Step 2 → 3 ──────────────────────────────────────────────
//     const handleSlotNext = () => {
//         if (!selectedDate) { toast.error('Please select a date.'); return }
//         if (!selectedSlot) { toast.error('Please select a time slot.'); return }
//         setStep(3)
//         window.scrollTo({ top: 0, behavior: 'smooth' })
//     }

//     // ── Step 3: confirm & submit ─────────────────────────────────
//     // const handleConfirm = async () => {
//     //     setSubmitting(true)
//     //     try {
//     //         const res = await createAppointment({
//     //             ...patientData,
//     //             date: selectedDate,
//     //             timeSlot: selectedSlot,
//     //         })

//     //         const url = buildBookingURL({
//     //             name: patientData.name,
//     //             service: patientData.service,
//     //             date: formatDisplayDate(selectedDate),
//     //             timeSlot: selectedSlot,
//     //         })

//     //         setWhatsappUrl(url)
//     //         setDone(true)
//     //         window.scrollTo({ top: 0, behavior: 'smooth' })

//     //     } catch (err) {
//     //         const msg = err.message || ''

//     //         // Only show "slot taken" if backend explicitly said so
//     //         if (msg.includes('This slot is no longer available') || msg.includes('slotTaken')) {
//     //             toast.error('This slot was just taken! Please choose another time.')
//     //             setStep(2)
//     //             setSelectedSlot('')
//     //         } else if (msg.includes('reach database') || msg.includes('fetch') || msg.includes('connect')) {
//     //             toast.error('Cannot connect to server. Please make sure backend is running.')
//     //         } else {
//     //             toast.error(msg || 'Booking failed. Please try again.')
//     //         }
//     //     } finally {
//     //         setSubmitting(false)
//     //     }
//     // }
//     const handleGoToPayment = () => {
//         setStep(4)
//         window.scrollTo({ top: 0, behavior: 'smooth' })
//     }
//     // ── Success screen ────────────────────────────────────────────
//     if (done) {
//         return (
//             <SuccessScreen
//                 patientData={patientData}
//                 selectedDate={selectedDate}
//                 selectedSlot={selectedSlot}
//                 whatsappUrl={whatsappUrl}
//             />
//         )
//     }

//     return (
//         <>
//             <Navbar />

//             {/* Header */}
//             <div className="bg-forest-800 pt-24 pb-10 px-4">
//                 <div className="max-w-xl mx-auto">
//                     <Link
//                         to="/"
//                         className="inline-flex items-center gap-1.5 text-forest-300 hover:text-white text-sm mb-5 transition-colors"
//                     >
//                         <ChevronLeft className="w-4 h-4" />
//                         Back to Home
//                     </Link>
//                     <h1 className="font-display text-3xl lg:text-4xl font-bold text-white mb-1">
//                         Book Your Appointment
//                     </h1>
//                     <p className="text-forest-400 text-sm">
//                         Niramay Ayurvedic Clinik · Real-time availability
//                     </p>
//                     <StepBar current={step} />
//                 </div>
//             </div>

//             {/* Form area */}
//             <div className="max-w-xl mx-auto px-4 py-10 pb-20">

//                 {/* ── STEP 1: Details ───────────────────────────────── */}
//                 {step === 1 && (
//                     <div className="card">
//                         <h2 className="font-display text-xl font-bold text-forest-900 mb-5">
//                             Patient Details
//                         </h2>
//                         <BookingForm
//                             initialService={initialService}
//                             onNext={handleDetailsNext}
//                         />
//                     </div>
//                 )}

//                 {/* ── STEP 2: Date & Slot ───────────────────────────── */}
//                 {step === 2 && (
//                     <div className="space-y-4">
//                         <button
//                             onClick={() => setStep(1)}
//                             className="inline-flex items-center gap-1.5 text-forest-600 hover:text-forest-800 text-sm"
//                         >
//                             <ChevronLeft className="w-4 h-4" /> Back
//                         </button>

//                         <div className="card space-y-6">
//                             <h2 className="font-display text-xl font-bold text-forest-900">
//                                 Select Date & Time
//                             </h2>

//                             {/* Date picker */}
//                             <div>
//                                 <label className="block text-sm font-medium text-forest-700 mb-2">
//                                     <Calendar className="inline w-4 h-4 mr-1" />
//                                     Preferred Date *
//                                 </label>
//                                 <input
//                                     type="date"
//                                     min={todayStr()}
//                                     max={maxDateStr()}
//                                     value={selectedDate}
//                                     onChange={(e) => {
//                                         const picked = e.target.value
//                                         // Double-check: block any past date even if typed manually
//                                         if (picked && picked < todayStr()) {
//                                             toast.error('Please select today or a future date.')
//                                             return
//                                         }
//                                         setSelectedDate(picked)
//                                     }}
//                                     onKeyDown={(e) => e.preventDefault()}  // prevent manual typing
//                                     className="form-input cursor-pointer"
//                                 />
//                                 {selectedDate && selectedDate < todayStr() && (
//                                     <p className="text-xs text-red-500 mt-1">
//                                         ⚠ Please select today or a future date.
//                                     </p>
//                                 )}
//                                 <p className="text-xs text-gray-400 mt-1">
//                                     Bookings available up to 60 days in advance
//                                 </p>
//                             </div>

//                             {/* Slot picker — only shows once date is selected */}
//                             {selectedDate && (
//                                 <SlotPicker
//                                     slotStatuses={slotStatuses}
//                                     selected={selectedSlot}
//                                     onSelect={setSelectedSlot}
//                                 />
//                             )}
//                         </div>

//                         <Button
//                             variant="primary"
//                             fullWidth
//                             size="lg"
//                             disabled={!selectedDate || !selectedSlot}
//                             onClick={handleSlotNext}
//                         >
//                             Next: Confirm Booking →
//                         </Button>
//                     </div>
//                 )}

//                 {/* ── STEP 3: Review & Confirm ──────────────────────── */}
//                 {step === 3 && (
//                     <div className="space-y-4">
//                         <button
//                             onClick={() => setStep(2)}
//                             className="inline-flex items-center gap-1.5 text-forest-600 hover:text-forest-800 text-sm"
//                         >
//                             <ChevronLeft className="w-4 h-4" /> Back
//                         </button>

//                         <div className="card">
//                             <h2 className="font-display text-xl font-bold text-forest-900 mb-5">
//                                 Review Your Appointment
//                             </h2>

//                             {/* Summary */}
//                             <div className="bg-forest-50 rounded-2xl p-5 space-y-3 mb-5">
//                                 {[
//                                     { label: 'Name', value: patientData?.name },
//                                     { label: 'Phone', value: `+91 ${patientData?.phone}` },
//                                     { label: 'Service', value: patientData?.service },
//                                     { label: 'Date', value: formatDisplayDate(selectedDate) },
//                                     { label: 'Time', value: selectedSlot },
//                                     ...(patientData?.notes
//                                         ? [{ label: 'Notes', value: patientData.notes }]
//                                         : []),
//                                 ].map(({ label, value }) => (
//                                     <div
//                                         key={label}
//                                         className="flex justify-between items-start gap-4"
//                                     >
//                                         <span className="text-forest-500 text-sm">{label}</span>
//                                         <span className="text-forest-900 text-sm font-semibold text-right">
//                                             {value}
//                                         </span>
//                                     </div>
//                                 ))}
//                             </div>

//                             {/* Info note */}
//                             <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-5">
//                                 <div className="flex items-start gap-2">
//                                     <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
//                                     <p className="text-amber-700 text-xs leading-relaxed">
//                                         After confirming, you&apos;ll be redirected to WhatsApp to
//                                         send us your booking message. Our team will confirm your
//                                         slot and notify you. Reminders will be sent{' '}
//                                         <strong>1 day before</strong> and{' '}
//                                         <strong>2 hours before</strong> your appointment.
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* <Button
//                                 variant="gold"
//                                 fullWidth
//                                 size="lg"
//                                 loading={submitting}
//                                 onClick={handleConfirm}
//                             >
//                                 <MessageCircle className="w-5 h-5" />
//                                 Confirm & Open WhatsApp
//                             </Button> */}

//                             <Button
//                                 variant="gold"
//                                 fullWidth
//                                 size="lg"
//                                 onClick={handleGoToPayment}
//                             >
//                                 <CreditCard className="w-5 h-5" />
//                                 Proceed to Payment →
//                             </Button>

//                             <p className="text-center text-gray-400 text-xs mt-3">
//                                 By booking you agree to receive WhatsApp reminders on +91{' '}
//                                 {patientData?.phone}
//                             </p>
//                         </div>
//                     </div>
//                 )}


//                 {/* ── STEP 4: Payment ──────────────────────────────────── */}
//                 {step === 4 && (
//                     <div className="space-y-4">
//                         <button
//                             onClick={() => setStep(3)}
//                             className="inline-flex items-center gap-1.5 text-forest-600 hover:text-forest-800 text-sm"
//                         >
//                             <ChevronLeft className="w-4 h-4" /> Back
//                         </button>

//                         <div className="card">
//                             <h2 className="font-display text-xl font-bold text-forest-900 mb-2">
//                                 Pay Deposit to Confirm
//                             </h2>
//                             <p className="text-gray-500 text-sm mb-5">
//                                 Pay a refundable deposit to secure your appointment slot.
//                             </p>

//                             {/* Deposit summary */}
//                             <div className="bg-forest-50 rounded-2xl p-5 mb-5">
//                                 <div className="flex justify-between items-center mb-3">
//                                     <span className="text-forest-600 text-sm">Service</span>
//                                     <span className="font-semibold text-forest-900 text-sm">
//                                         {patientData?.service}
//                                     </span>
//                                 </div>
//                                 <div className="flex justify-between items-center mb-3">
//                                     <span className="text-forest-600 text-sm">Date & Time</span>
//                                     <span className="font-semibold text-forest-900 text-sm">
//                                         {formatShortDate(selectedDate)}, {selectedSlot}
//                                     </span>
//                                 </div>
//                                 <div className="flex justify-between items-center mb-3">
//                                     <span className="text-forest-600 text-sm">Total Fee</span>
//                                     <span className="font-semibold text-forest-900 text-sm">
//                                         ₹{patientData?.price?.toLocaleString('en-IN')}
//                                     </span>
//                                 </div>
//                                 <div className="border-t border-forest-200 pt-3 flex justify-between items-center">
//                                     <div>
//                                         <span className="text-forest-800 font-bold">Deposit to Pay Now</span>
//                                         <p className="text-xs text-gray-400 mt-0.5">
//                                             Refundable if cancelled 24hrs before
//                                         </p>
//                                     </div>
//                                     <span className="text-2xl font-display font-bold text-forest-700">
//                                         ₹{patientData?.deposit?.toLocaleString('en-IN')}
//                                     </span>
//                                 </div>
//                             </div>

//                             {/* Google Pay button */}
//                             <PaymentButton
//                                 amount={patientData?.deposit || 0}
//                                 patientData={patientData}
//                                 selectedDate={selectedDate}
//                                 selectedSlot={selectedSlot}
//                                 onSuccess={(appointmentId) => {
//                                     setDone(true)
//                                     window.scrollTo({ top: 0, behavior: 'smooth' })
//                                 }}
//                             />

//                             <div className="mt-4 flex items-center justify-center gap-2 text-gray-400 text-xs">
//                                 <span>🔒</span>
//                                 <span>Secured by Google Pay · UPI · 256-bit encryption</span>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             <Footer />
//         </>
//     )
// }

import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ChevronLeft, Calendar, MessageCircle,
  CheckCircle, AlertCircle, Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'
import { gsap } from 'gsap'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BookingForm from '../components/BookingForm'
import SlotPicker from '../components/SlotPicker'
import Button from '../components/ui/Button'
import { useAvailability } from '../hooks/useAvailability'
import { createAppointment } from '../lib/api'
import { buildBookingURL } from '../lib/whatsapp'
import { formatDisplayDate, formatShortDate, todayStr, maxDateStr } from '../lib/utils'
import { SERVICES } from '../lib/constants'

// ─── Step Bar ─────────────────────────────────────────────────
function StepBar({ current }) {
  const steps = [
    { n: 1, label: 'Your Details' },
    { n: 2, label: 'Choose Slot'  },
    { n: 3, label: 'Confirm'      },
  ]
  return (
    <div className="flex items-center gap-2 mt-6">
      {steps.map(({ n, label }, idx) => (
        <div key={n} className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
              current === n
                ? 'bg-gold-500 border-gold-500 text-white scale-110'
                : current > n
                ? 'bg-forest-500 border-forest-500 text-white'
                : 'border-forest-500/50 text-forest-400'
            }`}>
              {current > n ? '✓' : n}
            </div>
            <span className={`text-sm hidden sm:block transition-colors ${
              current === n ? 'text-gold-300 font-medium'
              : current > n ? 'text-forest-300'
              : 'text-forest-500'
            }`}>
              {label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`h-0.5 mx-1 transition-all duration-500 ${
              current > idx + 1 ? 'bg-forest-400 w-8' : 'bg-forest-700 w-8'
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Animated field wrapper ───────────────────────────────────
function AnimatedField({ children, delay = 0 }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', delay }
    )
  }, [delay])
  return <div ref={ref} className="form-field">{children}</div>
}

// ─── Success screen ───────────────────────────────────────────
function SuccessScreen({ patientData, selectedDate, selectedSlot }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const items = ref.current.querySelectorAll('.success-item')
    gsap.fromTo(
      ref.current,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' }
    )
    gsap.fromTo(
      items,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 0.3 }
    )
  }, [])

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div ref={ref} className="card text-center" style={{ opacity: 0 }}>
          <div className="success-item w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="success-item font-display text-2xl font-bold text-forest-900 mb-2">
            Request Sent! 🌿
          </h2>
          <p className="success-item text-gray-600 text-sm leading-relaxed mb-6">
            Your booking request for <strong>{patientData?.service}</strong> on{' '}
            <strong>{formatDisplayDate(selectedDate)}</strong> at{' '}
            <strong>{selectedSlot}</strong> has been sent via WhatsApp.
          </p>
          <div className="success-item bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-amber-700 text-xs leading-relaxed">
                Your appointment is <strong>pending confirmation</strong>. Our
                team will confirm shortly via WhatsApp.
              </p>
            </div>
          </div>
          <div className="success-item flex gap-3">
            <Link to="/status" className="flex-1">
              <Button variant="primary" fullWidth>Check Status</Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button variant="outline" fullWidth>Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main booking page ────────────────────────────────────────
export default function Book() {
  const [searchParams] = useSearchParams()
  const initialService  = searchParams.get('service') || ''

  const [step, setStep]                 = useState(1)
  const [patientData, setPatientData]   = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [submitting, setSubmitting]     = useState(false)
  const [done, setDone]                 = useState(false)

  // Refs for animations
  const contentRef  = useRef(null)
  const headerRef   = useRef(null)
  const stepBarRef  = useRef(null)

  const { slotStatuses } = useAvailability(selectedDate)

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  // Animate header on load
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 }
      )
    }
  }, [])

  // Animate content area on step change
  useEffect(() => {
    if (!contentRef.current) return
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out' }
    )
  }, [step])

  useEffect(() => { setSelectedSlot('') }, [selectedDate])

  const goTo = (n) => {
    // Slide out current step
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0,
        x: n > step ? -30 : 30,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          setStep(n)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        },
      })
    } else {
      setStep(n)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleDetailsNext  = (data) => { setPatientData(data); goTo(2) }
  const handleSlotNext     = () => {
    if (!selectedDate) { toast.error('Please select a date.'); return }
    if (!selectedSlot) { toast.error('Please select a time slot.'); return }
    goTo(3)
  }

  const handleConfirmAndWhatsApp = async () => {
    setSubmitting(true)
    try {
      await createAppointment({
        ...patientData,
        date:     selectedDate,
        timeSlot: selectedSlot,
        status:   'PENDING',
        payment:  'NONE',
      })

      const svc    = SERVICES.find((s) => s.label === patientData?.service)
      const waUrl  = buildBookingURL({
        name:     patientData.name,
        service:  patientData.service,
        date:     formatDisplayDate(selectedDate),
        timeSlot: selectedSlot,
        deposit:  svc?.deposit,
        price:    svc?.price,
      })

      setDone(true)
      setTimeout(() => window.open(waUrl, '_blank'), 400)

    } catch (err) {
      const msg = err.message || ''
      if (msg.includes('slot') || msg.includes('available')) {
        toast.error('This slot was just taken! Please choose another.')
        setSelectedSlot('')
        goTo(2)
      } else {
        toast.error(msg || 'Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <SuccessScreen
        patientData={patientData}
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
      />
    )
  }

  return (
    <>
      <Navbar />

      {/* ── Animated Header ──────────────────────────────── */}
      <div ref={headerRef} className="bg-forest-800 pt-24 pb-10 px-4" style={{ opacity: 0 }}>
        <div className="max-w-xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-forest-300 hover:text-white text-sm mb-5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-gold-500/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-gold-400" />
            </div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-white">
              Book Your Appointment
            </h1>
          </div>
          <p className="text-forest-400 text-sm ml-11">
            Niramay Ayurvedic Clinik · Real-time availability
          </p>
          <StepBar current={step} />
        </div>
      </div>

      {/* ── Animated Content ─────────────────────────────── */}
      <div className="max-w-xl mx-auto px-4 py-10 pb-20">
        <div ref={contentRef}>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="card">
              {/* Step heading with animation */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-forest-100 rounded-xl flex items-center justify-center">
                  <span className="text-forest-700 font-bold text-sm">1</span>
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-forest-900 leading-none">
                    Patient Details
                  </h2>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Tell us about yourself
                  </p>
                </div>
              </div>
              <BookingForm
                initialService={initialService}
                onNext={handleDetailsNext}
              />
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <button
                onClick={() => goTo(1)}
                className="inline-flex items-center gap-1.5 text-forest-600 hover:text-forest-800 text-sm group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Details
              </button>

              <div className="card space-y-6">
                {/* Step heading */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-forest-100 rounded-xl flex items-center justify-center">
                    <span className="text-forest-700 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-forest-900 leading-none">
                      Select Date & Time
                    </h2>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Pick your preferred slot
                    </p>
                  </div>
                </div>

                {/* Date picker */}
                <AnimatedField delay={0.1}>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    min={todayStr()}
                    max={maxDateStr()}
                    value={selectedDate}
                    onChange={(e) => {
                      const picked = e.target.value
                      if (picked && picked < todayStr()) {
                        toast.error('Please select today or a future date.')
                        return
                      }
                      setSelectedDate(picked)
                    }}
                    onKeyDown={(e) => e.preventDefault()}
                    className="form-input cursor-pointer"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Bookings open up to 60 days in advance
                  </p>
                </AnimatedField>

                {selectedDate && (
                  <AnimatedField delay={0.05}>
                    <SlotPicker
                      slotStatuses={slotStatuses}
                      selected={selectedSlot}
                      onSelect={setSelectedSlot}
                    />
                  </AnimatedField>
                )}
              </div>

              <AnimatedField delay={0.2}>
                <Button
                  variant="primary" fullWidth size="lg"
                  disabled={!selectedDate || !selectedSlot}
                  onClick={handleSlotNext}
                >
                  Next: Review & Confirm →
                </Button>
              </AnimatedField>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <button
                onClick={() => goTo(2)}
                className="inline-flex items-center gap-1.5 text-forest-600 hover:text-forest-800 text-sm group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Slot Selection
              </button>

              <div className="card">
                {/* Step heading */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 bg-gold-100 rounded-xl flex items-center justify-center">
                    <span className="text-gold-700 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-forest-900 leading-none">
                      Review Your Booking
                    </h2>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Confirm details and send via WhatsApp
                    </p>
                  </div>
                </div>

                {/* Summary items — each animated */}
                <div className="bg-forest-50 rounded-2xl p-5 mb-5 space-y-0">
                  {[
                    { label: 'Name',         value: patientData?.name,                              icon: '👤' },
                    { label: 'Phone',        value: `+91 ${patientData?.phone}`,                   icon: '📞' },
                    { label: 'Email',        value: patientData?.email || '—',                     icon: '📧' },
                    { label: 'Service',      value: patientData?.service,                          icon: '💆' },
                    { label: 'Date',         value: formatDisplayDate(selectedDate),                icon: '📅' },
                    { label: 'Time',         value: selectedSlot,                                   icon: '⏰' },
                    { label: 'Total Fee',    value: `₹${patientData?.price?.toLocaleString('en-IN') || '—'}`,  icon: '💵' },
                    { label: 'Deposit',      value: `₹${patientData?.deposit?.toLocaleString('en-IN') || '—'} (refundable)`, icon: '💰' },
                    ...(patientData?.notes ? [{ label: 'Notes', value: patientData.notes, icon: '📝' }] : []),
                  ].map(({ label, value, icon }, i) => (
                    <ReviewRow key={label} label={label} value={value} icon={icon} delay={i * 0.05} />
                  ))}
                </div>

                {/* Info note */}
                <AnimatedField delay={0.5}>
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-5">
                    <div className="flex items-start gap-2">
                      <MessageCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-green-700 text-xs leading-relaxed">
                        Clicking below saves your request and opens WhatsApp with a
                        pre-filled message. Send it to us and our team will confirm
                        your appointment shortly.
                      </p>
                    </div>
                  </div>
                </AnimatedField>

                <AnimatedField delay={0.55}>
                  <Button
                    variant="gold" fullWidth size="lg"
                    loading={submitting}
                    onClick={handleConfirmAndWhatsApp}
                  >
                    <MessageCircle className="w-5 h-5" />
                    Send Booking Request on WhatsApp
                  </Button>
                  <p className="text-center text-gray-400 text-xs mt-3">
                    You will be redirected to WhatsApp with your booking details
                  </p>
                </AnimatedField>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}

// ─── Animated review row ──────────────────────────────────────
function ReviewRow({ label, value, icon, delay }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    gsap.fromTo(
      ref.current,
      { opacity: 0, x: -15 },
      { opacity: 1, x: 0, duration: 0.38, ease: 'power2.out', delay: 0.15 + delay }
    )
  }, [delay])
  return (
    <div
      ref={ref}
      className="flex justify-between items-start gap-4 py-2.5 border-b border-forest-100 last:border-0"
      style={{ opacity: 0 }}
    >
      <span className="text-forest-500 text-sm flex items-center gap-1.5">
        <span className="text-base leading-none">{icon}</span>
        {label}
      </span>
      <span className="text-forest-900 text-sm font-semibold text-right max-w-[60%]">
        {value}
      </span>
    </div>
  )
}