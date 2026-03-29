// import { useState } from 'react'
// import { Loader2, CheckCircle, ExternalLink } from 'lucide-react'
// import Button from './ui/Button'
// import { createAppointment } from '../lib/api'
// import { sendConfirmationWhatsApp } from '../lib/whatsapp'
// import { formatDisplayDate } from '../lib/utils'
// import { CLINIC_PHONE } from '../lib/constants'
// import toast from 'react-hot-toast'

// export default function PaymentButton({
//     amount,
//     patientData,
//     selectedDate,
//     selectedSlot,
//     onSuccess,
// }) {
//     const [status, setStatus] = useState('idle')  // idle | waiting | verifying | done
//     const [appointmentId, setAppointmentId] = useState(null)

//     // ── Build Google Pay UPI deep link ──────────────────────────
//     // Replace these with your clinic's actual UPI details
//     const UPI_ID = 'aryansutariya005@okhdfcbank'          // ← your UPI ID
//     const UPI_NAME = 'Niramay Ayurvedic Clinik'
//     const NOTE = `Deposit-${patientData?.name}-${selectedSlot}`

//     const buildGPayURL = () => {
//         const params = new URLSearchParams({
//             pa: UPI_ID,
//             pn: UPI_NAME,
//             am: amount.toString(),
//             cu: 'INR',
//             tn: NOTE,
//         })
//         // This opens Google Pay / any UPI app on mobile
//         return `upi://pay?${params.toString()}`
//     }

//     const buildGPayWebURL = () => {
//         // Web fallback — opens Google Pay web
//         const params = new URLSearchParams({
//             pa: UPI_ID,
//             pn: UPI_NAME,
//             am: amount.toString(),
//             cu: 'INR',
//             tn: NOTE,
//         })
//         return `https://pay.google.com/gp/v/u/0/pay?${params.toString()}`
//     }

//     // ── Step 1: Open Google Pay ─────────────────────────────────
//     const handleOpenGPay = () => {
//         setStatus('waiting')
//         // Try UPI deep link first (works on mobile)
//         const upiUrl = buildGPayURL()
//         window.location.href = upiUrl

//         // Fallback: after 2s if still on page, show manual confirm
//         setTimeout(() => {
//             if (status === 'waiting') {
//                 setStatus('waiting') // stay in waiting — show manual confirm button
//             }
//         }, 2000)
//     }

//     // ── Step 2: After user says payment done → create booking ───
//     const handlePaymentDone = async () => {
//         setStatus('verifying')
//         try {
//             // Create appointment in database
//             const res = await createAppointment({
//                 ...patientData,
//                 date: selectedDate,
//                 timeSlot: selectedSlot,
//                 status: 'CONFIRMED',  // auto-confirm after payment
//                 payment: 'DEPOSIT',
//             })

//             setAppointmentId(res.appointmentId)

//             // Send WhatsApp confirmation to patient
//             const confirmMsg = buildConfirmationMessage({
//                 name: patientData.name,
//                 service: patientData.service,
//                 date: formatDisplayDate(selectedDate),
//                 timeSlot: selectedSlot,
//                 deposit: amount,
//                 price: patientData.price,
//             })

//             const waUrl = `https://wa.me/91${patientData.phone}?text=${encodeURIComponent(confirmMsg)}`

//             setStatus('done')
//             toast.success('Booking confirmed! Sending WhatsApp confirmation...')

//             // Open WhatsApp with confirmation message
//             setTimeout(() => {
//                 window.open(waUrl, '_blank')
//                 onSuccess(res.appointmentId)
//             }, 1500)

//         } catch (err) {
//             setStatus('waiting')
//             if (err.message?.includes('slot')) {
//                 toast.error('This slot was just taken. Please go back and choose another.')
//             } else {
//                 toast.error(err.message || 'Booking failed. Please try again.')
//             }
//         }
//     }

//     // ── Confirmation message ────────────────────────────────────
//     const buildConfirmationMessage = ({ name, service, date, timeSlot, deposit, price }) =>
//         `🌿 *Booking Confirmed — Niramay Ayurvedic Clinik*

// Namaskar *${name}*! 🙏

// Your appointment has been *CONFIRMED* ✅

// 📋 *Booking Details:*
// 💆 Service: ${service}
// 📅 Date: ${date}
// ⏰ Time: ${timeSlot}

// 💰 *Payment Summary:*
// ✅ Deposit Paid: ₹${deposit}
// 🔄 Balance Due at Clinic: ₹${price - deposit}

// ⚠️ *Cancellation Policy:*
// Cancel 24+ hours before → Full deposit refunded
// Cancel within 24 hours → Deposit non-refundable

// For changes, call: *+91 ${CLINIC_PHONE}*

