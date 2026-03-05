# Design Refinement: от холодного flat к теплому modern minimal

**Дата:** 2026-03-05
**Статус:** Рекомендации к реализации
**Контекст:** Текущий flat-редизайн получился слишком строгим и холодным (бухгалтерская программа). Нужно добавить характер, воздушность и теплоту, сохранив flat-стиль и indigo-акцент.

**Вдохновение:** Linear, Craft, Notion — но с wellness-характером.

---

## Диагноз: почему сейчас холодно

1. **Radius = 0-2px** на всем. Это дает ощущение чертежа, а не дневника. Linear использует 8-12px, Craft — 10-16px.
2. **Тени = offset 2px 2px 0** — жесткие пиксельные тени как в Brutalist-дизайне, а не в wellness-приложении.
3. **Нет глубины в spacing** — gap 1.25rem везде одинаковый, нет ритма "дышит / сжимается".
4. **Цвет используется скупо** — indigo только на кнопках и акцент-линиях. Нет цветовых "касаний".
5. **Типографика однообразная** — Inter 700 / 600 / 500 не дает достаточной иерархии без size-контраста.
6. **Hover = opacity** — самый мертвый hover из возможных. Нет тактильности.

---

## 1. Типографика

### Шрифтовая пара

Оставляем **Inter** как основной. Добавляем **Inter Display** (или используем `font-variation-settings` для optical sizing) для заголовков — это даст характер без подключения нового шрифта.

Альтернатива: если хочется больше тепла — **DM Sans** или **Outfit** для заголовков (оба Google Fonts, оба geometric humanist). Они мягче Inter, но не "игрушечные".

### Конкретные изменения

**Файл:** `src/assets/theme.css`

```css
/* Добавить к :root */
--font-display: 'Inter', system-ui, sans-serif;
/* Если подключить DM Sans: */
/* --font-display: 'DM Sans', 'Inter', system-ui, sans-serif; */
```

**Иерархия (было -> стало):**

| Элемент | Было | Стало | Почему |
|---------|------|-------|--------|
| Page title (h1) | 1.75rem/700/-0.03em | **2.25rem/800/-0.04em** | Крупнее = воздушнее. Weight 800 через variable font дает personality. |
| Hero title | 2rem/700/-0.03em | **2.75rem/800/-0.04em**, line-height 1.1 | Hero должен быть statement, а не подпись |
| Card label | 0.8rem/600/uppercase/0.06em | **0.7rem/500/uppercase/0.08em**, color: `--color-text-muted` | Чуть меньше и легче — labels не должны кричать |
| Card title (если есть) | 0.85rem/600 | **0.95rem/600/-0.01em** | Читаемость |
| Body text | 0.9rem/line-height 1.65 | **0.9rem/line-height 1.7**, color: `--color-text-secondary` | Чуть больше leading = воздух |
| Subtitle | 0.9rem/secondary | **0.88rem/400**, color: `--color-text-muted` | Легче, не конкурирует с title |
| Metric value | mono/1rem/700 | mono/**1.5rem/700** | Цифры должны быть акцентом |

**Файл:** Все views, заголовки страниц

```css
/* Было */
.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.03em;
}

/* Стало */
.page-title {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.15;
  color: var(--color-text);
}
```

### Почему это работает
Контраст размеров создает иерархию без цвета. Когда h1 = 2.25rem, а label = 0.7rem, глаз сам строит порядок. Сейчас разница слишком мала (1.75rem vs 0.8rem = 2.2x), нужно довести до 3x минимум.

---

## 2. Spacing и воздушность

### Принцип: "дыхание между секциями, плотность внутри"

Сейчас gap одинаковый (1.25rem) между секциями и внутри карточек. Нужно создать ритм.

### Конкретные изменения

**Файл:** `src/assets/theme.css`

```css
/* Добавить spacing tokens */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 40px;
--space-2xl: 64px;
--space-section: 48px;  /* между секциями на странице */
```

**Файл:** `src/views/HomeView.vue`

```css
/* Было */
.home {
  gap: 1.5rem;    /* 24px — между всеми секциями одинаково */
}
.hero {
  padding: 2rem 0 1rem;
}

