"use client"

import React, { useState } from "react"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"

// Root-relative so the links work from any page (e.g. /preguntas-frecuentes),
// not just the home page. On "/" they're a same-document fragment change
// (smooth scroll, no reload); elsewhere they navigate home and then scroll.
const LINKS = [
  { href: "/#explore-wip", label: "Cómo funciona" },
  { href: "/#calculadora", label: "Calculadora" },
  { href: "/#pilares", label: "Productos" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <a href="/" className="logo" aria-label="Palm — inicio">
          <img className="logo-mark" src="/mockups/palm-logo.webp" alt="Palm" width={69} height={96} />
          <span className="wordmark">Palm</span>
        </a>

        <div className="nav-actions">
          <a href="/#download" className="nav-cta">Bajate la app</a>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <button className="nav-burger" aria-label="Abrir menú">
                  <span></span><span></span><span></span>
                </button>
              }
            />
            <SheetContent side="right" className="nav-sheet">
              <SheetTitle className="nav-sheet__title">Menú</SheetTitle>
              <nav className="nav-sheet__links">
                {LINKS.map((l) => (
                  <a key={l.href} href={l.href} className="menu-link" onClick={close}>
                    {l.label}
                  </a>
                ))}
              </nav>
              <a href="/#download" className="nav-sheet__cta" onClick={close}>
                Bajate la app
              </a>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