// See you soon! 🌱
// — Niramay Ayurvedic Clinik`

//     // ── Render ──────────────────────────────────────────────────
//     if (status === 'done') {
//         return (
//             <div className="text-center py-6">
//                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                     <CheckCircle className="w-8 h-8 text-green-600" />
//                 </div>
//                 <p className="font-display text-lg font-bold text-forest-900">
//                     Payment Received!
//                 </p>
//                 <p className="text-gray-500 text-sm mt-1">
//                     Opening WhatsApp to send your confirmation...
//                 </p>
//             </div>
//         )
//     }

//     return (
//         <div className="space-y-3">
//             {/* IDLE: show Pay button */}
//             {status === 'idle' && (
//                 <button
//                     onClick={handleOpenGPay}
//                     className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-forest-400 hover:bg-forest-50 rounded-2xl py-4 px-6 transition-all group shadow-sm hover:shadow-md"
//                 >
//                     {/* Google Pay logo */}
//                     <svg width="60" height="24" viewBox="0 0 60 24" className="flex-shrink-0">
//                         <text x="0" y="18" fontSize="18" fontWeight="bold">
//                             <tspan fill="#4285F4">G</tspan>
//                             <tspan fill="#EA4335">o</tspan>
//                             <tspan fill="#FBBC05">o</tspan>
//                             <tspan fill="#4285F4">g</tspan>
//                             <tspan fill="#34A853">l</tspan>
//                             <tspan fill="#EA4335">e</tspan>
//                         </text>
//                         <text x="40" y="18" fontSize="18" fontWeight="bold" fill="#5F6368">Pay</text>
//                     </svg>
//                     <div className="text-left">
//                         <p className="font-bold text-gray-800 text-sm">
//                             Pay ₹{amount.toLocaleString('en-IN')} via Google Pay
//                         </p>
//                         <p className="text-xs text-gray-400">UPI · Instant · Secure</p>
//                     </div>
//                     <ExternalLink className="w-4 h-4 text-gray-400 ml-auto group-hover:text-forest-600" />
//                 </button>
//             )}

//             {/* WAITING: show after GPay opened */}
//             {status === 'waiting' && (
//                 <div className="space-y-3">
//                     <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
//                         <p className="text-amber-800 font-semibold text-sm mb-1">
//                             Complete Payment in Google Pay
//                         </p>
//                         <p className="text-amber-600 text-xs">
//                             Google Pay should have opened. After paying ₹{amount}, click
//                             the button below to confirm your booking.
//                         </p>
//                     </div>

//                     <Button
//                         variant="primary"
//                         fullWidth
//                         size="lg"
//                         onClick={handlePaymentDone}
//                     >
//                         <CheckCircle className="w-5 h-5" />
//                         I Have Paid — Confirm My Booking
//                     </Button>

//                     <button
//                         onClick={() => setStatus('idle')}
//                         className="w-full text-center text-xs text-gray-400 hover:text-gray-600 underline"
//                     >
//                         Google Pay did not open? Try again
//                     </button>
//                 </div>
//             )}

//             {/* VERIFYING */}
//             {status === 'verifying' && (
//                 <div className="flex items-center justify-center gap-3 py-6">
//                     <Loader2 className="w-6 h-6 animate-spin text-forest-600" />
//                     <p className="text-forest-700 font-medium">
//                         Confirming your booking...
//                     </p>
//                 </div>
//             )}
//         </div>
//     )
// }


































import { useState } from 'react'
import { Loader2, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react'
import Button from './ui/Button'
import { createAppointment } from '../lib/api'
import { formatDisplayDate } from '../lib/utils'
import { CLINIC_PHONE } from '../lib/constants'
import toast from 'react-hot-toast'

// ── Replace with your clinic UPI ID ──────────────────────────
const UPI_ID   = 'aryansutariya005@okhdfcbank'           // e.g. 9999999999@ybl or name@okicici
const UPI_NAME = 'Niramay Ayurvedic Clinik'

function buildUpiUrl(amount, note) {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: UPI_NAME,
    am: amount.toString(),
    cu: 'INR',
    tn: note,
  })
  return `upi://pay?${params.toString()}`
}

function buildConfirmationMessage({ name, service, date, timeSlot, deposit, price, phone }) {
  const balance = (price || 0) - (deposit || 0)
  return `🌿 *Booking Confirmed — Niramay Ayurvedic Clinik*

Namaskar *${name}*! 🙏

Your appointment has been *CONFIRMED* ✅

📋 *Booking Details:*
💆 Service: ${service}
📅 Date: ${date}
⏰ Time: ${timeSlot}

💰 *Payment Summary:*
✅ Deposit Paid: ₹${deposit?.toLocaleString('en-IN')}
🔄 Balance Due at Clinic: ₹${balance.toLocaleString('en-IN')}

⚠️ *Cancellation Policy:*
- Cancel 24+ hours before → Full deposit refunded
- Cancel within 24 hours → Deposit non-refundable

To cancel or reschedule, visit our website or call:
*+91 ${CLINIC_PHONE}*

See you soon! 🌱
— Niramay Ayurvedic Clinik`
}

