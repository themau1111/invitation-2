"use client";

import { useState } from "react";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function RsvpCodeEntry({ initialCode = "" }) {
  const [code, setCode] = useState(/^\d{4}$/.test(initialCode) ? initialCode : "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function validate(candidate) {
    const nextCode = candidate ?? code;
    if (!/^\d{4}$/.test(nextCode)) return setMessage("Escribe los 4 dígitos de tu código.");
    if (!apiBase) return setMessage("La confirmación estará disponible pronto.");
    setLoading(true); setMessage("");
    try {
      const response = await fetch(`${apiBase}/v1/rsvp/access`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: nextCode }) });
      const payload = await response.json();
      if (!response.ok || !payload.accessToken) throw new Error(payload?.error?.message);
      window.location.assign(`/rsvp/${payload.accessToken}`);
    } catch (error) { setMessage(error.message || "No pudimos validar ese código."); }
    finally { setLoading(false); }
  }

  function submit(event) { event.preventDefault(); validate(); }

  return <form className="rsvp-code-form" onSubmit={submit}>
    <label htmlFor="access-code">Código de acceso</label>
    <div><input id="access-code" inputMode="numeric" autoComplete="one-time-code" maxLength="4" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} placeholder="· · · ·" aria-describedby="access-help" /><button type="submit" disabled={loading}>{loading ? "Validando…" : "Ver mis boletos"}</button></div>
    <p id="access-help">{initialCode ? "Tu código personal ya está listo; continúa para ver tus boletos." : "Ingresa el código de 4 dígitos incluido en tu invitación."}</p>
    {message && <p className="rsvp-code-message" role="status">{message}</p>}
  </form>;
}
