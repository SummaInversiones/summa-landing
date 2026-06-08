"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setMessage("¡Listo! Te avisamos apenas abramos el acceso.");
        setEmail("");
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setStatus("error");
      setMessage(
        data?.error === "invalid email"
          ? "Revisá el email e intentá de nuevo."
          : "Algo salió mal. Probá de nuevo en un rato."
      );
    } catch {
      setStatus("error");
      setMessage("No pudimos conectar. Revisá tu conexión.");
    }
  };

  return (
    <section className="waitlist section" id="waitlist" aria-labelledby="waitlist-title">
      <div className="container waitlist__inner">
        <h2 id="waitlist-title" className="waitlist__title" data-split-words>
          Sumate a la <span className="kw">lista de espera</span>.
        </h2>
        <p className="waitlist__lede reveal" data-delay="100">
          Dejanos tu email y te avisamos apenas abramos el acceso. Sin spam, sin letra chica.
        </p>

        {status === "success" ? (
          <p className="waitlist__success reveal" role="status">
            {message}
          </p>
        ) : (
          <form className="waitlist__form reveal" data-delay="150" onSubmit={onSubmit} noValidate>
            <label className="sr-only" htmlFor="waitlist-email">
              Email
            </label>
            <input
              id="waitlist-email"
              className="waitlist__input"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === "loading"}
            />
            <button className="waitlist__btn" type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Enviando…" : "Sumarme"}
            </button>
          </form>
        )}

        <p className="waitlist__msg" role="alert" aria-live="polite">
          {status === "error" ? message : ""}
        </p>
      </div>
    </section>
  );
}
