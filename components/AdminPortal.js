"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase-browser";
import SeatingPlanner from "@/components/SeatingPlanner";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://diana-y-hector.vercel.app";

function accessLink(code) {
  return `${siteUrl}/?code=${encodeURIComponent(code)}#confirmar`;
}

function Card({ title, value, detail }) {
  return <article className="admin-metric"><p>{title}</p><strong>{value}</strong><span>{detail}</span></article>;
}

export default function AdminPortal() {
  const supabase = useMemo(() => getBrowserSupabase(), []);
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [tab, setTab] = useState("resumen");
  const [guests, setGuests] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newGuest, setNewGuest] = useState({ fullName: "", email: "", phone: "", partySize: 1 });
  const [issued, setIssued] = useState(null);

  const callApi = useCallback(async (path, options = {}) => {
    if (!apiBase) throw new Error("Falta configurar la URL del API.");
    if (!session?.access_token) throw new Error("Tu sesión ya no está disponible.");
    const response = await fetch(`${apiBase}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}`, ...(options.headers || {}) },
    });
    const payload = response.status === 204 ? null : await response.json();
    if (!response.ok) throw new Error(payload?.error?.message || "No fue posible completar la operación.");
    return payload;
  }, [session]);

  const refresh = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      const [guestPayload, planPayload] = await Promise.all([callApi("/v1/admin/guests?pageSize=100"), callApi("/v1/admin/seating")]);
      setGuests(guestPayload.guests || []);
      setPlans(planPayload.plans || []);
    } catch (error) { setNotice(error.message); }
    finally { setLoading(false); }
  }, [callApi, session]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session || null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => { refresh(); }, [refresh]);

  async function sendLoginLink(event) {
    event.preventDefault();
    if (!supabase) return setNotice("El acceso de administración aún no está configurado.");
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    setNotice(error ? "No pudimos enviar el enlace de acceso." : "Revisa tu correo para continuar con seguridad.");
  }

  async function createGuest(event) {
    event.preventDefault();
    try {
      const payload = await callApi("/v1/admin/guests", { method: "POST", body: JSON.stringify(newGuest) });
      setIssued({ guest: payload.guest, code: payload.accessCode });
      setNewGuest({ fullName: "", email: "", phone: "", partySize: 1 });
      await refresh();
    } catch (error) { setNotice(error.message); }
  }

  async function regenerateCode(guest) {
    try {
      const payload = await callApi(`/v1/admin/guests/${guest.id}/access-code`, { method: "POST", body: "{}" });
      setIssued({ guest, code: payload.accessCode });
    } catch (error) { setNotice(error.message); }
  }

  async function copy(value, label) {
    try { await navigator.clipboard.writeText(value); setNotice(`${label} copiado.`); }
    catch { setNotice("No fue posible copiar automáticamente."); }
  }

  async function signOut() { await supabase?.auth.signOut(); setGuests([]); setPlans([]); }

  if (!supabase) return <main className="admin-auth"><section><p className="admin-kicker">Diana & Héctor</p><h1>Administración</h1><p>Faltan las variables públicas de autenticación para habilitar este portal.</p></section></main>;
  if (!session) return <main className="admin-auth"><section><p className="admin-kicker">Diana & Héctor</p><h1>Un espacio para organizarlo todo.</h1><p>Solicita un enlace seguro con el correo que fue dado de alta como administrador.</p><form onSubmit={sendLoginLink}><label htmlFor="admin-email">Correo administrador</label><input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="tu@correo.com" /><button type="submit">Enviar enlace de acceso</button></form>{notice && <p className="admin-notice" role="status">{notice}</p>}<a href="/">Volver a la invitación</a></section></main>;

  const confirmed = guests.filter((guest) => guest.rsvpStatus === "confirmed").length;
  const pending = guests.filter((guest) => guest.rsvpStatus === "pending").length;
  const tabs = [{ id: "resumen", label: "Resumen" }, { id: "invitaciones", label: "Invitaciones" }, { id: "mesas", label: "Mesas" }];
  return <main className="admin-shell">
    <header className="admin-header"><a href="/" className="admin-brand">D<span>♥</span>H <small>Administración</small></a><button className="admin-signout" type="button" onClick={signOut}>Cerrar sesión</button></header>
    <nav className="admin-nav" aria-label="Secciones administrativas">{tabs.map((item) => <button key={item.id} className={tab === item.id ? "is-active" : ""} onClick={() => setTab(item.id)} type="button">{item.label}</button>)}</nav>
    <section className="admin-content">
      {notice && <p className="admin-notice" role="status">{notice}</p>}
      {tab === "resumen" && <><div className="admin-title"><div><p className="admin-kicker">Vista general</p><h1>Todo empieza con una mesa bien pensada.</h1></div><button type="button" onClick={refresh} disabled={loading}>{loading ? "Actualizando…" : "Actualizar"}</button></div><div className="admin-metrics"><Card title="Invitaciones" value={guests.length} detail="creadas" /><Card title="Confirmadas" value={confirmed} detail="respuestas recibidas" /><Card title="Pendientes" value={pending} detail="por confirmar" /><Card title="Planos" value={plans.length} detail="para organizar" /></div><article className="admin-next"><p className="admin-kicker">Siguiente paso</p><h2>{guests.length ? "Comparte las invitaciones y acomoda a tus invitados." : "Crea la primera invitación personalizada."}</h2><button type="button" onClick={() => setTab(guests.length ? "mesas" : "invitaciones")}>{guests.length ? "Ir a mesas" : "Crear invitación"}</button></article></>}
      {tab === "invitaciones" && <><div className="admin-title"><div><p className="admin-kicker">Invitaciones personales</p><h1>Códigos, enlaces y boletos en un solo lugar.</h1></div></div><div className="admin-invitation-grid"><form className="admin-form" onSubmit={createGuest}><h2>Nueva invitación</h2><label>Nombre completo<input value={newGuest.fullName} onChange={(event) => setNewGuest({ ...newGuest, fullName: event.target.value })} required maxLength="160" /></label><label>Correo <small>opcional</small><input type="email" value={newGuest.email} onChange={(event) => setNewGuest({ ...newGuest, email: event.target.value })} /></label><label>Teléfono <small>opcional</small><input value={newGuest.phone} onChange={(event) => setNewGuest({ ...newGuest, phone: event.target.value })} maxLength="40" /></label><label>Boletos disponibles<select value={newGuest.partySize} onChange={(event) => setNewGuest({ ...newGuest, partySize: Number(event.target.value) })}>{Array.from({ length: 12 }, (_, index) => <option value={index + 1} key={index}>{index + 1}</option>)}</select></label><button type="submit">Crear invitación</button></form><section className="admin-guests"><div className="admin-panel-heading"><h2>Invitados</h2><span>{guests.length}</span></div>{guests.length ? <div className="admin-guest-list">{guests.map((guest) => <article key={guest.id}><div><strong>{guest.fullName}</strong><small>{guest.partySize} {guest.partySize === 1 ? "boleto" : "boletos"} · {guest.rsvpStatus === "confirmed" ? "Confirmada" : guest.rsvpStatus === "declined" ? "No asistirá" : "Pendiente"}</small></div><button type="button" onClick={() => regenerateCode(guest)}>Generar enlace</button></article>)}</div> : <p className="admin-empty">Aún no hay invitaciones. Crea la primera desde el formulario.</p>}</section></div>{issued && <section className="admin-issued"><p className="admin-kicker">Invitación lista</p><h2>{issued.guest.fullName}</h2><div className="admin-code"><span>Código personal</span><strong>{issued.code}</strong></div><label>Enlace personal<input readOnly value={accessLink(issued.code)} aria-label="Enlace personal" /></label><div><button type="button" onClick={() => copy(accessLink(issued.code), "Enlace")}>Copiar enlace</button><button type="button" className="admin-secondary" onClick={() => copy(issued.code, "Código")}>Copiar código</button>{issued.guest.email && <a href={`mailto:${encodeURIComponent(issued.guest.email)}?subject=${encodeURIComponent("Diana y Héctor · tu invitación")}&body=${encodeURIComponent(`Hola ${issued.guest.fullName},\n\nDiana y Héctor desean compartirte su invitación.\n\nAbre tu enlace personal: ${accessLink(issued.code)}\n\nTu código personal es: ${issued.code}`)}`}>Preparar correo</a>}</div><p>El código se muestra únicamente ahora. Si se extravía, genera uno nuevo para invalidar el anterior.</p></section>}</>}
      {tab === "mesas" && <SeatingPlanner plans={plans} guests={guests} callApi={callApi} onRefresh={refresh} />}
    </section>
  </main>;
}
