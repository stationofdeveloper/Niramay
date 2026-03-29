import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { Observer } from 'gsap/Observer'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Observer)

// Helper to check device type
const getDeviceType = () => {
  if (typeof window === 'undefined') return 'desktop'
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

// Get animation values that don't break layout
const getAnimationValues = () => {
  const device = getDeviceType()
  
  if (device === 'mobile') {
    return {
      // Minimal transforms to prevent layout shifts
      yOffset: 20,
      xOffset: 15,
      scaleStart: 0.98,
      staggerDelay: 0.08,
      duration: 0.6,
      // Use 'play' instead of scrub to prevent layout issues
      scrubValue: false,
      startPoint: 'top 85%',
      endPoint: 'top 35%'
    }
  } else if (device === 'tablet') {
    return {
      yOffset: 30,
      xOffset: 25,
      scaleStart: 0.95,
      staggerDelay: 0.1,
      duration: 0.7,
      scrubValue: 0.8,
      startPoint: 'top 85%',
      endPoint: 'top 30%'
    }
  } else {
    return {
      yOffset: 45,
      xOffset: 55,
      scaleStart: 0.88,
      staggerDelay: 0.12,
      duration: 0.8,
      scrubValue: 1,
      startPoint: 'top 85%',
      endPoint: 'top 25%'
    }
  }
}

// ─── Section-level Observer (full-page sections like hero/about) ──
export function initSectionObserver() {
  const sections = gsap.utils.toArray('.gsap-section')
  if (!sections.length) return

  let currentIndex = -1
  let animating    = false
  const wrap = gsap.utils.wrap(0, sections.length)

  // Hide all sections except first
  gsap.set(sections, { autoAlpha: 0, yPercent: 100 })
  gsap.set(sections[0], { autoAlpha: 1, yPercent: 0 })
  currentIndex = 0

  function gotoSection(index, direction) {
    index    = wrap(index)
    animating = true

    const fromTop  = direction === -1
    const dFactor  = fromTop ? -1 : 1
    const tl = gsap.timeline({
      defaults: { duration: 1.1, ease: 'power2.inOut' },
      onComplete: () => { animating = false },
    })

    if (currentIndex >= 0 && currentIndex !== index) {
      tl.to(sections[currentIndex], {
        yPercent: -100 * dFactor,
        autoAlpha: 0,
        duration: 1,
      })
    }

    gsap.set(sections[index], { autoAlpha: 1, yPercent: 100 * dFactor })
    tl.to(
      sections[index],
      { yPercent: 0, autoAlpha: 1, duration: 1.1 },
      currentIndex >= 0 ? '-=0.6' : 0
    )

    const heading = sections[index].querySelector('.gsap-heading')
    if (heading) {
      const chars = heading.querySelectorAll('.gsap-char')
      if (chars.length) {
        tl.fromTo(
          chars,
          { autoAlpha: 0, yPercent: 120 * dFactor },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.8,
            stagger: { each: 0.025, from: 'random' },
            ease: 'power2.out',
          },
          '-=0.7'
        )
      }
    }

    currentIndex = index
  }

  Observer.create({
    type: 'wheel,touch,pointer',
    wheelSpeed: -1,
    tolerance: 10,
    preventDefault: false,
    onDown: () => { if (!animating) gotoSection(currentIndex + 1, 1) },
    onUp:   () => { if (!animating) gotoSection(currentIndex - 1,  -1) },
  })

  return () => Observer.getAll().forEach((o) => o.kill())
}

