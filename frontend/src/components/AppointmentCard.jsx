// import { useState } from 'react'
// import {
//     Phone, Calendar, Clock, Star, ChevronDown,
//     MessageCircle, CheckCircle, XCircle, Loader2
// } from 'lucide-react'
// import { StatusBadge, PaymentBadge } from './StatusBadge'
// import Button from './ui/Button'
// import { formatShortDate, formatDateTime } from '../lib/utils'
// import { SERVICES } from '../lib/constants'
// import { buildConfirmURL, buildCancelURL, buildFeedbackWhatsAppURL } from '../lib/whatsapp'


// export default function AppointmentCard({
//     appointment,
//     isAdmin = false,
//     onConfirm,
//     onCancel,
//     onComplete,
//     onPaymentUpdate,
//     updating = false,
// }) {
//     const [expanded, setExpanded] = useState(false)

//     const {
//         id, name, phone, email, date, timeSlot,
//         service, status, payment, notes, createdAt,
//     } = appointment

//     const isToday =
//         new Date(date).toDateString() === new Date().toDateString()

//     const getServicePrice = (name) => SERVICES.find((s) => s.label === name)?.price || 0
//     const getServiceDeposit = (name) => SERVICES.find((s) => s.label === name)?.deposit || 0
//     return (
//         <div
//             className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 overflow-hidden ${status === 'PENDING'
//                 ? 'border-amber-200'
//                 : status === 'CONFIRMED'
//                     ? 'border-green-100'
//                     : 'border-cream-200'
//                 }`}
//         >
//             {/* ── Main Row ─────────────────────────────────────── */}
//             <div
//                 className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer"
//                 onClick={() => setExpanded(!expanded)}
//             >
//                 {/* Left: info */}
//                 <div className="flex-1 min-w-0">
//                     <div className="flex flex-wrap items-center gap-2 mb-1.5">
//                         <h3 className="font-semibold text-gray-900 text-sm">{name}</h3>

//                         {isToday && isAdmin && (
//                             <span className="bg-forest-100 text-forest-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
//                                 TODAY
//                             </span>
//                         )}

//                         <StatusBadge status={status} />
//                         <PaymentBadge payment={payment} />
//                     </div>

//                     <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
//                         {isAdmin && (
//                             <span className="flex items-center gap-1">
//                                 <Phone className="w-3 h-3" />
//                                 +91 {phone}
//                             </span>
//                         )}
//                         <span className="flex items-center gap-1">
//                             <Calendar className="w-3 h-3" />
//                             {formatShortDate(date)}
//                         </span>
//                         <span className="flex items-center gap-1">
//                             <Clock className="w-3 h-3" />
//                             {timeSlot}
//                         </span>
//                         <span className="flex items-center gap-1">
//                             <Star className="w-3 h-3" />
//                             {service}
//                         </span>
//                     </div>
//                 </div>

//                 {/* Right: admin quick actions */}
//                 {isAdmin && (
//                     <div
//                         className="flex items-center gap-2 flex-shrink-0"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         {status === 'PENDING' && (
//                             <>
//                                 <Button
//                                     size="sm"
//                                     variant="primary"
//                                     loading={updating}
//                                     onClick={() => {
//                                         onConfirm(id)
//                                         window.open(buildConfirmURL({
//                                             phone, name, service,
//                                             date: formatShortDate(date),
//                                             timeSlot,
//                                         }), '_blank')
//                                     }}
//                                 >
//                                     <CheckCircle className="w-3.5 h-3.5" />
//                                     Confirm
//                                 </Button>
//                                 <Button
//                                     size="sm"
//                                     variant="danger"
//                                     loading={updating}
//                                     onClick={() => onCancel(id)}
//                                 >
//                                     <XCircle className="w-3.5 h-3.5" />
//                                     Cancel
//                                 </Button>
//                             </>
//                         )}

