import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

export const prefersReducedMotion = () => typeof window !== "undefined" && Boolean(window.matchMedia?.(query).matches);

function subscribe(onChange) {
  const media = window.matchMedia?.(query);
  media?.addEventListener("change", onChange);
  return () => media?.removeEventListener("change", onChange);
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => false);
}
