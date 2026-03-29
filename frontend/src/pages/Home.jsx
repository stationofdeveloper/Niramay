import { useScrollAnimations } from '../hooks/useGSAP'
import { Link } from 'react-router-dom'
import {
    Calendar, Phone, CheckCircle, Star, ArrowRight,
    Shield, Heart, Leaf, Sparkles, MapPin, Clock, MessageCircle
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Button from '../components/ui/Button'
import {
    SERVICES, TESTIMONIALS,
    COLON_BENEFITS, COLON_STEPS,
    CLINIC_PHONE
} from '../lib/constants'
import { buildInquiryURL } from '../lib/whatsapp'
import { useState, useEffect } from 'react'
import { fetchFeedbacks } from '../lib/api'

export default function Home() {
    useScrollAnimations()
    const [liveFeedbacks, setLiveFeedbacks] = useState([])

    useEffect(() => {
        fetchFeedbacks()
            .then((d) => setLiveFeedbacks(d.feedbacks || []))
            .catch(() => { })
    }, [])
    return (
        <>
            <Navbar />

            {/* ═══════════════════════════════════════════HERO═══════════════════════════════════════════ */}
            <section className="relative min-h-screen flex items-center leaf-bg overflow-hidden">

                {/* Background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            'url(https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1600&q=80)',
                    }}
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-forest-950/92 via-forest-900/85 to-forest-800/75" />

                {/* Floating glow blobs */}
                <div className="absolute top-24 right-16 w-72 h-72 bg-forest-500/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
                <div className="absolute bottom-24 left-10 w-56 h-56 bg-gold-500/10 rounded-full blur-3xl animate-float pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-36">
                    <div className="max-w-3xl">

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
                            <Leaf className="w-3.5 h-3.5 text-gold-400" />
                            <span className="text-gold-300 text-sm font-medium tracking-wide">
                                Authentic Ayurvedic Healing Since 2010
                            </span>
                        </div>

                        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
                            Heal from{' '}
                            <span className="text-gold-400">Within</span>
                            <br />
                            with Ancient
                            <br />
                            Ayurvedic Wisdom
                        </h1>

                        <p className="text-lg text-white/80 leading-relaxed mb-10 max-w-xl">
                            Experience transformative healing at Niramay Ayurvedic Clinik.
                            Specializing in Colon Therapy, Panchakarma, and personalized
                            wellness treatments rooted in 5000-year-old Ayurvedic science.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/book">
                                <Button variant="gold" size="lg">
                                    <Calendar className="w-5 h-5" />
                                    Book Appointment
                                </Button>
                            </Link>
                            <a href={`tel:${CLINIC_PHONE}`}>
                                <Button
                                    size="lg"
                                    className="bg-white/10 hover:bg-white/20 border border-white/30 text-white"
                                >
                                    <Phone className="w-5 h-5" />
                                    Call for Colon Therapy
                                </Button>
                            </a>
                        </div>

                        {/* Stats row */}
                        <div className="mt-16 grid grid-cols-3 gap-6 max-w-xs sm:max-w-sm stagger-children">
                            {[
                                { num: '5000+', label: 'Patients Healed' },
                                { num: '14+', label: 'Years Experience' },
                                { num: '100%', label: 'Natural Treatments' },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <p className="font-display text-3xl font-bold text-green-900">
                                        {stat.num}
                                    </p>
                                    <p className="text-green-900/60 text-xs mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce pointer-events-none">
                    <div className="w-0.5 h-8 bg-white/30 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                </div>
            </section>

            {/* ═══════════════════════════════════════════ABOUT═══════════════════════════════════════════ */}
            <section id="about" className="py-24 bg-cream-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Text */}
                        <div className="slide-left animate-fade-up">
                            <span className="section-tag">About Us</span>
                            <h2 className="section-title mb-6">
                                Where Ancient Wisdom Meets Modern Care
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                At Niramay Ayurvedic Clinik, we believe true healing comes from
                                within. Our expert practitioners combine centuries-old Ayurvedic
                                knowledge with modern understanding of the body to deliver
                                treatments that are both effective and deeply nourishing.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                We specialize in{' '}
                                <strong className="text-forest-700">
                                    Colon Therapy (Basti)
                                </strong>{' '}
                                — one of Ayurveda&apos;s most powerful detoxification tools —
                                alongside a complete range of Panchakarma and wellness therapies
                                tailored to your unique Prakriti.
                            </p>
                            <div className="grid grid-cols-2 gap-4 stagger-children">
                                {[
                                    { icon: Shield, text: 'Certified Practitioners' },
                                    { icon: Heart, text: 'Personalized Care' },
                                    { icon: Leaf, text: '100% Herbal Products' },
                                    { icon: Sparkles, text: 'Holistic Approach' },
                                ].map(({ icon: Icon, text }) => (
                                    <div key={text} className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-forest-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-4 h-4 text-forest-600" />
                                        </div>
                                        <span className="text-forest-800 font-medium text-sm">
                                            {text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Image */}
                        <div className="relative slide-right">
                            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80"
                                    alt="Ayurvedic treatment"
                                    className="w-full h-full object-cover parallax-img"
                                />
                            </div>
                            {/* Floating badge */}
                            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-4 border border-cream-200 scale-reveal">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 bg-forest-600 rounded-xl flex items-center justify-center text-2xl">
                                        🌿
                                    </div>
                                    <div>
                                        <p className="font-display font-bold text-forest-900">
                                            Certified
                                        </p>
                                        <p className="text-gray-400 text-xs">Ayurvedic Practitioners</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════SERVICES═══════════════════════════════════════════ */}
            <section id="services" className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14 reveal">
                        <span className="section-tag">Our Treatments</span>
                        <h2 className="section-title">Healing Services</h2>
                        <p className="text-gray-500 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
                            Each treatment is personalized to your body constitution and
                            healing needs.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 reveal">
                        {SERVICES.map((service) => (
                            <div
                                key={service.id}
                                className="group relative bg-cream-50 hover:bg-forest-600 rounded-2xl p-6 transition-all duration-300 border border-cream-200 hover:border-forest-600 hover:shadow-xl hover:-translate-y-1 cursor-default scale-reveal"
                            >
                                <div className="absolute top-4 right-4">
                                    <span className="bg-gold-100 group-hover:bg-gold-500/20 text-gold-700 group-hover:text-gold-300 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors">
                                        {service.badge}
                                    </span>
                                </div>

                                <div className="text-4xl mb-4">{service.icon}</div>

                                <h3 className="font-display text-lg font-bold text-forest-900 group-hover:text-white mb-2 transition-colors">
                                    {service.label}
                                </h3>
                                <p className="text-gray-600 group-hover:text-white/80 text-sm leading-relaxed mb-4 transition-colors">
                                    {service.desc}
                                </p>
                                <div className="flex items-center gap-1.5 text-forest-500 group-hover:text-forest-200 text-xs font-medium transition-colors">
                                    <Clock className="w-3.5 h-3.5" />
                                    {service.duration}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12 reveal">
                        <Link to="/book">
                            <Button variant="primary" size="lg">
                                Book Any Treatment
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════COLON THERAPY═══════════════════════════════════════════ */}
            <section
                id="colon-therapy"
                className="py-24 bg-gradient-to-br from-forest-950 to-forest-800 leaf-bg"
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Left */}
                        <div className="slide-left">
                            <span className="text-gold-400 text-sm font-semibold tracking-widest uppercase">
                                Signature Treatment
                            </span>
                            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mt-3 mb-6">
                                Ayurvedic Colon Therapy{' '}
                                <span className="text-gold-400">(Basti)</span>
                            </h2>
                            <p className="text-white/80 leading-relaxed mb-5">
                                Basti — considered <em>Ardha Chikitsa</em> (half of all
                                treatments) by Acharya Charaka — is one of the most powerful
                                Panchakarma procedures. It involves administering herbal oils
                                and decoctions to cleanse the colon, eliminate Ama (toxins),
                                and restore the balance of Vata dosha.
                            </p>
                            <p className="text-white/70 leading-relaxed mb-8 text-sm">
                                Sessions last 45–60 minutes in a private, clinical setting. Our
                                trained practitioners provide detailed pre- and post-session
                                dietary guidance for maximum benefit. Call{' '}
                                <a
                                    href={`tel:${CLINIC_PHONE}`}
                                    className="text-gold-400 hover:text-gold-300 font-semibold"
                                >
                                    +91 {CLINIC_PHONE}
                                </a>{' '}
                                for more information.
                            </p>

                            {/* Benefits list */}
                            <div className="grid grid-cols-1 gap-2.5 mb-8 stagger-children">
                                {COLON_BENEFITS.map((benefit) => (
                                    <div key={benefit} className="flex items-start gap-2.5">
                                        <CheckCircle className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-white/80 text-sm">{benefit}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link to="/book?service=Colon+Therapy+%28Basti%29">
                                    <Button variant="gold" size="lg">
                                        <Calendar className="w-4 h-4" />
                                        Book Colon Therapy
                                    </Button>
                                </Link>
                                <a href={buildInquiryURL('Colon Therapy (Basti)')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button
                                        size="lg"
                                        className="bg-green-500 hover:bg-green-600 text-white"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        Ask on WhatsApp
                                    </Button>
                                </a>
                            </div>
                        </div>

                        {/* Right: Steps */}
                        <div className="space-y-4 stagger-children">
                            {COLON_STEPS.map((item) => (
                                <div
                                    key={item.step}
                                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 flex items-start gap-4"
                                >
                                    <div className="w-10 h-10 bg-gold-500/20 border border-gold-500/40 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <span className="text-gold-400 font-bold text-sm">
                                            {item.step}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">
                                            {item.title}
                                        </h4>
                                        <p className="text-white/70 text-sm leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section >

            {/* ═══════════════════════════════════════════TESTIMONIALS═══════════════════════════════════════════ */}
            < section className="py-24 bg-cream-50" >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14 reveal">
                        <span className="section-tag">Patient Stories</span>
                        <h2 className="section-title">Healing Experiences</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 stagger-children">
                        {TESTIMONIALS.map((t) => (
                            <div
                                key={t.name}
                                className="card hover:shadow-md transition-shadow"
                            >
                                <div className="flex mb-3">
                                    {Array.from({ length: t.rating }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-4 h-4 fill-gold-400 text-gold-400"
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                                    &ldquo;{t.text}&rdquo;
                                </p>
                                <div className="flex items-center gap-3 pt-3 border-t border-cream-100">
                                    <div className="w-8 h-8 bg-forest-100 rounded-full flex items-center justify-center">
                                        <span className="text-forest-700 font-bold text-sm">
                                            {t.name[0]}
                                        </span>
                                    </div>
                                    <span className="font-semibold text-forest-800 text-sm">
                                        {t.name}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >
            
            {liveFeedbacks.length > 0 && (
                <section className="py-20 bg-white">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12 reveal">
                            <span className="section-tag">Verified Reviews</span>
                            <h2 className="section-title">What Our Patients Say</h2>
                            <p className="text-gray-400 text-sm mt-2">
                                Real feedback from real patients
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-5 stagger-children">
                            {liveFeedbacks.slice(0, 6).map((fb) => (
                                <div key={fb.id} className="card hover:shadow-md transition-shadow scale-reveal">
                                    {/* Stars */}
                                    <div className="flex mb-2">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < fb.rating ? 'fill-gold-400 text-gold-400' : 'text-gray-200'
                                                    }`}
                                            />
                                        ))}
                                        <span className="ml-2 text-xs text-gray-400">
                                            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][fb.rating]}
                                        </span>
                                    </div>

                                    {/* Comment */}
                                    {fb.comment && (
                                        <p className="text-gray-600 text-sm leading-relaxed mb-3 italic">
                                            &ldquo;{fb.comment}&rdquo;
                                        </p>
                                    )}

                                    {/* Service + name */}
                                    <div className="flex items-center justify-between pt-3 border-t border-cream-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 bg-forest-100 rounded-full flex items-center justify-center">
                                                <span className="text-forest-700 font-bold text-xs">
                                                    {fb.name[0]}
                                                </span>
                                            </div>
                                            <span className="font-semibold text-forest-800 text-xs">{fb.name}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">{fb.service.split(' ')[0]}</span>
                                    </div>

                                    {fb.wouldRecommend && (
                                        <p className="text-xs text-green-600 mt-2">
                                            ✓ Recommends Niramay Clinik
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════BOOK CTA BANNER═══════════════════════════════════════════ */}
            < section className="py-20 bg-forest-600" >
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
                        Begin Your Healing Journey
                    </h2>
                    <p className="text-white/80 text-lg mb-8">
                        Book online in 2 minutes — availability checked in real-time.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/book">
                            <Button variant="gold" size="lg">
                                <Calendar className="w-5 h-5" />
                                Book Appointment Now
                            </Button>
                        </Link>
                        <Link to="/status">
                            <Button
                                size="lg"
                                className="bg-white/15 hover:bg-white/25 border border-white/30 text-white"
                            >
                                Check Appointment Status
                            </Button>
                        </Link>
                    </div>
                </div>
            </section >

            {/* ═══════════════════════════════════════════CONTACT═══════════════════════════════════════════ */}
            < section id="contact" className="py-24 bg-white" >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">

                        <div className='slide-left'>
                            <span className="section-tag">Get in Touch</span>
                            <h2 className="section-title mb-8">Visit Niramay Clinik</h2>

                            <div className="space-y-6">
                                {[
                                    {
                                        icon: Phone,
                                        title: 'Phone / WhatsApp',
                                        content: (
                                            <>
                                                <a
                                                    href={`tel:${CLINIC_PHONE}`}
                                                    className="text-forest-600 hover:text-forest-800 font-medium"
                                                >
                                                    +91 {CLINIC_PHONE}
                                                </a>
                                                <p className="text-gray-400 text-xs mt-0.5">
                                                    Call for Colon Therapy inquiries
                                                </p>
                                            </>
                                        ),
                                    },
                                    {
                                        icon: Clock,
                                        title: 'Clinic Hours',
                                        content: (
                                            <>
                                                <p className="text-gray-600 text-sm">
                                                    Monday – Saturday: 9:00 AM – 7:00 PM
                                                </p>
                                                <p className="text-gray-600 text-sm">
                                                    Sunday: 10:00 AM – 2:00 PM
                                                </p>
                                            </>
                                        ),
                                    },
                                    {
                                        icon: MapPin,
                                        title: 'Location',
                                        content: (
                                            <p className="text-gray-600 text-sm">
                                                Niramay Ayurvedic Clinik
                                                <br />
                                                [Your Clinic Address]
                                                <br />
                                                [City, State — PIN]
                                            </p>
                                        ),
                                    },
                                ].map(({ icon: Icon, title, content }) => (
                                    <div key={title} className="flex items-start gap-4">
                                        <div className="w-11 h-11 bg-forest-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-5 h-5 text-forest-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-forest-800 mb-1">
                                                {title}
                                            </p>
                                            {content}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* WhatsApp quick inquiry */}
                            <div className="mt-8 p-5 bg-green-50 rounded-2xl border border-green-100">
                                <p className="font-semibold text-forest-800 mb-1">
                                    💬 Quick Inquiry via WhatsApp
                                </p>
                                <p className="text-gray-500 text-sm mb-3">
                                    Message us directly for treatment information or queries.
                                </p>
                                <a
                                    href={buildInquiryURL()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button className="bg-green-500 hover:bg-green-600 text-white" size="sm">
                                        <MessageCircle className="w-4 h-4" />
                                        Chat on WhatsApp
                                    </Button>
                                </a>
                            </div>
                        </div>

                        {/* Map placeholder */}
                        <div className="slide-right bg-cream-50 rounded-3xl border border-cream-200 min-h-[380px] flex items-center justify-center">
                            <div className="text-center p-8">
                                <MapPin className="w-12 h-12 text-forest-300 mx-auto mb-3" />
                                <p className="text-forest-600 font-medium">Clinic Location</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    Paste your Google Maps embed iframe here
                                </p>
                            </div>
                        </div>
                    </div >
                </div >
            </section >

            <Footer />
        </>
    )
}