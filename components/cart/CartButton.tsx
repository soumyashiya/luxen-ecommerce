"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

export default function CartButton({ className }: { className?: string }) {
  const { count, openCart } = useCart();
  return (
    <button
      onClick={openCart}
      aria-label={`Open cart${count ? ` (${count} items)` : ""}`}
      className={cn("relative grid h-10 w-10 place-items-center", className)}
    >
      <ShoppingBag size={20} strokeWidth={2} />
      {count > 0 && (
        <span className="absolute right-0 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-yellow px-1 text-[10px] font-bold leading-none tracking-normal text-pink">
          {count}
        </span>
      )}
    </button>
  );
}
