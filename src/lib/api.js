import { API_BASE } from './constants'

// ─── Generic fetch wrapper ────────────────────────────────────
async function request(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Request failed')
    return data
}

// ─── Availability ─────────────────────────────────────────────
export const fetchAvailability = (date) =>
    request(`/api/availability?date=${date}`)

// ─── Appointments (patient) ───────────────────────────────────
export const createAppointment = (payload) =>
    request('/api/appointments', { method: 'POST', body: JSON.stringify(payload) })

export const fetchByPhone = (phone) =>
    request(`/api/appointments?phone=${phone}`)

// ─── Admin ────────────────────────────────────────────────────
export const fetchAllAppointments = (token) =>
    request('/api/admin?action=list', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })

export const confirmAppointment = (id, updates, token) =>
    request('/api/confirm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, ...updates }),
    })


// ─── Patient cancels their own appointment ────────────────────
export const cancelAppointment = (id, reason) =>
    request('/api/cancel', {
        method: 'POST',
        body: JSON.stringify({ id, reason }),
    })


export const fetchFeedbacks = () => request('/api/feedback')