//                         {status === 'CONFIRMED' && (
//                             <Button
//                                 size="sm"
//                                 variant="ghost"
//                                 loading={updating}
//                                 onClick={() => onComplete(id)}
//                                 className="text-blue-600 hover:bg-blue-50"
//                             >
//                                 <CheckCircle className="w-3.5 h-3.5" />
//                                 Done
//                             </Button>
//                         )}

//                         <ChevronDown
//                             className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''
//                                 }`}
//                         />
//                     </div>
//                 )}

//                 {/* Patient view: just chevron */}
//                 {!isAdmin && (
//                     <ChevronDown
//                         className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${expanded ? 'rotate-180' : ''
//                             }`}
//                     />
//                 )}
//             </div>

//             {/* ── Expanded Details ──────────────────────────────── */}
//             {expanded && (
//                 <div className="px-5 pb-5 border-t border-gray-50 pt-4 space-y-4">

//                     {/* Info grid */}
//                     <div className="grid sm:grid-cols-2 gap-4">
//                         <div className="space-y-2 text-xs text-gray-600">
//                             {email && (
//                                 <p><span className="font-medium text-gray-500">Email: </span>{email}</p>
//                             )}
//                             {notes && (
//                                 <div className="bg-gray-50 rounded-xl p-3">
//                                     <p className="font-medium text-gray-500 mb-1">Patient Notes</p>
//                                     <p className="leading-relaxed">{notes}</p>
//                                 </div>
//                             )}
//                             <p className="text-gray-400">
//                                 Booked: {formatDateTime(createdAt)}
//                             </p>
//                         </div>


//                         {/* ─── Payment section inside expanded admin view ─────────────── */}
//                         {isAdmin && (
//                             <div className="space-y-3">

//                                 {/* Payment update with Received / Pending options */}
//                                 <div>
//                                     <p className="text-xs font-semibold text-gray-600 mb-2">
//                                         Payment Status
//                                     </p>

//                                     {/* If no payment yet — show Deposit / Full options */}
//                                     {payment === 'NONE' && (
//                                         <div className="space-y-2">
//                                             <p className="text-xs text-gray-400">Mark payment as:</p>
//                                             <div className="flex gap-2">
//                                                 <button
//                                                     disabled={updating}
//                                                     onClick={() => onPaymentUpdate(id, 'DEPOSIT')}
//                                                     className="flex-1 py-2 text-xs font-semibold rounded-xl border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-all disabled:opacity-40"
//                                                 >
//                                                     💰 Deposit Received
//                                                 </button>
//                                                 <button
//                                                     disabled={updating}
//                                                     onClick={() => onPaymentUpdate(id, 'FULL')}
//                                                     className="flex-1 py-2 text-xs font-semibold rounded-xl border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-all disabled:opacity-40"
//                                                 >
//                                                     ✅ Full Payment Received
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     )}

//                                     {/* If DEPOSIT — show Received/Pending toggle + upgrade to full */}
//                                     {payment === 'DEPOSIT' && (
//                                         <div className="space-y-2">
//                                             <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl px-3 py-2.5">
//                                                 <div className="flex items-center gap-2">
//                                                     <span className="w-2.5 h-2.5 bg-orange-400 rounded-full" />
//                                                     <span className="text-xs font-semibold text-orange-700">
//                                                         Deposit Paid
//                                                     </span>
//                                                 </div>
//                                                 <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full font-medium">
//                                                     Received ✓
//                                                 </span>
//                                             </div>
//                                             <button
//                                                 disabled={updating}
//                                                 onClick={() => onPaymentUpdate(id, 'FULL')}
//                                                 className="w-full py-2 text-xs font-semibold rounded-xl border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-all disabled:opacity-40"
//                                             >
//                                                 ↑ Upgrade to Full Payment Received
//                                             </button>
//                                             <button
//                                                 disabled={updating}
//                                                 onClick={() => onPaymentUpdate(id, 'NONE')}
//                                                 className="w-full py-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
//                                             >
//                                                 Mark as pending (not received)
//                                             </button>
//                                         </div>
//                                     )}

