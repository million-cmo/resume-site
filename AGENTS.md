# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Product decision

- Dynamic behavior is a hard requirement for this resume site: keep the scroll reveal, animated data/particle treatment, terminal cursor/status motion, skill bar entrance, hover feedback, demo playback state, and global language toggle working as the prototype evolves.

## Technical baseline

- This is a static React 19 single-page resume site built with Vite 6 and JavaScript / ES Modules.
- Styling uses native CSS. Keep the existing design tokens, responsive breakpoints, interaction states, and `prefers-reduced-motion` handling coherent when editing the UI.
- Static assets live in `public/`. The current brand assets include `public/favicon.svg` and the 180×180 `public/apple-touch-icon.png`.
- There is no application backend. `worker/index.js` provides Sites static-asset handling and route fallback.
- The project is connected to GitHub on the `main` branch and deployed through Vercel. Do not add secrets, tokens, or private configuration to source control.

## Project direction

- The site serves both hiring reviewers and potential collaborators. Keep the data-engineering × AI-exploration positioning clear, technically credible, and easy to scan in both Chinese and English.
- Preserve the visual language of cream, deep ink-green, violet, lavender, and orange accents, with terminal, grid, data-stream, and particle metaphors used purposefully.
- Preserve the mouse-follow terminal tilt, skill and project hover feedback, demo playback, global language switch, and the page-level Z Logo rotation. The browser favicon remains static because Chromium does not animate SVG favicons.
- Keep placeholder projects, demo media, external links, and contact details easy to replace. Avoid inventing real personal information.
- For implementation changes, run `npm run build`; when Sites packaging is relevant, also run `npm run test:sites`.
- See `agent.md` for the longer project overview, stack summary, commands, and maintenance notes.

## Regression checks

- Run `npm test`, `npm run build`, and `npm run test:sites` for UI changes. Frontend tests cover language switching, resume availability, skill disclosures, motion preferences, and logo assets; the Sites tests cover packaging and route fallback only.
- Preserve the original outlined “下载简历 / DOWNLOAD RESUME” button, arrow, and hover feedback as requested. Until a real PDF is supplied, activation must show a localized preparation notice, never navigate to projects or simulate a successful download.
- Localize skill names and tags as well as page copy; update `document.documentElement.lang`, title, and description when the language changes.
- Both CSS and JavaScript motion must respect live changes to `prefers-reduced-motion`. Cancel pending tilt frames and reset the transform immediately when it is enabled.
- Keep skill details usable by hover, keyboard, and touch. Check widths 320, 390, 820, 1100, and 1280 when changing the skill grid or navigation.
- Skill hover previews must not change card/row heights or move neighboring content. Use a non-intercepting overlay for mouse hover; reserve in-flow expansion for explicit click/keyboard activation. Verify geometry while moving across multiple rows, not just whether the detail text appears.
- Skill-row hover underlines must disappear on pointer leave. Do not couple them to the persistent skill-dial selection; retain a separate `:focus-visible` outline for keyboard users.
- Regenerate the Safari icon from the source SVG with `npm run icons:generate`; verify centered content and an opaque 180×180 canvas, not just file dimensions.
- Dependency fixes should preserve framework major versions where possible and be followed by `npm audit` and regression tests. Do not use forced dependency upgrades.
