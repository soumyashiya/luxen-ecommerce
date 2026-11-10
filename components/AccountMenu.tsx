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

  if (!ready) return <div className={cn("h-10 w-10", className)} aria-hidden />;

  /* `dark` = sitting on the pink header bar, so the icon renders yellow. */
  const onPink = variant === "dark";
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
          "by-icon grid h-10 w-10 place-items-center",
          onPink ? "text-yellow" : "text-pink",
        )}
      >
        {isAuthed && initial ? (
          <span
            className={cn(
              "grid h-8 w-8 place-items-center rounded-full text-sm font-bold",
              onPink ? "bg-yellow text-pink" : "bg-pink text-yellow",
            )}
          >
            {initial}
          </span>
        ) : (
          <User size={20} strokeWidth={2} />
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="by-menu-open absolute right-0 top-[calc(100%+8px)] w-64 border border-pink/15 bg-yellow text-pink shadow-[0_16px_34px_-20px_rgba(227,29,147,0.7)]"
        >
          {isAuthed ? (
            <>
              <div className="border-b border-pink/15 px-4 py-3">
                <p className="text-sm font-bold uppercase tracking-[1px] text-pink">
                  {user?.name ?? "Account"}
                </p>
                {user?.email && (
                  <p className="mt-0.5 truncate text-xs text-pink/70">{user.email}</p>
                )}
              </div>

              <div className="py-1">
                <Link
                  href="/track-order"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-[15px] uppercase tracking-[0.6px] text-pink transition-colors hover:underline hover:underline-offset-[0.3rem]"
                >
                  <PackageSearch size={15} aria-hidden />
                  Track order
                </Link>
                <Link
                  href="/cart"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-[15px] uppercase tracking-[0.6px] text-pink transition-colors hover:underline hover:underline-offset-[0.3rem]"
                >
                  <ShoppingBag size={15} aria-hidden />
                  Your cart
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[15px] uppercase tracking-[0.6px] text-pink transition-colors hover:underline hover:underline-offset-[0.3rem]"
                >
                  <LogOut size={15} aria-hidden />
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
                className="flex items-center gap-2.5 px-4 py-2.5 text-[15px] uppercase tracking-[0.6px] text-pink transition-colors hover:underline hover:underline-offset-[0.3rem]"
              >
                <LogIn size={15} aria-hidden />
                Sign in
              </Link>
              <Link
                href="/signup"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[15px] uppercase tracking-[0.6px] text-pink transition-colors hover:underline hover:underline-offset-[0.3rem]"
              >
                <UserPlus size={15} aria-hidden />
                Create account
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
