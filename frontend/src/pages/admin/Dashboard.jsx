// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import {
//   Leaf, LogOut, RefreshCw, Search,
//   CheckCircle, XCircle, AlertCircle,
//   Users, Calendar, TrendingUp, Clock,
//   Loader2, Filter, ChevronDown, ChevronUp
// } from 'lucide-react'
// import toast from 'react-hot-toast'
// import AppointmentCard from '../../components/AppointmentCard'
// import Button from '../../components/ui/Button'
// import { useAuth } from '../../hooks/useAuth'
// import { useAdminAppointments } from '../../hooks/useAppointments'
// import { formatShortDate } from '../../lib/utils'

// // ─── Status filter tabs ───────────────────────────────────────
// const FILTERS = [
//   { label: 'All',       value: 'ALL'       },
//   { label: 'Pending',   value: 'PENDING'   },
//   { label: 'Confirmed', value: 'CONFIRMED' },
//   { label: 'Completed', value: 'COMPLETED' },
//   { label: 'Cancelled', value: 'CANCELLED' },
// ]

// // ─── Stat card ────────────────────────────────────────────────
// function StatCard({ icon: Icon, label, value, color, highlight }) {
//   return (
//     <div
//       className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${
//         highlight ? 'border-amber-200 shadow-amber-50' : 'border-gray-100'
//       }`}
//     >
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-gray-500 text-xs font-medium mb-1">{label}</p>
//           <p className="font-display text-3xl font-bold text-gray-900">
//             {value}
//           </p>
//         </div>
//         <div
//           className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
//         >
//           <Icon className="w-5 h-5" />
//         </div>
//       </div>
//     </div>
//   )
// }

// // ─── Today's schedule strip ───────────────────────────────────
// function TodayStrip({ appointments }) {
//   const todayAppts = appointments
//     .filter((a) => {
//       const d = new Date(a.date)
//       return (
//         d.toDateString() === new Date().toDateString() &&
//         a.status === 'CONFIRMED'
//       )
//     })
//     .sort((a, b) => {
//       // Sort by time slot
//       const toMin = (slot) => {
//         const [time, period] = slot.split(' ')
//         let [h, m] = time.split(':').map(Number)
//         if (period === 'PM' && h !== 12) h += 12
//         if (period === 'AM' && h === 12) h = 0
//         return h * 60 + (m || 0)
//       }
//       return toMin(a.timeSlot) - toMin(b.timeSlot)
//     })

//   if (todayAppts.length === 0) return null

//   return (
//     <div className="bg-forest-600 rounded-2xl p-5 mb-6">
//       <p className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
//         <Clock className="w-4 h-4 text-gold-300" />
//         Today&apos;s Schedule — {todayAppts.length} appointment
//         {todayAppts.length > 1 ? 's' : ''}
//       </p>
//       <div className="flex flex-wrap gap-2">
//         {todayAppts.map((a) => (
//           <div
//             key={a.id}
//             className="bg-white/15 border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
//           >
//             <span className="font-semibold">{a.timeSlot}</span>
//             <span className="mx-1.5 text-white/40">·</span>
//             <span>{a.name}</span>
//             <span className="mx-1.5 text-white/40">·</span>
//             <span className="text-white/70">{a.service.split(' ')[0]}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// // ─── Empty state ──────────────────────────────────────────────
// function EmptyState({ filter, search }) {
//   return (
//     <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
//       <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-3" />
//       <p className="text-gray-400 font-medium">No appointments found</p>
//       {(filter !== 'ALL' || search) && (
//         <p className="text-gray-300 text-sm mt-1">
//           Try clearing your filters
//         </p>
//       )}
//     </div>
//   )
// }

// // ─── Main dashboard ───────────────────────────────────────────
// export default function Dashboard() {
//   const navigate    = useNavigate()
//   const { admin, logout } = useAuth()

//   const {
//     appointments,
//     loading,
//     updating,
//     stats,
//     load,
//     confirm,
//     cancel,
//     complete,
//     setPayment,
//   } = useAdminAppointments()

