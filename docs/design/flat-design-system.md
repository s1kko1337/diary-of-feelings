# Flat Design System — Diary of Feelings

**Версия:** 2.0
**Дата:** 2026-03-05
**Автор:** UI/UX Design Architect Agent
**Статус:** Ready for implementation
**Тип изменения:** Радикальная смена дизайн-системы (glassmorphism/пастель → flat/геометрия)

---

## Философия нового направления

Новый стиль вдохновлён редакционной типографикой, бумажными дневниками и инструментами продуктивности (Are.na, Pitch, Notion). Меньше декора — больше структуры. Контент организован через линии, отступы и иерархию размеров, а не через цветные поверхности и размытые эффекты.

**Эмоциональный тон не меняется:** приложение остаётся спокойным и поддерживающим. Геометрия здесь — это чёткость и ясность, а не холодность.

---

## Часть 1. Полные CSS-переменные (замена theme.css)

Файл для замены: `src/assets/theme.css`

```css
/* ============================================================
   Flat Design System — Light Theme (default)
   Diary of Feelings v2.0
   ============================================================ */

:root {
  /* ---- Backgrounds ---- */
  --color-bg: #ffffff;
  --color-surface: #f7f7f7;
  --color-surface-hover: #f0f0f0;

  /* Убираем gradient — плоский белый фон */
  --color-bg-gradient: #ffffff;

  /* ---- Text ---- */
  --color-text: #0f0f0f;
  --color-text-secondary: #444444;
  --color-text-muted: #888888;

  /* ---- Borders ---- */
  --color-border: #e8e8e8;
  --color-border-strong: #cccccc;

  /* ---- Accent (Indigo) ---- */
  --color-accent: #6366f1;
  --color-accent-soft: #eef2ff;
  --color-accent-text: #4338ca;
  --color-accent-hover: #4f46e5;

  /* ---- Semantic ---- */
  --color-danger: #ef4444;
  --color-danger-soft: #fef2f2;
  --color-success: #22c55e;
  --color-success-soft: #f0fdf4;
  --color-warning: #f59e0b;
  --color-warning-soft: #fffbeb;

  /* ---- Совместимость с существующим кодом ----
     Старые переменные перемаплены на новые значения.
     Это позволяет постепенно мигрировать компоненты.  */
  --color-primary: #6366f1;
  --color-primary-soft: #eef2ff;
  --color-surface-solid: #f7f7f7;

  /* Старая палитра — удаляется в финальной очистке.
     Временно сохранена для обратной совместимости. */
  --color-lavender: #6366f1;
  --color-lavender-soft: #eef2ff;
  --color-lavender-medium: rgba(99, 102, 241, 0.2);
  --color-peach: #f59e0b;
  --color-peach-soft: #fffbeb;
  --color-mint: #22c55e;
  --color-mint-soft: #f0fdf4;
  --color-rose: #ef4444;
  --color-rose-soft: #fef2f2;
  --color-cream: #f7f7f7;

  /* ---- СМЭР-разделы (адаптированы под новую палитру) ---- */
  --color-smear-s: #6366f1;    /* Ситуация → indigo (вместо мяты) */
  --color-smear-m: #8b5cf6;    /* Мысли → violet */
  --color-smear-e: #f59e0b;    /* Эмоции → amber */
  --color-smear-r: #ef4444;    /* Реакция → red */
  --color-smear-s-soft: #eef2ff;
  --color-smear-m-soft: #f5f3ff;
  --color-smear-e-soft: #fffbeb;
  --color-smear-r-soft: #fef2f2;

  /* ---- Typography ---- */
  --font-main: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* ---- Shape — flat, minimal radius ---- */
  --radius-sm: 0px;
  --radius-md: 2px;
  --radius-lg: 2px;
  --radius-xl: 2px;
  --radius-full: 2px;

  /* ---- Shadows — flat drop-shadow вместо мягких теней ---- */
  --shadow-soft: none;
  --shadow-card: 2px 2px 0 var(--color-border);
  --shadow-float: 3px 3px 0 var(--color-border-strong);

  /* ---- Layout ---- */
  --header-height: 56px;
  --bottom-nav-height: 64px;

  /* ---- Spacing scale ---- */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 40px;
  --space-2xl: 64px;
}


/* ============================================================
   Dark Theme — warm and deep
   ============================================================ */

.dark {
  /* ---- Backgrounds ---- */
  --color-bg: #0a0a0a;
  --color-surface: #141414;
  --color-surface-hover: #1e1e1e;
  --color-bg-gradient: #0a0a0a;

  /* ---- Text ---- */
  --color-text: #f0f0f0;
  --color-text-secondary: #aaaaaa;
  --color-text-muted: #666666;

  /* ---- Borders ---- */
  --color-border: #2a2a2a;
  --color-border-strong: #3a3a3a;

  /* ---- Accent ---- */
  --color-accent: #6366f1;
  --color-accent-soft: #1e1b4b;
  --color-accent-text: #818cf8;
  --color-accent-hover: #818cf8;

  /* ---- Semantic ---- */
  --color-danger: #f87171;
  --color-danger-soft: #1f0a0a;
  --color-success: #4ade80;
  --color-success-soft: #0a1f0a;
  --color-warning: #fbbf24;
  --color-warning-soft: #1f1500;

  /* ---- Совместимость ---- */
  --color-primary: #818cf8;
  --color-primary-soft: #1e1b4b;
  --color-surface-solid: #141414;

  --color-lavender: #818cf8;
  --color-lavender-soft: #1e1b4b;
  --color-lavender-medium: rgba(129, 140, 248, 0.2);
  --color-peach: #fbbf24;
  --color-peach-soft: #1f1500;
  --color-mint: #4ade80;
  --color-mint-soft: #0a1f0a;
  --color-rose: #f87171;
  --color-rose-soft: #1f0a0a;
  --color-cream: #141414;

  /* ---- СМЭР-разделы (тёмная) ---- */
  --color-smear-s: #818cf8;
  --color-smear-m: #a78bfa;
  --color-smear-e: #fbbf24;
  --color-smear-r: #f87171;
  --color-smear-s-soft: #1e1b4b;
  --color-smear-m-soft: #1a1038;
  --color-smear-e-soft: #1f1500;
  --color-smear-r-soft: #1f0a0a;

  /* ---- Shadows ---- */
  --shadow-soft: none;
  --shadow-card: 2px 2px 0 var(--color-border);
  --shadow-float: 3px 3px 0 var(--color-border-strong);
}
```