/* Стало */
.home {
  gap: var(--space-section);  /* 48px — секции дышат */
}
.hero {
  padding: var(--space-2xl) 0 var(--space-lg);  /* 64px top, 24px bottom */
}
```

**Файл:** `src/views/CbtView.vue`

```css
/* Было */
.cbt-page {
  gap: 1.25rem;
}

/* Стало */
.cbt-page {
  gap: var(--space-xl);  /* 40px */
}
```

**Файл:** `src/views/EmotionsView.vue`

```css
/* Было */
.emotions-page {
  gap: 1.25rem;
}

/* Стало */
.emotions-page {
  gap: var(--space-xl);  /* 40px */
}
```

**Внутри карточек — наоборот, плотнее и просторнее одновременно:**

```css
/* Было */
.card {
  padding: 1.5rem;  /* 24px */
}

/* Стало */
.card {
  padding: var(--space-lg) var(--space-lg);  /* 24px, но на мобайле: */
}

@media (min-width: 768px) {
  .card {
    padding: 28px 32px;  /* На десктопе чуть просторнее */
  }
}
```

### Почему это работает
Linear и Craft используют "breathing layout" — между блоками много воздуха (40-64px), внутри блоков — компактно (16-24px). Это создает ощущение простора без потери структуры. Сейчас все зажато с одинаковым ритмом.

---

## 3. Цветовые акценты

### Проблема
Indigo #6366f1 используется только в двух ролях: кнопка и left-border. Это скучно.

### Стратегия: один акцент, пять способов применения

**Файл:** `src/assets/theme.css`

```css
/* Расширить палитру indigo */
--color-accent: #6366f1;
--color-accent-soft: #eef2ff;        /* Есть — для bg */
--color-accent-hover: #4f46e5;       /* Есть — для hover */
--color-accent-subtle: #e0e7ff;      /* НОВЫЙ — для borders, dividers */
--color-accent-mist: #f5f3ff;        /* НОВЫЙ — еле заметный тинт */

/* Модульные акценты — чтобы разделы имели свой оттенок, но все оставалось в семье */
--color-module-emotions: #8b5cf6;    /* Violet — для раздела эмоций */
--color-module-cbt: #6366f1;         /* Indigo — для КПТ */
--color-module-tasks: #3b82f6;       /* Blue — для задач */
--color-module-notes: #06b6d4;       /* Cyan — для заметок */

