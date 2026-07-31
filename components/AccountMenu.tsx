"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LogIn, LogOut, PackageSearch, ShoppingBag, User, UserPlus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

type Variant = "light" | "dark";

/*
 * Shared account control for the header — always renders as a single user
 * icon, signed in or not. Clicking it opens a dropdown:
 * - Signed out → Sign in / Create account
 * - Signed in  → account info, Track order, Your cart, Logout
 *
 * `variant` swaps colors so it works both on the dark hero navbar and the
 * white sub-page header.
 */
export default function AccountMenu({
  variant = "light",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  const { isAuthed, user, ready, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!ready) return <div className={cn("h-9 w-9", className)} aria-hidden />;

  const onDark = variant === "dark";
  const first = user?.name?.split(" ")[0];
  const initial = first?.[0]?.toUpperCase();

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className={cn(
          "grid h-9 w-9 place-items-center rounded-full transition-colors",
          onDark
            ? "text-white hover:bg-white/10"
            : "text-ink hover:bg-surface",
        )}
      >
        {isAuthed && initial ? (
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-sm font-bold text-white">
            {initial}
          </span>
        ) : (
          <User size={20} strokeWidth={2} />
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] w-64 overflow-hidden rounded-2xl border border-black/10 bg-white text-ink shadow-[0_20px_40px_-20px_rgba(0,0,0,0.25)]"
        >
          {isAuthed ? (
            <>
              <div className="border-b border-black/10 bg-surface px-4 py-3">
                <p className="text-sm font-bold text-ink">{user?.name ?? "Account"}</p>
                {user?.email && (
                  <p className="mt-0.5 truncate text-xs text-muted">{user.email}</p>
                )}
              </div>

              <div className="py-1">
                <Link
                  href="/track-order"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink transition-colors hover:bg-surface"
                >
                  <PackageSearch size={15} className="text-muted" />
                  Track order
                </Link>
                <Link
                  href="/cart"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink transition-colors hover:bg-surface"
                >
                  <ShoppingBag size={15} className="text-muted" />
                  Your cart
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-ink transition-colors hover:bg-surface"
                >
                  <LogOut size={15} className="text-muted" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="py-1">
              <Link
                href="/signin"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink transition-colors hover:bg-surface"
              >
                <LogIn size={15} className="text-muted" />
                Sign in
              </Link>
              <Link
                href="/signup"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink transition-colors hover:bg-surface"
              >
                <UserPlus size={15} className="text-muted" />
                Create account
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
