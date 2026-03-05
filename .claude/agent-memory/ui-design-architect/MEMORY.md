# UI/UX Design Architect — Persistent Memory

## Проект: Diary of Feelings

### Дизайн-система: Warm Modern Minimal (v2.1, 2026-03-05)

**Эволюция:** glassmorphism v1.0 -> flat/brutalist v2.0 -> warm modern minimal v2.1
**Вдохновение:** Linear, Craft, Notion — с wellness-характером
**Спецификации:** `docs/design/flat-design-system.md`, `docs/design/design-refinement.md`

### Ключевые файлы

- CSS-переменные: `src/assets/theme.css`
- Глобальные стили: `src/assets/main.css`
- КПТ-спецификация: `docs/design/cbt-diary-spec.md`

### Палитра (v2.1)

**Accent:** #6366f1 indigo + расширенная шкала:
- accent-soft: #eef2ff, accent-subtle: #e0e7ff, accent-mist: #f5f3ff, accent-hover: #4f46e5

**Модульные цвета:**
- Эмоции: #8b5cf6 violet, КПТ: #6366f1 indigo, Задачи: #3b82f6 blue, Заметки: #06b6d4 cyan

**Warm accent:** #f59e0b amber (стрики, закладки, "Совет дня")

**СМЭР-секции:**
- С: indigo #6366f1, М: violet #8b5cf6, Э: amber #f59e0b, Р: red #ef4444

### Border Radius (v2.1 — CHANGED from v2.0)

- `--radius-sm: 6px` (было 0px)
- `--radius-md: 10px` (было 2px)
- `--radius-lg: 14px` (было 2px)
- `--radius-xl: 18px` (было 2px)
- `--radius-full: 9999px` (было 2px)

### Тени (v2.1 — CHANGED from v2.0)

Ambient shadows, not offset:
- `--shadow-card: 0 1px 3px rgb(0 0 0 / 0.04), 0 1px 2px rgb(0 0 0 / 0.02)`
- `--shadow-float: 0 4px 12px rgb(0 0 0 / 0.06), 0 1px 3px rgb(0 0 0 / 0.04)`
- `--shadow-elevated: 0 8px 24px rgb(0 0 0 / 0.08), 0 2px 6px rgb(0 0 0 / 0.04)`

### Spacing Tokens (v2.1 — NEW)

`--space-xs: 4px, --space-sm: 8px, --space-md: 16px, --space-lg: 24px`
`--space-xl: 40px, --space-2xl: 64px, --space-section: 48px`

**Правило:** 48px между секциями, 24-32px внутри карточек.

### Типографика (v2.1)

- Page titles: 2.25rem/800/-0.04em (было 1.75rem/700/-0.03em)
- Hero title: 2.75rem/800/-0.04em
- Labels: 0.7rem/500/uppercase/0.08em + accent dot ::before
- Body: 0.9rem/line-height 1.7 (было 1.65)
- Metric values: 1.5rem/700 JetBrains Mono (было 1rem)

### Карточки (v2.1 — CHANGED)

**Правило:** Cards = background + shadow, NO border. Border only for controls.
- `.flat-card` = bg + shadow + radius, no border
- `.flat-card-elevated` = bg + stronger shadow + radius, no border
- `.glass-card` = alias for flat-card (backward compat)

### Hover/Interaction (v2.1 — CHANGED)

- Buttons: background change + subtle colored shadow. NEVER just opacity.
- Active: scale(0.97). Cards: translateY(-1px) + shadow-float.
- Filter pills active = filled accent bg + white text (not outline)
- Bottom nav active = top line indicator, no background fill

### Decorative Elements (v2.1)

- Accent dot before labels (6px circle ::before)
- Corner accent on special cards (gradient triangle, opacity 0.08)
- Section divider: gradient line (accent -> transparent)
- Dot grid SVG for empty states and hero (opacity 0.3)
- Logo mark: rounded square with inner dot (not plain square)

### Технические предупреждения

- `backdrop-filter` ЗАПРЕЩЁН — flat design, не нужен
- Декоративные элементы — `pointer-events: none`
- `currentColor` в SVG — цвет через CSS `color:`
- Dark theme shadows: use rgb(0 0 0 / 0.2) instead of 0.04
- contrast ratio #6366f1 on #0a0a0a = ~5.4:1 (WCAG AA)

### Компоненты проекта

```
src/components/
  emotions/   — EmotionWheel, EmotionEntryForm, EmotionHistory, EmotionChart
  layout/     — AppBottomNav, AppHeader, AppNavbar
  cbt/        — CbtEntryCard, CbtStatCard, CbtProgressBar
  icons/      — EmptyStateCbt.vue, EmptyStateEmotions.vue
src/stores/   — emotions.js, user.js, cbt.js
src/composables/ — useEmotionWheel.js, useTheme.js, useChartColors.js
```
