"use client";

import SiteHeader from "@/components/SiteHeader";

/* The reference uses one identical masthead on every template, so the
   homepage navbar is simply the shared header. Kept as a named module so
   existing imports (`components/sections/Navbar`) keep resolving. */
export default function Navbar() {
  return <SiteHeader />;
}
