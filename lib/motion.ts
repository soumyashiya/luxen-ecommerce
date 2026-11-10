import type { Variants, Transition } from "framer-motion";

/* Easing and durations lifted from the reference theme:
   --ease-out-slow: cubic-bezier(0, 0, .3, 1)
   --duration-default: .2s · --duration-medium: .3s
   --duration-long: .5s   · --duration-extra-long: .6s           */
export const EASE = [0, 0, 0.3, 1] as const;

export const DUR = {
  short: 0.1,
  default: 0.2,
  medium: 0.3,
  long: 0.5,
  xl: 0.6,
} as const;

export const spring: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 26,
  mass: 0.5,
};

/* `slideIn` — the reference's single scroll-reveal: a 2rem rise + fade
   over .6s. Every section uses this one motion; there is no blur, no
   scale, no directional variation anywhere on the site. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.xl, ease: EASE },
  },
};

/* `fadeIn` — opacity only, for media that shouldn't shift position. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DUR.xl, ease: EASE } },
};

/* Kept for API compatibility with existing call sites — all three now
   resolve to the same reveal, because the reference only has the one. */
export const blurUp = fadeUp;
export const revealLeft = fadeUp;
export const revealRight = fadeUp;
export const scaleIn = fadeIn;

/* Stagger parent */
export const stagger = (gap = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: gap, delayChildren: delay },
  },
});

/* Common viewport config for whileInView */
export const inView = { once: true, amount: 0.2 } as const;
