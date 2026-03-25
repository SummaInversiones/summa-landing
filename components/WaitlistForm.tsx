'use client'

import { useState, useId } from 'react'

type Variant = 'dark' | 'light'

interface Props {
  variant?: Variant
  id?: string
}

export function WaitlistForm({ variant = 'dark', id }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const formId = useId()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="text-brand-green font-medium text-lg">
        Ya estás en la lista.
      </p>
    )
  }

  const inputClass = variant === 'dark'
    ? 'bg-white/[0.08] border border-white/[0.15] text-white placeholder:text-white/40'
    : 'bg-white border border-muted text-brand-dark placeholder:text-muted-fg'

  return (
    <div id={id} className="relative w-full max-w-md flex flex-col">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
        <label htmlFor={formId} className="sr-only">Tu email</label>
        <input
          id={formId}
          type="email"
          required
          placeholder="Tu email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={`flex-1 rounded-full px-5 py-3 text-sm outline-none ${inputClass}`}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-full px-6 py-3 text-sm font-bold bg-brand-green text-brand-dark
                     hover:scale-[1.02] transition-transform duration-150 disabled:opacity-60
                     whitespace-nowrap"
        >
          {status === 'loading' ? 'Enviando…' : 'Quiero invertir →'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-red-400 text-sm mt-2 text-center">
          Algo salió mal. Intentá de nuevo.
        </p>
      )}
    </div>
  )
}
