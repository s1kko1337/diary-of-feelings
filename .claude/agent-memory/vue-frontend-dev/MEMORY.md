# Agent Memory — Vue Frontend Dev

## Project Structure Confirmed
- `src/api/client.js` exports `ApiError` and `request(handler, options)` with delay/timeout
- Mock pattern: `src/api/mock/*.js` (CRUD with localStorage), `src/api/mock/data/*.js` (seed data)
- API wrapper pattern: `src/api/*.js` calls `request(() => mock.fn())`
- Stores: composition syntax confirmed in `emotions.js`, `user.js`, `cbt.js`

## Design System — Modern Minimal v3.0 (March 2026)
- Evolved from flat/geometric to warm modern minimal (Linear/Craft-inspired)
- No `backdrop-filter` or `-webkit-backdrop-filter` anywhere
- `border-radius` vars: 6-18px (human, not sharp)
- Shadows: ambient multi-layer (`0 1px 3px...`), not offset
- Background: solid `var(--color-bg)`, no gradient
- Accent: indigo #6366f1, hover: #4f46e5
- Warm accent: amber #f59e0b for AI/tips cards
- Cards: background + shadow, NO border (border removed in refinement)
- Buttons: hover = background change + shadow, NOT opacity
- Active state: scale(0.97) on buttons
- Bottom nav active: top-border indicator (::before), not bg highlight

## Existing Global CSS Classes
- `.glass-card` / `.flat-card` — surface bg, radius-lg, shadow-card (no border)
- `.glass-card-elevated` / `.flat-card-elevated` — radius-xl, shadow-float (no border)
- `.metric-value` — mono font for numeric values
- `.divider` — 1px horizontal rule
- `.left-accent` — 2px left border accent + padding
- `.btn-primary` — indigo bg, white text, hover=accent-hover+shadow, active=scale(0.97)
- `.btn-ghost` — transparent bg, border, hover=accent-mist+accent-subtle border
- `.card-label::before` — 5px accent dot before labels
- `.section-divider` — gradient fade line (accent -> subtle -> transparent)

## CSS Variables (theme.css)
- Accent: `--color-accent`, `--color-accent-soft`, `--color-accent-text`
- `--color-accent-hover`: #4f46e5, `--color-accent-subtle`: #e0e7ff, `--color-accent-mist`: #f5f3ff
- `--color-warm`: #f59e0b, `--color-warm-soft`: #fffbeb
- Compat aliases: `--color-lavender`=#6366f1, `--color-peach`=#f97316, etc.
- Radii: sm=6, md=10, lg=14, xl=18, full=9999
- Shadows: ambient multi-layer
- Spacing: xs=4, sm=8, md=16, lg=24, xl=40, 2xl=64, section=48
- Fonts: `--font-main`, `--font-mono`

## Typography Standards
- Page titles: 2.25rem/800/-0.04em/1.15 line-height
- Hero title: 2.75rem/800/-0.04em/1.1 + gradient text (dark -> indigo)

## Lucide Icons
- `CircleHalfIcon` does NOT exist — use `ContrastIcon` instead
- `HeartCrackIcon` IS available
- `GavelIcon`, `FocusIcon`, `BrainIcon` all available

## CBT Module (implemented)
- Store: `useCbtStore` in `src/stores/cbt.js`
- localStorage key: `diary-cbt-entries`
- Routes: `/cbt` (list), `/cbt/new` (create), `/cbt/:id` (view/edit)
- Components: CbtEntryCard, CbtStatCard, CbtDistortionPicker, CbtEmotionPicker, CbtProgressBar
- Entry cards: left-accent border (3px), shadow-card, hover=translateY(-1px)+shadow-float

## CSS Relative Color Syntax
- No browserslist — avoid `rgb(from var(...) r g b / 0.12)`
- Use concrete rgba values instead

## Formatting Notes
- Prettier auto-formats: collapses single-line spans, adjusts multi-line attributes
- Build warning: echarts chunk > 500kb — expected, not actionable
