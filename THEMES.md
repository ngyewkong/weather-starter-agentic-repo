# Themes

The weather dashboard supports selectable visual themes through `frontend/src/state/theme.tsx` and CSS custom properties in `frontend/src/index.css`. Themes are applied with `data-theme` on the document root and persisted in `localStorage` under `weather-app:theme`.

## Theme List

| ID | Name | Design direction | Best suited for |
| --- | --- | --- | --- |
| `apple` | Apple | Cool, translucent, glass-like weather dashboard with a blue-gray atmosphere | Calm, minimal weather monitoring |
| `daybreak` | Daybreak Pastel | Warm sunrise gradient with soft pastel tones, opaque rounded cards, and friendly typography | Approachable, playful daytime use |
| `terminal` | Terminal Weather | Near-black, monospace dashboard with phosphor-green data, thin hairline borders, and sharp corners | Data-dense, power-user monitoring |
| `paper` | Paper Almanac | Cream, print-inspired layout with ink-black serif type, flat hairline cards, and a left-aligned hero header | Editorial, airy, print-like reading |
| `neon` | Neon Nightscape | Cyberpunk dark theme with a subtle grid-textured background, glassy translucent cards with cyan borders and a pink/violet glow, rounded-xl corners, and bold geometric type | Vivid, high-energy dashboard use |

## Apple

### Description

Apple is the default theme. It uses a cool blue-gray gradient background, translucent white surfaces, strong blur, thin light borders, and lightweight typography. The visual language is quiet and atmospheric, allowing weather readings and icons to remain the focus.

### Design Considerations

- Preserve the layered blue-gray background and its radial highlights; avoid replacing it with a flat color.
- Treat cards and the sidebar as translucent glass surfaces. Keep blur, subtle borders, and generous spacing coordinated.
- Use white text with opacity levels to establish hierarchy rather than introducing many unrelated colors.
- Reserve the yellow accent for weather emphasis and important visual cues.
- The primary button is a light surface with dark text, so maintain strong contrast when changing button content or states.
- Selected locations need a visibly stronger surface and border than unselected cards.
- Keep the lightweight display and heading weights for large temperature values and headings.

## Daybreak Pastel

### Description

Daybreak Pastel uses a warm peach-to-lilac gradient inspired by sunrise. It pairs dark brown text with near-opaque white cards, coral actions, large rounded corners, and `Nunito` for a softer, friendlier tone.

### Design Considerations

- Preserve the warm peach and lilac relationship in the page background; do not let new components introduce competing saturated colors.
- Use opaque white cards for readability over the pastel background. Do not assume the Apple theme's translucency or blur values apply here.
- Use dark brown text tokens for hierarchy and keep secondary text sufficiently legible against white surfaces.
- Keep coral as the primary action and selected-state accent; hover states should remain distinct but not visually aggressive.
- Retain the larger `1.5rem` card radius and softer shadow language for cards and controls.
- Keep `Nunito` and the heavier display/heading weights to preserve the approachable personality.

## Terminal Weather

### Description

Terminal Weather uses a flat near-black background with a phosphor-green text ramp reserved for data (temperature, conditions, values) and dim greys reserved for chrome (uppercase section labels, dividers, placeholders). Cards are thin, hairline-bordered, unblurred, and sharp-cornered (`0px` radius), set in `JetBrains Mono` for a data-dense, monospace dashboard feel.

### Design Considerations

- Keep the background flat and near-black; do not reintroduce gradients, glows, or soft radial highlights, which would undercut the dashboard feel.
- Reserve green text tokens (`--text-1` through `--text-4`) for actual weather data and reserve grey tokens (`--text-5`, `--text-6`) for labels, captions, and placeholders — don't invert this pairing.
- Borders should stay thin and green-tinted (not white/translucent) with no blur and no box-shadow; cards should read as flat panels, not glass or paper.
- Keep `--radius-card` at `0px` so cards, inputs, and the add-location form stay sharp-cornered. A few circular chrome controls (delete button, refresh pill, theme selector button, dropdown rows) intentionally stay round in every theme — don't try to force those to sharp corners.
- Keep `JetBrains Mono` and the bolder display/heading weights; avoid mixing in a proportional typeface for data values.
- The primary button is an inverted highlight (green background, near-black text) — preserve that contrast rather than reusing another theme's button styling.

## Paper Almanac

### Description

Paper Almanac uses a flat cream background with ink-black text, evoking an old printed weather almanac. Cards are flat and hairline-bordered rather than boxed or blurred, with `0px` radius, generous whitespace, and a muted brick-red accent. Unlike every other theme, it uses two distinct serif typefaces: `Fraunces` for the display elements (hero temperature and area name) and `Source Serif 4` for body text. The hero header is left-aligned instead of centered.

### Design Considerations

