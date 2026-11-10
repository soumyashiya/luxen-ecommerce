import { cn } from "@/lib/utils";

/* Small uppercase label. The reference sets these in blue at 15px/500
   with 1px tracking, with no icon or rule alongside. */
export default function Eyebrow({
  children,
  className,
  light = false,
  center = false,
}: {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
  center?: boolean;
}) {
  return (
    <span
      className={cn(
        "eyebrow",
        light ? "text-yellow" : "text-blue",
        center && "justify-center",
        className,
      )}
    >
      {children}
    </span>
  );
}
