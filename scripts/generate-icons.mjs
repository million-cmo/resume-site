import sharp from "sharp";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(new URL("../public/favicon.svg", import.meta.url));
const target = fileURLToPath(new URL("../public/apple-touch-icon.png", import.meta.url));

// Rasterize the actual SVG, including its gradient and miter joins. Leave
// symmetric padding and an opaque cream background for home-screen use.
await sharp(source, { density: 288 })
  .resize(144, 144)
  .flatten({ background: "#F7F4EC" })
  .extend({ top: 18, bottom: 18, left: 18, right: 18, background: "#F7F4EC" })
  .png()
  .toFile(target);

console.log("Generated 180×180 apple-touch-icon.png from favicon.svg");
