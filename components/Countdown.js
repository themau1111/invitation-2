"use client";

import { useEffect, useState } from "react";

const weddingDate = new Date("2027-02-07T18:00:00-06:00");

function remaining() {
  const milliseconds = Math.max(0, weddingDate.getTime() - Date.now());
  return {
    días: Math.floor(milliseconds / 86_400_000),
    horas: Math.floor(milliseconds / 3_600_000) % 24,
    minutos: Math.floor(milliseconds / 60_000) % 60,
    segundos: Math.floor(milliseconds / 1_000) % 60
  };
}

export default function Countdown() {
  const [time, setTime] = useState(remaining);
  useEffect(() => {
    const timer = window.setInterval(() => setTime(remaining()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  return <div className="countdown" aria-label="Cuenta regresiva para la boda">
    {Object.entries(time).map(([label, value]) => <div key={label}><strong>{String(value).padStart(2, "0")}</strong><span>{label}</span></div>)}
  </div>;
}