// ─── Component-level scroll animations ──
export function initScrollAnimations() {
  // Kill existing triggers
  ScrollTrigger.getAll().forEach((t) => t.kill())
  
  const values = getAnimationValues()
  const device = getDeviceType()

  // Ensure all animated elements have proper initial states
  // This prevents layout jumps
  const ensureInitialState = () => {
    // Set all animated elements to visible by default
    gsap.set('.reveal, .stagger-children, .scale-reveal, .slide-left, .slide-right', {
      willChange: 'transform, opacity'
    })
  }
  
  ensureInitialState()

  // ── Fade + slide up ──────────────────────────────────────────
  gsap.utils.toArray('.reveal').forEach((el) => {
    // Don't set initial state here - let CSS handle it
    gsap.set(el, { opacity: 0, y: values.yOffset });
    
    ScrollTrigger.create({
      trigger: el,
      start: values.startPoint,
      end: values.endPoint,
      scrub: values.scrubValue,
      toggleActions: 'play reverse play reverse',
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: values.duration,
          ease: 'power3.out',
          overwrite: true
        });
      },
      onLeaveBack: () => {
        gsap.to(el, {
          opacity: 0,
          y: values.yOffset,
          duration: values.duration,
          ease: 'power3.out',
          overwrite: true
        });
      }
    });
  })

  // ── Stagger children ─────────────────────────────────────────
  gsap.utils.toArray('.stagger-children').forEach((parent) => {
    const children = Array.from(parent.children)
    if (!children.length) return
    
    // Set initial state
    gsap.set(children, { opacity: 0, y: values.yOffset });
    
    ScrollTrigger.create({
      trigger: parent,
      start: values.startPoint,
      end: values.endPoint,
      scrub: values.scrubValue,
      toggleActions: 'play reverse play reverse',
      onEnter: () => {
        gsap.to(children, {
          opacity: 1,
          y: 0,
          duration: values.duration,
          stagger: values.staggerDelay,
          ease: 'power2.out',
          overwrite: true
        });
      },
      onLeaveBack: () => {
        gsap.to(children, {
          opacity: 0,
          y: values.yOffset,
          duration: values.duration,
          stagger: values.staggerDelay / 2,
          ease: 'power2.out',
          overwrite: true
        });
      }
    });
  })

  // ── Scale reveal ─────────────────────────────────────────────
  gsap.utils.toArray('.scale-reveal').forEach((el) => {
    gsap.set(el, { opacity: 0, scale: values.scaleStart });
    
    ScrollTrigger.create({
      trigger: el,
      start: values.startPoint,
      end: values.endPoint,
      scrub: values.scrubValue,
      toggleActions: 'play reverse play reverse',
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          scale: 1,
          duration: values.duration,
          ease: 'back.out(1.2)',
          overwrite: true
        });
      },
      onLeaveBack: () => {
        gsap.to(el, {
          opacity: 0,
          scale: values.scaleStart,
          duration: values.duration,
          ease: 'back.in(1.2)',
          overwrite: true
        });
      }
    });
  })

  // ── Slide from left ──────────────────────────────────────────
  gsap.utils.toArray('.slide-left').forEach((el) => {
    gsap.set(el, { opacity: 0, x: -values.xOffset });
    
    ScrollTrigger.create({
      trigger: el,
      start: values.startPoint,
      end: values.endPoint,
      scrub: values.scrubValue,
      toggleActions: 'play reverse play reverse',
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          x: 0,
          duration: values.duration,
          ease: 'power3.out',
          overwrite: true
        });
      },
      onLeaveBack: () => {
        gsap.to(el, {
          opacity: 0,
          x: -values.xOffset,
          duration: values.duration,
          ease: 'power3.out',
          overwrite: true
        });
      }
    });
  })

  // ── Slide from right ─────────────────────────────────────────
  gsap.utils.toArray('.slide-right').forEach((el) => {
    gsap.set(el, { opacity: 0, x: values.xOffset });
    
    ScrollTrigger.create({
      trigger: el,
      start: values.startPoint,
      end: values.endPoint,
      scrub: values.scrubValue,
      toggleActions: 'play reverse play reverse',
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          x: 0,
          duration: values.duration,
          ease: 'power3.out',
          overwrite: true
        });
      },
      onLeaveBack: () => {
        gsap.to(el, {
          opacity: 0,
          x: values.xOffset,
          duration: values.duration,
          ease: 'power3.out',
          overwrite: true
        });
      }
    });
  })

  // ── Counter number animation ─────────────────────────────────
  gsap.utils.toArray('.count-up').forEach((el) => {
    const target = parseInt(el.dataset.target || '0', 10)
    let animated = false
    
    ScrollTrigger.create({
      trigger: el,
      start: values.startPoint,
      toggleActions: 'play none none reverse',
      onEnter: () => {
        if (!animated) {
          gsap.fromTo(el, 
            { innerText: 0 },
            {
              innerText: target,
              duration: values.duration * 1.5,
              ease: 'power1.out',
              snap: { innerText: 1 },
              onUpdate: function() {
                el.textContent = Math.floor(this.targets()[0].innerText).toLocaleString('en-IN')
              }
            }
          )
          animated = true
        }
      },
      onLeaveBack: () => {
        // Reset counter when scrolling back up
        if (device !== 'mobile') {
          el.textContent = '0'
          animated = false
        }
      }
    })
  })

  // ── Horizontal line draw ─────────────────────────────────────
  gsap.utils.toArray('.line-draw').forEach((el) => {
    gsap.set(el, { scaleX: 0, transformOrigin: 'left center' });
    
    ScrollTrigger.create({
      trigger: el,
      start: values.startPoint,
      end: values.endPoint,
      scrub: values.scrubValue,
      toggleActions: 'play reverse play reverse',
      onEnter: () => {
        gsap.to(el, {
          scaleX: 1,
          duration: values.duration,
          ease: 'power2.out',
          overwrite: true
        });
      },
      onLeaveBack: () => {
        gsap.to(el, {
          scaleX: 0,
          duration: values.duration,
          ease: 'power2.out',
          overwrite: true
        });
      }
    });
  })

  // ── Parallax on images (gentle on mobile) ───────────────────
  gsap.utils.toArray('.parallax-img').forEach((el) => {
    const parallaxAmount = device === 'mobile' ? -5 : (device === 'tablet' ? -10 : -15)
    const scrubAmount = device === 'mobile' ? 0.5 : 1
    
    gsap.to(el, {
      yPercent: parallaxAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: scrubAmount,
      },
    })
  })

  // Refresh after all animations are set
  setTimeout(() => {
    ScrollTrigger.refresh()
  }, 100)
}

