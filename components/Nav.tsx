'use client'

import { useEffect, useState } from 'react'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const sentinel = document.getElementById('hero-sentinel')
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  function scrollToWaitlist() {
    document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })
    setTimeout(() => {
      const input = document.getElementById('waitlist-form')?.querySelector('input')
      input?.focus({ preventScroll: true })
    }, 500)
  }

  const pillBase = 'fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full px-6 py-3 flex items-center gap-6 transition-colors duration-300'
  const pillDark = 'bg-white/10 backdrop-blur-md border border-white/15'
  const pillLight = 'bg-black/5 backdrop-blur-md border border-black/10'

  const linkBase = 'text-sm font-medium transition-colors'
  const linkDark = 'text-white/70 hover:text-white'
  const linkLight = 'text-brand-dark/70 hover:text-brand-dark'

  return (
    <nav aria-label="Principal" className={`${pillBase} ${scrolled ? pillLight : pillDark}`}>
      <span className={`font-bold text-base tracking-tight ${scrolled ? 'text-brand-dark' : 'text-white'}`}>
        SUMMA
      </span>

      <div className="hidden md:flex items-center gap-6">
        <a href="#como-funciona" className={`${linkBase} ${scrolled ? linkLight : linkDark}`}>
          ¿Cómo funciona?
        </a>
        <a href="#beneficios" className={`${linkBase} ${scrolled ? linkLight : linkDark}`}>
          Por qué Summa
        </a>
        <a href="#faq" className={`${linkBase} ${scrolled ? linkLight : linkDark}`}>
          Preguntas Frecuentes
        </a>
      </div>

      <button
        type="button"
        onClick={scrollToWaitlist}
        className="bg-brand-green text-brand-dark font-bold text-sm px-5 py-2 rounded-full hover:scale-[1.02] active:scale-[0.97] transition-transform duration-150 whitespace-nowrap"
      >
        Acceso Anticipado
      </button>
    </nav>
  )
}
