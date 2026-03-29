import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Leaf, Phone, Menu, X, Calendar, ChevronRight } from 'lucide-react'
import { gsap } from 'gsap'
import { CLINIC_PHONE } from '../lib/constants'

const NAV_LINKS = [
    { hash: 'about', label: 'About' },
    { hash: 'services', label: 'Services' },
    { hash: 'colon-therapy', label: 'Colon Therapy' },
    { hash: 'contact', label: 'Contact' },
]

export default function Navbar() {
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const isHome = location.pathname === '/'

    // Refs for GSAP
    const mobileMenuRef = useRef(null)
    const overlayRef = useRef(null)
    const menuBtnRef = useRef(null)
    const menuIconRef = useRef(null)
    const closeIconRef = useRef(null)
    const menuItemsRef = useRef([])
    const menuTimeline = useRef(null)

    // ── Scroll detection ────────────────────────────────────────
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // ── Close on route change ───────────────────────────────────
    useEffect(() => {
        if (open) closeMenu()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])

    // ── Lock body scroll when menu open ────────────────────────
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [open])

    // ── Build GSAP timeline on mount ────────────────────────────
    useEffect(() => {
        if (!mobileMenuRef.current || !overlayRef.current) return

        // Set initial hidden states
        gsap.set(mobileMenuRef.current, { x: '100%' })
        gsap.set(overlayRef.current, { autoAlpha: 0 })

        // Set initial states for menu items
        if (menuItemsRef.current.length > 0) {
            gsap.set(menuItemsRef.current, {
                opacity: 0,
                x: 40,
                autoAlpha: 0
            })
        }

        // Create the timeline (paused initially)
        menuTimeline.current = gsap.timeline({ paused: true })

        // 1. Show overlay
        menuTimeline.current.to(overlayRef.current, {
            autoAlpha: 1,
            duration: 0.3,
            ease: 'power2.out',
        }, 0)

        // 2. Slide in the menu panel
        menuTimeline.current.to(mobileMenuRef.current, {
            x: '0%',
            duration: 0.5,
            ease: 'power3.out',
        }, 0)

        // 3. Stagger animate menu items
        if (menuItemsRef.current.length > 0) {
            menuTimeline.current.to(menuItemsRef.current, {
                opacity: 1,
                x: 0,
                autoAlpha: 1,
                duration: 0.4,
                stagger: 0.08,
                ease: 'power2.out',
            }, '-=0.2')
        }

        return () => {
            if (menuTimeline.current) {
                menuTimeline.current.kill()
            }
        }
    }, [])

    // ── Open menu ───────────────────────────────────────────────
    const openMenu = () => {
        setOpen(true)

        // Reset menu items to initial state
        if (menuItemsRef.current.length > 0) {
            gsap.set(menuItemsRef.current, {
                opacity: 0,
                x: 40,
                autoAlpha: 0
            })
        }

        // Play the menu animation
        if (menuTimeline.current) {
            menuTimeline.current.restart()
        }

        // Animate hamburger to X
        if (menuBtnRef.current) {
            // Hide hamburger icon, show X icon with animation
            gsap.to(menuBtnRef.current, {
                rotation: 180,
                duration: 0.3,
                ease: 'back.out(0.8)',
                overwrite: true
            })
        }
    }

    // ── Close menu ─────────────────────────────────────────────
    const closeMenu = () => {
        if (!open) return

        // Create reverse animation
        const closeTimeline = gsap.timeline({
            onComplete: () => {
                setOpen(false)
                // Reset timeline position
                if (menuTimeline.current) {
                    menuTimeline.current.pause(0)
                }
                // Reset overlay visibility
                gsap.set(overlayRef.current, { autoAlpha: 0 })
            }
        })

        // Animate out menu items in reverse order
        if (menuItemsRef.current.length > 0) {
            const reversedItems = [...menuItemsRef.current].reverse()
            closeTimeline.to(reversedItems, {
                opacity: 0,
                x: 40,
                autoAlpha: 0,
                duration: 0.25,
                stagger: 0.05,
                ease: 'power2.in',
            }, 0)
        }

        // Slide out menu panel
        if (mobileMenuRef.current) {
            closeTimeline.to(mobileMenuRef.current, {
                x: '100%',
                duration: 0.4,
                ease: 'power3.in',
            }, '-=0.1')
        }

        // Fade out overlay
        if (overlayRef.current) {
            closeTimeline.to(overlayRef.current, {
                autoAlpha: 0,
                duration: 0.3,
                ease: 'power2.in',
            }, '<')
        }

        // Animate X back to hamburger
        if (menuBtnRef.current) {
            gsap.to(menuBtnRef.current, {
                rotation: 0,
                duration: 0.3,
                ease: 'back.out(0.8)',
                overwrite: true
            })
        }
    }

    // ── Toggle menu ────────────────────────────────────────────
    const handleToggle = () => {
        if (open) {
            closeMenu()
        } else {
            openMenu()
        }
    }

    // ── Hash nav ───────────────────────────────────────────────
    const handleNavClick = (e, hash) => {
        e.preventDefault()
        if (open) closeMenu()

        if (isHome) {
            setTimeout(() => {
                const element = document.getElementById(hash)
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                }
            }, open ? 400 : 0)
        } else {
            navigate('/')
            setTimeout(() => {
                const element = document.getElementById(hash)
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                }
            }, open ? 550 : 350)
        }
    }

    const isTransparent = isHome && !scrolled && !open

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isTransparent ? 'bg-transparent' : 'bg-white/95 backdrop-blur-md shadow-md'
                }`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
                            <div className="w-9 h-9 bg-forest-600 rounded-xl flex items-center justify-center shadow-md group-hover:bg-forest-700 transition-colors">
                                <Leaf className="w-5 h-5 text-cream-100" />
                            </div>
                            <div>
                                <p className={`font-display font-bold text-lg leading-none transition-colors ${isTransparent ? 'text-white' : 'text-forest-800'
                                    }`}>Niramay</p>
                                <p className={`text-[10px] tracking-widest uppercase leading-none transition-colors ${isTransparent ? 'text-white/60' : 'text-forest-500'
                                    }`}>Ayurvedic Clinik</p>
                            </div>
                        </Link>

                        {/* Desktop links */}
                        <div className="hidden md:flex items-center gap-7">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.hash}
                                    href={`/#${link.hash}`}
                                    onClick={(e) => handleNavClick(e, link.hash)}
                                    className={`relative text-sm font-medium transition-colors group cursor-pointer ${isTransparent
                                            ? 'text-white/80 hover:text-white'
                                            : 'text-forest-700 hover:text-forest-900'
                                        }`}
                                >
                                    {link.label}
                                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gold-500 group-hover:w-full transition-all duration-300" />
                                </a>
                            ))}
                        </div>

                        {/* Desktop CTA */}
                        <div className="hidden md:flex items-center gap-3">
                            <a
                                href={`tel:${CLINIC_PHONE}`}
                                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isTransparent
                                        ? 'text-white/80 hover:text-white'
                                        : 'text-forest-600 hover:text-forest-800'
                                    }`}
                            >
                                <Phone className="w-3.5 h-3.5" />
                                {CLINIC_PHONE}
                            </a>
                            <Link to="/book" className="btn-primary py-2 px-4 text-sm">
                                <Calendar className="w-4 h-4" />
                                Book Now
                            </Link>
                        </div>

                        {/* Mobile hamburger - Animated Icon */}

                    </div>
                </div>
            </nav>

            {/* ── Mobile Menu Overlay ─────────────────────────────── */}
            <div
                ref={overlayRef}
                onClick={closeMenu}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                style={{
                    visibility: open ? 'visible' : 'hidden',
                    pointerEvents: open ? 'auto' : 'none'
                }}
            />
            <button
                ref={menuBtnRef}
                onClick={handleToggle}
                className={`md:hidden fixed top-4 right-4 w-10 h-10 z-[100] rounded-lg transition-colors flex items-center justify-center ${isTransparent
                        ? 'text-white hover:bg-white/10'
                        : 'text-forest-600 hover:bg-forest-50'
                    }`}
                aria-label="Toggle menu"
            >
                <div className="relative w-6 h-6">
                    {/* Menu Icon (Three lines) */}
                    <div
                        className={`absolute inset-0 transition-all duration-300 ${open ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                            }`}
                    >
                        <Menu className="w-6 h-6" />
                    </div>
                    {/* Close Icon (X) */}
                    <div
                        className={`absolute inset-0 transition-all duration-300 ${open ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                            }`}
                    >
                        <X className="w-6 h-6" />
                    </div>
                </div>
            </button>
            {/* ── Mobile Menu Panel (Clean version without header/footer) ── */}
            <div
                ref={mobileMenuRef}
                className="fixed top-0 right-0 h-full w-[80%] max-w-sm z-50 bg-white shadow-2xl md:hidden"
                style={{ transform: 'translateX(100%)' }}
            >
                {/* Simple padding for menu items */}
                <div className="pt-20 pb-8 px-6 h-full overflow-y-auto">
                    <div className="space-y-2">
                        {NAV_LINKS.map((link, i) => (
                            <a
                                key={link.hash}
                                ref={(el) => {
                                    if (el) menuItemsRef.current[i] = el
                                }}
                                href={`/#${link.hash}`}
                                onClick={(e) => handleNavClick(e, link.hash)}
                                className="flex items-center justify-between px-5 py-4 rounded-2xl text-forest-800 font-medium hover:bg-forest-50 transition-colors group"
                                style={{ opacity: 0, transform: 'translateX(40px)' }}
                            >
                                <span className="text-lg">{link.label}</span>
                                <ChevronRight className="w-5 h-5 text-forest-300 group-hover:text-forest-600 group-hover:translate-x-1 transition-all" />
                            </a>
                        ))}

                        {/* Book Appointment Link */}
                        <div
                            ref={(el) => {
                                if (el) menuItemsRef.current[NAV_LINKS.length] = el
                            }}
                            style={{ opacity: 0, transform: 'translateX(40px)' }}
                            className="mt-4"
                        >
                            <Link
                                to="/book"
                                onClick={() => closeMenu()}
                                className="flex items-center justify-between px-5 py-4 rounded-2xl bg-forest-600 text-white font-semibold hover:bg-forest-700 transition-colors group"
                            >
                                <span className="flex items-center gap-2 text-lg">
                                    <Calendar className="w-5 h-5" />
                                    Book Appointment
                                </span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Check Status Link */}
                        <div
                            ref={(el) => {
                                if (el) menuItemsRef.current[NAV_LINKS.length + 1] = el
                            }}
                            style={{ opacity: 0, transform: 'translateX(40px)' }}
                        >
                            <Link
                                to="/status"
                                onClick={() => closeMenu()}
                                className="flex items-center justify-between px-5 py-4 rounded-2xl border border-forest-200 text-forest-700 font-semibold hover:bg-forest-50 transition-colors group"
                            >
                                <span>Check Status</span>
                                <ChevronRight className="w-5 h-5 text-forest-300 group-hover:text-forest-600 group-hover:translate-x-1 transition-all" />
                            </Link>
                        </div>

                        {/* Phone Number */}
                        <div
                            ref={(el) => {
                                if (el) menuItemsRef.current[NAV_LINKS.length + 2] = el
                            }}
                            style={{ opacity: 0, transform: 'translateX(40px)' }}
                            className="mt-6 pt-4 border-t border-cream-100"
                        >
                            <a
                                href={`tel:${CLINIC_PHONE}`}
                                className="flex items-center gap-3 p-3 rounded-xl text-forest-600 hover:bg-forest-50 transition-colors"
                            >
                                <Phone className="w-5 h-5" />
                                <span className="font-medium">+91 {CLINIC_PHONE}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}