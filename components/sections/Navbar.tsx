"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { LogOut, Menu, User, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import CartButton from "@/components/cart/CartButton";
import AccountMenu from "@/components/AccountMenu";
import { NAV_LINKS } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isAuthed, user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    // Close on Escape — expected menu behavior for screen-reader / keyboard users.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={cn(
          "transition-all duration-500",
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_-18px_rgba(0,0,0,0.25)]"
            : "bg-transparent",
        )}
      >
        <div className="container-luxen flex h-[74px] items-center justify-between">
          {/* Left: menu trigger (icon-only on mobile) */}
          <button
            onClick={() => setOpen(true)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full bg-white px-3 py-2.5 text-[13px] font-bold tracking-wide shadow-sm transition-colors sm:px-4",
              "text-ink hover:bg-white",
            )}
            aria-label="Open navigation menu"
            aria-expanded={open}
            aria-controls="main-nav-drawer"
            aria-haspopup="dialog"
          >
            <span className="hidden sm:inline">MENU</span>
            <Menu size={18} strokeWidth={2.5} aria-hidden="true" />
          </button>

          {/* Center: logo */}
          <Logo
            className={cn(
              "absolute left-1/2 -translate-x-1/2 transition-colors duration-300",
              scrolled ? "text-ink" : "text-white",
            )}
            mark="var(--brand)"
          />

          {/* Right: shop + account + cart */}
          <div className="flex items-center gap-3 md:gap-6">
            <Link
              href="/shop"
              className="hidden items-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark sm:inline-flex"
            >
              Shop
            </Link>
            <AccountMenu variant={scrolled ? "light" : "dark"} />
            <CartButton className={cn(scrolled ? "text-ink" : "text-white", "hover:text-brand")} />
          </div>
        </div>
      </div>

      {/* Fullscreen mobile / menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="main-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-navy/95 backdrop-blur-xl"
          >
            <div className="container-luxen flex h-[74px] items-center justify-between">
              <Logo className="text-white" mark="var(--brand)" />
              <button
                onClick={() => setOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <motion.nav
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
              className="container-luxen mt-4 flex flex-col gap-1 pb-[calc(4rem+env(safe-area-inset-bottom))] sm:mt-8 sm:gap-2"
            >
              {NAV_LINKS.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: { opacity: 1, y: 0, transition: { ease: EASE, duration: 0.5 } },
                  }}
                  className="group flex items-baseline justify-between border-b border-white/10 py-3 text-[1.7rem] font-bold text-white/90 transition-colors hover:text-white sm:py-4 sm:text-4xl md:text-6xl"
                >
                  {link.label}
                  <span className="text-base font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
                    0{NAV_LINKS.indexOf(link) + 1}
                  </span>
                </motion.a>
              ))}

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: { ease: EASE, duration: 0.5 } },
                }}
                className="flex flex-col gap-3 pt-6 sm:pt-8"
              >
                {isAuthed ? (
                  <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-white">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-white">
                        {(user?.name?.[0] ?? "A").toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold">{user?.name ?? "Account"}</p>
                        {user?.email && (
                          <p className="truncate text-xs text-white/60">{user.email}</p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        logout();
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                    >
                      <LogOut size={16} /> Sign out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/signup"
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
                    >
                      <User size={16} /> Create account
                    </Link>
                    <Link
                      href="/signin"
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center justify-center rounded-full border border-white/20 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                    >
                      Sign in
                    </Link>
                  </div>
                )}
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
