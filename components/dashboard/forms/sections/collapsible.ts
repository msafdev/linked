export const COLLAPSE_TRANSITION = {
  opacity: { duration: 0.23, ease: "easeInOut" },
  height: { duration: 0.48, ease: [0.25, 0.8, 0.25, 1], delay: 0.06 },
  marginTop: { duration: 0.23, ease: "easeInOut" },
} as const;

export const COLLAPSE_VARIANTS = {
  expanded: { opacity: 1, height: "auto", marginTop: 24 },
  collapsed: { opacity: 0, height: 0, marginTop: 0 },
} as const;
