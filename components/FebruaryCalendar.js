const weekdays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function FebruaryCalendar() {
  const days = Array.from({ length: 28 }, (_, index) => index + 1);
  return <section className="calendar" aria-label="Calendario de febrero de 2027">
    <p className="eyebrow">Reserva la fecha</p><h2>Febrero <span>2027</span></h2>
    <div className="calendar-grid calendar-weekdays">{weekdays.map((day) => <span key={day}>{day}</span>)}</div>
    <div className="calendar-grid calendar-days">{days.map((day) => <span className={day === 7 ? "wedding-day" : ""} key={day}>{day === 7 ? <><b>7</b><i aria-hidden="true">♥</i></> : day}</span>)}</div>
  </section>;
}
