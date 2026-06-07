"use client"

import React, { useState } from "react"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <a href="#" className="logo" aria-label="Palm">
          <img className="logo-mark" src="/mockups/palm-logo.png" alt="Palm" />
          <span className="wordmark">Palm</span>
        </a>

        <div className="nav-actions">
          <a href="#download" className="nav-cta">Bajate la app</a>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <button className="nav-burger" aria-label="Abrir menú">
                  <span></span><span></span><span></span>
                </button>
              }
            />
            <SheetContent side="right">
              <SheetTitle className="sr-only">Menú</SheetTitle>
              <a href="#proceso" className="menu-link" onClick={() => setOpen(false)}>Cómo funciona</a>
              <a href="#pilares" className="menu-link" onClick={() => setOpen(false)}>Productos</a>
              <a href="#download" className="nav-cta menu-link" onClick={() => setOpen(false)}>Bajate la app</a>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
