import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function useFormAnimation(step) {
  const formRef = useRef(null)

  useEffect(() => {
    if (!formRef.current) return

    // Kill any existing tweens on this element
    gsap.killTweensOf(formRef.current)

    // Animate the whole form card in on step change
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 30, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power3.out',
      }
    )

    // Stagger animate all form fields inside
    const fields = formRef.current.querySelectorAll(
      'input, select, textarea, .form-field, .service-card, label'
    )
    if (fields.length) {
      gsap.fromTo(
        fields,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.38,
          stagger: 0.06,
          ease: 'power2.out',
          delay: 0.15,
        }
      )
    }
  }, [step])

  return formRef
}