---

## Часть 2. Глобальные классы (замена main.css)

Файл для изменения: `src/assets/main.css`

```css
@import 'tailwindcss';
@import './theme.css';

/* ============================================================
   Global base
   ============================================================ */

body {
  font-family: var(--font-main);
  background: var(--color-bg);
  color: var(--color-text);
  min-height: 100dvh;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
  /* Убрано: background-attachment: fixed (было для gradient) */
}

/* ============================================================
   Flat Cards — замена .glass-card и .glass-card-elevated
   ============================================================ */

/*
  .flat-card
  Базовая плоская карточка.
  Белый/surface фон, 1px border, нет blur, нет скруглений.
*/
.flat-card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  /* Никакого backdrop-filter */
  /* Никакого box-shadow по умолчанию */
}

/*
  .flat-card-elevated
  Карточка с flat drop-shadow — ощущение глубины без blur.
  Вдохновлено бумажными скетчбуками.
*/
.flat-card-elevated {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-card);
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}

.flat-card-elevated:hover {
  box-shadow: var(--shadow-float);
  transform: translate(-1px, -1px);
}

/*
  .flat-card-surface
  Карточка на surface-цвете (слегка серый фон) — для вложенных блоков.
*/
.flat-card-surface {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}

/* ============================================================
   Обратная совместимость — старые классы redirected
   Убрать после полной миграции всех компонентов.
   ============================================================ */

.glass-card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  /* backdrop-filter УБРАН */
  /* box-shadow УБРАН */
}

.glass-card-elevated {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-card);
}

/* ============================================================
   Навигация — плоская, без blur
   ============================================================ */

/* Desktop pill-navbar становится flat bar */
.app-navbar {
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  border-radius: 0;
  /* backdrop-filter УБРАН */
  box-shadow: none;
}

/* Mobile bottom nav */
.app-bottom-nav {
  background: var(--color-bg);
  border-top: 1px solid var(--color-border);
  /* backdrop-filter УБРАН */
}

/* Mobile header */
.app-header {
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  /* backdrop-filter УБРАН */
}

/* ============================================================
   Разделители
   ============================================================ */

.divider {
  height: 1px;
  background: var(--color-border);
  border: none;
  margin: 0;
}

.divider-strong {
  height: 1px;
  background: var(--color-border-strong);
  border: none;
  margin: 0;
}

/* ============================================================
   Геометрические акценты — замена орбов
   ============================================================ */

/*
  .geo-dot — маленькая квадратная точка-акцент
  Используется как декоративный маркер.
*/
.geo-dot {
  width: 6px;
  height: 6px;
  background: var(--color-accent);
  flex-shrink: 0;
  pointer-events: none;
}

/*
  .geo-line-accent — вертикальная линия-акцент слева
  Заменяет цветной орб в секциях СМЭР.
*/
.geo-line-accent {
  width: 2px;
  align-self: stretch;
  background: var(--color-accent);
  flex-shrink: 0;
  pointer-events: none;
}

/*
  .left-accent — border-left как структурный акцент
  Используется вместо gradient-орбов в статьях и секциях.
*/
.left-accent {
  border-left: 2px solid var(--color-accent);
  padding-left: var(--space-md);
}

.left-accent--indigo { border-left-color: #6366f1; }
.left-accent--violet { border-left-color: #8b5cf6; }
.left-accent--amber  { border-left-color: #f59e0b; }
.left-accent--red    { border-left-color: #ef4444; }
.left-accent--green  { border-left-color: #22c55e; }

/* ============================================================
   Прогресс-линии — замена pill-индикаторов
   ============================================================ */

/*
  Геометрический прогресс: горизонтальная линия с квадратными точками.
  Используется в CbtEntryView.
*/
.progress-line {
  display: flex;
  align-items: center;
  gap: 0;
  position: relative;
}

.progress-line__track {
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.progress-line__track--active {
  background: var(--color-accent);
}

.progress-line__dot {
  width: 8px;
  height: 8px;
  background: var(--color-border);
  flex-shrink: 0;
  transition: background-color 0.2s ease;
}

.progress-line__dot--active {
  background: var(--color-accent);
}

.progress-line__dot--current {
  background: var(--color-accent);
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* ============================================================
   Кнопки
   ============================================================ */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-family: var(--font-main);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    transform 0.15s ease,
    box-shadow 0.15s ease;
  text-decoration: none;
  border: 1px solid transparent;
}

.btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Основная кнопка — indigo fill */
.btn-primary {
  background: var(--color-accent);
  color: #ffffff;
  border-color: var(--color-accent);
}

.btn-primary:hover {
  background: var(--color-accent-hover);
  box-shadow: 2px 2px 0 rgba(99, 102, 241, 0.3);
}

.btn-primary:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* Вторичная — outline */
.btn-secondary {
  background: transparent;
  color: var(--color-text);
  border-color: var(--color-border-strong);
}

.btn-secondary:hover {
  background: var(--color-surface-hover);
  border-color: var(--color-text-muted);
}

/* Призрачная — только текст */
.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
  border-color: transparent;
}

.btn-ghost:hover {
  background: var(--color-surface);
  color: var(--color-text);
}

/* Акцентная ссылка-действие */
.btn-link {
  background: none;
  border: none;
  padding: 0;
  color: var(--color-accent);
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: gap 0.2s ease;
}

.btn-link:hover {
  gap: 10px;
}

/* ============================================================
   Поля ввода — underline style
   ============================================================ */

.input-underline {
  width: 100%;
  padding: 10px 0;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--color-border-strong);
  border-radius: 0;
  font-family: var(--font-main);
  font-size: 0.9rem;
  color: var(--color-text);
  outline: none;
  transition: border-color 0.2s ease;
}

.input-underline::placeholder {
  color: var(--color-text-muted);
}

.input-underline:focus {
  border-bottom-color: var(--color-accent);
}

/* Textarea в underline-стиле */
.textarea-underline {
  width: 100%;
  padding: 10px 0;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--color-border-strong);
  border-radius: 0;
  font-family: var(--font-main);
  font-size: 0.9rem;
  color: var(--color-text);
  outline: none;
  resize: none;
  transition: border-color 0.2s ease;
  line-height: 1.65;
}

.textarea-underline:focus {
  border-bottom-color: var(--color-accent);
}

/* Стандартный bordered input (для полей настроек) */
.input-bordered {
  width: 100%;
  padding: 8px 12px;
  background: var(--color-bg);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  font-family: var(--font-main);
  font-size: 0.9rem;
  color: var(--color-text);
  outline: none;
  transition: border-color 0.2s ease;
}

.input-bordered:focus {
  border-color: var(--color-accent);
}

/* ============================================================
   Toggle — квадратный flat стиль
   ============================================================ */

.toggle-flat {
  position: relative;
  width: 40px;
  height: 22px;
  background: var(--color-border-strong);
  border: 1px solid var(--color-border-strong);
  border-radius: 0;
  cursor: pointer;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
}

.toggle-flat--on {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.toggle-flat__knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background: #ffffff;
  border-radius: 0;
  transition: transform 0.2s ease;
}

.toggle-flat--on .toggle-flat__knob {
  transform: translateX(18px);
}

/* ============================================================
   Метрики и данные
   ============================================================ */

.metric-value {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.03em;
}

.metric-label {
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
}

/* ============================================================
   Скроллбар
   ============================================================ */

::-webkit-scrollbar {
  width: 3px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--color-border-strong);
  border-radius: 0;
}

/* ============================================================
   УДАЛЁННЫЕ классы (комментарий для разработчика)
   Следующие классы больше не используются и должны быть
   полностью удалены после завершения миграции:
     - .blob
     - .hero-orb (в HomeView.vue)
     - .article-card-orb (в HomeView.vue)
     - .section-orb (в CbtEntryView.vue)
     - .cbt-header-orb (в CbtView.vue)
   ============================================================ */
```

