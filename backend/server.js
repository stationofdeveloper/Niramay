const express = require('express')
const cors = require('cors')
require('dotenv').config()

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Log connection errors
  log: ['error', 'warn'],
})

// Converts Date objects → ISO strings so React can parse them safely
function normalizeAppointment(appt) {
  return {
    id: appt.id,
    name: appt.name,
    phone: appt.phone,
    email: appt.email || null,
    date: appt.date instanceof Date
      ? appt.date.toISOString()
      : appt.date,
    timeSlot: appt.timeSlot,
    service: appt.service,
    status: appt.status,
    payment: appt.payment,
    notes: appt.notes || null,
    createdAt: appt.createdAt instanceof Date
      ? appt.createdAt.toISOString()
      : appt.createdAt,
  }
}

// Wake up DB on server start
async function wakeDatabase() {
  let attempts = 0
  while (attempts < 5) {
    try {
      await prisma.$connect()
      console.log('✅ Database connected successfully!')
      return
    } catch (e) {
      attempts++
      console.log(`⏳ Database waking up... attempt ${attempts}/5`)
      // Wait 2 seconds before retry
      await new Promise((r) => setTimeout(r, 2000))
    }
  }
  console.error('❌ Could not connect to database after 5 attempts.')
  console.error('Check your DATABASE_URL and make sure Neon is not suspended.')
}

wakeDatabase()


const app = express()

// Allow requests from your React app
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://niramay-clinic.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json())

// ── Health check ────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: '🌿 Niramay backend running!' })
})

// // ── GET /api/availability?date=2024-12-25 ──────────────────
// app.get('/api/availability', async (req, res) => {
//   const { date } = req.query

//   if (!date) {
//     return res.status(400).json({ message: 'date is required' })
//   }

//   try {
//     // Use noon IST to avoid timezone issues
//     const targetDate = new Date(date + 'T12:00:00')
//     const dayStart   = new Date(date + 'T00:00:00')
//     const dayEnd     = new Date(date + 'T23:59:59')

//     const booked = await prisma.appointment.findMany({
//       where: {
//         date:   { gte: dayStart, lte: dayEnd },
//         status: { in: ['PENDING', 'CONFIRMED'] },
//       },
//       select: { timeSlot: true },
//     })

//     const bookedSlots = booked.map((b) => b.timeSlot)
//     console.log(`📅 Availability for ${date}:`, bookedSlots)

//     res.json({ bookedSlots, date })
//   } catch (e) {
//     console.error('Availability error:', e)
//     res.status(500).json({ message: e.message })
//   }
// })

// ── GET /api/availability?date=2024-12-25 ──────────────────
app.get('/api/availability', async (req, res) => {
  const { date } = req.query

  if (!date) {
    return res.status(400).json({ message: 'date is required' })
  }

  try {
    const dayStart = new Date(date + 'T00:00:00.000Z')
    const dayEnd = new Date(date + 'T23:59:59.999Z')

    // Get booked appointments (PENDING or CONFIRMED)
    const booked = await prisma.appointment.findMany({
      where: {
        date: { gte: dayStart, lte: dayEnd },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      select: { timeSlot: true },
    })

    // Get admin-blocked slots
    const blocked = await prisma.blockedSlot.findMany({
      where: {
        date: { gte: dayStart, lte: dayEnd },
      },
      select: { timeSlot: true },
    })

    const bookedSlots = [
      ...booked.map((b) => b.timeSlot),
      ...blocked.map((b) => b.timeSlot),
    ]

    // Remove duplicates
    const unique = [...new Set(bookedSlots)]

    console.log(`📅 ${date} — unavailable slots:`, unique.length ? unique : 'none')
    res.json({ bookedSlots: unique, date, blockedSlots: blocked.map((b) => b.timeSlot) })

  } catch (e) {
    console.error('❌ Availability error:', e.message)
    res.json({ bookedSlots: [], date, warning: 'Could not check availability' })
  }
})

// ── POST /api/appointments ──────────────────────────────────
app.post('/api/appointments', async (req, res) => {
  // const { name, phone, email, service, date, timeSlot, notes } = req.body
  const { name, phone, email, service, date, timeSlot, notes, status, payment } = req.body

  if (!name || !phone || !date || !timeSlot || !service) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const dayStart = new Date(date + 'T00:00:00')
    const dayEnd = new Date(date + 'T23:59:59')

    // Race-condition safe slot check
    const existing = await prisma.appointment.findFirst({
      where: {
        date: { gte: dayStart, lte: dayEnd },
        timeSlot,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    })

    if (existing) {
      return res.status(409).json({
        message: 'This slot is no longer available.',
        slotTaken: true,
      })
    }

    const appt = await prisma.appointment.create({
      data: {
        name,
        phone,
        email: email || null,
        service,
        date: new Date(date + 'T12:00:00'),
        timeSlot,
        notes: notes || null,
        status: status || 'PENDING',   // ← accept status from request
        payment: payment || 'NONE',      // ← accept payment from request
      },
    })

    console.log('✅ New appointment:', appt.id, name, date, timeSlot)
    res.json({ success: true, appointmentId: appt.id })
  } catch (e) {
    console.error('Booking error:', e)
    res.status(500).json({ message: e.message })
  }
})

// ── GET /api/admin?action=list ─────────────────────────────
app.get('/api/admin', async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: [{ status: 'asc' }, { date: 'asc' }],
    })

    // Normalize all date fields to ISO strings
    const normalized = appointments.map(normalizeAppointment)
    res.json({ appointments: normalized })
  } catch (e) {
    console.error('Admin list error:', e.message)
    res.status(500).json({ message: e.message })
  }
})


