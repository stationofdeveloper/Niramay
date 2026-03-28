// import { useState, useEffect } from 'react'
// import { fetchAvailability } from '../lib/api'
// import { TIME_SLOTS } from '../lib/constants'

// export function useAvailability(date) {
//   const [slotStatuses, setSlotStatuses] = useState({})
//   const [loading, setLoading]           = useState(false)
//   const [error, setError]               = useState(null)

//   useEffect(() => {
//     // Clear everything when no date selected
//     if (!date) {
//       setSlotStatuses({})
//       setError(null)
//       return
//     }

//     let cancelled = false

//     const load = async () => {
//       // Show shimmer immediately
//       const loadingMap = {}
//       TIME_SLOTS.forEach((s) => { loadingMap[s] = 'loading' })
//       setSlotStatuses(loadingMap)
//       setLoading(true)
//       setError(null)

//       try {
//         const data = await fetchAvailability(date)

//         if (cancelled) return  // Component unmounted — ignore

//         const map = {}
//         TIME_SLOTS.forEach((slot) => {
//           map[slot] = (data.bookedSlots || []).includes(slot)
//             ? 'booked'
//             : 'available'
//         })
//         setSlotStatuses(map)

//       } catch (err) {
//         if (cancelled) return

//         console.error('Availability fetch failed:', err)
//         setError('Could not load slots. Is the backend running?')

//         // Show all slots as available so user is not stuck
//         const fallback = {}
//         TIME_SLOTS.forEach((s) => { fallback[s] = 'available' })
//         setSlotStatuses(fallback)
//       } finally {
//         if (!cancelled) setLoading(false)
//       }
//     }

//     load()

//     return () => { cancelled = true }
//   }, [date])

//   return { slotStatuses, loading, error }
// }










import { useState, useEffect } from 'react'
import { fetchAvailability } from '../lib/api'
import { TIME_SLOTS } from '../lib/constants'

function slotToMinutes(slot) {
  const [time, period] = slot.split(' ')
  let [h, m] = time.split(':').map(Number)
  if (period === 'PM' && h !== 12) h += 12
  if (period === 'AM' && h === 12) h = 0
  return h * 60 + (m || 0)
}

function isSlotPast(slot, selectedDate) {
  const today    = new Date()
  const todayStr = today.toISOString().split('T')[0]
  if (selectedDate !== todayStr) return false
  const nowMinutes  = today.getHours() * 60 + today.getMinutes()
  const slotMinutes = slotToMinutes(slot)
  return slotMinutes <= nowMinutes + 30 // 30-min buffer
}

export function useAvailability(date) {
  const [slotStatuses, setSlotStatuses] = useState({})
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState(null)

  useEffect(() => {
    if (!date) { setSlotStatuses({}); setError(null); return }

    let cancelled = false

    const load = async () => {
      const loadingMap = {}
      TIME_SLOTS.forEach((s) => { loadingMap[s] = 'loading' })
      setSlotStatuses(loadingMap)
      setLoading(true)
      setError(null)

      try {
        const data = await fetchAvailability(date)
        if (cancelled) return

        const map = {}
        TIME_SLOTS.forEach((slot) => {
          if (isSlotPast(slot, date)) {
            map[slot] = 'past'
          } else if ((data.bookedSlots || []).includes(slot)) {
            map[slot] = 'booked'
          } else {
            map[slot] = 'available'
          }
        })
        setSlotStatuses(map)

      } catch (err) {
        if (cancelled) return
        console.error('Availability fetch failed:', err)
        setError('Could not load slots. Is the backend running?')
        const fallback = {}
        TIME_SLOTS.forEach((s) => {
          fallback[s] = isSlotPast(s, date) ? 'past' : 'available'
        })
        setSlotStatuses(fallback)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [date])

  return { slotStatuses, loading, error }
}