//                                     {/* If FULL — show green received badge */}
//                                     {payment === 'FULL' && (
//                                         <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
//                                             <div className="flex items-center gap-2">
//                                                 <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
//                                                 <span className="text-xs font-semibold text-green-700">
//                                                     Full Payment Received
//                                                 </span>
//                                             </div>
//                                             <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-medium">
//                                                 ✅ Confirmed
//                                             </span>
//                                         </div>
//                                     )}

//                                     {/* If REFUNDED */}
//                                     {payment === 'REFUNDED' && (
//                                         <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-3 py-2.5">
//                                             <span className="text-xs font-semibold text-blue-700">Refunded</span>
//                                             <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Done</span>
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* Confirm button — only show if PENDING */}
//                                 {status === 'PENDING' && (
//                                     <div>
//                                         <p className="text-xs font-semibold text-gray-600 mb-1.5">
//                                             Confirm Appointment
//                                         </p>
//                                         <Button
//                                             size="sm"
//                                             variant="primary"
//                                             fullWidth
//                                             loading={updating}
//                                             onClick={() => onConfirm(id)}
//                                         >
//                                             <CheckCircle className="w-3.5 h-3.5" />
//                                             Confirm Booking
//                                         </Button>
//                                         <p className="text-xs text-gray-400 mt-1 text-center">
//                                             After confirming, send WhatsApp to patient below
//                                         </p>
//                                     </div>
//                                 )}

//                                 {/* WhatsApp actions */}
//                                 <div>
//                                     <p className="text-xs font-semibold text-gray-600 mb-1.5">
//                                         WhatsApp Actions
//                                     </p>
//                                     <div className="flex gap-2">
//                                         <a
//                                             href={buildConfirmURL({
//                                                 phone, name, service,
//                                                 date: formatShortDate(date),
//                                                 timeSlot,
//                                                 payment,
//                                                 price: getServicePrice(service),
//                                                 deposit: getServiceDeposit(service),
//                                             })}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                             className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-2 rounded-xl transition-colors"
//                                         >
//                                             <MessageCircle className="w-3.5 h-3.5" />
//                                             Send Confirmation
//                                         </a>
//                                         <a
//                                             href={`https://wa.me/91${phone}`}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                             className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-2 rounded-xl transition-colors"
//                                         >
//                                             <Phone className="w-3.5 h-3.5" />
//                                             Open Chat
//                                         </a>
//                                     </div>
//                                 </div>

//                                 {/* Complete / Cancel — for confirmed */}
//                                 {status === 'CONFIRMED' && (
//                                     <div className="flex gap-2">
//                                         <Button size="sm" variant="danger" fullWidth loading={updating} onClick={() => onCancel(id)}>
//                                             <XCircle className="w-3.5 h-3.5" /> Cancel
//                                         </Button>
//                                         <Button
//                                             size="sm" fullWidth loading={updating}
//                                             onClick={() => onComplete(id)}
//                                             className="bg-blue-50 hover:bg-blue-100 text-blue-600"
//                                         >
//                                             <CheckCircle className="w-3.5 h-3.5" /> Mark Done
//                                         </Button>
//                                     </div>
//                                 )}
//                             </div>
//                         )}


//                     </div>

//                     {/* Patient status messages */}
//                     {!isAdmin && status === 'PENDING' && (
//                         <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
//                             ⏳ Your appointment is awaiting confirmation from our team. You will
//                             receive a WhatsApp notification once confirmed.
//                         </div>
//                     )
//                     }
//                     {/* {!isAdmin && status === 'CONFIRMED' && (
//                         <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-xs text-green-700">
//                             ✅ Confirmed! You will receive WhatsApp reminders 1 day before and
//                             2 hours before your appointment.
//                         </div>
//                     )} */}