export default function PaymentButton({
  amount,
  patientData,
  selectedDate,
  selectedSlot,
  onSuccess,
}) {
  const [status, setStatus] = useState('idle') // idle | waiting | verifying | done

  const note = `Deposit-${patientData?.name}-${selectedDate}`

  const handleOpenGPay = () => {
    const upiUrl = buildUpiUrl(amount, note)
    setStatus('waiting')
    // On mobile: opens Google Pay / PhonePe / any UPI app
    window.location.href = upiUrl
  }

  const handlePaymentDone = async () => {
    setStatus('verifying')
    try {
      const res = await createAppointment({
        ...patientData,
        date:     selectedDate,
        timeSlot: selectedSlot,
        status:   'CONFIRMED',
        payment:  'DEPOSIT',
      })

      // Build and open WhatsApp confirmation
      const confirmMsg = buildConfirmationMessage({
        name:     patientData.name,
        service:  patientData.service,
        date:     formatDisplayDate(selectedDate),
        timeSlot: selectedSlot,
        deposit:  amount,
        price:    patientData.price,
        phone:    CLINIC_PHONE,
      })

      const waUrl = `https://wa.me/91${patientData.phone}?text=${encodeURIComponent(confirmMsg)}`

      setStatus('done')
      toast.success('Booking confirmed! Opening WhatsApp...')

      setTimeout(() => {
        window.open(waUrl, '_blank')
        onSuccess(res.appointmentId)
      }, 1200)

    } catch (err) {
      setStatus('waiting')
      if (err.message?.includes('slot') || err.message?.includes('available')) {
        toast.error('This slot was just taken. Please go back and choose another.')
      } else if (err.message?.includes('database') || err.message?.includes('connect')) {
        toast.error('Server temporarily unavailable. Please try again.')
      } else {
        toast.error(err.message || 'Booking failed. Please try again.')
      }
    }
  }

  if (status === 'done') {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <p className="font-display text-lg font-bold text-forest-900">
          Payment Received!
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Opening WhatsApp to send your confirmation...
        </p>
      </div>
    )
  }

  if (status === 'verifying') {
    return (
      <div className="flex items-center justify-center gap-3 py-8">
        <Loader2 className="w-6 h-6 animate-spin text-forest-600" />
        <p className="text-forest-700 font-medium text-sm">
          Confirming your booking...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">

      {/* IDLE state — show UPI pay button */}
      {status === 'idle' && (
        <>
          <button
            onClick={handleOpenGPay}
            className="w-full flex items-center justify-between gap-3 bg-white border-2 border-gray-200 hover:border-forest-400 hover:bg-forest-50 rounded-2xl py-4 px-5 transition-all group shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              {/* Google Pay styled text */}
              <div className="flex-shrink-0 w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center shadow-sm">
                <span className="text-lg">G</span>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800 text-sm">
                  Pay ₹{amount.toLocaleString('en-IN')} via Google Pay / UPI
                </p>
                <p className="text-xs text-gray-400">
                  Works with PhonePe, Paytm, any UPI app
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:text-forest-600" />
          </button>

          <p className="text-center text-xs text-gray-400">
            You will be redirected to your UPI app to complete payment
          </p>
        </>
      )}

      {/* WAITING state — shown after UPI app opened */}
      {status === 'waiting' && (
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
            <p className="text-amber-800 font-semibold text-sm mb-1">
              Complete Payment in Your UPI App
            </p>
            <p className="text-amber-700 text-xs leading-relaxed">
              Pay <strong>₹{amount.toLocaleString('en-IN')}</strong> to{' '}
              <strong>{UPI_NAME}</strong> via Google Pay / PhonePe / Paytm.
              Once payment is done, click the button below.
            </p>
          </div>

          {/* Manual UPI ID fallback */}
          <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">
              Or pay manually to UPI ID:
            </p>
            <p className="font-mono font-bold text-forest-700 text-sm select-all">
              {UPI_ID}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Amount: ₹{amount.toLocaleString('en-IN')}
            </p>
          </div>

          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={handlePaymentDone}
          >
            <CheckCircle className="w-5 h-5" />
            I Have Paid — Confirm My Booking
          </Button>

          <button
            onClick={() => setStatus('idle')}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
          >
            <RefreshCw className="w-3 h-3" />
            UPI app did not open? Try again
          </button>
        </div>
      )}
    </div>
  )
}