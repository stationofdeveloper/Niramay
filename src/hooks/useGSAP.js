import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initScrollAnimations } from '../lib/gsapInit'

export function useScrollAnimations(deps = []) {
  useEffect(() => {
    // Small delay so DOM is painted
    const timer = setTimeout(() => {
      initScrollAnimations()
    }, 100)

    return () => {
      clearTimeout(timer)
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, deps)
}