---

## Часть 3. Дизайн страниц

### 3.1. HomeView — Домашняя страница

#### ASCII-макет (мобайл, < 768px)

```
┌──────────────────────────────────────┐
│ [AppHeader]   Diary of Feelings   [☀]│  ← border-bottom 1px
├──────────────────────────────────────┤
│                                      │
│  чт, 5 марта 2026                    │  ← 0.7rem, uppercase, muted
│                                      │
│  Добрый вечер,                       │  ← 0.9rem, secondary
│  Михаил                              │  ← 2rem, weight 800, -0.04em
│                                      │
├──────────────────────────────────────┤  ← divider
│                                      │
│  ЧТО ТЫ ЧУВСТВУЕШЬ?                  │  ← 0.7rem uppercase label
│                                      │
│  ┌──────────┐ ┌──────────┐           │
│  │ 😊       │ │ 😌       │           │  ← квадратные flat кнопки
│  │ Радость  │ │ Спокойст.│           │
│  └──────────┘ └──────────┘           │
│  ┌──────────┐ ┌──────────┐           │
│  │ 😟       │ │ 😴       │           │
│  │ Тревога  │ │ Усталость│           │
│  └──────────┘ └──────────┘           │
│                                      │
│  Открыть дневник →                   │  ← btn-link, gap animation
│                                      │
├──────────────────────────────────────┤  ← divider
│                                      │
│  СТАТЬИ НА СЕГОДНЯ                   │  ← 0.7rem uppercase label
│                                      │
│  │ РАЗОГРЕВ                          │  ← left-accent--indigo
│  │ Как замечать хорошее в обычных    │
│  │ днях                              │
│                                      │
│  │ ГЛУБИНА                           │  ← left-accent--violet
│  │ Почему мы избегаем тишины         │
│                                      │
│  │ РЕФЛЕКСИЯ                         │  ← left-accent--amber
│  │ Письмо себе в конце дня           │
│                                      │
├──────────────────────────────────────┤  ← divider + border-top 2px accent
│ ▮▮ СОВЕТ ДНЯ                         │  ← border-top: 2px solid indigo
│                                      │
│  Каждый день здесь будет появляться  │
│  тёплый совет на основе твоих записей│
│  и настроения.                       │
│                                      │
├──────────────────────────────────────┤
│ [AppBottomNav]                       │  ← border-top 1px
└──────────────────────────────────────┘
```

#### ASCII-макет (десктоп, ≥ 768px)

```
        [AppNavbar — flat, border-bottom]

┌─────────────────────────────────────────────────────┐
│                   max-width: 720px                  │
│                                                     │
│  чт, 5 марта 2026                                   │
│  Добрый вечер, Михаил                               │  ← 2.5rem
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  ЧТО ТЫ ЧУВСТВУЕШЬ?                                 │
│                                                     │
│  [😊 Радость] [😌 Спокойствие] [😟 Тревога]         │  ← 4 в ряд
│  [😴 Усталость] [🙏 Благодарность]                  │
│                                       Открыть дн. → │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  СТАТЬИ НА СЕГОДНЯ                                  │
│                                                     │
│  │ РАЗОГРЕВ    Как замечать хорошее в обычных днях  │
│  │ ГЛУБИНА     Почему мы избегаем тишины            │
│  │ РЕФЛЕКСИЯ   Письмо себе в конце дня              │
│                                                     │
│  ─────────────────────────────────────────────────  │
│  ▮▮                                                 │
│  СОВЕТ ДНЯ                                          │
│                                                     │
│  Каждый день здесь будет появляться тёплый совет... │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### Ключевые CSS-изменения в HomeView.vue

```css
/* УБРАТЬ */
.hero-orb { ... }                    /* декоративный орб — удалить элемент из шаблона */
@keyframes pulse-orb { ... }         /* анимацию орба — удалить */
.article-card-orb { ... }            /* орб в карточке статьи — удалить */
.card--accent background: linear-gradient(...)  /* градиентный фон */

/* backdrop-filter во всех .article-card — удалить */

/* ЗАМЕНИТЬ */
.hero { padding: 2rem 0 1.5rem; text-align: left; }  /* выравнивание влево */
.hero-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-muted); }
.hero-title { font-size: 2rem; font-weight: 800; letter-spacing: -0.04em; }

/* EMOTION GRID — квадратные кнопки вместо pills */
.emotion-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
@media (min-width: 640px) { .emotion-grid { grid-template-columns: repeat(4, 1fr); } }

