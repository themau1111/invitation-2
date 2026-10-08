"use client";

import { useState } from "react";

const assets = {
  bottom: "/images/envelope/bottom-flap.png",
  left: "/images/envelope/side-flap-left.png",
  right: "/images/envelope/side-flap-right.png",
  seal: "/images/envelope/wax-seal.png",
  top: "/images/envelope/top-flap.png",
};

function InvitationCard() {
  return <section className="premium-envelope__invitation" aria-hidden="true">
    <p>Nos casamos</p>
    <strong>Diana <i>&amp;</i> Héctor</strong>
    <span>07 · 02 · 2027</span>
  </section>;
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

  return <section className={`premium-envelope-intro${opening ? " is-opening" : ""}`} aria-label="Abrir invitación de Diana y Héctor">
    <div className="premium-envelope" aria-hidden="true">
      <div className="premium-envelope__back-outer" />
      <div className="premium-envelope__inner-back" />
      <InvitationCard />
      <img className="premium-envelope__flap premium-envelope__flap--bottom" src={assets.bottom} alt="" />
      <img className="premium-envelope__flap premium-envelope__flap--left" src={assets.left} alt="" />
      <img className="premium-envelope__flap premium-envelope__flap--right" src={assets.right} alt="" />
      <img className="premium-envelope__flap premium-envelope__flap--top" src={assets.top} alt="" />
    </div>
    <button type="button" className="premium-envelope__seal" onClick={openInvitation} disabled={opening} aria-label="Abrir invitación de Diana y Héctor">
      <img src={assets.seal} alt="" />
    </button>
  </section>;
}