//                     {!isAdmin && status === 'CONFIRMED' && (
//                         <div>
//                             <p className="text-xs font-semibold text-gray-600 mb-1.5">
//                                 Send Reminder
//                             </p>
//                             <div className="flex gap-2">
//                                 <a
//                                     href={`https://wa.me/91${phone}?text=${encodeURIComponent(
//                                         `🌿 Reminder: Your appointment for ${service} is tomorrow at ${timeSlot}. Please arrive 10 mins early. — Niramay Ayurvedic Clinik 🙏`
//                                     )}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="flex-1 flex items-center justify-center gap-1.5 bg-forest-50 hover:bg-forest-100 text-forest-700 text-xs font-semibold py-2 rounded-xl transition-colors border border-forest-200"
//                                 >
//                                     📅 Day Before
//                                 </a>
//                                 <a
//                                     href={`https://wa.me/91${phone}?text=${encodeURIComponent(
//                                         `🌿 Reminder: Your appointment for ${service} is in 2 hours at ${timeSlot}. Please arrive 10 mins early. — Niramay Ayurvedic Clinik 🙏`
//                                     )}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="flex-1 flex items-center justify-center gap-1.5 bg-forest-50 hover:bg-forest-100 text-forest-700 text-xs font-semibold py-2 rounded-xl transition-colors border border-forest-200"
//                                 >
//                                     ⏰ 2 Hours Before
//                                 </a>
//                             </div>
//                         </div>
//                     )
//                     }

//                     {/* Feedback request — for completed appointments */}
//                     {isAdmin && status === 'COMPLETED' && (
//                         <div>
//                             <p className="text-xs font-semibold text-gray-600 mb-1.5">
//                                 Request Feedback
//                             </p>
//                             <a
//                                 href={buildFeedbackWhatsAppURL({
//                                     phone, name,
//                                     appointmentId: id,
//                                     service,
//                                 })}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="w-full flex items-center justify-center gap-2 bg-gold-50 hover:bg-gold-100 border border-gold-200 text-gold-700 text-xs font-semibold py-2.5 rounded-xl transition-colors"
//                             >
//                                 <Star className="w-3.5 h-3.5" />
//                                 Send Feedback Request on WhatsApp
//                             </a>
//                         </div>
//                     )}


//                 </div >
//             )
//             }
//         </div >
//     )
// }














import { useState } from 'react'
import {
    Phone, Calendar, Clock, Star,
    ChevronDown, MessageCircle,
    CheckCircle, XCircle, IndianRupee
} from 'lucide-react'
import { StatusBadge, PaymentBadge } from './StatusBadge'
import Button from './ui/Button'
import { formatShortDate, formatDateTime } from '../lib/utils'
import {
    buildConfirmURL,
    buildCancelURL,
    buildFeedbackWhatsAppURL,
} from '../lib/whatsapp'
import { SERVICES } from '../lib/constants'

const getServicePrice = (name) => SERVICES.find((s) => s.label === name)?.price || 0
const getServiceDeposit = (name) => SERVICES.find((s) => s.label === name)?.deposit || 0

