# UI/UX Design Architect — Persistent Memory

## Проект: Diary of Feelings

### Ключевые файлы дизайн-системы
- CSS-переменные: `/home/mike/projects/diary-of-feelings/src/assets/theme.css`
- Глобальные стили: `/home/mike/projects/diary-of-feelings/src/assets/main.css`
- Глобальные классы: `.glass-card` (blur 20px), `.glass-card-elevated` (blur 24px), `.blob`, `.metric-value`

### Существующие паттерны (подтверждены кодом)

**Карточка:** `background: var(--color-surface)` + `backdrop-filter: blur(20px)` + `border: 1px solid var(--color-border)` + `border-radius: var(--radius-xl)` + `box-shadow: var(--shadow-card)` + `padding: 1.5rem`

**Emotion pill:** `border-radius: var(--radius-full)`, CSS custom prop `--pill-bg` + `--pill-accent`, hover: `translateY(-2px)` + box-shadow

**Section label (card-label):** `font-size: 0.8rem`, `font-weight: 600`, `text-transform: uppercase`, `letter-spacing: 0.06em`, `color: var(--color-text-muted)`, `margin-bottom: 1rem`

**Card-action link:** `gap: 6px` → hover `gap: 10px`, `transition: gap 0.2s ease`

**Input focus:** `border-color: var(--color-primary)` + `box-shadow: 0 0 0 3px var(--color-primary-soft)`

**Toggle:** width 36px, height 20px, knob 16px, `translateX(16px)` when on

**Submit button:** `background: var(--color-primary)`, white text, hover `translateY(-1px)`, disabled `opacity: 0.4`

**Pattern stat:** JetBrains Mono, `font-size: 1rem`, `font-weight: 700`, subtext `font-size: 0.7rem` muted

### Компоненты, реализованные в проекте
- `AppNavbar.vue` — floating pill, `position: fixed`, `top: 16px`, `blur(24px)`, `border-radius: full`
- `AppHeader.vue` — мобайл хедер
- `AppBottomNav.vue` — мобайл bottom nav, высота `--bottom-nav-height: 72px`
- `EmotionWheel.vue`, `EmotionEntryForm.vue`, `EmotionHistory.vue`, `EmotionChart.vue`
- `HomeView.vue`, `EmotionsView.vue` — реализованы полностью

### Дизайн-решения для КПТ/СМЭР (зафиксированы в спецификации)

**Цветовая схема разделов:**
- С (Ситуация) → мята (`--color-mint`, `#a8dfc8`) — нейтральный факт
- М (Мысли) → лаванда (`--color-lavender`, `#c4b5e0`) — когнитивное
- Э (Эмоции) → персик (`--color-peach`, `#f8c9a0`) — чувственное
- Р (Реакция) → розовый (`--color-rose`, `#f0b8c0`) — поведение

**UX-паттерн формы СМЭР:** Scroll-секции (НЕ wizard), секции блокируются пока предыдущая не заполнена

**Прогресс-бар:** 4 точки С/М/Э/Р с линиями между, каждая точка получает `--step-color`

**Продвинутый режим:** Разворачивается через `max-height` transition (осторожно с `height: auto`)

**Sticky кнопка сохранения на мобайле:** `bottom: calc(72px + 12px)` чтобы не перекрывала bottom nav

### Спецификации (ссылки на файлы)
- КПТ-дневник СМЭР: `docs/design/cbt-diary-spec.md` (v1.0, 2026-03-05)

### Технические предупреждения
- CSS `rgb(from var(...) r g b / opacity)` (relative color syntax) — проверять поддержку браузеров
- `CircleHalfIcon`, `HeartCrackIcon` — проверять наличие в установленной версии lucide-vue-next
- `backdrop-filter` НИКОГДА в keyframes — только в transition
- Всегда добавлять `-webkit-backdrop-filter` рядом с `backdrop-filter`
- Декоративные элементы — всегда `pointer-events: none`
- Не более 5 стекло-слоёв на экране (GPU)

### Структура проекта (компоненты)
```
src/components/
  emotions/   — EmotionWheel, EmotionEntryForm, EmotionHistory, EmotionChart
  layout/     — AppBottomNav, AppHeader, AppNavbar
  cbt/        — НЕ СОЗДАНО (нужно создать по спецификации)
src/stores/   — emotions.js, user.js
src/composables/ — useEmotionWheel.js, useTheme.js
```
