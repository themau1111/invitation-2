import { QRCodeSVG } from "qrcode.react";

export default function InvitationQr() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "https://diana-y-hector.vercel.app";
  return <aside className="desktop-qr" aria-label="Abrir invitación en el celular">
    <QRCodeSVG value={url} size={88} bgColor="#faf7ef" fgColor="#314837" level="M" includeMargin />
    <p>Escanea para verla<br />en tu celular</p>
  </aside>;
}