export default function AppointmentCard({
    appointment,
    isAdmin = false,
    onConfirm,
    onCancel,
    onComplete,
    onPaymentUpdate,
    updating = false,
}) {
    const [expanded, setExpanded] = useState(false)

    const {
        id, name, phone, email,
        date, timeSlot, service,
        status, payment, notes,
        createdAt, cancelReason,
    } = appointment

    const isToday = new Date(date).toDateString() === new Date().toDateString()
    const price = getServicePrice(service)
    const deposit = getServiceDeposit(service)
    const balance = price - deposit

    // Build WhatsApp URLs
    const confirmWaUrl = buildConfirmURL({
        phone, name, service,
        date: formatShortDate(date),
        timeSlot, payment, price, deposit,
    })

    // Fix 4: cancel URL includes reason
    const cancelWaUrl = buildCancelURL({
        phone, name, service,
        date: formatShortDate(date),
        cancelReason: cancelReason || '',
    })

    const feedbackWaUrl = buildFeedbackWhatsAppURL({
        phone, name,
        appointmentId: id,
        service,
    })

    return (
        <div className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 overflow-hidden ${status === 'PENDING' ? 'border-amber-200' :
            status === 'CONFIRMED' ? 'border-green-100' :
                status === 'CANCELLED' ? 'border-red-100' :
                    'border-cream-200'
            }`}>

            {/* ── Main Row ─────────────────────────────────────── */}
            <div
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="font-semibold text-gray-900 text-sm">{name}</h3>
                        {isToday && isAdmin && (
                            <span className="bg-forest-100 text-forest-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                TODAY
                            </span>
                        )}
                        <StatusBadge status={status} />
                        <PaymentBadge payment={payment} />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        {isAdmin && (
                            <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" /> +91 {phone}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {formatShortDate(date)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {timeSlot}
                        </span>
                        <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" /> {service}
                        </span>
                    </div>
                </div>

                {/* Quick confirm button (admin, pending only) */}
                {isAdmin && (
                    <div
                        className="flex items-center gap-2 flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {status === 'PENDING' && (
                            <Button
                                size="sm" variant="primary"
                                loading={updating}
                                onClick={() => onConfirm(id)}
                            >
                                <CheckCircle className="w-3.5 h-3.5" />
                                Confirm
                            </Button>
                        )}
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                    </div>
                )}

                {!isAdmin && (
                    <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                )}
            </div>

            {/* ── Expanded Details ──────────────────────────────── */}
            {expanded && (
                <div className="px-5 pb-5 border-t border-gray-50 pt-4 space-y-4">

                    {/* Basic info */}
                    <div className="space-y-1.5 text-xs text-gray-600">
                        {email && <p><span className="font-medium text-gray-500">Email: </span>{email}</p>}
                        {notes && (
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="font-medium text-gray-500 mb-1">Patient Notes</p>
                                <p>{notes}</p>
                            </div>
                        )}
                        {cancelReason && (
                            <div className="bg-red-50 rounded-xl p-3">
                                <p className="font-medium text-red-500 mb-1">Cancellation Reason</p>
                                <p className="text-red-700">{cancelReason}</p>
                            </div>
                        )}
                        <p className="text-gray-400">Booked: {formatDateTime(createdAt)}</p>
                    </div>

                    {/* ────────── ADMIN ACTIONS ────────────────────── */}
                    {isAdmin && (
                        <div className="space-y-4">

                            {/* ═══ PAYMENT MANAGEMENT ═════════════════════ */}
                            <div className="border border-gray-100 rounded-2xl p-4 space-y-3">
                                <p className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 text-forest-600" />
                                    Payment Management
                                </p>

                                {/* Fee summary */}
                                <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Total Fee</span>
                                        <span className="font-semibold">₹{price.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Deposit</span>
                                        <span className="font-semibold text-orange-600">₹{deposit.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-gray-200 pt-1.5">
                                        <span className="text-gray-500">Balance at Clinic</span>
                                        <span className="font-semibold text-forest-700">₹{balance.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                {/* ─── NO payment yet ───────────────────── */}
                                {payment === 'NONE' && (
                                    <div className="space-y-2">
                                        <p className="text-xs text-gray-400">No payment received yet. Mark as:</p>
                                        <div className="flex gap-2">
                                            <button
                                                disabled={updating}
                                                onClick={() => onPaymentUpdate(id, 'DEPOSIT')}
                                                className="flex-1 py-2.5 text-xs font-semibold rounded-xl border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-all disabled:opacity-40"
                                            >
                                                💰 Deposit Received
                                                <br />
                                                <span className="font-normal text-orange-500">
                                                    ₹{deposit.toLocaleString('en-IN')}
                                                </span>
                                            </button>
                                            <button
                                                disabled={updating}
                                                onClick={() => onPaymentUpdate(id, 'FULL')}
                                                className="flex-1 py-2.5 text-xs font-semibold rounded-xl border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-all disabled:opacity-40"
                                            >
                                                ✅ Full Received
                                                <br />
                                                <span className="font-normal text-green-600">
                                                    ₹{price.toLocaleString('en-IN')}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* ─── DEPOSIT received ─────────────────── */}
                                {/* Fix 5: after clicking deposit, confirmation includes deposit info */}
                                {payment === 'DEPOSIT' && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl px-3 py-2.5">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 bg-orange-400 rounded-full" />
                                                <span className="text-xs font-semibold text-orange-700">
                                                    Deposit Received — ₹{deposit.toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                                                ✓ Confirmed
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 text-center">
                                            Balance due at clinic: ₹{balance.toLocaleString('en-IN')}
                                        </p>
                                        <button
                                            disabled={updating}
                                            onClick={() => onPaymentUpdate(id, 'FULL')}
                                            className="w-full py-2 text-xs font-semibold rounded-xl border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-all disabled:opacity-40"
                                        >
                                            ↑ Mark Full Payment Received (₹{price.toLocaleString('en-IN')})
                                        </button>
                                        <button
                                            disabled={updating}
                                            onClick={() => onPaymentUpdate(id, 'NONE')}
                                            className="w-full py-1.5 text-[11px] text-gray-400 hover:text-red-500 transition-colors underline"
                                        >
                                            ✕ Revert — mark deposit as not yet received
                                        </button>
                                    </div>
                                )}

                                {/* ─── FULL payment received ──────────────── */}
                                {/* Fix 7: must revert full payment before cancelling */}
                                {payment === 'FULL' && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                                                <span className="text-xs font-semibold text-green-700">
                                                    Full Payment Received — ₹{price.toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                                ✅ Paid
                                            </span>
                                        </div>
                                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-2.5">
                                            <p className="text-[11px] text-amber-700 text-center">
                                                ⚠️ To cancel this appointment, first revert the payment below
                                            </p>
                                        </div>
                                        <button
                                            disabled={updating}
                                            onClick={() => onPaymentUpdate(id, 'DEPOSIT')}
                                            className="w-full py-2 text-xs font-semibold rounded-xl border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-all disabled:opacity-40"
                                        >
                                            ↓ Revert to Deposit Only (cancel full payment)
                                        </button>
                                        <button
                                            disabled={updating}
                                            onClick={() => onPaymentUpdate(id, 'NONE')}
                                            className="w-full py-1.5 text-[11px] text-gray-400 hover:text-red-500 transition-colors underline"
                                        >
                                            ✕ Cancel payment entirely (mark as none)
                                        </button>
                                    </div>
                                )}

                                {/* REFUNDED */}
                                {payment === 'REFUNDED' && (
                                    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-3 py-2.5">
                                        <span className="text-xs font-semibold text-blue-700">Deposit Refunded</span>
                                        <span className="text-[10px] text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                                            Done
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* ═══ APPOINTMENT ACTIONS ════════════════════ */}
                            <div className="border border-gray-100 rounded-2xl p-4 space-y-3">
                                <p className="text-xs font-bold text-gray-700">Appointment Actions</p>

                                {/* PENDING: confirm */}
                                {status === 'PENDING' && (
                                    <div className="space-y-2">
                                        <Button
                                            size="sm" variant="primary" fullWidth
                                            loading={updating}
                                            onClick={() => onConfirm(id)}
                                        >
                                            <CheckCircle className="w-3.5 h-3.5" />
                                            Confirm This Appointment
                                        </Button>
                                        <p className="text-[11px] text-gray-400 text-center">
                                            After confirming, send WhatsApp confirmation below
                                        </p>
                                    </div>
                                )}

                                {/* CONFIRMED: complete or cancel */}
                                {status === 'CONFIRMED' && (
                                    <div className="flex gap-2">
                                        {/* Fix 7: disable cancel when full payment received */}
                                        <Button
                                            size="sm" variant="danger" fullWidth
                                            loading={updating}
                                            disabled={payment === 'FULL'}
                                            title={
                                                payment === 'FULL'
                                                    ? 'Revert full payment first before cancelling'
                                                    : 'Cancel appointment'
                                            }
                                            onClick={() => onCancel(id)}
                                        >
                                            <XCircle className="w-3.5 h-3.5" />
                                            {payment === 'FULL' ? 'Revert Payment First' : 'Cancel'}
                                        </Button>
                                        <Button
                                            size="sm" fullWidth
                                            loading={updating}
                                            onClick={() => onComplete(id)}
                                            className="bg-blue-50 hover:bg-blue-100 text-blue-600"
                                        >
                                            <CheckCircle className="w-3.5 h-3.5" />
                                            Mark Done
                                        </Button>
                                    </div>
                                )}

                                {/* CANCELLED: mark refunded if deposit was paid */}
                                {status === 'CANCELLED' && payment === 'DEPOSIT' && (
                                    <Button
                                        size="sm" variant="primary" fullWidth
                                        loading={updating}
                                        onClick={() => onPaymentUpdate(id, 'REFUNDED')}
                                    >
                                        <IndianRupee className="w-3.5 h-3.5" />
                                        Mark Deposit Refunded
                                    </Button>
                                )}
                            </div>

                            {/* ═══ WHATSAPP ACTIONS ══════════════════════ */}
                            <div className="border border-gray-100 rounded-2xl p-4 space-y-2">
                                <p className="text-xs font-bold text-gray-700">WhatsApp Actions</p>

                                {/* Fix 4: cancelled → cancellation message; others → confirmation */}
                                {status === 'CANCELLED' ? (
                                    <a
                                        href={cancelWaUrl}
                                        target="_blank" rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-semibold py-2.5 rounded-xl transition-colors"
                                    >
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        Send Cancellation Message
                                    </a>
                                ) : (
                                    <a
                                        href={confirmWaUrl}
                                        target="_blank" rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
                                    >
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        {payment === 'DEPOSIT'
                                            ? 'Send Confirmation (Deposit Received ✓)'
                                            : payment === 'FULL'
                                                ? 'Send Confirmation (Fully Paid ✓)'
                                                : 'Send Confirmation Message'}
                                    </a>
                                )}

                                {/* Open chat */}
                                <a
                                    href={`https://wa.me/91${phone}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-2 rounded-xl transition-colors"
                                >
                                    <Phone className="w-3.5 h-3.5" />
                                    Open WhatsApp Chat
                                </a>

                                {/* Feedback — completed only */}
                                {status === 'COMPLETED' && (
                                    <a
                                        href={feedbackWaUrl}
                                        target="_blank" rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-1.5 bg-gold-50 hover:bg-gold-100 border border-gold-200 text-gold-700 text-xs font-semibold py-2.5 rounded-xl transition-colors"
                                    >
                                        <Star className="w-3.5 h-3.5" />
                                        Request Feedback via WhatsApp
                                    </a>
                                )}
                            </div>
                        </div >
                    )
                    }

                    {/* Patient-side status messages */}
                    {
                        !isAdmin && status === 'PENDING' && (
                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
                                ⏳ Your appointment is awaiting confirmation. You will receive a
                                WhatsApp notification once confirmed.
                            </div>
                        )
                    }
                    {
                        !isAdmin && status === 'CONFIRMED' && (
                            <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-xs text-green-700">
                                ✅ Confirmed! You will receive reminders 1 day before and 2 hours
                                before your appointment.
                            </div>
                        )
                    }
                    {
                        !isAdmin && status === 'CANCELLED' && (
                            <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-700">
                                ❌ This appointment has been cancelled.
                                {cancelReason ? ` Reason: ${cancelReason}` : ''}
                            </div>
                        )
                    }
                </div >
            )
            }
        </div >
    )
}