// ─── Char splitting helper ────────────────────────────────────
export function splitChars(selector) {
  document.querySelectorAll(selector).forEach((el) => {
    const text = el.textContent || ''
    el.innerHTML = text
      .split('')
      .map((char) =>
        char === ' '
          ? `<span class="gsap-char">&nbsp;</span>`
          : `<span class="gsap-char" style="display:inline-block">${char}</span>`
      )
      .join('')
  })
}

// ─── Navbar hide/show on scroll ──────────────────────────────
export function initNavbarScroll() {
  const navbar = document.querySelector('nav')
  if (!navbar) return

  let lastY = 0
  ScrollTrigger.create({
    start: 'top -80px',
    onUpdate: (self) => {
      const y = self.scroll()
      if (y < 80) return
      if (y > lastY) {
        gsap.to(navbar, { yPercent: -100, duration: 0.3, ease: 'power2.in' })
      } else {
        gsap.to(navbar, { yPercent: 0, duration: 0.3, ease: 'power2.out' })
      }
      lastY = y
    },
  })
}

// Handle resize and orientation changes
export function initResponsiveAnimations() {
  let resizeTimer
  
  const handleResize = () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
      initScrollAnimations()
    }, 250)
  }
  
  window.addEventListener('resize', handleResize)
  window.addEventListener('orientationchange', handleResize)
  
  return () => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('orientationchange', handleResize)
    clearTimeout(resizeTimer)
  }
}

export { gsap, ScrollTrigger, Observer }