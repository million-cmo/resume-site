# Design QA

## Source and implementation

- Source visual truth: `/Users/million/.codex/generated_images/01a05bdf-61ea-7310-909a-923aafcc21d6/exec-11a7ea0a-f798-4690-b8e4-5600d702d58a.png` (selected visual direction, 864 x 1821 px, long-scroll desktop concept).
- Implementation: `http://localhost:4173/`.
- Desktop evidence: `/Users/million/Workspace/CodexWorkSpace/HaiOu/resume-site/qa-implementation-home.png`, `/Users/million/Workspace/CodexWorkSpace/HaiOu/resume-site/qa-implementation-skills.png`, `/Users/million/Workspace/CodexWorkSpace/HaiOu/resume-site/qa-implementation-demo.png` (1265 x 712 px browser screenshots; CSS viewport 1280 x 720; 1x density).
- Mobile evidence: `/Users/million/Workspace/CodexWorkSpace/HaiOu/resume-site/qa-implementation-mobile.png` (375 x 812 px screenshot; CSS viewport 390 x 844; 1x density).
- Normalization: source is a full long-scroll concept and implementation evidence is captured as same-state focused desktop regions, so no whole-page pixel scaling was applied. The Browser full-page stitch was treated as a capture artifact because fixed UI repeated during stitching; focused region captures were used for visual judgment.
- State: Chinese default; hero at top, skills section focused, demo section focused; assets loaded; demo play state tested both paused and playing.

## Comparison

### Full-view evidence

The implementation preserves the source's primary visual grammar: near-black technical canvas, fixed top utility bar, left section rail, oversized name/identity block, terminal window, neon lime/violet data stream, two skill panels, two coming-soon project cards, demo player, external links, and contact footer. The responsive implementation intentionally uses a slightly more breathable vertical rhythm than the dense concept image so the copy remains legible at a real 1280 px desktop viewport.

### Focused regions

- Hero: the terminal and particle stream are implemented as real raster assets with the same dark/lime/violet art direction; the code window, live state, cursor, CTA, and scroll cue are present.
- Skills: both required groups are present as animated skill bars, interactive focus rows, tags, and rotating capability dials; the source's terminal/data-matrix intent is retained.
- Projects: exactly two cards remain, both visibly marked `待补充 / COMING SOON`, with full title, description, tag, cover placeholder, and detail-link structure.
- Demo and links: the generated dashboard asset is used in a play-state demo block; GitHub and blog links expose placeholder destinations and loaded icon assets.

## Required fidelity surfaces

- Fonts and typography: display hierarchy uses a bold sans-serif fallback stack with compact monospace labels/code. Heading scale, line-height, and letter-spacing preserve the source's terminal/editorial feel. Google font loading has a system fallback for offline preview.
- Spacing and layout rhythm: desktop uses a fixed utility/header rail and a two-column hero, skills, projects, and links grid; mobile collapses content to one column and hides the desktop rail without clipping the fixed language toggle.
- Colors and visual tokens: palette is tokenized around `--bg`, `--ink`, `--muted`, `--lime`, `--violet`, and `--orange`; active/live states use lime and interaction focus uses violet.
- Image quality and asset fidelity: hero particle stream and demo dashboard are generated raster assets placed at their intended positions; no target imagery is replaced by a generic photo or broken local asset. GitHub and blog icon images loaded successfully in the preview.
- Copy and content: all requested data-engineering skills, AI toolchain skills, two portfolio placeholders, demo area, GitHub/blog entry points, bilingual toggle, and email/WeChat placeholders are present. English toggle also translates the demo bullets and focus strip.
- Icons and controls: utility controls are semantic buttons/links with accessible labels; external brand marks use image assets, and placeholder links remain visibly identifiable.
- States and interactions: scroll reveal, section navigation, fixed language toggle, terminal tilt on pointer movement, animated particle image, live readout rotation, skill focus details, hover lift, demo play/pause progress, smooth scroll CTAs, and WeChat copy action are implemented.
- Accessibility: semantic headings, button/link controls, alt text for generated images, keyboard-focusable controls, readable contrast, and `prefers-reduced-motion` fallback are present.

## Findings

No actionable P0, P1, or P2 findings remain after the final comparison. The minor differences in content density and section height are intentional responsive adaptations of the long-scroll concept rather than usability regressions.

## Open questions

- The user's real name, resume file, email, WeChat ID, GitHub URL, blog URL, and project screenshots/video can replace the current placeholders in a content pass.

## Comparison history

### Pass 1 — initial implementation

- Evidence: desktop hero, skills, and demo captures against the selected concept image.
- Result: no P0/P1/P2 fidelity issues. The main interactions rendered and the two generated raster assets loaded.

### Pass 2 — bilingual completeness polish

- Change: translated the demo bullet list and focus strip for the English state, then rebuilt and recaptured the desktop evidence.
- Post-fix evidence: `qa-implementation-home.png`, `qa-implementation-skills.png`, `qa-implementation-demo.png`; browser console remained clean.

## Implementation checklist

- [x] Default Chinese state with global Chinese/English toggle.
- [x] Dynamic hero, terminal, scroll rail, section reveal, skill bars, hover states, and demo progress.
- [x] Two complete portfolio placeholder cards with Coming Soon treatment.
- [x] Demo/video placeholder uses a generated dashboard asset and play/pause interaction.
- [x] GitHub/blog placeholders and email/WeChat footer contact entries.
- [x] Desktop and mobile layout checks completed.
- [x] `npm run build` passed.
- [x] `npm run test:sites` passed (4/4).
- [x] Browser console error/warning check passed (no entries).

## Follow-up polish

- Replace the placeholder identity and links with the user's real information.
- Add real project cover images and the actual demo recording when available.

final result: passed
