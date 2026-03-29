// import { useState, useCallback } from 'react'
// import {
//   fetchAllAppointments,
//   fetchByPhone,
//   confirmAppointment,
// } from '../lib/api'
// import { storage } from '../lib/utils'
// import toast from 'react-hot-toast'
// import { saveToSheet } from '../lib/sheets'

// // ─── Patient: look up by phone ────────────────────────────────
// export function usePatientAppointments() {
//   const [appointments, setAppointments] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [searched, setSearched] = useState(false)

//   const search = async (phone) => {
//     setLoading(true)
//     setSearched(false)
//     try {
//       const data = await fetchByPhone(phone)
//       setAppointments(data.appointments || [])
//       setSearched(true)
//     } catch {
//       toast.error('Could not fetch appointments. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return { appointments, loading, searched, search }
// }

// // ─── Admin: full list + mutation actions ──────────────────────
// export function useAdminAppointments() {
//   const [appointments, setAppointments] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [updating, setUpdating] = useState(null) // id of row being updated

//   const getToken = () => storage.get('niramay_admin')?.token || ''

//   const load = useCallback(async () => {
//     setLoading(true)
//     try {
//       const data = await fetchAllAppointments()  // no token argument
//       setAppointments(data.appointments || [])
//     } catch {
//       toast.error('Failed to load appointments.')
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   const update = async (id, updates, successMsg) => {
//     setUpdating(id)
//     try {
//       await confirmAppointment(id, updates)
//       toast.success(successMsg || 'Updated successfully!')
//       // Optimistic UI update
//       setAppointments((prev) =>
//         prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
//       )
//     } catch (err) {
//       toast.error(err.message || 'Update failed.')
//     } finally {
//       setUpdating(null)
//     }
//   }

//   // const confirm  = (id) => update(id, { status: 'CONFIRMED' }, 'Appointment confirmed! WhatsApp sent to patient.')
//   const confirm = async (id) => {
//     await update(id, { status: 'CONFIRMED' }, 'Appointment confirmed! WhatsApp sent to patient.')

//     // Find the appointment and save to Google Sheet
//     const appt = appointments.find((a) => a.id === id)
//     if (appt) {
//       saveToSheet({ ...appt, status: 'CONFIRMED' })
//         .then(() => console.log('Saved to Google Sheets ✅'))
//         .catch(() => console.warn('Sheet save failed — check webhook URL'))
//     }
//   }
//   const cancel = (id) => update(id, { status: 'CANCELLED' }, 'Appointment cancelled.')
//   const complete = (id) => update(id, { status: 'COMPLETED' }, 'Marked as completed.')
//   const setPayment = (id, payment) => update(id, { payment }, `Payment updated to ${payment}.`)

//   // Computed stats
//   const stats = {
//     total: appointments.length,
//     pending: appointments.filter((a) => a.status === 'PENDING').length,
//     confirmed: appointments.filter((a) => a.status === 'CONFIRMED').length,
//     today: appointments.filter((a) => {
//       const d = new Date(a.date)
//       return d.toDateString() === new Date().toDateString()
//     }).length,
//   }

//   return {
//     appointments,
//     loading,
//     updating,
//     stats,
//     load,
//     confirm,
//     cancel,
//     complete,
//     setPayment,
//   }
// }




















import { useState, useCallback } from 'react'
import {
  fetchAllAppointments,
  fetchByPhone,
  confirmAppointment,
} from '../lib/api'
import { storage } from '../lib/utils'
import toast from 'react-hot-toast'

// ─── Patient: look up by phone ────────────────────────────────
export function usePatientAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading]           = useState(false)
  const [searched, setSearched]         = useState(false)

  const search = async (phone) => {
    setLoading(true)
    setSearched(false)
    try {
      const data = await fetchByPhone(phone)
      setAppointments(data.appointments || [])
      setSearched(true)
    } catch {
      toast.error('Could not fetch appointments. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Optimistic local status update (for cancellation)
  const updateStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    )
  }

  return { appointments, loading, searched, search, updateStatus }
}

// ─── Admin: full list + mutation actions ──────────────────────
export function useAdminAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading]           = useState(false)
  const [updating, setUpdating]         = useState(null)

  const getToken = () => storage.get('niramay_admin')?.token || ''

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAllAppointments()
      setAppointments(data.appointments || [])
    } catch {
      toast.error('Failed to load appointments.')
    } finally {
      setLoading(false)
    }
  }, [])

  const update = async (id, updates, successMsg) => {
    setUpdating(id)
    try {
      await confirmAppointment(id, updates, getToken())
      toast.success(successMsg || 'Updated successfully!')
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
      )
    } catch (err) {
      toast.error(err.message || 'Update failed.')
    } finally {
      setUpdating(null)
    }
  }

  const confirm     = (id) => update(id, { status: 'CONFIRMED'  }, 'Appointment confirmed!')
  const cancel      = (id) => update(id, { status: 'CANCELLED'  }, 'Appointment cancelled.')
  const complete    = (id) => update(id, { status: 'COMPLETED'  }, 'Marked as completed.')
  const setPayment  = (id, payment) => update(id, { payment }, `Payment updated to ${payment}.`)
  const setRefunded = (id) => update(id, { payment: 'REFUNDED', refundStatus: 'DONE' }, 'Refund marked as processed.')

  const stats = {
    total:        appointments.length,
    pending:      appointments.filter((a) => a.status === 'PENDING').length,
    confirmed:    appointments.filter((a) => a.status === 'CONFIRMED').length,
    cancelled:    appointments.filter((a) => a.status === 'CANCELLED').length,
    refundDue:    appointments.filter((a) =>
                    a.status === 'CANCELLED' &&
                    a.payment === 'DEPOSIT' &&
                    a.refundStatus !== 'DONE'
                  ).length,
    today:        appointments.filter((a) => {
                    const d = new Date(a.date)
                    return d.toDateString() === new Date().toDateString()
                  }).length,
  }

  return {
    appointments, loading, updating, stats,
    load, confirm, cancel, complete, setPayment, setRefunded,
  }
}