//   const [filter, setFilter]   = useState('ALL')
//   const [search, setSearch]   = useState('')
//   const [sortDir, setSortDir] = useState('asc') // asc | desc by date

//   // Load appointments on mount
//   useEffect(() => { load() }, [load])

//   const handleLogout = () => {
//     logout()
//     navigate('/admin/login', { replace: true })
//   }

//   // ── Filter + search + sort ────────────────────────────────────
//   const filtered = appointments
//     .filter((a) => {
//       const matchStatus =
//         filter === 'ALL' || a.status === filter
//       const q = search.toLowerCase()
//       const matchSearch =
//         !search ||
//         a.name.toLowerCase().includes(q) ||
//         a.phone.includes(q) ||
//         a.service.toLowerCase().includes(q)
//       return matchStatus && matchSearch
//     })
//     .sort((a, b) => {
//       const da = new Date(a.date)
//       const db = new Date(b.date)
//       return sortDir === 'asc' ? da - db : db - da
//     })

//   return (
//     <div className="min-h-screen bg-gray-50">

//       {/* ── Top Navbar ──────────────────────────────────────── */}
//       <header className="bg-forest-800 shadow-lg sticky top-0 z-40">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

//           {/* Logo */}
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 bg-forest-600 rounded-xl flex items-center justify-center">
//               <Leaf className="w-4 h-4 text-cream-100" />
//             </div>
//             <div>
//               <p className="font-display font-bold text-white text-sm leading-none">
//                 Niramay
//               </p>
//               <p className="text-[9px] text-forest-400 tracking-wider uppercase">
//                 Admin Dashboard
//               </p>
//             </div>
//           </div>

//           {/* Right: refresh + logout */}
//           <div className="flex items-center gap-2">
//             <span className="text-forest-400 text-xs hidden sm:block mr-2">
//               👋 {admin?.username}
//             </span>
//             <button
//               onClick={load}
//               title="Refresh"
//               className="p-2 text-forest-300 hover:text-white hover:bg-forest-700 rounded-lg transition-colors"
//             >
//               <RefreshCw
//                 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
//               />
//             </button>
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-1.5 text-forest-300 hover:text-white text-sm px-3 py-1.5 hover:bg-forest-700 rounded-lg transition-colors"
//             >
//               <LogOut className="w-4 h-4" />
//               <span className="hidden sm:inline">Sign Out</span>
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

//         {/* ── Stats ─────────────────────────────────────────── */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <StatCard
//             icon={Users}
//             label="Total Appointments"
//             value={stats.total}
//             color="bg-blue-50 text-blue-600"
//           />
//           <StatCard
//             icon={AlertCircle}
//             label="Pending Review"
//             value={stats.pending}
//             color="bg-amber-50 text-amber-600"
//             highlight={stats.pending > 0}
//           />
//           <StatCard
//             icon={CheckCircle}
//             label="Confirmed"
//             value={stats.confirmed}
//             color="bg-green-50 text-green-600"
//           />
//           <StatCard
//             icon={Calendar}
//             label="Today's Appointments"
//             value={stats.today}
//             color="bg-forest-50 text-forest-600"
//           />
//         </div>

//         {/* ── Today's strip ─────────────────────────────────── */}
//         <TodayStrip appointments={appointments} />

//         {/* ── Pending alert banner ──────────────────────────── */}
//         {stats.pending > 0 && (
//           <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-6 flex items-center justify-between gap-4">
//             <div className="flex items-center gap-3">
//               <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
//               <p className="text-amber-800 text-sm font-medium">
//                 {stats.pending} appointment
//                 {stats.pending > 1 ? 's' : ''} waiting for your confirmation
//               </p>
//             </div>
//             <button
//               onClick={() => setFilter('PENDING')}
//               className="text-amber-700 hover:text-amber-900 text-xs font-semibold underline flex-shrink-0"
//             >
//               View all →
//             </button>
//           </div>
//         )}

