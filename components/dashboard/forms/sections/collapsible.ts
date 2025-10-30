export const COLLAPSE_TRANSITION = {
  opacity: { duration: 0.23, ease: "easeInOut" },
  height: { duration: 0.48, ease: [0.25, 0.8, 0.25, 1], delay: 0.06 },
  filter: { duration: 0.33, ease: "easeInOut", delay: 0 },
  marginTop: { duration: 0.23, ease: "easeInOut" },
} as const;

export const COLLAPSE_VARIANTS = {
  expanded: {
    opacity: 1,
    height: "auto",
    filter: "blur(0px)",
    marginTop: 24,
    overflow: "visible",
  },
  collapsed: {
    opacity: 0,
    height: 0,
    filter: "blur(2px)",
    marginTop: 0,
    overflow: "hidden",
  },
} as const;
