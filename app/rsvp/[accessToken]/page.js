import Link from "next/link";
import RsvpForm from "@/components/RsvpForm";

export default async function RsvpPage({ params }) {
  const { accessToken } = await params;
  return <main className="rsvp-page"><Link href="/" className="back-link">← Diana &amp; Héctor</Link><RsvpForm accessToken={accessToken} /></main>;
}
