// import { CLINIC_PHONE } from './constants'

// // ─── Patient booking request → clinic ────────────────────────
// export const buildBookingURL = ({ name, service, date, timeSlot, deposit, price }) => {
//   const depositLine = deposit
//     ? `\n💰 *Deposit:* ₹${deposit?.toLocaleString('en-IN')} (refundable)`
//     : ''
//   const priceLine = price
//     ? `\n💵 *Total Fee:* ₹${price?.toLocaleString('en-IN')}` : ''

//   const message =
// `🙏 *Appointment Request — Niramay Ayurvedic Clinik*

// Hello! I would like to book an appointment.

// 👤 *Name:* ${name}
// 💆 *Service:* ${service}
// 📅 *Date:* ${date}
// ⏰ *Time:* ${timeSlot}${priceLine}${depositLine}

// Please confirm my appointment. Thank you! 🌿`

//   return `https://wa.me/91${CLINIC_PHONE}?text=${encodeURIComponent(message)}`
// }

// // ─── Admin → Patient: Confirmation message ───────────────────
// export const buildConfirmURL = ({ phone, name, service, date, timeSlot, payment, price, deposit }) => {
//   const paymentLine =
//     payment === 'FULL'
//       ? `✅ *Full Payment:* ₹${price?.toLocaleString('en-IN')} — Received`
//       : payment === 'DEPOSIT'
//       ? `✅ *Deposit Paid:* ₹${deposit?.toLocaleString('en-IN')}\n🔄 *Balance Due at Clinic:* ₹${((price||0)-(deposit||0)).toLocaleString('en-IN')}`
//       : `💰 *Payment:* Due at clinic`

//   const message =
// `🌿 *Booking Confirmed — Niramay Ayurvedic Clinik*

// Namaskar *${name}*! 🙏

// Your appointment has been *CONFIRMED* ✅

// 📋 *Appointment Details:*
// 💆 Service: ${service}
// 📅 Date: ${date}
// ⏰ Time: ${timeSlot}

// 💰 *Payment Details:*
// ${paymentLine}

// ⚠️ *Cancellation Policy:*
// Cancel 24+ hrs before → Full deposit refunded
// Cancel within 24 hrs → Deposit non-refundable

// For queries, call: *+91 ${CLINIC_PHONE}*

// See you soon! 🌱
// — Niramay Ayurvedic Clinik`

//   return `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`
// }

// // ─── Admin → Patient: Cancellation message ───────────────────
// export const buildCancelURL = ({ phone, name, service, date }) => {
//   const message =
// `Hello *${name}*,

// Your appointment for *${service}* on *${date}* has been *cancelled*.

// Please call us at *+91 ${CLINIC_PHONE}* to reschedule.

// We apologise for the inconvenience. 🙏
// — Niramay Ayurvedic Clinik`

//   return `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`
// }

// // ─── Quick inquiry ────────────────────────────────────────────
// export const buildInquiryURL = (topic = 'your treatments') => {
//   const message = `Hello! I would like to know more about ${topic} at Niramay Ayurvedic Clinik.`
//   return `https://wa.me/91${CLINIC_PHONE}?text=${encodeURIComponent(message)}`
// }

// // export const sendConfirmationWhatsApp=()=>{

// // }

// // Add this function to whatsapp.js
// export const buildFeedbackWhatsAppURL = ({ phone, name, appointmentId, service }) => {
//   // Admin sends this to patient after appointment
//   // It contains a deep link to the feedback page with pre-filled data
//   const feedbackUrl = `${window.location.origin}/feedback?id=${appointmentId}&name=${encodeURIComponent(name)}&service=${encodeURIComponent(service)}&phone=${phone}`

//   const message =
// `🌿 *Niramay Ayurvedic Clinik*

// Namaskar *${name}*! 🙏

// Thank you for visiting us today. We hope your *${service}* session was a wonderful experience.

// We would love to hear your feedback — it takes just 30 seconds!

// 👉 ${feedbackUrl}

// Your feedback helps us serve you better. 🌱

// — Niramay Ayurvedic Clinik`

//   return `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`
// }












import { CLINIC_PHONE } from './constants'

// ─── Patient booking request → clinic ────────────────────────
export const buildBookingURL = ({ name, service, date, timeSlot, deposit, price }) => {
  const depositLine = deposit
    ? `\n💰 *Deposit:* ₹${Number(deposit).toLocaleString('en-IN')} (refundable)`
    : ''
  const priceLine = price
    ? `\n💵 *Total Fee:* ₹${Number(price).toLocaleString('en-IN')}`
    : ''

  const message =
`🙏 *Appointment Request — Niramay Ayurvedic Clinik*

Hello! I would like to book an appointment.

👤 *Name:* ${name}
💆 *Service:* ${service}
📅 *Date:* ${date}
⏰ *Time:* ${timeSlot}${priceLine}${depositLine}

Please confirm my appointment. Thank you! 🌿`

  return `https://wa.me/91${CLINIC_PHONE}?text=${encodeURIComponent(message)}`
}