- Keep the background a flat cream color; do not add gradients, blur, or shadows — the theme's identity depends on reading as flat print, not glass or paper texture.
- Cards intentionally have a transparent/near-transparent `--card-bg` with only a thin ink-toned hairline border — resist the urge to give them a filled surface like other themes.
- Preserve the two-typeface split: `--font-display` (`Fraunces`) is used only on the hero `h1` and giant temperature via `[font-family:var(--font-display)]`; `--font-sans` (`Source Serif 4`) drives everything else. Every other theme sets `--font-display: var(--font-sans)` so this split is Paper-only — keep that aliasing intact when adding future themes.
- Keep the `.hero-header` left-alignment override (`[data-theme='paper'] .hero-header`) scoped to this theme only; the footer and the "select a location" empty state intentionally remain centered in every theme, including this one.
- Use the muted brick-red accent (`--accent`, `--card-border-selected`) sparingly, the same way Terminal uses green and Daybreak uses coral — as a single accent, not a broad palette.
- Keep `--radius-card` at `0px` for sharp corners, consistent with Terminal Weather; the same small set of circular chrome controls (delete button, refresh pill, theme selector) stay round by design.

## Neon Nightscape

### Description

Neon Nightscape is a cyberpunk-inspired dark theme: a near-black background with a subtle repeating grid texture and low-opacity pink/cyan ambient glows, `Space Grotesk` in bold weights, and glassy translucent cards (`rounded-xl`, moderate blur) with cyan hairline borders and a layered cyan/pink/violet glow shadow. Selection and primary actions use a hot-pink accent.

### Design Considerations

- Keep the grid-texture + ambient-glow background layered in `--app-bg` (repeating-linear-gradient grid lines plus two radial glows over a near-black base); don't flatten it to a solid color — the texture is core to the "cyberpunk dashboard" identity.
- Unlike Terminal Weather and Paper Almanac, this theme keeps blur (`--card-blur: 16px`) and a real `--card-shadow` glow — cards should read as glassy neon panels, not flat print/terminal panels.
- The three neon hues are intentionally assigned to specific roles, not interchangeable: cyan for the default card border, violet for subtle internal dividers, hot pink for selection/accent/primary actions. Keep that mapping when tuning colors.
- **Scoped exception:** the brainstormed "accent-color-coded tiles per metric" (a different neon hue per individual weather tile) is intentionally not implemented — it would require per-tile theme-specific styling in `Tiles.tsx`, breaking the theme-agnostic component pattern every other theme relies on. The single coherent glow treatment (uniform cyan border + multicolor glow shadow) stands in for it.
- Keep `Space Grotesk` and the bold (`700`) display/heading weights; this theme has no separate `--font-display` (aliases `--font-sans`), unlike Paper Almanac.
- `--button-primary-bg`/`--button-primary-bg-hover` must stay solid colors, not gradients — they're consumed via `bg-[color:var(--button-primary-bg)]`-style Tailwind arbitrary values, which require a plain color.

## Shared Rules

- Components should consume semantic variables such as `--text-1`, `--card-bg`, `--card-border`, `--font-display`, `--accent`, and button variables instead of hardcoding theme-specific colors.
- Every new surface needs a readable text, border, hover, selected, disabled, and focus-visible state in every theme, not just the theme it was designed for.
- `--font-display` defaults to `var(--font-sans)` in every theme except Paper Almanac; if a new theme wants a distinct display typeface, set `--font-display` explicitly, otherwise it must alias `--font-sans` so the display elements don't silently pick up a stray font.
- Weather meaning should not depend on color alone. Pair condition-based accents with icons, labels, or other visual cues.
- Temperature and measurement values should remain prominent and use tabular numerals where comparison benefits from aligned digits.
- Responsive behavior is part of the design: preserve clear hierarchy and usable controls on narrow screens.
- Check map labels and third-party UI separately because some map styles currently use fixed colors and may not automatically follow the selected theme.
- When adding a theme, update the `THEMES` list, define the complete semantic token set (including `--font-display`) in `index.css`, and verify the selector, persisted default/fallback behavior, forms, cards, map, and focus states across every existing theme, not just the new one.
- **Gotcha:** never apply `--card-shadow` with Tailwind's `shadow-[var(--card-shadow)]` syntax — Tailwind's arbitrary-value inference treats a single `var(...)` token inside `shadow-[...]` as a shadow *color*, not a full `box-shadow` value, so it silently sets `--tw-shadow-color` without ever touching `box-shadow` (this shipped broken for a while and Daybreak Pastel's shadow never actually rendered). Always use the unambiguous arbitrary-property form instead: `[box-shadow:var(--card-shadow)]`.

## Implementation References

- Theme definitions and persistence: `frontend/src/state/theme.tsx`
- Theme tokens and global styles: `frontend/src/index.css`
- Theme selector UI: `frontend/src/components/ThemeSelector.tsx`
- Theme provider mounting: `frontend/src/App.tsx`