/* Теплый акцент для позитивных состояний */
--color-warm: #f59e0b;               /* Amber */
--color-warm-soft: #fffbeb;
```

### Пять способов использовать indigo:

**1. Tinted backgrounds для секций (вместо серого #f7f7f7)**

```css
/* В HomeView hero — вместо белого фона, еле заметный tint */
.hero {
  background: var(--color-accent-mist);  /* #f5f3ff — почти белый, но теплее */
  margin: 0 calc(-1 * var(--space-lg));  /* Bleed за пределы контейнера */
  padding: var(--space-2xl) var(--space-lg) var(--space-lg);
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
}
```

**2. Gradient text для ключевых элементов (экономно, 1-2 на страницу)**

```css
/* Только для hero title или ключевого CTA */
.hero-title {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**3. Accent dot/mark для labels (вместо полного цвета)**

```css
.card-label::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
  margin-right: 8px;
  vertical-align: middle;
}
```

**4. Subtle ring вместо жесткого border**

```css
/* Для emotion pills */
.emotion-pill:hover {
  box-shadow: 0 0 0 2px var(--color-accent-subtle);
  border-color: transparent;
}
```

**5. Цветовой бэджик модуля**

```css
/* Каждый раздел имеет свой subtle цвет в заголовке */
.cbt-title::after {
  content: 'КПТ';
  display: inline-block;
  margin-left: 12px;
  padding: 2px 10px;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--color-module-cbt);
  background: var(--color-accent-soft);
  border-radius: 100px;
  vertical-align: middle;
}
```

### Как добавить тепло

Добавить **один** теплый цвет в палитру — amber #f59e0b. Использовать ТОЛЬКО для:
- Стрик/достижения
- "Совет дня" карточка (вместо accent border-top)
- Звездочки/закладки

```css
/* Совет дня — теплая карточка */
.card--warm {
  background: var(--color-warm-soft);  /* #fffbeb */
  border-color: rgb(245 158 11 / 0.15);
}
```

---

## 4. Карточки и контейнеры

### Главная проблема: radius 0-2px + border = тюрьма

**Файл:** `src/assets/theme.css`

```css
/* Было */
--radius-sm: 0px;
--radius-md: 2px;
--radius-lg: 2px;
--radius-xl: 2px;
--radius-full: 2px;

/* Стало — Linear-style, не glassmorphism */
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 14px;
--radius-xl: 18px;
--radius-full: 9999px;
```

**Почему:** Linear использует radius 8-12px. Craft — 12-16px. Notion — 6-8px. Все они flat, но НЕ sharp. Sharp corners (0-2px) — это про Brutalism/Swiss design, а не про wellness.

### Тени: от offset к ambient

```css
/* Было */
--shadow-card: 2px 2px 0 var(--color-border);
--shadow-float: 3px 3px 0 var(--color-border);

/* Стало — мягкие, почти невидимые */
--shadow-card: 0 1px 3px rgb(0 0 0 / 0.04), 0 1px 2px rgb(0 0 0 / 0.02);
--shadow-float: 0 4px 12px rgb(0 0 0 / 0.06), 0 1px 3px rgb(0 0 0 / 0.04);
--shadow-elevated: 0 8px 24px rgb(0 0 0 / 0.08), 0 2px 6px rgb(0 0 0 / 0.04);
```

### Три стратегии разделения контента (вместо "всегда border + bg")

**Стратегия A: Только spacing (для связанного контента)**

```css
/* Статьи на главной — убрать border-left, разделять spacing */
.articles-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.article-item {
  padding: var(--space-md) 0;
  border-left: none;
  border-bottom: 1px solid var(--color-border);
}

.article-item:last-child {
  border-bottom: none;
}
```

**Стратегия B: Background (для самостоятельных секций)**

```css
/* Карточка без border, только background + shadow */
.card {
  padding: var(--space-lg);
  background: var(--color-surface);
  border: none;  /* Убрать border! */
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}
```

**Стратегия C: Тонкий border (для интерактивных элементов)**

```css
/* Только для кнопок, inputs, pills — где нужна кликабельность */
.filter-pill {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
}
```

### Правило: карточки = background + shadow, controls = border. Не наоборот.

**Файл:** `src/assets/main.css`

```css
/* Было */
.glass-card,
.flat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

/* Стало */
.flat-card {
  background: var(--color-surface);
  border: none;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.flat-card-elevated {
  background: var(--color-surface);
  border: none;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-float);
}
```

---

## 5. Геометрические декоративные элементы

### Принцип: accent shapes, не паттерны

Не нужны сложные SVG-паттерны. Нужны 2-3 простых геометрических акцента, которые создают "подпись" приложения.

### Элемент 1: Accent dot grid (для пустых состояний и hero)

```html
<!-- Компонент DotGrid.vue -->
<template>
  <svg
    class="dot-grid"
    :width="cols * spacing"
    :height="rows * spacing"
    :viewBox="`0 0 ${cols * spacing} ${rows * spacing}`"
    fill="none"
    aria-hidden="true"
  >
    <circle
      v-for="(_, i) in cols * rows"
      :key="i"
      :cx="(i % cols) * spacing + spacing / 2"
      :cy="Math.floor(i / cols) * spacing + spacing / 2"
      :r="dotSize"
      :fill="accentDots.includes(i) ? accentColor : baseColor"
    />
  </svg>
</template>
```

Использование: в hero-секции как фоновый элемент (position absolute, opacity 0.4), в empty state рядом с иллюстрацией.

```css
.dot-grid {
  pointer-events: none;
  opacity: 0.3;
}
```

### Элемент 2: Corner accent (для карточек)

Вместо border-top: 2px solid accent — маленький геометрический элемент в углу:

```css
.card--accented::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--color-accent) 50%, transparent 50%);
  border-radius: var(--radius-lg) 0 0 0;
  opacity: 0.08;
  pointer-events: none;
}
```

### Элемент 3: Line accent (для разделов)

Горизонтальная линия с gradient fade — вместо border-bottom:

```css
.section-divider {
  height: 1px;
  background: linear-gradient(
    90deg,
    var(--color-accent) 0%,
    var(--color-accent-subtle) 30%,
    transparent 100%
  );
  border: none;
  margin: var(--space-xl) 0;
}
```

### Элемент 4: Logo mark

Сейчас логотип — квадрат 18x18 с accent fill. Это слишком примитивно. Варианты:

```css
/* Вариант A: Два overlapping circles */
.logo-mark {
  position: relative;
  width: 22px;
  height: 22px;
}
.logo-mark::before,
.logo-mark::after {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid var(--color-accent);
}
.logo-mark::before {
  top: 0;
  left: 0;
}
.logo-mark::after {
  bottom: 0;
  right: 0;
  background: var(--color-accent);
}

/* Вариант B: Rounded square с inner dot */
.logo-mark {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid var(--color-accent);
  position: relative;
}
.logo-mark::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

### Где размещать декор (и где НЕ размещать)

| Место | Декор | Применение |
|-------|-------|-----------|
| Hero секция | Dot grid (фон) | opacity 0.3, position absolute, right top corner |
| Empty states | Corner accent + текст | Вместо скучных иконок |
| Между секциями | Line accent | 1 раз на страницу, не больше |
| Карточка "Совет дня" | Corner accent | Визуальное отличие от обычных карточек |
| **НЕ** на каждой карточке | — | Перегруз |
| **НЕ** на формах/inputs | — | Отвлекает от контента |

---

## 6. Микровзаимодействия

### Проблема: hover = opacity 0.85 — это "мертвая" кнопка

### Кнопки (primary)

```css
/* Было */
.btn-primary:hover {
  opacity: 0.85;
}

/* Стало */
.btn-primary {
  transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
}

.btn-primary:hover {
  background: var(--color-accent-hover);  /* #4f46e5 — чуть темнее */
  box-shadow: 0 2px 8px rgb(99 102 241 / 0.25);
}

.btn-primary:active {
  transform: scale(0.97);
  box-shadow: none;
}
```

### Кнопки (ghost)

```css
/* Стало */
.btn-ghost {
  transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
}

.btn-ghost:hover {
  border-color: var(--color-accent-subtle);
  background: var(--color-accent-mist);
  color: var(--color-accent);
}

.btn-ghost:active {
  background: var(--color-accent-soft);
}
```

### Карточки

```css
/* Было — ничего не происходит */

/* Стало */
.flat-card {
  transition: box-shadow 0.2s ease, transform 0.15s ease;
}

.flat-card:hover {
  box-shadow: var(--shadow-float);
}

/* Только для кликабельных карточек */
.flat-card[role="button"]:hover,
.flat-card--interactive:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-float);
}

