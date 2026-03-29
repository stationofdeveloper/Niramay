import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Leaf, Lock, User, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useAuth } from '../../hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoggedIn } = useAuth()

  const [form, setForm]       = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  // Already logged in → go straight to dashboard
  if (isLoggedIn) return <Navigate to="/admin/dashboard" replace />

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Small delay for UX feel
    await new Promise((r) => setTimeout(r, 400))

    const result = login(form.username, form.password)
    if (result.success) {
      toast.success('Welcome back, Admin! 🌿')
      navigate('/admin/dashboard', { replace: true })
    } else {
      toast.error(result.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800 leaf-bg flex items-center justify-center px-4">

      {/* Glow blobs */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-forest-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-forest-600 rounded-2xl shadow-xl mb-4">
            <Leaf className="w-8 h-8 text-cream-100" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">
            Admin Portal
          </h1>
          <p className="text-forest-400 text-sm mt-1">
            Niramay Ayurvedic Clinik
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
          <h2 className="font-display text-xl font-bold text-white mb-6">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-forest-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={form.username}
                  onChange={set('username')}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-forest-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-forest-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400 pointer-events-none" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-forest-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-forest-400 hover:text-white transition-colors"
                >
                  {showPass
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye    className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
              className="bg-gold-500 hover:bg-gold-600 text-white mt-2"
            >
              Sign In to Dashboard
            </Button>
          </form>
        </div>

        <p className="text-center text-forest-500 text-xs mt-4">
          Patients:{' '}
          <a href="/" className="text-forest-300 hover:text-white underline">
            Go to main website →
          </a>
        </p>
      </div>
    </div>
  )
}