.emotion-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
  text-align: left;
}

.emotion-btn:hover {
  background: var(--color-surface-hover);
  border-color: var(--color-border-strong);
  color: var(--color-text);
}

.emotion-btn--selected {
  border-color: var(--color-accent);
  background: var(--color-accent-soft);
  color: var(--color-accent-text);
}

/* ARTICLES — список с left-accent вместо карточек */
.articles-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.article-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background-color 0.15s ease;
  text-decoration: none;
}

.article-row:last-child { border-bottom: none; }
.article-row:hover { background: var(--color-surface); margin: 0 -16px; padding-left: 16px; padding-right: 16px; }

.article-row__accent {
  width: 2px;
  align-self: stretch;
  flex-shrink: 0;
  min-height: 36px;
}

.article-row__tag {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  margin-bottom: 2px;
}

.article-row__title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.4;
}

/* AI БЛОК — border-top акцент */
.ai-block {
  padding: 20px 0;
  border-top: 2px solid var(--color-accent);
}

.ai-block__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.ai-block__icon {
  width: 6px;
  height: 6px;
  background: var(--color-accent);
}

.ai-block__label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-accent);
}
```

---

### 3.2. EmotionsView — Дневник эмоций

#### ASCII-макет

```
┌──────────────────────────────────────┐
│ [AppHeader]   Дневник эмоций      [+]│
├──────────────────────────────────────┤
│                                      │
│  ЧТО ТЫ СЕЙЧАС ЧУВСТВУЕШЬ?          │  ← 0.7rem uppercase
│                                      │
│  [EmotionWheel — без изменений]      │  ← колесо остаётся, styling кнопок
│   ↓ кнопки становятся квадратными   │
│                                      │
├──────────────────────────────────────┤
│                                      │
│  ПАТТЕРНЫ ЗА НЕДЕЛЮ                  │
│                                      │
│  12          5.3         😟 3         │  ← mono метрики в ряд
│  ЗАПИСЕЙ     СРЕДНЯЯ     ТОП-ЭМОЦИЯ  │  ← uppercase 0.7rem muted
│                                      │
├──────────────────────────────────────┤
│                                      │
│  ДИНАМИКА                            │
│  [EmotionChart — цвета → accent]     │  ← тот же компонент, цвет indigo
│                                      │
├──────────────────────────────────────┤
│                                      │
│  СЕГОДНЯ                             │
│                                      │
│  ──────────────────────────────────  │  ← divider
│  😊 Радость · 7/10                  │  ← строка записи
│  14:30                               │
│  «Хороший день, всё сложилось»       │
│  ──────────────────────────────────  │
│  😟 Тревога · 5/10                  │
│  09:15                               │
│  ──────────────────────────────────  │
│                                      │
└──────────────────────────────────────┘
```

#### Ключевые CSS-изменения в EmotionsView.vue

```css
/* УБРАТЬ — glassmorphism с .glass-card */
/* Все section.glass-card → section (без класса) с divider разделителями */

/* ПАТТЕРНЫ — горизонтальный ряд метрик */
.patterns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
}

.pattern-stat {
  padding: 12px 16px 12px 0;
  border-right: 1px solid var(--color-border);
}

.pattern-stat:last-child { border-right: none; }

.pattern-value {
  font-family: var(--font-mono);
  font-size: 1.25rem;
  font-weight: 700;
  display: block;
  color: var(--color-text);
}

.pattern-name {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
}

/* ИСТОРИЯ — список с разделителями */
.emotion-history-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: start;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border);
}

/* EmotionWheel кнопки — квадратные */
/* В EmotionWheel.vue: border-radius → 0, убрать rounded классы */
```

---

### 3.3. CbtView — Список записей КПТ

#### ASCII-макет

```
┌──────────────────────────────────────┐
│ [AppHeader]                          │
├──────────────────────────────────────┤
│                                      │
│  КПТ-ДНЕВНИК                         │  ← 2rem, weight 800
│  Помогает понять связь мыслей        │
│  и эмоций                            │  ← 0.9rem, secondary
│                                      │  [+ Новая запись] → btn-primary
│                                      │
│  ──────────────────────────────────  │
│  12           Катастр.    +3         │  ← mono метрики
│  ЗАПИСЕЙ      ТОП         ЗА НЕДЕЛЮ  │
│  ──────────────────────────────────  │
│                                      │
│  [Все] [Неделя] [Месяц]              │  ← flat квадратные tab-кнопки
│  [▾ Искажение]                       │  ← select без скруглений
│                                      │
│  ──────────────────────────────────  │
│                                      │
│  ▮ вт 3 мар · Тревога 7/10           │  ← левый индикатор indigo
│    Коллега не ответил на сообщение…  │
│    Катастрофизация                   │  ← tag, muted
│  ──────────────────────────────────  │
│                                      │
│  ▮ пн 2 мар · Обида 5/10             │
│    Встреча прошла не так, как        │
│    ожидал…                           │
│  ──────────────────────────────────  │
│                                      │
│  [Пустой стейт — SVG иллюстрация]    │  ← если нет записей
│                                      │
└──────────────────────────────────────┘
```

#### Ключевые CSS-изменения в CbtView.vue

```css
/* УБРАТЬ */
.cbt-header-orb { ... }    /* декоративный орб — удалить из шаблона */

/* ЗАМЕНИТЬ .glass-card карточки записей */
.entry-row {
  display: grid;
  grid-template-columns: 4px 1fr;  /* accent line + content */
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.15s ease;
}

.entry-row:hover {
  background: var(--color-surface);
  margin: 0 -16px;
  padding-left: 16px;
  padding-right: 16px;
}

.entry-accent-line {
  background: var(--color-accent);
  border-radius: 0;
  align-self: stretch;
  min-height: 20px;
}

.entry-date {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  margin-bottom: 4px;
  font-family: var(--font-mono);
}

.entry-emotion {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-accent-text);
}

.entry-preview {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-top: 4px;
  /* однострочный overflow */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.entry-tag {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  margin-top: 6px;
}

/* ФИЛЬТРЫ — квадратные tab-кнопки */
.filter-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--space-lg);
}

.filter-tab {
  padding: 8px 16px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-muted);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.filter-tab--active {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}

