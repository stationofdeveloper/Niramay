import { useState, useEffect, useRef } from 'react'
import { X, MessageCircle, Send } from 'lucide-react'
import { gsap } from 'gsap'
import { CLINIC_PHONE, CLINIC_NAME } from '../lib/constants'
import { useLocation } from 'react-router-dom'

const QUICK_MESSAGES = [
    '🌿 I want to book an appointment',
    '💆 Tell me about Colon Therapy',
    '📅 What are your clinic hours?',
    '💰 What are your service charges?',
]

export default function WhatsAppWidget() {
    const location = useLocation()

    // Hide on all admin pages
    const isAdminPage = location.pathname.startsWith('/admin')
    if (isAdminPage) return null
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const popupRef = useRef(null)
    const btnRef = useRef(null)
    const bubblesRef = useRef(null)

    // ── Open animation ────────────────────────────────────────
    useEffect(() => {
        if (!popupRef.current) return

        if (open) {
            // Popup enter
            gsap.fromTo(
                popupRef.current,
                { opacity: 0, scale: 0.85, y: 20, transformOrigin: 'bottom right' },
                { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.6)' }
            )
            // Stagger quick message bubbles
            if (bubblesRef.current) {
                const bubbles = bubblesRef.current.querySelectorAll('.wa-bubble')
                gsap.fromTo(
                    bubbles,
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, duration: 0.3, stagger: 0.08, ease: 'power2.out', delay: 0.2 }
                )
            }
        } else {
            gsap.to(popupRef.current, {
                opacity: 0, scale: 0.85, y: 20,
                duration: 0.25, ease: 'power2.in',
            })
        }
    }, [open])

    // ── Pulse animation on button ─────────────────────────────
    useEffect(() => {
        if (!btnRef.current) return
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 })
        tl.to(btnRef.current, {
            scale: 1.12,
            duration: 0.3,
            ease: 'power1.inOut',
        }).to(btnRef.current, {
            scale: 1,
            duration: 0.3,
            ease: 'power1.inOut',
        })
        return () => tl.kill()
    }, [])

    const buildURL = (msg) => {
        const text = msg || message || 'Hello! I would like to know more about Niramay Ayurvedic Clinik.'
        return `https://wa.me/91${CLINIC_PHONE}?text=${encodeURIComponent(text)}`
    }

    const handleSend = () => {
        const text = message.trim() || 'Hello! I would like to know more about Niramay Ayurvedic Clinik.'
        window.open(buildURL(text), '_blank')
    }

    const handleQuick = (msg) => {
        window.open(buildURL(msg), '_blank')
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

            {/* ── Popup ──────────────────────────────────────────── */}
            {open && (
                <div
                    ref={popupRef}
                    className="w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                    style={{ opacity: 0 }}
                >
                    {/* Header */}
                    <div className="bg-[#075e54] px-4 py-4 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-white/30">
                            <span className="text-2xl">🌿</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-bold text-sm">{CLINIC_NAME}</p>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-[#25d366] rounded-full" />
                                <p className="text-white/80 text-xs">Typically replies within minutes</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-white/60 hover:text-white transition-colors p-1"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Chat bubble area */}
                    <div className="bg-[#e5ddd5] px-4 py-4 min-h-[120px]">
                        {/* Clinic message bubble */}
                        <div className="flex items-start gap-2 mb-3">
                            <div className="w-7 h-7 rounded-full bg-[#075e54] flex items-center justify-center flex-shrink-0">
                                <span className="text-sm">🌿</span>
                            </div>
                            <div className="bg-white rounded-2xl rounded-tl-none px-3.5 py-2.5 shadow-sm max-w-[85%]">
                                <p className="text-gray-800 text-sm font-medium mb-0.5">
                                    Namaste! 🙏
                                </p>
                                <p className="text-gray-600 text-xs leading-relaxed">
                                    How can I help you today? Choose a topic or type your message.
                                </p>
                                <p className="text-gray-300 text-[10px] text-right mt-1">
                                    {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>

                        {/* Quick message bubbles */}
                        <div ref={bubblesRef} className="space-y-1.5 mt-3">
                            {QUICK_MESSAGES.map((msg) => (
                                <button
                                    key={msg}
                                    onClick={() => handleQuick(msg)}
                                    className="wa-bubble w-full text-left bg-white hover:bg-[#dcf8c6] border border-gray-200 hover:border-green-300 rounded-xl px-3 py-2 text-xs text-gray-700 font-medium transition-all duration-200 hover:shadow-sm active:scale-95"
                                >
                                    {msg}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Message input */}
                    <div className="bg-[#f0f0f0] px-3 py-3 flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            className="flex-1 bg-white rounded-full px-4 py-2 text-sm text-gray-700 border border-gray-200 focus:outline-none focus:border-green-400 placeholder-gray-400"
                        />
                        <button
                            onClick={handleSend}
                            className="w-9 h-9 bg-[#25d366] hover:bg-[#1fb855] rounded-full flex items-center justify-center transition-colors flex-shrink-0 active:scale-90"
                        >
                            <Send className="w-4 h-4 text-white" />
                        </button>
                    </div>

                    {/* Powered by note */}
                    <div className="bg-white px-4 py-2 text-center">
                        <p className="text-gray-300 text-[10px]">
                            Chat opens in WhatsApp · +91 {CLINIC_PHONE}
                        </p>
                    </div>
                </div>
            )}

            {/* ── WhatsApp Button ────────────────────────────────── */}
            <div className="relative">
                {/* Ripple rings */}
                <span className="absolute inset-0 rounded-full bg-[#25d366] animate-ping opacity-20 pointer-events-none" />
                <span className="absolute inset-0 rounded-full bg-[#25d366] animate-ping opacity-10 pointer-events-none [animation-delay:0.5s]" />

                <button
                    ref={btnRef}
                    onClick={() => setOpen((p) => !p)}
                    className="relative w-14 h-14 bg-[#25d366] hover:bg-[#1fb855] rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-colors group"
                    aria-label="Chat on WhatsApp"
                >
                    {open ? (
                        <X className="w-6 h-6 text-white" />
                    ) : (
                        <svg
                            viewBox="0 0 24 24"
                            className="w-7 h-7 fill-white"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                    )}
                </button>

                {/* Unread dot */}
                {/* {!open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-md">
            1
          </span>
        )} */}
            </div>
        </div>
    )
}