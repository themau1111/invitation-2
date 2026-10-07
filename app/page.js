import Countdown from "@/components/Countdown";
import FebruaryCalendar from "@/components/FebruaryCalendar";
import InvitationQr from "@/components/InvitationQr";
import RsvpCodeEntry from "@/components/RsvpCodeEntry";

const templeMap = "https://www.google.com.mx/maps/place/Santuario+Nuestra+Se%C3%B1ora+de+la+Soledad/@20.6396927,-103.3309581,15z/data=!3m1!4b1!4m6!3m5!1s0x8428b3b4b7864039:0x720a85b7458cf61c!8m2!3d20.6396937!4d-103.312504!16s%2Fg%2F1thcn2gj";
const receptionMap = "https://www.google.com.mx/maps/place/La+Yeguada+A+y+E/@20.6341582,-103.2075609,17z/data=!3m1!4b1!4m6!3m5!1s0x8428b5003b7957b9:0x73fb5e945d9f62d8!8m2!3d20.6341582!4d-103.204986!16s%2Fg%2F11wthrt9xg";

export default function Home() {
  return <main>
    <InvitationQr />
    <section className="hero" aria-labelledby="couple">
      <p className="eyebrow">Nos casamos</p>
      <div className="monogram" style={{ gap: ".03em" }} aria-hidden="true"><span style={{ transform: "none" }}>D</span><b style={{ color: "var(--forest)", fontSize: ".32em", fontStyle: "normal", margin: "0 .05em" }}>♥</b><span style={{ transform: "none" }}>H</span></div>
      <h1 id="couple">Diana <em>&amp;</em> Héctor</h1>
      <div className="hero-date" aria-label="Domingo 07 de febrero de 2027">
        <p>Febrero</p>
        <div><span>Domingo</span><strong>07</strong><span>2027</span></div>
      </div>
      <a className="scroll-link" href="#celebracion">Descubre nuestro día <span aria-hidden="true">↓</span></a>
    </section>

    <section className="quote-section">
      <div className="ornament" aria-hidden="true">❦</div>
      <blockquote>“Porque descubrimos que el amor no es solo un sentimiento, sino la decisión diaria de hacernos felices. Hoy elegimos caminar juntos para siempre.”</blockquote>
    </section>

    <section className="countdown-section"><p className="eyebrow">Tan solo faltan</p><Countdown /><p className="script-line">para nuestro gran día</p></section>

    <FebruaryCalendar />

    <section id="celebracion" className="details" aria-labelledby="details-title">
      <p className="eyebrow">Celebremos juntos</p><h2 id="details-title">Nuestro día</h2>
      <div className="event-list">
        <article className="venue-card"><div className="venue-image venue-image--temple"><img src="/images/santuario-transparent.png" alt="Santuario Nuestra Señora de la Soledad" /></div><div className="venue-copy"><span className="event-icon" aria-hidden="true">✧</span><p className="event-label">Ceremonia religiosa</p><h3>Santuario Nuestra Señora<br />de la Soledad</h3><p>Te esperamos a las <strong>5:40 pm</strong><br />Misa a las <strong>6:00 pm</strong></p><a href={templeMap} target="_blank" rel="noreferrer">Abrir ubicación <span aria-hidden="true">↗</span></a></div></article>
        <article className="venue-card"><div className="venue-image venue-image--reception"><img src="/images/yeguada-transparent.png" alt="La Yeguada A y E" /></div><div className="venue-copy"><span className="event-icon" aria-hidden="true">✧</span><p className="event-label">Recepción</p><h3>La Yeguada A y E</h3><p>Nos vemos a las <strong>8:00 pm</strong></p><a href={receptionMap} target="_blank" rel="noreferrer">Abrir ubicación <span aria-hidden="true">↗</span></a></div></article>
      </div>
    </section>

    <section className="attire"><p className="eyebrow">Código de vestimenta</p><h2>Semiformal</h2><p>Agradecemos evitar el blanco y los tonos verde olivo.</p><div className="swatches" aria-label="Tonos a evitar"><i /><i /><i /><i /><i /></div></section>

    <section className="gifts"><p className="eyebrow">Mesa de regalos</p><h2>Tu presencia es el<br /><em>mejor regalo</em></h2><p>Pero si deseas acompañarnos con un detalle, selecciona la opción que prefieras.</p><div className="gift-options"><a href="https://mesaderegalos.liverpool.com.mx/milistaderegalos/60007672" target="_blank" rel="noreferrer"><img src="/images/liverpool.png" alt="Liverpool" /><small>Opción 01</small><span>Ver mesa de regalos ↗</span></a><a href="https://www.amazon.com.mx/wedding/guest-view/2HMJ9WW6M938H" target="_blank" rel="noreferrer"><img src="/images/amazon.png" alt="Amazon" /><small>Opción 02</small><span>Ver mesa de regalos ↗</span></a></div></section>

    <section className="rsvp"><p className="eyebrow">Confirma tu asistencia</p><h2>Nos encantará<br /><em>celebrar contigo</em></h2><p>Con tu código personal podrás ver tus boletos y confirmar a tus acompañantes.</p><RsvpCodeEntry /></section>
    <footer>Diana &amp; Héctor <span>♥</span> 07 · 02 · 2027</footer>
  </main>;
}
