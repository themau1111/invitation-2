"use client";

import { useState } from "react";

export default function EnvelopeIntro() {
  const [opening, setOpening] = useState(false);
  const [visible, setVisible] = useState(true);

  function openInvitation() {
    if (opening) return;

    setOpening(true);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => setVisible(false), reducedMotion ? 0 : 1_250);
  }

  if (!visible) return null;

  return <section className={`envelope-intro${opening ? " is-opening" : ""}`} aria-label="Abrir invitación de Diana y Héctor">
    <div className="envelope-intro__glow" aria-hidden="true" />
    <div className="envelope-scene">
      <div className="envelope-card" aria-hidden="true">
        <span>Nos casamos</span>
        <strong>D <i>♥</i> H</strong>
        <small>07 · 02 · 2027</small>
      </div>
      <div className="envelope" aria-hidden="true">
        <div className="envelope__back" />
        <div className="envelope__flap" />
        <div className="envelope__front envelope__front--left" />
        <div className="envelope__front envelope__front--right" />
        <div className="envelope__seal">D<i>♥</i>H</div>
      </div>
      <p className="envelope-scene__note">Una celebración para recordar</p>
      <button type="button" className="envelope-open" onClick={openInvitation} disabled={opening}>
        {opening ? "Abriendo…" : "Abrir invitación"}
        <span aria-hidden="true">↗</span>
      </button>
    </div>
  </section>;
}