/* SELECT — без скруглений */
.filter-select {
  padding: 6px 10px;
  border: 1px solid var(--color-border-strong);
  border-radius: 0;
  background: var(--color-bg);
  font-size: 0.8rem;
  color: var(--color-text);
  cursor: pointer;
  outline: none;
}

.filter-select:focus {
  border-color: var(--color-accent);
}

/* STAT ROW */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid var(--color-border);
  margin-bottom: var(--space-lg);
}

.stat-cell {
  padding: 16px;
  border-right: 1px solid var(--color-border);
}

.stat-cell:last-child { border-right: none; }
```

---

### 3.4. CbtEntryView — Форма/просмотр записи СМЭР

#### ASCII-макет

```
┌──────────────────────────────────────┐
│ ← Назад          Новая запись        │  ← flat topbar, border-bottom
├──────────────────────────────────────┤
│                                      │
│  •────────────•────────────•────── • │  ← progress-line: 4 точки
│  С            М            Э       Р │  ← labels под точками
│                                      │
│  ──────────────────────────────────  │
│                                      │
│  ▮ С — СИТУАЦИЯ                      │  ← 2px left border, indigo/violet
│    ЧТО ПРОИЗОШЛО?                    │  ← 0.7rem uppercase
│                                      │
│    Просто опиши, что случилось.      │  ← textarea underline
│    _______________________________   │  ← border-bottom only
│    _______________________________   │
│                                      │  250 / 1000 →  ← char counter, muted
│                                      │
│  ──────────────────────────────────  │
│                                      │
│  ▮ М — МЫСЛИ                         │  ← 2px left border, violet
│    КАКИЕ МЫСЛИ ВОЗНИКЛИ?             │
│                                      │
│    _________________________________ │  ← textarea underline
│                                      │
│  ──────────────────────────────────  │
│                                      │
│  ▮ Э — ЭМОЦИИ                        │  ← 2px left border, amber
│    КАКИЕ ЭМОЦИИ И НАСКОЛЬКО СИЛЬНО?  │
│                                      │
│    [+ Добавить эмоцию]               │  ← btn-ghost
│    😟 Тревога  ●●●●●●●○○○  7         │  ← slider flat
│                                      │
│  ──────────────────────────────────  │
│                                      │
│  ▮ Р — РЕАКЦИЯ                       │  ← 2px left border, red
│    КАК ТЫ ОТРЕАГИРОВАЛ?              │
│    _________________________________ │
│                                      │
│  ──────────────────────────────────  │
│                                      │
│  ▸ Продвинутый режим                 │  ← collapsible, стрелка
│                                      │
│  ──────────────────────────────────  │
│                                      │
│        [Сохранить запись]            │  ← btn-primary, sticky bottom
│                                      │
└──────────────────────────────────────┘
```

#### Ключевые CSS-изменения в CbtEntryView.vue

```css
/* УБРАТЬ */
.section-orb { ... }             /* декоративный орб в каждой секции */
.cbt-entry-page--mounted анимации появления → оставить, упростить */

/* SMEAR SECTION — плоская секция с left-accent */
.smear-section {
  display: grid;
  grid-template-columns: 2px 1fr;
  gap: 16px;
  padding: 20px 0;
  border-bottom: 1px solid var(--color-border);
}

.smear-section__accent {
  background: var(--section-color, var(--color-accent));
  align-self: stretch;
}

.smear-section__content { /* всё содержимое секции */ }

.section-letter {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--section-color, var(--color-accent));
  display: block;
  margin-bottom: 4px;
}

.section-title {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  display: block;
  margin-bottom: 12px;
}

/* TEXTAREA → underline-стиль */
.smear-textarea {
  /* Заменить bordered → underline */
  border: none;
  border-bottom: 1px solid var(--color-border-strong);
  border-radius: 0;
  background: transparent;
  padding: 8px 0;
  /* ... остальное из .textarea-underline */
}

.smear-textarea:focus {
  border-bottom-color: var(--section-color, var(--color-accent));
}

/* PROGRESS LINE — заменить CbtProgressBar */
/* В CbtProgressBar.vue переключить на .progress-line классы */

/* LOCKED STATE */
.smear-section--locked {
  opacity: 0.4;
  pointer-events: none;
}

/* COLLAPSIBLE — продвинутый режим */
.advanced-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-muted);
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  transition: color 0.15s ease;
}

.advanced-toggle:hover { color: var(--color-text); }

.advanced-toggle__arrow {
  transition: transform 0.2s ease;
}

.advanced-toggle--open .advanced-toggle__arrow {
  transform: rotate(90deg);
}
```

---

### 3.5. ProfileView — Настройки

#### ASCII-макет

```
┌──────────────────────────────────────┐
│ [AppHeader]   Настройки              │
├──────────────────────────────────────┤
│                                      │
│  ПРОФИЛЬ                             │  ← 0.7rem uppercase, muted
│  ──────────────────────────────────  │
│  Имя                                 │  ← label, 0.75rem
│  Михаил_____________________________ │  ← input underline
│  ──────────────────────────────────  │
│                                      │
│  ВНЕШНИЙ ВИД                         │
│  ──────────────────────────────────  │
│  ☀ Светлая тема              [■   ]  │  ← flat toggle
│  ──────────────────────────────────  │
│                                      │
│  УВЕДОМЛЕНИЯ                         │
│  ──────────────────────────────────  │
│  🔔 Ежедневное напоминание   [■   ]  │
│  Время                       20:00   │  ← если включено
│  ──────────────────────────────────  │
│                                      │
│  КПТ-РЕЖИМ                           │
│  ──────────────────────────────────  │
│  Продвинутый режим СМЭР      [■   ]  │
│  ──────────────────────────────────  │
│                                      │
│  ДАННЫЕ                              │
│  ──────────────────────────────────  │
│  Экспорт записей             →       │
│  ──────────────────────────────────  │
│  Удалить все данные                  │  ← color: danger
│  ──────────────────────────────────  │
│                                      │
└──────────────────────────────────────┘
```

#### Ключевые CSS-изменения в ProfileView.vue

```css
/* УБРАТЬ .settings-card { backdrop-filter ... border-radius } */

/* ЗАМЕНИТЬ — списки с разделителями */
.settings-group {
  margin-bottom: var(--space-xl);
}

