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

  function scrollToForm() {
    const section = document.getElementById('waitlist-form')
    section?.scrollIntoView({ behavior: 'smooth' })
    const input = section?.querySelector('input')
    input?.focus({ preventScroll: true })
  }

  return (
    <nav
      aria-label="Principal"
      className={`fixed top-0 left-0 right-0 z-50 transition-none ${
        scrolled
          ? 'bg-brand-white/85 backdrop-blur-md border-b border-muted'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className={`font-bold text-lg tracking-tight ${scrolled ? 'text-brand-dark' : 'text-white'}`}>
          SUMMA
        </span>
        <button
          onClick={scrollToForm}
          className={`hidden sm:block text-sm font-medium px-5 py-2 rounded-full border transition-colors ${
            scrolled
              ? 'border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white'
              : 'border-white/40 text-white hover:border-white'
          }`}
        >
          Unirse a la lista
        </button>
      </div>
    </nav>
  )
}
