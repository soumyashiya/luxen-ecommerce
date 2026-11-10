"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ANNOUNCEMENTS } from "@/lib/data";

/* Yellow bar above the header. One message at a time, auto-rotating every
   5s with arrows either side — the reference's `announcement-bar`. */
export default function AnnouncementBar() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = ANNOUNCEMENTS.length;

  const go = useCallback(
    (dir: 1 | -1) => setI((n) => (n + dir + total) % total),
    [total],
  );

  useEffect(() => {
    if (paused || total < 2) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % total), 5000);
    return () => window.clearInterval(id);
  }, [paused, total]);

  return (
    <div
      className="bg-yellow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Wraps to two lines on narrow screens rather than truncating. */}
      <div className="by-page flex min-h-[38px] items-center justify-between gap-2 py-1">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous announcement"
          className="by-icon grid h-8 w-8 shrink-0 place-items-center text-pink"
        >
          <ChevronLeft size={18} strokeWidth={2.2} />
        </button>

        {/* aria-live keeps screen readers informed as the message rotates. */}
        <p
          key={i}
          aria-live="polite"
          className="by-announcement-in min-w-0 flex-1 text-balance text-center text-[13px] font-bold uppercase leading-snug tracking-[0.4px] text-pink sm:text-sm"
        >
          {ANNOUNCEMENTS[i]}
        </p>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next announcement"
          className="by-icon grid h-8 w-8 shrink-0 place-items-center text-pink"
        >
          <ChevronRight size={18} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