//         {/* ── Filters & search bar ──────────────────────────── */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
//           <div className="flex flex-col sm:flex-row gap-3">

//             {/* Search input */}
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//               <input
//                 type="text"
//                 placeholder="Search by name, phone, or service..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 focus:border-transparent"
//               />
//             </div>

//             {/* Sort button */}
//             <button
//               onClick={() =>
//                 setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
//               }
//               className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0"
//             >
//               <Calendar className="w-3.5 h-3.5" />
//               Date{' '}
//               {sortDir === 'asc' ? (
//                 <ChevronUp className="w-3.5 h-3.5" />
//               ) : (
//                 <ChevronDown className="w-3.5 h-3.5" />
//               )}
//             </button>
//           </div>

//           {/* Status filter tabs */}
//           <div className="flex gap-2 flex-wrap mt-3">
//             {FILTERS.map((f) => {
//               const isPending = f.value === 'PENDING' && stats.pending > 0
//               return (
//                 <button
//                   key={f.value}
//                   onClick={() => setFilter(f.value)}
//                   className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
//                     filter === f.value
//                       ? 'bg-forest-600 text-white shadow-md'
//                       : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                   }`}
//                 >
//                   {f.label}
//                   {isPending && (
//                     <span className="ml-1.5 bg-amber-400 text-white text-[10px] w-4 h-4 rounded-full inline-flex items-center justify-center font-bold">
//                       {stats.pending}
//                     </span>
//                   )}
//                 </button>
//               )
//             })}

//             {/* Clear filters */}
//             {(filter !== 'ALL' || search) && (
//               <button
//                 onClick={() => { setFilter('ALL'); setSearch('') }}
//                 className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors ml-auto"
//               >
//                 ✕ Clear filters
//               </button>
//             )}
//           </div>
//         </div>

//         {/* ── Results count ─────────────────────────────────── */}
//         {!loading && (
//           <p className="text-xs text-gray-400 mb-3 px-1">
//             Showing {filtered.length} of {appointments.length} appointment
//             {appointments.length !== 1 ? 's' : ''}
//           </p>
//         )}

//         {/* ── Appointment list ───────────────────────────────── */}
//         {loading ? (
//           <div className="flex items-center justify-center py-24">
//             <div className="text-center">
//               <Loader2 className="w-8 h-8 animate-spin text-forest-600 mx-auto mb-3" />
//               <p className="text-gray-400 text-sm">Loading appointments...</p>
//             </div>
//           </div>
//         ) : filtered.length === 0 ? (
//           <EmptyState filter={filter} search={search} />
//         ) : (
//           <div className="space-y-3">
//             {filtered.map((appt) => (
//               <AppointmentCard
//                 key={appt.id}
//                 appointment={appt}
//                 isAdmin={true}
//                 updating={updating === appt.id}
//                 onConfirm={confirm}
//                 onCancel={cancel}
//                 onComplete={complete}
//                 onPaymentUpdate={setPayment}
//               />
//             ))}
//           </div>
//         )}

//         {/* ── Bottom action bar (bulk hint) ─────────────────── */}
//         {filtered.length > 0 && !loading && (
//           <div className="mt-8 text-center text-gray-300 text-xs">
//             Click any appointment row to expand details & take actions
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

























import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Leaf, LogOut, RefreshCw, Search,
  CheckCircle, XCircle, AlertCircle,
  Users, Calendar, Clock, Loader2,
  ChevronDown, ChevronUp, IndianRupee,
  TrendingUp, Ban, UserPlus
} from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import AppointmentCard from '../../components/AppointmentCard'
import AddAppointmentModal from '../../components/AddAppointmentModal'
import BlockSlotModal from '../../components/BlockSlotModal'
import Button from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { useAdminAppointments } from '../../hooks/useAppointments'
import { formatShortDate } from '../../lib/utils'
import { SERVICES } from '../../lib/constants'


// ─── Helpers ──────────────────────────────────────────────────
const FILTERS = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Refunds Due', value: 'REFUND' },
]