.settings-group-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 0;
}

.settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border);
  gap: 12px;
}

.settings-row:last-child { border-bottom: none; }

.settings-row__info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.875rem;
  color: var(--color-text);
}

.settings-row__info--danger {
  color: var(--color-danger);
}

.settings-row__action {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

/* INPUT — underline стиль */
.settings-input {
  /* использовать .input-underline из main.css */
}

/* TOGGLE — flat квадратный */
/* использовать .toggle-flat из main.css */
```

---

### 3.6. Навигация — AppNavbar / AppHeader / AppBottomNav

#### AppNavbar (Desktop) — было: floating pill с blur

```
До:  position: fixed, top: 16px, border-radius: 999px, backdrop-filter: blur(24px)
После: position: fixed, top: 0, left: 0, right: 0, border-radius: 0, border-bottom: 1px solid var(--color-border), background: var(--color-bg)
```

```css
/* AppNavbar.vue — новые стили */
.app-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: var(--header-height);
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  /* УБРАНО: backdrop-filter, border-radius: full, box-shadow */
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar-inner {
  display: flex;
  align-items: center;
  gap: 2px;
  /* УБРАНО: padding, background, border-radius */
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 0;           /* БЫЛО: var(--radius-full) */
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.15s ease, background-color 0.15s ease;
}

.nav-link:hover {
  color: var(--color-text);
  background: var(--color-surface);
}

.nav-link--active {
  color: var(--color-accent);
  background: var(--color-accent-soft);
  font-weight: 600;
}
```

#### AppBottomNav (Mobile)

```css
/* AppBottomNav.vue — новые стили */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--bottom-nav-height);
  background: var(--color-bg);
  border-top: 1px solid var(--color-border);
  /* УБРАНО: backdrop-filter */
  display: flex;
  align-items: center;
  justify-content: space-around;
}
```

---

## Часть 4. SVG-иллюстрации

### 4.1. Empty State — КПТ-дневник

Концепция: открытый блокнот с горизонтальными линиями и пером. Геометрическая абстракция — прямоугольник (лист), параллельные линии (строки), диагональный элемент (перо).

```svg
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="160"
  height="160"
  viewBox="0 0 160 160"
  fill="none"
  aria-label="Нет записей"
  role="img"
>
  <!-- Лист блокнота — прямоугольник -->
  <rect
    x="24"
    y="20"
    width="88"
    height="108"
    stroke="currentColor"
    stroke-width="1.5"
    fill="none"
  />

  <!-- Корешок переплёта — вертикальная линия слева -->
  <line
    x1="40"
    y1="20"
    x2="40"
    y2="128"
    stroke="currentColor"
    stroke-width="1.5"
    opacity="0.4"
  />

  <!-- Строки — 6 горизонтальных линий -->
  <line x1="52" y1="44"  x2="100" y2="44"  stroke="currentColor" stroke-width="1" opacity="0.35" />
  <line x1="52" y1="58"  x2="100" y2="58"  stroke="currentColor" stroke-width="1" opacity="0.35" />
  <line x1="52" y1="72"  x2="84"  y2="72"  stroke="currentColor" stroke-width="1" opacity="0.35" />
  <line x1="52" y1="86"  x2="100" y2="86"  stroke="currentColor" stroke-width="1" opacity="0.35" />
  <line x1="52" y1="100" x2="76"  y2="100" stroke="currentColor" stroke-width="1" opacity="0.35" />

  <!-- Перо / карандаш — диагональный прямоугольник в правом нижнем углу -->
  <g transform="translate(96, 96) rotate(-45)">
    <!-- Тело карандаша -->
    <rect
      x="-6"
      y="-22"
      width="12"
      height="32"
      stroke="currentColor"
      stroke-width="1.5"
      fill="none"
    />
    <!-- Кончик -->
    <polygon
      points="-6,10 6,10 0,18"
      stroke="currentColor"
      stroke-width="1.5"
      fill="none"
    />
    <!-- Ластик -->
    <rect
      x="-6"
      y="-26"
      width="12"
      height="4"
      stroke="currentColor"
      stroke-width="1.5"
      fill="none"
      opacity="0.5"
    />
  </g>

  <!-- Маленький акцентный квадрат — геометрический маркер -->
  <rect
    x="110"
    y="18"
    width="8"
    height="8"
    fill="currentColor"
    opacity="0.6"
  />
</svg>
```

**Использование в компоненте:**

```html
<!-- CbtView.vue — empty state -->
<div class="empty-state" v-if="store.entries.length === 0 && !store.isLoading">
  <div class="empty-state__illustration" aria-hidden="true">
    <!-- вставить SVG-код выше -->
    <!-- color: var(--color-text-muted) через currentColor -->
  </div>
  <p class="empty-state__title">Пока нет записей</p>
  <p class="empty-state__text">
    Начни с описания ситуации, которая тебя беспокоит. Это займёт 2 минуты.
  </p>
  <button class="btn btn-primary" @click="goToNew">
    Создать первую запись
  </button>
</div>
```

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-2xl) var(--space-lg);
  gap: var(--space-md);
}

.empty-state__illustration {
  color: var(--color-text-muted);
  opacity: 0.7;
  margin-bottom: var(--space-sm);
}

.empty-state__title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.empty-state__text {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.65;
  max-width: 280px;
}
```

---

### 4.2. Empty State — Дневник эмоций

Концепция: окружность (колесо эмоций) с пересекающимися диаметрами и точками на осях. Геометрическая версия компаса или циферблата.

