import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

export const frames = new Map();
let media;

export function setMotionPreference(matches) {
  media.matches = matches;
  media.dispatchEvent(new Event("change"));
}

export function flushFrame() {
  const callbacks = [...frames.values()];
  frames.clear();
  callbacks.forEach((callback) => callback(performance.now()));
}

beforeEach(() => {
  vi.useFakeTimers();
  frames.clear();
  media = new EventTarget();
  media.matches = false;
  media.media = "(prefers-reduced-motion: reduce)";
  vi.stubGlobal("matchMedia", vi.fn(() => media));
  let frameId = 0;
  vi.stubGlobal("requestAnimationFrame", vi.fn((callback) => {
    frames.set(++frameId, callback);
    return frameId;
  }));
  vi.stubGlobal("cancelAnimationFrame", vi.fn((id) => frames.delete(id)));
  vi.stubGlobal("PointerEvent", class extends MouseEvent {
    constructor(type, options = {}) {
      super(type, options);
      this.pointerType = options.pointerType ?? "mouse";
    }
  });
  Element.prototype.scrollIntoView = vi.fn();
  document.head.innerHTML = '<meta name="description" content="">';
});

afterEach(() => {
  cleanup();
  frames.clear();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