const STATUS_COLORS = {
  PENDING: '#f59e0b',
  CONFIRMED: '#10b981',
  COMPLETED: '#3b82f6',
  CANCELLED: '#ef4444',
}

const CHART_COLORS = ['#2d6e4e', '#d4a017', '#3b82f6', '#ef4444', '#f97316']

function getServiceDeposit(serviceName) {
  return SERVICES.find((s) => s.label === serviceName)?.deposit || 0
}
function getServicePrice(serviceName) {
  return SERVICES.find((s) => s.label === serviceName)?.price || 0
}

// ─── Stat card ────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color, highlight }) {
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${highlight ? 'border-amber-200 shadow-amber-50' : 'border-gray-100'
      }`}>
      <div className="flex items-start justify-between mb-2">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="font-display text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-gray-500 text-xs font-medium mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

// ─── Today's strip ────────────────────────────────────────────
function TodayStrip({ appointments }) {
  const today = appointments
    .filter((a) => {
      const d = new Date(a.date)
      return d.toDateString() === new Date().toDateString() && a.status === 'CONFIRMED'
    })
    .sort((a, b) => {
      const toMin = (slot) => {
        const [time, period] = slot.split(' ')
        let [h, m] = time.split(':').map(Number)
        if (period === 'PM' && h !== 12) h += 12
        if (period === 'AM' && h === 12) h = 0
        return h * 60 + (m || 0)
      }
      return toMin(a.timeSlot) - toMin(b.timeSlot)
    })

  if (!today.length) return null

  return (
    <div className="bg-forest-600 rounded-2xl p-5 mb-6">
      <p className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4 text-gold-300" />
        Today&apos;s Schedule — {today.length} appointment{today.length > 1 ? 's' : ''}
      </p>
      <div className="flex flex-wrap gap-2">
        {today.map((a) => (
          <div key={a.id} className="bg-white/15 border border-white/20 rounded-xl px-3 py-2 text-xs text-white">
            <span className="font-semibold">{a.timeSlot}</span>
            <span className="mx-1.5 text-white/40">·</span>
            <span>{a.name}</span>
            <span className="mx-1.5 text-white/40">·</span>
            <span className="text-white/70">{a.service.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Refund card ──────────────────────────────────────────────
function RefundCard({ appointment, onMarkRefunded, updating }) {
  const [exp, setExp] = useState(false)
  return (
    <div className="bg-white rounded-2xl border border-orange-200 shadow-sm overflow-hidden">
      <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExp(!exp)}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-gray-900 text-sm">{appointment.name}</p>
            <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              REFUND DUE
            </span>
          </div>
          <p className="text-xs text-gray-500">+91 {appointment.phone} · {appointment.service}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Was: {formatShortDate(appointment.date)} at {appointment.timeSlot}
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${exp ? 'rotate-180' : ''}`} />
      </div>

      {exp && (
        <div className="px-4 pb-4 border-t border-orange-50 pt-3 space-y-3">
          {appointment.cancelReason && (
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs font-medium text-gray-500 mb-1">Cancellation Reason</p>
              <p className="text-sm text-gray-700">{appointment.cancelReason}</p>
            </div>
          )}
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
            <p className="text-xs font-semibold text-orange-800 mb-1">💰 Refund Instructions</p>
            <p className="text-xs text-orange-700">
              Send deposit back to: <strong className="select-all">+91 {appointment.phone}</strong>
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href={`https://wa.me/91${appointment.phone}?text=${encodeURIComponent(
                `Hello ${appointment.name}, your refund for the cancelled ${appointment.service} appointment on ${formatShortDate(appointment.date)} has been processed. Allow 1–2 business days. — Niramay Ayurvedic Clinik 🙏`
              )}`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Notify Patient
            </a>
            <Button
              size="sm" variant="primary" fullWidth
              loading={updating === appointment.id}
              onClick={() => onMarkRefunded(appointment.id)}
              className="flex-1"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Mark Refunded
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Earnings section ─────────────────────────────────────────
function EarningsSection({ appointments }) {
  const now = new Date()
  const today = now.toDateString()
  const month = now.getMonth()
  const year = now.getFullYear()

  // Only count completed appointments with deposit or full payment
  const paid = appointments.filter(
    (a) => a.status === 'COMPLETED' && (a.payment === 'DEPOSIT' || a.payment === 'FULL')
  )

  const calcEarning = (appt) =>
    appt.payment === 'FULL'
      ? getServicePrice(appt.service)
      : getServiceDeposit(appt.service)

  const todayEarning = paid
    .filter((a) => new Date(a.date).toDateString() === today)
    .reduce((s, a) => s + calcEarning(a), 0)

  const monthEarning = paid
    .filter((a) => {
      const d = new Date(a.date)
      return d.getMonth() === month && d.getFullYear() === year
    })
    .reduce((s, a) => s + calcEarning(a), 0)

  const yearEarning = paid
    .filter((a) => new Date(a.date).getFullYear() === year)
    .reduce((s, a) => s + calcEarning(a), 0)

  // ── Bar chart: last 7 days ────────────────────────────────
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })
    const dayStr = d.toDateString()
    const earning = paid
      .filter((a) => new Date(a.date).toDateString() === dayStr)
      .reduce((s, a) => s + calcEarning(a), 0)
    return { day: label, earning }
  })

  // ── Last 6 months bar chart ───────────────────────────────
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    const label = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
    const earning = paid
      .filter((a) => {
        const ad = new Date(a.date)
        return ad.getMonth() === d.getMonth() && ad.getFullYear() === d.getFullYear()
      })
      .reduce((s, a) => s + calcEarning(a), 0)
    return { month: label, earning }
  })

  // ── Status pie chart data ─────────────────────────────────
  const statusCounts = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((s) => ({
    name: s.charAt(0) + s.slice(1).toLowerCase(),
    value: appointments.filter((a) => a.status === s).length,
    color: STATUS_COLORS[s],
  })).filter((d) => d.value > 0)

  // ── Service distribution ──────────────────────────────────
  const serviceCounts = SERVICES.map((s) => ({
    name: s.label.split(' ')[0],
    count: appointments.filter((a) => a.service === s.label).length,
  })).filter((d) => d.count > 0)

  const fmt = (n) => `₹${n.toLocaleString('en-IN')}`

  return (
    <div className="space-y-6 mb-8">
      <h2 className="font-display text-xl font-bold text-gray-900 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-forest-600" />
        Earnings & Analytics
      </h2>

      {/* Earning cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Today's Earnings", value: fmt(todayEarning), sub: 'Completed today', color: 'bg-forest-50 text-forest-600' },
          { label: "This Month", value: fmt(monthEarning), sub: 'Completed this month', color: 'bg-gold-50 text-gold-600' },
          { label: "This Year", value: fmt(yearEarning), sub: 'Completed this year', color: 'bg-blue-50 text-blue-600' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-xs font-medium mb-1">{label}</p>
            <p className="font-display text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-gray-400 text-xs mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Weekly earnings bar chart */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="font-semibold text-gray-700 text-sm mb-4">
            📊 Last 7 Days Earnings
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={last7} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${v}`} />
              <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Earnings']} />
              <Bar dataKey="earning" fill="#2d6e4e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly earnings line chart */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="font-semibold text-gray-700 text-sm mb-4">
            📈 Last 6 Months Earnings
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={last6Months} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${v}`} />
              <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Earnings']} />
              <Line
                type="monotone" dataKey="earning"
                stroke="#d4a017" strokeWidth={2.5}
                dot={{ fill: '#d4a017', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Status pie chart */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="font-semibold text-gray-700 text-sm mb-4">
            🍩 Appointment Status Breakdown
          </p>
          {statusCounts.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="60%" height={180}>
                <PieChart>
                  <Pie
                    data={statusCounts}
                    cx="50%" cy="50%"
                    innerRadius={50} outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusCounts.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {statusCounts.map((s) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: s.color }} />
                    <span className="text-xs text-gray-600">{s.name}</span>
                    <span className="text-xs font-bold text-gray-900 ml-auto">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">No data yet</p>
          )}
        </div>

        {/* Service popularity bar chart */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="font-semibold text-gray-700 text-sm mb-4">
            💆 Services Booked
          </p>
          {serviceCounts.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={serviceCounts}
                layout="vertical"
                margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={70} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {serviceCounts.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">No data yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main dashboard ───────────────────────────────────────────
export default function Dashboard() {

  const navigate = useNavigate()
  const { admin, logout } = useAuth()

  const {
    appointments, loading, updating, stats,
    load, confirm, cancel, complete, setPayment, setRefunded,
  } = useAdminAppointments()

  const [activeTab, setActiveTab] = useState('appointments')
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [sortDir, setSortDir] = useState('asc')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showBlockModal, setShowBlockModal] = useState(false)  // ← this was missing

  useEffect(() => { load() }, [load])

  // Auto-complete confirmed appointments whose time has passed
  useEffect(() => {
    if (!appointments.length) return
    const now = new Date()
    appointments.forEach((a) => {
      if (a.status !== 'CONFIRMED') return
      const [time, period] = a.timeSlot.split(' ')
      let [h, m] = time.split(':').map(Number)
      if (period === 'PM' && h !== 12) h += 12
      if (period === 'AM' && h === 12) h = 0
      const apptTime = new Date(a.date)
      apptTime.setHours(h, m + 60, 0, 0) // 60 min session
      if (now > apptTime) {
        // Mark as completed automatically
        complete(a.id)
      }
    })
  }, [appointments])

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  const refundDueList = appointments.filter(
    (a) => a.status === 'CANCELLED' && a.payment === 'DEPOSIT' && a.refundStatus !== 'DONE'
  )

  const filtered = appointments
    .filter((a) => {
      if (filter === 'REFUND') {
        return a.status === 'CANCELLED' && a.payment === 'DEPOSIT' && a.refundStatus !== 'DONE'
      }
      const matchStatus = filter === 'ALL' || a.status === filter
      const q = search.toLowerCase()
      const matchSearch =
        !search ||
        a.name.toLowerCase().includes(q) ||
        a.phone.includes(q) ||
        a.service.toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
    .sort((a, b) => {
      const da = new Date(a.date), db = new Date(b.date)
      return sortDir === 'asc' ? da - db : db - da
    })

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <header className="bg-forest-800 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-forest-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-4 h-4 text-cream-100" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm leading-none">Niramay</p>
              <p className="text-[9px] text-forest-400 tracking-wider uppercase">Admin Dashboard</p>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex items-center bg-forest-900 rounded-xl p-1 gap-1">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'appointments'
                ? 'bg-white text-forest-800 shadow-sm'
                : 'text-forest-300 hover:text-white'
                }`}
            >
              Appointments
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'analytics'
                ? 'bg-white text-forest-800 shadow-sm'
                : 'text-forest-300 hover:text-white'
                }`}
            >
              Analytics
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-forest-400 text-xs hidden sm:block mr-2">👋 {admin?.username}</span>
            <button onClick={load} className="p-2 text-forest-300 hover:text-white hover:bg-forest-700 rounded-lg transition-colors">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-forest-300 hover:text-white text-sm px-3 py-1.5 hover:bg-forest-700 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Analytics Tab ───────────────────────────────── */}
        {activeTab === 'analytics' && (
          <EarningsSection appointments={appointments} />
        )}

        {/* ── Appointments Tab ─────────────────────────────── */}
        {activeTab === 'appointments' && (
          <>
            {/* <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold text-gray-900">
                All Appointments
              </h2>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddModal(true)}
              >
                <UserPlus className="w-4 h-4" />
                Add Patient
              </Button>
            </div> */}

            <div className="flex items-center gap-2 mb-5">
              <h2 className="font-display text-xl font-bold text-gray-900 flex-1">
                All Appointments
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="border border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => setShowBlockModal(true)}
              >
                <Ban className="w-4 h-4" />
                Block Slots
              </Button>
              <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
                <UserPlus className="w-4 h-4" />
                Add Patient
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <StatCard icon={Users} label="Total" value={stats.total} color="bg-blue-50 text-blue-600" />
              <StatCard icon={AlertCircle} label="Pending" value={stats.pending} color="bg-amber-50 text-amber-600" highlight={stats.pending > 0} />
              <StatCard icon={CheckCircle} label="Confirmed" value={stats.confirmed} color="bg-green-50 text-green-600" />
              <StatCard icon={Calendar} label="Today" value={stats.today} color="bg-forest-50 text-forest-600" />
              <StatCard icon={IndianRupee} label="Refunds Due" value={stats.refundDue} color="bg-orange-50 text-orange-600" highlight={stats.refundDue > 0} />
            </div>

            <TodayStrip appointments={appointments} />

            {/* Refund alert */}
            {stats.refundDue > 0 && filter !== 'REFUND' && (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4 mb-5 flex items-center justify-between gap-4">
                <p className="text-orange-800 text-sm font-medium">
                  💰 {stats.refundDue} refund{stats.refundDue > 1 ? 's' : ''} pending
                </p>
                <button onClick={() => setFilter('REFUND')} className="text-orange-700 text-xs font-semibold underline">
                  View refunds →
                </button>
              </div>
            )}

            {/* Pending alert */}
            {stats.pending > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-5 flex items-center justify-between gap-4">
                <p className="text-amber-800 text-sm font-medium">
                  ⏳ {stats.pending} appointment{stats.pending > 1 ? 's' : ''} waiting for confirmation
                </p>
                <button onClick={() => setFilter('PENDING')} className="text-amber-700 text-xs font-semibold underline">
                  View all →
                </button>
              </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by name, phone, or service..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setSortDir((d) => d === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 flex-shrink-0"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Date {sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="flex gap-2 flex-wrap mt-3">
                {FILTERS.map((f) => {
                  const badge = f.value === 'PENDING' && stats.pending > 0 ? stats.pending
                    : f.value === 'REFUND' && stats.refundDue > 0 ? stats.refundDue : null
                  return (
                    <button
                      key={f.value}
                      onClick={() => setFilter(f.value)}
                      className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === f.value ? 'bg-forest-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {f.label}
                      {badge && (
                        <span className="ml-1.5 bg-amber-400 text-white text-[10px] w-4 h-4 rounded-full inline-flex items-center justify-center font-bold">
                          {badge}
                        </span>
                      )}
                    </button>
                  )
                })}
                {(filter !== 'ALL' || search) && (
                  <button onClick={() => { setFilter('ALL'); setSearch('') }} className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 ml-auto">
                    ✕ Clear
                  </button>
                )}
              </div>
            </div>

            {/* Count */}
            {!loading && (
              <p className="text-xs text-gray-400 mb-3 px-1">
                Showing {filtered.length} of {appointments.length} appointments
              </p>
            )}

            {/* List */}
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-forest-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Loading appointments...</p>
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
                <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">No appointments found</p>
              </div>
            ) : filter === 'REFUND' ? (
              <div className="space-y-3">
                {filtered.map((appt) => (
                  <RefundCard key={appt.id} appointment={appt} onMarkRefunded={setRefunded} updating={updating} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((appt) => (
                  <AppointmentCard
                    key={appt.id}
                    appointment={appt}
                    isAdmin={true}
                    updating={updating === appt.id}
                    onConfirm={confirm}
                    onCancel={cancel}
                    onComplete={complete}
                    onPaymentUpdate={setPayment}
                  />
                ))}
              </div>
            )}

            <AddAppointmentModal
              isOpen={showAddModal}
              onClose={() => setShowAddModal(false)}
              onAdded={load}
            />
            <BlockSlotModal
              isOpen={showBlockModal}
              onClose={() => setShowBlockModal(false)}
              onBlocked={load}
            />
          </>
        )}
      </div>
    </div>
  )
}