```svg
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="140"
  height="140"
  viewBox="0 0 140 140"
  fill="none"
  aria-label="Нет записей эмоций"
  role="img"
>
  <!-- Внешняя окружность -->
  <circle
    cx="70"
    cy="70"
    r="52"
    stroke="currentColor"
    stroke-width="1.5"
  />

  <!-- Внутренняя окружность — кольцо -->
  <circle
    cx="70"
    cy="70"
    r="32"
    stroke="currentColor"
    stroke-width="1"
    opacity="0.4"
  />

  <!-- Горизонтальный диаметр -->
  <line
    x1="18"
    y1="70"
    x2="122"
    y2="70"
    stroke="currentColor"
    stroke-width="1"
    opacity="0.4"
  />

  <!-- Вертикальный диаметр -->
  <line
    x1="70"
    y1="18"
    x2="70"
    y2="122"
    stroke="currentColor"
    stroke-width="1"
    opacity="0.4"
  />

  <!-- Диагональ 1 (45°) — укороченная до внешнего круга -->
  <line
    x1="33.2"
    y1="33.2"
    x2="106.8"
    y2="106.8"
    stroke="currentColor"
    stroke-width="1"
    opacity="0.2"
  />

  <!-- Диагональ 2 (135°) -->
  <line
    x1="106.8"
    y1="33.2"
    x2="33.2"
    y2="106.8"
    stroke="currentColor"
    stroke-width="1"
    opacity="0.2"
  />

  <!-- Точки на осях — на внешней окружности -->
  <rect x="17" y="68" width="4" height="4" fill="currentColor" opacity="0.5" />
  <rect x="119" y="68" width="4" height="4" fill="currentColor" opacity="0.5" />
  <rect x="68" y="17" width="4" height="4" fill="currentColor" opacity="0.5" />
  <rect x="68" y="119" width="4" height="4" fill="currentColor" opacity="0.5" />

  <!-- Центральный квадрат вместо точки -->
  <rect
    x="66"
    y="66"
    width="8"
    height="8"
    fill="currentColor"
    opacity="0.8"
  />

  <!-- Акцентный квадрат (геометрический маркер) — верхний правый угол -->
  <rect
    x="108"
    y="22"
    width="7"
    height="7"
    fill="currentColor"
    opacity="0.55"
  />
</svg>
```

**Использование в компоненте:**

```html
<!-- EmotionsView.vue — empty state для истории -->
<div class="empty-state" v-if="history.length === 0 && !loading">
  <div class="empty-state__illustration" aria-hidden="true">
    <!-- вставить SVG-код выше -->
  </div>
  <p class="empty-state__title">Ещё нет записей</p>
  <p class="empty-state__text">
    Выбери эмоцию выше, чтобы начать отслеживать своё состояние.
  </p>
</div>
```

---

## Часть 5. Инструкции для разработчика

### 5.1. Порядок выполнения работы

Работы выполняются последовательно — каждый шаг проверяется визуально перед переходом к следующему.

#### Шаг 1. Замена theme.css (основа всего)

Файл: `src/assets/theme.css`

- Полностью заменить содержимое файла на CSS-переменные из Части 1 данной спецификации.
- Проверить: после замены `--radius-full` становится `2px` — это сломает pill-форму навбара. Это ожидаемо.
- Проверить: цвета из СМЭР-спецификации (`--color-smear-s` и т.д.) добавлены.

#### Шаг 2. Замена main.css (глобальные классы)

Файл: `src/assets/main.css`

- Полностью заменить содержимое файла на код из Части 2.
- `.glass-card` и `.glass-card-elevated` сохраняются как алиасы для обратной совместимости, но больше не содержат `backdrop-filter`.
- Убедиться, что `.blob` удалён из файла.

#### Шаг 3. Навигация (AppNavbar, AppHeader, AppBottomNav)

Файлы: `src/components/layout/AppNavbar.vue`, `AppHeader.vue`, `AppBottomNav.vue`

- **AppNavbar:** Убрать `border-radius` (было `full`), убрать `backdrop-filter`, убрать `position: fixed; top: 16px` — заменить на `top: 0`, убрать glassmorphism-фон, добавить `border-bottom`. Убедиться, что `max-width` контента = 720px внутри navbar.
- **AppHeader:** Убрать glassmorphism если есть, добавить `border-bottom`.
- **AppBottomNav:** Убрать glassmorphism если есть, добавить `border-top`.

#### Шаг 4. HomeView.vue

Файл: `src/views/HomeView.vue`

**Что удалить из шаблона:**
- `<div class="hero-orb" />` — полностью убрать элемент
- `<div class="article-card-orb" />` — полностью убрать элемент из каждой `.article-card`

**Что изменить в шаблоне:**
- `.glass-card-elevated.card` → без класса стекла, использовать разделители `.divider`
- `.card--accent` → заменить на `.ai-block` (border-top: 2px indigo)
- `.emotion-pill` → `.emotion-btn` (квадратные flat кнопки, см. CSS выше)
- `.articles-grid` + `.article-card` → `.articles-list` + `.article-row` (список с left-accent)
- Добавить `class="article-row__accent"` с inline цветом для каждого типа статьи

**Что удалить из `<style scoped>`:**
- `.hero-orb { ... }`, `@keyframes pulse-orb { ... }`
- `.article-card-orb { ... }`
- `.card--accent` (заменить)
- `.emotion-pill` (заменить на `.emotion-btn`)
- `backdrop-filter` во всех правилах
- `border-radius: var(--radius-lg)` → `var(--radius-sm)`

**Что добавить в `<style scoped>`:**
- Стили из блока "Ключевые CSS-изменения HomeView.vue" из Части 3.1

#### Шаг 5. EmotionsView.vue

Файл: `src/views/EmotionsView.vue`

- Убрать `.glass-card` с секций, использовать `<hr class="divider">` между блоками
- Обновить `.patterns` → горизонтальные метрики с вертикальными разделителями
- Обновить `.section-label` → стиль из метрик label
- Обновить EmotionHistory список → строки с `border-bottom`

Файл: `src/components/emotions/EmotionWheel.vue`

- Найти все `border-radius: var(--radius-full)` и `rounded-full` Tailwind-классы на кнопках эмоций
- Заменить на `border-radius: 0` / `rounded-none`
- Hover-стиль: убрать `transform: scale(1.1)` → заменить на `background: var(--color-surface-hover), border-color: var(--color-border-strong)`

#### Шаг 6. CbtView.vue

Файл: `src/views/CbtView.vue`

**Что удалить из шаблона:**
- `<div class="cbt-header-orb" />` — полностью убрать

**Что изменить:**
- `.glass-card` карточки записей → `.entry-row` (список с разделителями)
- Фильтр-pills → tab-кнопки `.filter-tab` с border-bottom
- `CbtStatCard` компонент → `.stat-cell` в `.stats-row` grid

Файл: `src/components/cbt/CbtStatCard.vue` (если существует)
- Убрать glassmorphism/pill стиль, применить стиль `.stat-cell`

