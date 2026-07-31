import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/seo";
import TrackOrderPageClient from "./TrackOrderPageClient";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: `Check the status of your ${SITE_NAME} research peptide order.`,
  robots: { index: false, follow: true },
  alternates: { canonical: "/track-order" },
};

export default function TrackOrderPage() {
  return <TrackOrderPageClient />;
}
