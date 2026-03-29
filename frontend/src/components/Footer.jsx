import { Link } from 'react-router-dom'
import { Leaf, Phone, MapPin, Clock, MessageCircle } from 'lucide-react'
import { CLINIC_PHONE, CLINIC_NAME } from '../lib/constants'
import { buildInquiryURL } from '../lib/whatsapp'

const FOOTER_LINKS = [
    { label: 'About', to: '/#about' },
    { label: 'Services', to: '/#services' },
    { label: 'Colon Therapy', to: '/#colon-therapy' },
    { label: 'Book Appointment', to: '/book' },
    { label: 'Check Status', to: '/status' },
]

export default function Footer() {
    const handleHashLink = (e, to) => {
        if (to.startsWith('/#')) {
            e.preventDefault()
            const id = to.replace('/#', '')
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <footer className="bg-forest-950">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">

                {/* Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-9 h-9 bg-forest-600 rounded-xl flex items-center justify-center">
                                <Leaf className="w-5 h-5 text-cream-100" />
                            </div>
                            <div>
                                <p className="font-display font-bold text-white text-lg leading-none">
                                    Niramay
                                </p>
                                <p className="text-[10px] text-forest-400 tracking-widest uppercase">
                                    Ayurvedic Clinik
                                </p>
                            </div>
                        </div>
                        <p className="text-forest-400 text-sm leading-relaxed mb-5">
                            Authentic Ayurvedic healing combining 5000-year-old wisdom with
                            modern understanding of the body.
                        </p>
                        <a
                            href={buildInquiryURL()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Chat on WhatsApp
                        </a>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <p className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">
                            Quick Links
                        </p>
                        <ul className="space-y-2.5">
                            {FOOTER_LINKS.map((link) => (
                                <li key={link.to}>
                                    {link.to.startsWith('/#') ? (
                                        <a
                                            href={link.to}
                                            onClick={(e) => handleHashLink(e, link.to)}
                                            className="text-forest-400 hover:text-gold-400 text-sm transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    ) : (
                                        <Link
                                            to={link.to}
                                            className="text-forest-400 hover:text-gold-400 text-sm transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <p className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">
                            Contact Us
                        </p>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href={`tel:${CLINIC_PHONE}`}
                                    className="flex items-start gap-3 text-forest-400 hover:text-white transition-colors group"
                                >
                                    <Phone className="w-4 h-4 mt-0.5 text-gold-500 flex-shrink-0" />
                                    <span className="text-sm">
                                        +91 {CLINIC_PHONE}
                                        <span className="block text-xs text-forest-500 group-hover:text-forest-400">
                                            Call for Colon Therapy
                                        </span>
                                    </span>
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-forest-400">
                                <Clock className="w-4 h-4 mt-0.5 text-gold-500 flex-shrink-0" />
                                <span className="text-sm">
                                    Mon–Sat: 9:00 AM – 7:00 PM
                                    <span className="block">Sun: 10:00 AM – 2:00 PM</span>
                                </span>
                            </li>
                            <li className="flex items-start gap-3 text-forest-400">
                                <MapPin className="w-4 h-4 mt-0.5 text-gold-500 flex-shrink-0" />
                                <span className="text-sm">
                                    [Your Clinic Address]<br />
                                    [City, State – PIN]
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-forest-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-forest-500 text-xs">
                    <p>© {new Date().getFullYear()} {CLINIC_NAME}. All rights reserved.</p>
                    <div className="flex items-center gap-1">
                        <Leaf className="w-3 h-3 text-forest-600" />
                        <span>Made with care for your wellness</span>
                    </div>
                </div>
            </div >
        </footer >
    )
}