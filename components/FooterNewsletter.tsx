"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

// The footer "newsletter" block maps to Palm's real waitlist (Upstash).
export default function FooterNewsletter() {
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
        setMessage("Listo, te anotamos. Te avisamos cuando abramos.");
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
    <div className="fnl">
      <div className="fnl__copy">
        <h2 className="fnl__title">Sumate a la lista.</h2>
        <p className="fnl__sub">
          Sé de los primeros en invertir con Palm. Te avisamos cuando abramos —
          sin spam.
        </p>
      </div>

      {status === "success" ? (
        <p className="fnl__success" role="status">{message}</p>
      ) : (
        <form className="fnl__form" onSubmit={onSubmit} noValidate>
          <label className="sr-only" htmlFor="footer-email">Email</label>
          <input
            id="footer-email"
            className="fnl__input"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "loading"}
          />
          <button className="fnl__btn" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Enviando…" : "Sumarme"}
          </button>
        </form>
      )}

      <p className="fnl__msg" role="alert" aria-live="polite">
        {status === "error" ? message : ""}
      </p>
    </div>
  );
}