// ── POST /api/confirm ──────────────────────────────────────
app.post('/api/confirm', async (req, res) => {
  console.log('Confirm request body:', req.body)  // debug

  const { id, status, payment, refundStatus } = req.body

  if (!id) {
    return res.status(400).json({ message: 'id is required' })
  }

  const VALID_STATUS = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']
  const VALID_PAYMENT = ['NONE', 'DEPOSIT', 'FULL', 'REFUNDED']

  const data = {}
  if (status && VALID_STATUS.includes(status)) data.status = status
  if (payment && VALID_PAYMENT.includes(payment)) data.payment = payment
  if (refundStatus) data.refundStatus = refundStatus

  if (!Object.keys(data).length) {
    return res.status(400).json({ message: 'Nothing to update' })
  }

  try {
    const existing = await prisma.appointment.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ message: 'Appointment not found' })
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data,
    })

    console.log('✅ Updated appointment:', id, data)
    res.json({
      success: true,
      message: 'Updated successfully.',
      appointment: normalizeAppointment(updated),
    })
  } catch (e) {
    console.error('❌ Confirm error:', e.message)
    res.status(500).json({ message: 'Server error: ' + e.message })
  }
})




// ── GET /api/appointments?phone=9876543210 ─────────────────
app.get('/api/appointments', async (req, res) => {
  const { phone } = req.query
  if (!phone) return res.status(400).json({ message: 'phone is required' })

  try {
    const appointments = await prisma.appointment.findMany({
      where: { phone },
      orderBy: { date: 'desc' },
      take: 10,
    })
    res.json({ appointments: appointments.map(normalizeAppointment) })
  } catch (e) {
    console.error('Status error:', e.message)
    res.status(500).json({ message: e.message })
  }
})


// ── POST /api/cancel (patient cancellation) ────────────────
app.post('/api/cancel', async (req, res) => {
  const { id, reason } = req.body

  if (!id) {
    return res.status(400).json({ message: 'id is required' })
  }

  try {
    const appt = await prisma.appointment.findUnique({ where: { id } })

    if (!appt) {
      return res.status(404).json({ message: 'Appointment not found.' })
    }

    if (appt.status === 'CANCELLED') {
      return res.status(400).json({ message: 'Already cancelled.' })
    }

    if (appt.status === 'COMPLETED') {
      return res.status(400).json({ message: 'Completed appointments cannot be cancelled.' })
    }

    // Check refund eligibility
    const now = new Date()
    const apptTime = new Date(appt.date)
    const hoursUntil = (apptTime - now) / (1000 * 60 * 60)
    const refundEligible = hoursUntil > 24

    // Determine refund status
    const refundStatus = appt.payment === 'DEPOSIT' && refundEligible
      ? 'PENDING'   // needs admin to process
      : 'NA'        // no refund due

    await prisma.appointment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelReason: reason || null,
        cancelledAt: new Date(),
        refundStatus,
      },
    })

    console.log(`❌ Appointment ${id} cancelled by patient. Refund: ${refundStatus}`)
    res.json({
      success: true,
      refundEligible,
      refundStatus,
      message: refundEligible
        ? 'Appointment cancelled. Refund will be processed within 3–5 business days.'
        : 'Appointment cancelled. No refund applicable.',
    })

  } catch (e) {
    console.error('Cancel error:', e.message)
    res.status(500).json({ message: 'Server error. Please try again.' })
  }
})

