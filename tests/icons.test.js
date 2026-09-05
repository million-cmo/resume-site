import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { expect, it } from "vitest";

it("exports a centered, full-size Z on an opaque 180px cream canvas", async () => {
  const image = await sharp("public/apple-touch-icon.png").ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  expect([image.info.width, image.info.height]).toEqual([180, 180]);
  let left = 180, right = 0, top = 180, bottom = 0;
  for (let y = 0; y < 180; y++) {
    for (let x = 0; x < 180; x++) {
      const i = (y * 180 + x) * 4;
      expect(image.data[i + 3]).toBe(255);
      if (Math.abs(image.data[i] - 247) + Math.abs(image.data[i + 1] - 244) + Math.abs(image.data[i + 2] - 236) > 60) {
        left = Math.min(left, x); right = Math.max(right, x);
        top = Math.min(top, y); bottom = Math.max(bottom, y);
      }
    }
  }
  expect(right - left).toBeGreaterThan(120);
  expect(bottom - top).toBeGreaterThan(90);
  expect(Math.abs((left + right) / 2 - 89.5)).toBeLessThan(2);
  expect(Math.abs((top + bottom) / 2 - 89.5)).toBeLessThan(2);
});

it("keeps favicon static, references both assets, and includes the reduced-motion logo override", async () => {
  const html = await readFile("index.html", "utf8");
  const svg = await readFile("public/favicon.svg", "utf8");
  const css = await readFile("src/styles.css", "utf8");
  expect((html.match(/rel="icon"/g) ?? []).length).toBe(1);
  expect(html).toContain('href="/apple-touch-icon.png"');
  expect(svg).not.toMatch(/<animate|@keyframes/);
  expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*\.brand-mark img\.z-spin \{ animation: none;/);
});