// ─── Admin → Patient: Confirmation message ───────────────────
// Fix 5: includes payment status (deposit received / full paid)
export const buildConfirmURL = ({ phone, name, service, date, timeSlot, payment, price, deposit }) => {
  const p       = Number(price)   || 0
  const d       = Number(deposit) || 0
  const balance = p - d

  let paymentLine = ''
  if (payment === 'FULL') {
    paymentLine = `✅ *Full Payment Received:* ₹${p.toLocaleString('en-IN')}\n🎉 No balance due at clinic!`
  } else if (payment === 'DEPOSIT') {
    paymentLine =
`✅ *Deposit Received:* ₹${d.toLocaleString('en-IN')}
🔄 *Balance Due at Clinic:* ₹${balance.toLocaleString('en-IN')}`
  } else {
    paymentLine = `💰 *Payment:* Due at clinic`
  }

  const message =
`🌿 *Booking Confirmed — Niramay Ayurvedic Clinik*

Namaskar *${name}*! 🙏

Your appointment has been *CONFIRMED* ✅

📋 *Appointment Details:*
💆 Service: ${service}
📅 Date: ${date}
⏰ Time: ${timeSlot}

💰 *Payment Details:*
${paymentLine}

⚠️ *Cancellation Policy:*
Cancel 24+ hrs before → Full deposit refunded
Cancel within 24 hrs → Deposit non-refundable

For queries, call: *+91 ${CLINIC_PHONE}*

See you soon! 🌱
— Niramay Ayurvedic Clinik`

  return `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`
}

// ─── Fix 4: Admin → Patient: Cancellation message ─────────────
export const buildCancelURL = ({ phone, name, service, date, cancelReason }) => {
  const reasonLine = cancelReason ? `\n📝 *Reason:* ${cancelReason}` : ''

  const message =
`🌿 *Niramay Ayurvedic Clinik*

Namaskar *${name}*, 🙏

We regret to inform you that your appointment has been *cancelled*.

💆 *Service:* ${service}
📅 *Date:* ${date}${reasonLine}

Please call us at *+91 ${CLINIC_PHONE}* to reschedule at your convenience.

We apologise for the inconvenience. 🙏
— Niramay Ayurvedic Clinik`

  return `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`
}

// ─── Quick inquiry ────────────────────────────────────────────
export const buildInquiryURL = (topic = 'your treatments') => {
  const message = `Hello! I would like to know more about ${topic} at Niramay Ayurvedic Clinik.`
  return `https://wa.me/91${CLINIC_PHONE}?text=${encodeURIComponent(message)}`
}

// ─── Admin sends feedback request to completed patient ────────
export const buildFeedbackWhatsAppURL = ({ phone, name, appointmentId, service }) => {
  const feedbackUrl = `${window.location.origin}/feedback?id=${appointmentId}&name=${encodeURIComponent(name)}&service=${encodeURIComponent(service)}&phone=${phone}`

  const message =
`🌿 *Niramay Ayurvedic Clinik*

Namaskar *${name}*! 🙏

Thank you for visiting us. We hope your *${service}* session was wonderful.

We'd love to hear your feedback — it takes just 30 seconds!

👉 ${feedbackUrl}

Your feedback helps us serve you better. 🌱
— Niramay Ayurvedic Clinik`

  return `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`
}

// ─── Patient → Admin: cancellation request ───────────────────
export const buildCancellationRequestURL = ({
  name, phone, service, date, timeSlot, payment, deposit, price
}) => {
  const paymentLine =
    payment === 'FULL'
      ? `💵 Full payment of ₹${price?.toLocaleString('en-IN')} was made. I request a full refund.`
      : payment === 'DEPOSIT'
      ? `💰 Deposit of ₹${deposit?.toLocaleString('en-IN')} was paid. I request a refund.`
      : `No payment was made.`

  const message =
`🚫 *Appointment Cancellation Request*

Hello Niramay Ayurvedic Clinik,

I would like to cancel my appointment.

👤 *Name:* ${name}
📞 *Phone:* +91 ${phone}
💆 *Service:* ${service}
📅 *Date:* ${date}
⏰ *Time:* ${timeSlot}

💳 *Payment Details:*
${paymentLine}

Please confirm the cancellation and process the refund if applicable.

Thank you 🙏`

  return `https://wa.me/91${CLINIC_PHONE}?text=${encodeURIComponent(message)}`
}