.flat-card--interactive:active {
  transform: translateY(0);
  box-shadow: var(--shadow-card);
}
```

### Emotion pills

```css
/* Было */
.emotion-pill:hover {
  border-color: var(--pill-accent, var(--color-accent));
  background: var(--color-surface-hover);
}

/* Стало */
.emotion-pill {
  transition: border-color 0.15s ease, background 0.15s ease,
              box-shadow 0.15s ease, transform 0.1s ease;
}

.emotion-pill:hover {
  border-color: var(--pill-accent, var(--color-accent));
  background: var(--pill-bg);
  box-shadow: 0 0 0 3px rgb(99 102 241 / 0.08);
  transform: translateY(-1px);
}

.emotion-pill:active {
  transform: translateY(0) scale(0.98);
}
```

### Filter pills

```css
.filter-pill {
  transition: all 0.15s ease;
}

.filter-pill:hover {
  border-color: var(--color-accent-subtle);
  background: var(--color-accent-mist);
  color: var(--color-accent);
}

.filter-pill--active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: white;
  box-shadow: 0 1px 4px rgb(99 102 241 / 0.3);
}
```

### Links/actions

```css
/* Было — gap анимация, хорошо, оставляем */
.card-action {
  transition: gap 0.2s ease, color 0.15s ease;
}