#### Шаг 7. CbtEntryView.vue

Файл: `src/views/CbtEntryView.vue`

**Что удалить из шаблона:**
- `<div class="section-orb" />` — убрать из каждой секции
- Декоративные орбы из `.section-icon-wrapper`

**Что изменить:**
- `.smear-section` → grid с 2px accent line слева (см. CSS Часть 3.4)
- `.section-icon-wrapper` (цветной круг с иконкой) → убрать круг, оставить иконку рядом с заголовком
- `.smear-textarea` → underline стиль (border-bottom only)
- `CbtProgressBar` → переключить на `.progress-line` компонент из main.css

Файл: `src/components/cbt/CbtProgressBar.vue`
- Полностью переделать стили под `.progress-line` + `.progress-line__dot` + `.progress-line__track`

#### Шаг 8. ProfileView.vue

Файл: `src/views/ProfileView.vue`

- `.settings-card` → убрать, использовать `.settings-group` + `.settings-row`
- Toggle компонент → заменить на `.toggle-flat` стиль (квадратный)
- Input поля → `.input-underline` стиль
- Добавить empty-state SVG если нужен

#### Шаг 9. Добавить empty-state SVG-иллюстрации

- Создать `src/components/icons/EmptyStateCbt.vue` — с SVG из Части 4.1
- Создать `src/components/icons/EmptyStateEmotions.vue` — с SVG из Части 4.2
- Использовать `currentColor` для цвета — задаётся через CSS `color: var(--color-text-muted)`
- Добавить в CbtView.vue и EmotionsView.vue соответственно

#### Шаг 10. Финальная очистка

- Удалить `.blob` класс из всех компонентов
- Убрать блок совместимости из `main.css` (`.glass-card` алиасы) после проверки
- Убрать старые палитровые переменные из `theme.css` (блок совместимости) после проверки
- Проверить все `backdrop-filter` через поиск по проекту — не должно остаться ни одного
- Запустить `npm run lint && npm run format`

---

### 5.2. Зависимости и потенциальные сложности

#### Обратная совместимость CSS-переменных

Старые переменные `--color-lavender`, `--color-peach` и т.д. перемаплены в Части 1 на новые значения. Это позволит компонентам, ещё не прошедшим миграцию, работать без поломок — хотя их цвета изменятся.

Проверить через поиск: `grep -r "color-lavender\|color-peach\|color-mint\|color-rose" src/`

#### EmotionWheel — специфика компонента

Колесо эмоций построено на сложной геометрии (SVG или CSS-grid с позиционированием). Изменение `border-radius` на кнопках эмоций может нарушить форму колеса если она зависит от скругления. Проверить визуально и при необходимости скорректировать layout колеса.

#### CbtProgressBar

Если `CbtProgressBar.vue` использует pill-стиль через `--radius-full`, его полная переделка на `progress-line` означает изменение HTML-структуры компонента. Убедиться, что пропсы `steps` и логика active/done/current состояний сохраняются.

#### Анимация появления в CbtEntryView

Существующая `.cbt-entry-page--mounted` анимация использует `opacity` + `translateY` — это безопасно и её можно сохранить. Убедиться, что она не анимирует `backdrop-filter`.

#### Тёмная тема

После замены `theme.css` проверить тёмную тему: переключиться в `.dark` режим и убедиться, что:
- Фон `#0a0a0a` применяется корректно
- Контрасты достаточны (текст `#f0f0f0` на `#0a0a0a` = ratio 18:1, отлично)
- Accent `#6366f1` видим на тёмном фоне (проверить contrast ratio)

Предупреждение: `#6366f1` на `#0a0a0a` имеет contrast ratio ~5.4:1 — достаточно для WCAG AA. Accent-text в тёмной теме используется `#818cf8` (~7.1:1 — отлично).

#### Spacing — body padding-top

После того как `AppNavbar` перестаёт быть `floating pill` и становится `full-width sticky bar`, нужно проверить, что контент страниц имеет корректный `padding-top` для компенсации navbar. Текущий `--header-height: 56px` должен применяться в layout-обёртке.

---

### 5.3. Файлы для создания

```
src/components/icons/EmptyStateCbt.vue        ← новый
src/components/icons/EmptyStateEmotions.vue   ← новый
```

### 5.4. Файлы для изменения (в порядке приоритета)

```
1.  src/assets/theme.css           ← полная замена
2.  src/assets/main.css            ← полная замена
3.  src/components/layout/AppNavbar.vue
4.  src/components/layout/AppHeader.vue
5.  src/components/layout/AppBottomNav.vue
6.  src/views/HomeView.vue
7.  src/views/EmotionsView.vue
8.  src/components/emotions/EmotionWheel.vue
9.  src/views/CbtView.vue
10. src/components/cbt/CbtStatCard.vue        ← если существует
11. src/views/CbtEntryView.vue
12. src/components/cbt/CbtProgressBar.vue
13. src/views/ProfileView.vue
```

### 5.5. Что НЕ меняется

- Логика компонентов (JS/`<script setup>` блоки)
- Pinia stores (`src/stores/`)
- Composables (`src/composables/`)
- API слой (`src/api/`)
- Vue Router (`src/router/`)
- Структура пропсов и emit-событий компонентов
- EmotionChart — только обновить цвет линий на `var(--color-accent)` через `useChartColors()` composable

---

## Самопроверка (чеклист перед финализацией)

- [x] Все цвета из новой палитры (indigo/нейтральные)
- [x] Нет `backdrop-filter` ни в одном правиле
- [x] Нет `border-radius > 2px` (кроме блока совместимости)
- [x] Нет gradients в фонах (заменены на solid)
- [x] Нет орбов/блобов (заменены на геометрию)
- [x] Mobile и desktop варианты описаны для всех страниц
- [x] Все состояния (hover, active, disabled, empty, loading, error) покрыты
- [x] Обратная совместимость CSS-переменных обеспечена
- [x] SVG-иллюстрации используют `currentColor`
- [x] A11y: `aria-label` на SVG, `role="img"`, `aria-hidden="true"` на декоративных элементах
- [x] WCAG AA contrast ratios проверены для accent цветов
- [x] Порядок миграции чёткий, пошаговый
- [x] Описаны потенциальные сложности реализации
