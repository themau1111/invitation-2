"use client";

import { useEffect, useState } from "react";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function RsvpForm({ accessToken }) {
  const [guest, setGuest] = useState(null);
  const [companions, setCompanions] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!apiBase) { setStatus("error"); setMessage("La confirmación estará disponible pronto."); return; }
    fetch(`${apiBase}/v1/rsvp/${accessToken}`, { cache: "no-store" })
      .then(async (response) => response.ok ? response.json() : Promise.reject())
      .then(({ guest: invitationGuest, companions: invitationCompanions }) => { setGuest(invitationGuest); setCompanions(invitationCompanions); setStatus("ready"); })
      .catch(() => { setStatus("error"); setMessage("No encontramos una invitación válida con este enlace."); });
  }, [accessToken]);

  async function submit(rsvpStatus) {
    setStatus("saving");
    try {
      const response = await fetch(`${apiBase}/v1/rsvp/${accessToken}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rsvpStatus, dietaryRequirements: null, companions: companions.map((companion) => ({ id: companion.id, fullName: companion.fullName, rsvpStatus })) }) });
      if (!response.ok) throw new Error();
      setStatus("saved");
      setMessage(rsvpStatus === "confirmed" ? "¡Gracias! Nos emociona celebrar contigo." : "Gracias por avisarnos. Te tendremos presente en nuestro día.");
    } catch { setStatus("ready"); setMessage("No fue posible guardar tu respuesta. Inténtalo de nuevo."); }
  }

  return <div className="rsvp-card">
    {status === "loading" && <p>Cargando tu invitación…</p>}
    {status === "error" && <><h1>Lo sentimos</h1><p>{message}</p></>}
    {guest && <><p className="eyebrow">Tu invitación</p><h1>Hola, {guest.fullName}</h1><p>Tu invitación contempla <strong>{guest.partySize} {guest.partySize === 1 ? "persona" : "personas"}</strong>{companions.length > 0 ? ", incluidas las personas que aparecen a continuación." : "."}</p>{companions.length > 0 && <ul>{companions.map((companion) => <li key={companion.id}>{companion.fullName || "Acompañante"}</li>)}</ul>}{status !== "saved" && <div className="rsvp-actions"><button onClick={() => submit("confirmed")} disabled={status === "saving"}>Sí, ahí estaré</button><button className="secondary" onClick={() => submit("declined")} disabled={status === "saving"}>No podré asistir</button></div>}{message && <p className="rsvp-message" role="status">{message}</p>}</>}
  </div>;
}