// ── POST /api/admin/block-slots ────────────────────────────
app.post('/api/admin/block-slots', async (req, res) => {
  const { date, slots, reason } = req.body

  if (!date || !Array.isArray(slots) || slots.length === 0) {
    return res.status(400).json({ message: 'date and slots array are required' })
  }

  try {
    const targetDate = new Date(date + 'T12:00:00')
    const created = []
    const skipped = []

    for (const slot of slots) {
      // Check if already blocked
      const existing = await prisma.blockedSlot.findFirst({
        where: {
          date: targetDate,
          timeSlot: slot,
        },
      })

      if (existing) {
        skipped.push(slot)
        continue
      }

      await prisma.blockedSlot.create({
        data: {
          date: targetDate,
          timeSlot: slot,
          reason: reason || null,
        },
      })
      created.push(slot)
    }

    console.log(`🚫 Blocked ${created.length} slots on ${date}:`, created)
    res.json({
      success: true,
      blocked: created,
      skipped,
      message: `${created.length} slot${created.length !== 1 ? 's' : ''} blocked.`,
    })
  } catch (e) {
    console.error('Block slot error:', e.message)
    res.status(500).json({ message: 'Server error: ' + e.message })
  }
})

// ── GET /api/admin/block-slots?date=2025-01-15 ─────────────
app.get('/api/admin/block-slots', async (req, res) => {
  const { date } = req.query

  try {
    const where = {}

    if (date) {
      where.date = {
        gte: new Date(date + 'T00:00:00'),
        lte: new Date(date + 'T23:59:59'),
      }
    }

    const slots = await prisma.blockedSlot.findMany({
      where,
      orderBy: [{ date: 'asc' }, { timeSlot: 'asc' }],
    })

    res.json({ slots })
  } catch (e) {
    console.error('Get blocked slots error:', e.message)
    res.status(500).json({ message: e.message })
  }
})

// ── DELETE /api/admin/block-slots ──────────────────────────
app.delete('/api/admin/block-slots', async (req, res) => {
  const { id } = req.body
  if (!id) return res.status(400).json({ message: 'id is required' })

  try {
    await prisma.blockedSlot.delete({ where: { id } })
    res.json({ success: true, message: 'Slot unblocked.' })
  } catch (e) {
    console.error('Unblock slot error:', e.message)
    res.status(500).json({ message: e.message })
  }
})

//FEEDBACK
// ── POST /api/feedback ─────────────────────────────────────
app.post('/api/feedback', async (req, res) => {
  const { appointmentId, name, phone, service, rating, comment, wouldRecommend } = req.body

  if (!appointmentId || !rating || !name || !phone || !service) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' })
  }

  try {
    // Check if feedback already submitted
    const existing = await prisma.feedback.findUnique({ where: { appointmentId } })
    if (existing) {
      return res.status(409).json({ message: 'Feedback already submitted for this appointment.' })
    }

    const feedback = await prisma.feedback.create({
      data: {
        appointmentId,
        name,
        phone,
        service,
        rating: parseInt(rating),
        comment: comment || null,
        wouldRecommend: wouldRecommend !== false,
      },
    })

    res.json({ success: true, feedbackId: feedback.id })
  } catch (e) {
    console.error('Feedback error:', e.message)
    res.status(500).json({ message: 'Server error' })
  }
})
// ── GET /api/feedback ──────────────────────────────────────
// Returns approved feedback for landing page display
app.get('/api/feedback', async (req, res) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true, name: true, service: true,
        rating: true, comment: true,
        wouldRecommend: true, createdAt: true,
      },
    })
    res.json({ feedbacks })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})



const PORT = process.env.PORT || 10000 ||4000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌿 Niramay backend running on http://localhost:${PORT}`)
})

setInterval(async () => {
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log('💓 DB keepalive ping sent')
  } catch (e) {
    console.warn('⚠️ Keepalive ping failed:', e.message)
  }
}, 4 * 60 * 1000)