/* Добавить: underline появляется при hover */
.card-action:hover {
  gap: 10px;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: rgb(99 102 241 / 0.3);
}
```

### Навигация (bottom nav)

```css
/* Было */
.bottom-nav-item--active {
  color: var(--color-accent);
  background: var(--color-accent-soft);
}

/* Стало — active indicator вместо background */
.bottom-nav-item {
  position: relative;
  transition: color 0.2s ease;
}

.bottom-nav-item--active {
  color: var(--color-accent);
  background: transparent;  /* Убрать фон */
}

.bottom-nav-item--active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: var(--color-accent);
  border-radius: 0 0 2px 2px;
}
```

---

## 7. Сводная таблица изменений по файлам

| Файл | Что менять |
|------|-----------|
| `src/assets/theme.css` | Radius (0-2 -> 6-18), shadows (offset -> ambient), spacing tokens, новые цветовые переменные |
| `src/assets/main.css` | `.flat-card` убрать border добавить shadow, `.btn-primary`/`.btn-ghost` hover, `.left-accent` |
| `src/views/HomeView.vue` | Hero spacing (64px top), gap (48px), card radius, hero tint bg, типографика |
| `src/views/CbtView.vue` | Gap (40px), filter-pill стиль (active = filled), card hover |
| `src/views/EmotionsView.vue` | Gap (40px), section spacing |
| `src/components/layout/AppHeader.vue` | Logo mark redesign |
| `src/components/layout/AppBottomNav.vue` | Active indicator (line instead of bg) |
| Все views с page-title | font-size 2.25rem, weight 800 |

---

## 8. Порядок реализации

1. **theme.css** — radius, shadows, spacing tokens, новые цвета (все остальное зависит от этого)
2. **main.css** — flat-card, btn-primary, btn-ghost (глобальные классы)
3. **AppHeader.vue + AppBottomNav.vue** — навигация
4. **HomeView.vue** — главная страница (самая видимая)
5. **CbtView.vue + EmotionsView.vue** — внутренние страницы
6. **Декоративные элементы** — DotGrid, corner accent (опционально, в конце)

---

## 9. Чек-лист для самопроверки после реализации

- [ ] Radius на карточках 10-14px (не 0, не 20+)
- [ ] Тени мягкие ambient, не offset
- [ ] Между секциями минимум 40px gap
- [ ] Hover на кнопках = background change + subtle shadow (не opacity)
- [ ] Hover на карточках = enhanced shadow
- [ ] Active = scale(0.97) на кнопках
- [ ] Есть минимум 2 варианта использования accent кроме кнопок
- [ ] Labels с accent dot
- [ ] filter-pill active = filled (не outline)
- [ ] Page titles 2.25rem / 800
- [ ] Тёмная тема: тени адаптированы (rgb(0 0 0 / 0.2) вместо 0.04)
