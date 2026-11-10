"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import CartButton from "@/components/cart/CartButton";
import AccountMenu from "@/components/AccountMenu";
import AnnouncementBar from "@/components/AnnouncementBar";
import { MAIN_NAV, UTILITY_NAV, type NavItem } from "@/lib/data";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Header — a faithful rebuild of the reference's three-row masthead:

     1. yellow announcement bar (rotating)
     2. pink main bar     — utility links · centred wordmark · icon cluster
     3. yellow nav row    — centred uppercase links, dropdowns on hover/focus

   The whole stack is sticky and sits in normal flow, so pages don't need a
   top offset. Below 990px rows 1 and 3 collapse into a left drawer.
--------------------------------------------------------------------------- */

function NavDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  /* A short close delay keeps the panel usable while the pointer crosses
     the gap between the trigger and the panel. */
  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(e) => {
        if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <Link
        href={item.href}
        aria-expanded={open}
        aria-haspopup="true"
        className="by-nav-link by-link inline-flex items-center gap-1.5 px-[30px] py-[11px] text-pink"
      >
        <span className={cn(open && "underline underline-offset-[0.3rem]")}>
          {item.label}
        </span>
        <ChevronDown
          size={15}
          strokeWidth={2.4}
          aria-hidden
          className={cn(
            "transition-transform duration-[var(--dur)] ease-[var(--ease)]",
            open && "rotate-180",
          )}
        />
      </Link>

      {open && (
        <div className="by-menu-open absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 border border-pink/15 bg-yellow py-2 shadow-[0_12px_28px_-18px_rgba(227,29,147,0.6)]">
          {item.children?.map((c) => (
            <Link
              key={c.href + c.label}
              href={c.href}
              className="block px-5 py-2 text-[15px] uppercase leading-snug tracking-[0.6px] text-pink transition-colors hover:underline hover:underline-offset-[0.3rem]"
            >
              {c.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="absolute inset-x-0 top-full z-50 border-t border-yellow/20 bg-pink">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const term = q.trim();
          router.push(term ? `/shop?q=${encodeURIComponent(term)}` : "/shop");
          onClose();
        }}
        className="by-page flex items-center gap-3 py-5"
      >
        <Search size={20} className="shrink-0 text-yellow" aria-hidden />
        <input
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="SEARCH THE RESEARCH CATALOG"
          aria-label="Search products"
          className="by-field by-field-on-pink border-0 border-b bg-transparent px-0 uppercase tracking-[1px]"
        />
        <button type="submit" className="by-btn by-btn-yellow shrink-0 px-6">
          Search
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="by-icon grid h-10 w-10 shrink-0 place-items-center text-yellow"
        >
          <X size={20} />
        </button>
      </form>
    </div>
  );
}

function MobileDrawer({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Main navigation"
    >
      <div className="absolute inset-0 bg-blue/45" onClick={onClose} />

      <div className="by-menu-open absolute inset-y-0 left-0 flex w-[min(400px,88vw)] flex-col overflow-y-auto overscroll-contain bg-yellow">
        <div className="flex items-center justify-between border-b border-pink/15 px-5 py-4">
          <Link href="/" onClick={onClose} aria-label="LUXEN home">
            <Logo className="text-pink" textClassName="text-[26px]" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="by-icon grid h-10 w-10 place-items-center text-pink"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex flex-col py-2">
          {MAIN_NAV.map((item) =>
            item.children ? (
              <div key={item.label} className="border-b border-pink/10">
                <button
                  type="button"
                  onClick={() =>
                    setExpanded((e) => (e === item.label ? null : item.label))
                  }
                  aria-expanded={expanded === item.label}
                  className="by-nav-link flex w-full items-center justify-between px-5 py-4 text-left text-pink"
                >
                  {item.label}
                  <ChevronDown
                    size={18}
                    strokeWidth={2.4}
                    aria-hidden
                    className={cn(
                      "transition-transform duration-[var(--dur)] ease-[var(--ease)]",
                      expanded === item.label && "rotate-180",
                    )}
                  />
                </button>
                {expanded === item.label && (
                  <div className="pb-2">
                    {item.children.map((c) => (
                      <Link
                        key={c.href + c.label}
                        href={c.href}
                        onClick={onClose}
                        className="block py-2.5 pl-9 pr-5 text-[15px] uppercase tracking-[0.6px] text-pink/85"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="by-nav-link border-b border-pink/10 px-5 py-4 text-pink"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="mt-auto flex flex-col items-start gap-2 border-t border-pink/15 p-5">
          {UTILITY_NAV.map((l) => (
            <Link
              key={l.href + l.label}
              href={l.href}
              onClick={onClose}
              className="by-footer-link text-pink"
            >
              {l.label}
            </Link>
          ))}
          {/* Account entry points, since the header icon is desktop-only. */}
          <Link href="/signin" onClick={onClose} className="by-footer-link text-pink">
            Sign in
          </Link>
          <Link href="/signup" onClick={onClose} className="by-footer-link text-pink">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <AnnouncementBar />

      {/* Row 2 — pink bar */}
      <div className="relative bg-pink">
        <div className="by-page flex h-[64px] items-center justify-between gap-4 lg:h-[93px]">
          {/* Left: utility links on desktop, menu trigger on mobile */}
          <div className="flex min-w-0 flex-1 items-center gap-8">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              className="by-icon -ml-2 grid h-10 w-10 place-items-center text-yellow lg:hidden"
            >
              <Menu size={24} strokeWidth={2.2} />
            </button>

            {UTILITY_NAV.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                className="by-nav-link by-link hidden whitespace-nowrap text-yellow lg:inline-block"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Centre: wordmark */}
          <Link
            href="/"
            aria-label="LUXEN home"
            className="absolute left-1/2 -translate-x-1/2"
          >
            <Logo className="text-yellow" />
          </Link>

          {/* Right: icon cluster */}
          <div className="flex flex-1 items-center justify-end gap-3 sm:gap-5">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              aria-expanded={searchOpen}
              className="by-icon grid h-10 w-10 place-items-center text-yellow"
            >
              <Search size={20} strokeWidth={2} />
            </button>
            {/* The reference's mobile header carries only search + cart;
                account moves into the drawer. */}
            <AccountMenu variant="dark" className="hidden sm:block" />
            <CartButton className="by-icon text-yellow" />
          </div>
        </div>

        {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      </div>

      {/* Row 3 — yellow nav */}
      <nav aria-label="Main" className="hidden bg-yellow lg:block">
        <div className="by-page flex items-center justify-center">
          {MAIN_NAV.map((item) =>
            item.children ? (
              <NavDropdown key={item.label} item={item} />
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="by-nav-link by-link px-[30px] py-[11px] text-pink"
              >
                {item.label}
              </Link>
            ),
          )}
        </div>
      </nav>

      {menuOpen && <MobileDrawer onClose={() => setMenuOpen(false)} />}
    </header>
  );
}
