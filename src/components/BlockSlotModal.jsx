import { useState, useEffect } from 'react'
import { Calendar, FileText, RefreshCw } from 'lucide-react'
import Modal from './ui/Modal'
import Button from './ui/Button'
import { TIME_SLOTS } from '../lib/constants'
import { storage } from '../lib/utils'
import toast from 'react-hot-toast'

// API base — read from env or fall back to localhost
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function BlockSlotModal({ isOpen, onClose, onBlocked }) {
  const [date,       setDate]       = useState('')
  const [selected,   setSelected]   = useState([])
  const [reason,     setReason]     = useState('')
  const [allDay,     setAllDay]     = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [alreadyBlocked, setAlreadyBlocked] = useState([]) // slots already blocked this date
  const [loading,    setLoading]    = useState(false)

  // Reset when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setDate('')
      setSelected([])
      setReason('')
      setAllDay(false)
      setAlreadyBlocked([])
    }
  }, [isOpen])

  // Fetch already-blocked slots when date changes
  useEffect(() => {
    if (!date) {
      setAlreadyBlocked([])
      setSelected([])
      setAllDay(false)
      return
    }

    setLoading(true)
    fetch(`${API}/api/admin/block-slots?date=${date}`, {
      headers: {
        Authorization: `Bearer ${storage.get('niramay_admin')?.token || ''}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        // data.slots is array of BlockedSlot objects
        const blocked = (data.slots || []).map((s) => s.timeSlot)
        setAlreadyBlocked(blocked)
      })
      .catch((err) => {
        console.error('Failed to fetch blocked slots:', err)
        setAlreadyBlocked([])
      })
      .finally(() => setLoading(false))
  }, [date])

  const toggleSlot = (slot) => {
    // Cannot toggle already-blocked slots
    if (alreadyBlocked.includes(slot)) return
    setSelected((prev) =>
      prev.includes(slot)
        ? prev.filter((s) => s !== slot)
        : [...prev, slot]
    )
  }

  const handleAllDay = (checked) => {
    setAllDay(checked)
    if (checked) {
      // Select all slots that are NOT already blocked
      setSelected(TIME_SLOTS.filter((s) => !alreadyBlocked.includes(s)))
    } else {
      setSelected([])
    }
  }

  const handleSubmit = async () => {
    if (!date) {
      toast.error('Please select a date.')
      return
    }
    if (selected.length === 0) {
      toast.error('Please select at least one slot to block.')
      return
    }

    setSubmitting(true)
    try {
      const token = storage.get('niramay_admin')?.token || ''
      const res = await fetch(`${API}/api/admin/block-slots`, {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({
          date,
          slots:  selected,
          reason: reason.trim() || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to block slots')
      }

      toast.success(
        `✅ ${data.blocked?.length || selected.length} slot${selected.length > 1 ? 's' : ''} blocked on ${date}`
      )
      onBlocked?.()
      onClose()

    } catch (err) {
      console.error('Block slot error:', err)
      toast.error(err.message || 'Failed to block slots. Check backend is running.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Block Time Slots"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={submitting}
            disabled={selected.length === 0 || !date}
            onClick={handleSubmit}
          >
            Block {selected.length > 0
              ? `${selected.length} Slot${selected.length > 1 ? 's' : ''}`
              : 'Slots'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">

        {/* Info box */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
          <p className="text-xs text-amber-700 leading-relaxed">
            🚫 Blocked slots will <strong>not be available</strong> for patient
            booking. Use this for holidays, doctor leave, lunch breaks, or
            equipment maintenance.
          </p>
        </div>

        {/* Date picker */}
        <div>
          <label className="block text-sm font-medium text-forest-700 mb-1.5">
            Date *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400 pointer-events-none" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-input pl-10 cursor-pointer"
            />
          </div>
        </div>

        {/* Slot grid */}
        {date && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-forest-700">
                Select Slots to Block
              </label>

              <div className="flex items-center gap-3">
                {loading && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Loading...
                  </span>
                )}
                {/* Select all day toggle */}
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allDay}
                    onChange={(e) => handleAllDay(e.target.checked)}
                    className="w-3.5 h-3.5 accent-red-500"
                  />
                  <span className="text-xs text-red-600 font-medium">
                    Block entire day
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => {
                const isAlready  = alreadyBlocked.includes(slot)
                const isSelected = selected.includes(slot)

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isAlready}
                    onClick={() => toggleSlot(slot)}
                    className={`
                      relative py-2.5 px-2 rounded-xl text-xs font-medium
                      transition-all border select-none
                      ${isAlready
                        ? 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
                        : isSelected
                        ? 'bg-red-500 border-red-500 text-white shadow-sm scale-105'
                        : 'bg-white border-gray-200 text-forest-700 hover:border-red-300 hover:bg-red-50 cursor-pointer'
                      }
                    `}
                  >
                    {slot}
                    {isAlready && (
                      <span className="absolute top-1 right-1 text-[9px] text-gray-400 leading-none">
                        ✕
                      </span>
                    )}
                    {isSelected && !isAlready && (
                      <span className="absolute top-1 right-1 text-[9px] text-white leading-none">
                        ✓
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-sm inline-block" />
                Will be blocked
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-gray-100 border border-gray-200 rounded-sm inline-block" />
                Already blocked
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-white border border-gray-200 rounded-sm inline-block" />
                Available
              </span>
            </div>

            {alreadyBlocked.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                {alreadyBlocked.length} slot{alreadyBlocked.length > 1 ? 's' : ''} already
                blocked on this date.
              </p>
            )}
          </div>
        )}

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-forest-700 mb-1.5">
            Reason (optional)
          </label>
          <div className="relative">
            <FileText className="absolute left-3.5 top-3 w-4 h-4 text-forest-400 pointer-events-none" />
            <textarea
              rows={2}
              placeholder="e.g. Doctor on leave, Clinic holiday, Maintenance..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={200}
              className="form-input pl-10 resize-none"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">{reason.length}/200</p>
        </div>

        {/* Selection summary */}
        {selected.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-3">
            <p className="text-xs text-red-700 font-medium mb-1">
              {selected.length} slot{selected.length > 1 ? 's' : ''} will be blocked:
            </p>
            <p className="text-xs text-red-600">
              {selected.join(' · ')}
            </p>
          </div>
        )}
      </div>
    </Modal>
  )
}