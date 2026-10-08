"use client";

import { useState } from "react";

function BotanicalRelief({ className }) {
  return <svg className={`envelope-botanical ${className}`} viewBox="0 0 240 360" aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 352C52 293 45 229 85 183C122 140 161 118 226 16" strokeWidth="3" />
      <path d="M51 293c-20-17-30-39-28-67 27 8 39 29 28 67Zm11-56c21-4 38-17 50-39-25-5-43 8-50 39Zm29-56c-17-20-22-43-14-68 25 13 33 35 14 68Zm33-38c23 0 43-10 58-30-25-10-45 0-58 30Zm35-38c-9-23-4-45 14-65 16 22 12 44-14 65Zm-83 151c19 8 31 24 36 49-24-2-37-18-36-49Zm43-70c23 4 39 18 48 42-26 1-42-13-48-42Zm54-62c20 9 31 25 33 50-23-4-34-21-33-50Z" strokeWidth="2.6" />
      <path d="M29 224c18 9 28 24 29 46-21-4-31-19-29-46Zm83-112c20-6 39-2 57 13-18 13-37 9-57-13Zm73-54c15-15 34-21 57-17-10 21-29 26-57 17Z" strokeWidth="2" />
    </g>
  </svg>;
}

export default function EnvelopeIntro() {
  const [opening, setOpening] = useState(false);
  const [visible, setVisible] = useState(true);

  function openInvitation() {
    if (opening) return;

    setOpening(true);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => setVisible(false), reducedMotion ? 0 : 4_900);
  }

  if (!visible) return null;

  return <section className={`envelope-intro${opening ? " is-opening" : ""}`} aria-label="Abrir invitación de Diana y Héctor">
    <div className="envelope-intro__glow" aria-hidden="true" />
    <div className="envelope-scene envelope-scene--sealed">
      <div className="envelope" aria-hidden="true">
        <div className="envelope__back" />
        <div className="envelope__flap envelope__flap--top" />
        <div className="envelope__flap envelope__flap--left" />
        <div className="envelope__flap envelope__flap--right" />
        <div className="envelope__flap envelope__flap--bottom" />
        <BotanicalRelief className="envelope-botanical--left" />
        <BotanicalRelief className="envelope-botanical--right" />
        <BotanicalRelief className="envelope-botanical--lower-left" />
        <BotanicalRelief className="envelope-botanical--lower-right" />
      </div>
      <button type="button" className="envelope__seal" onClick={openInvitation} disabled={opening} aria-label="Abrir invitación de Diana y Héctor">
        <span aria-hidden="true">D<i>&amp;</i>H</span>
      </button>
    </div>
  </section>;
}
