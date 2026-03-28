import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Star, CheckCircle, Leaf, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Button from '../components/ui/Button'
import { API_BASE } from '../lib/constants'

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 active:scale-95"
        >
          <Star
            className={`w-9 h-9 transition-colors ${
              star <= (hovered || value)
                ? 'fill-gold-400 text-gold-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="text-sm text-gray-500 ml-1">
          {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][value]}
        </span>
      )}
    </div>
  )
}

export default function Feedback() {
  const [searchParams] = useSearchParams()

  // Pre-fill from URL params (sent via WhatsApp link)
  const appointmentId = searchParams.get('id')     || ''
  const prefillName   = searchParams.get('name')   || ''
  const prefillPhone  = searchParams.get('phone')  || ''
  const prefillSvc    = searchParams.get('service')|| ''

  const [form, setForm] = useState({
    name:           prefillName,
    phone:          prefillPhone,
    service:        prefillSvc,
    rating:         0,
    comment:        '',
    wouldRecommend: true,
  })

  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]             = useState(false)

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.rating) { toast.error('Please select a star rating.'); return }
    if (!form.name.trim()) { toast.error('Please enter your name.'); return }

    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE}/api/feedback`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...form, appointmentId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setDone(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      toast.error(err.message || 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full card text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-forest-900 mb-2">
            Thank You! 🙏
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Your feedback has been submitted. We truly appreciate you taking the
            time to share your experience at Niramay Ayurvedic Clinik.
          </p>
          <div className="flex gap-3">
            <Link to="/" className="flex-1">
              <Button variant="primary" fullWidth>Back to Home</Button>
            </Link>
            <Link to="/book" className="flex-1">
              <Button variant="outline" fullWidth>Book Again</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar />

      {/* Header */}
      <div className="bg-forest-800 pt-24 pb-10 px-4">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4">
            <Leaf className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-gold-300 text-sm">Share Your Experience</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">
            How Was Your Visit?
          </h1>
          <p className="text-forest-300 text-sm">
            Your honest feedback helps us serve you better
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-10 pb-20">
        <form onSubmit={handleSubmit} className="card space-y-6">

          {/* Pre-filled service info */}
          {prefillSvc && (
            <div className="bg-forest-50 rounded-xl p-4">
              <p className="text-xs text-forest-500 mb-1">Your service</p>
              <p className="text-forest-800 font-semibold">{prefillSvc}</p>
            </div>
          )}

          {/* Name */}
          {!prefillName && (
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1.5">
                Your Name *
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={set('name')}
                className="form-input"
                required
              />
            </div>
          )}

          {/* Star rating */}
          <div>
            <label className="block text-sm font-medium text-forest-700 mb-3">
              Rate Your Experience *
            </label>
            <StarRating
              value={form.rating}
              onChange={(r) => setForm((p) => ({ ...p, rating: r }))}
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-forest-700 mb-1.5">
              Tell Us More (optional)
            </label>
            <textarea
              rows={4}
              placeholder="What did you like? What could we improve? Any specific feedback about the treatment or staff..."
              value={form.comment}
              onChange={set('comment')}
              maxLength={500}
              className="form-input resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{form.comment.length}/500</p>
          </div>

          {/* Would recommend */}
          <div>
            <label className="block text-sm font-medium text-forest-700 mb-2">
              Would you recommend us to others?
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, wouldRecommend: true }))}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                  form.wouldRecommend
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-green-300'
                }`}
              >
                👍 Yes, definitely!
              </button>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, wouldRecommend: false }))}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                  !form.wouldRecommend
                    ? 'bg-red-400 text-white border-red-400'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-red-300'
                }`}
              >
                👎 Not really
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="gold"
            fullWidth
            size="lg"
            loading={submitting}
          >
            <Star className="w-5 h-5" />
            Submit My Feedback
          </Button>
        </form>
      </div>

      <Footer />
    </>
  )
}