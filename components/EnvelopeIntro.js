"use client";

import { useState } from "react";

export default function EnvelopeIntro() {
  const [opening, setOpening] = useState(false);
  const [visible, setVisible] = useState(true);

  function openInvitation() {
    if (opening) return;

    setOpening(true);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => setVisible(false), reducedMotion ? 0 : 1_900);
  }

  if (!visible) return null;

  return <section className={`envelope-intro${opening ? " is-opening" : ""}`} aria-label="Abrir invitación de Diana y Héctor">
    <div className="envelope-intro__glow" aria-hidden="true" />
    <div className="envelope-scene envelope-scene--sealed">
      <p className="envelope-scene__eyebrow">Diana &amp; Héctor</p>
      <div className="envelope" aria-hidden="true">
        <div className="envelope__back" />
        <div className="envelope__flap envelope__flap--top" />
        <div className="envelope__flap envelope__flap--left" />
        <div className="envelope__flap envelope__flap--right" />
        <div className="envelope__flap envelope__flap--bottom" />
      </div>
      <button type="button" className="envelope__seal" onClick={openInvitation} disabled={opening}>
        <span aria-hidden="true">D<i>♥</i>H</span>
        <span className="sr-only">{opening ? "Abriendo invitación" : "Abrir invitación de Diana y Héctor"}</span>
      </button>
      <p className="envelope-scene__note" aria-hidden="true">{opening ? "" : "Toca el sello para abrir"}</p>
    </div>
  </section>;
}
