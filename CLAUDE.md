# Diary of Feelings -- Мотивационный Ежедневный Ассистент

## Суть проекта

Личное пространство для ежедневной рефлексии и эмоциональной поддержки. Два крыла: **Задачи** (действия, планы, знания) и **Эмоции** (чувства, терапия, AI-поддержка). Между ними -- древовидный граф на главной, AI-помощник, который видит обе стороны.

Никакого давления на пользователя. Organic дизайн с paper-элементами.

### Модули

**Раздел ЗАДАЧИ** (bottom nav: Задачи / Заметки / Библиотека):
- **Задачи** -- гридовый календарь + цветные стикеры (drag & drop на даты)
- **Заметки** -- минималистичный блокнот (стиль iOS Notes), AI парсит для советов
- **Библиотека** -- документы (Word, PDF, статьи), личная база знаний

**Раздел ЭМОЦИИ** (bottom nav: Эмоции / Помощник / Отчёт):
- **Дневник эмоций** -- колесо эмоций, одна строка в день, тайм-капсулы, паттерны
- **КПТ-дневник (СМЭР)** -- kanban board с drag & drop карточками
- **AI-помощник** -- чат с персональным агентом, советы, опрос настроения
- **Отчёт** -- аналитика за период, графики, паттерны, корреляции

**Общие:**
- **Splash screen** -- волновая SVG-анимация при запуске
- **Home** -- древовидный граф с ветками Задачи/Эмоции
- **Онбординг** -- 6-шаговый флоу
- **Профиль** -- настройки, тема, уведомления

### Дневник эмоций (подробнее)

- **Колесо эмоций** -- двухуровневый выбор точной эмоции
- **Одна строка в день** -- минимальный барьер входа
- **Интенсивность** -- шкала 0--10
- **Тайм-капсула** -- запись, которую увидишь через 30 дней
- **Паттерны** -- AI замечает закономерности
- **Месячный отчёт** -- динамика настроения

### КПТ-дневник -- СМЭР (подробнее)

Kanban board на основе когнитивно-поведенческой терапии.

**Структура карточки СМЭР:**

| Поле | Описание | Пример |
|------|----------|--------|
| **С -- Ситуация** | Что произошло (объективно) | "Коллега не ответил за 3 часа" |
| **М -- Мысли** | Автоматические мысли | "Он меня игнорирует" |
| **Э -- Эмоции** | Эмоции и интенсивность (0--10) | Тревога 7/10 |
| **Р -- Реакция** | Поведение | "Написал ещё 3 сообщения" |

**Дополнительные поля (продвинутый режим):**
- Когнитивное искажение (выбор из списка)
- Оспаривание ("Есть ли доказательства?")
- Альтернативная мысль
- Эмоции после проработки

**Kanban колонки:** Новая -> В работе -> Проработана

**Принципы:** Drag & drop карточек, базовый режим для новичков, никакого давления.

## Pipeline разработки

```
Backend API (FastAPI) -> Дизайн компонентов -> Фронтенд компоненты
```

**API First:** фронтенд пишется под готовые эндпоинты. При отсутствии бекенда -- моки через `src/api/mock/`.

## Стек

| Слой | Технология |
|------|-----------|
| Frontend | Vue 3 + Vite + PWA (Workbox) |
| UI | Tailwind CSS 4 |
| State | Pinia (composition syntax) |
| Routing | Vue Router (lazy-load) |
| Drag & Drop | VueDraggable / Sortable.js |
| Анимации | GSAP + CSS transitions |
| Backend | Python FastAPI |
| БД | PostgreSQL + Redis |
| AI | Anthropic Claude API (при разработке -- моки) |
| Уведомления | Web Push API |
| Lint | ESLint + oxlint + Prettier |

## Архитектура

### Frontend

```
src/
├── main.js              # Entry point
├── App.vue              # Root component (splash -> main layout)
├── api/                 # API wrappers
│   ├── client.js        # ApiError, request() with delay/timeout
│   ├── mock/            # Mock data and generators (localStorage)
│   └── *.js             # Module wrappers (tasks.js, emotions.js, etc.)
├── assets/              # Styles, fonts
│   ├── main.css         # Global styles (.glass-card, etc.)
│   └── theme.css        # CSS variables (light + dark)
├── components/
│   ├── layout/          # AppHeader, AppBottomNav (context-aware)
│   ├── home/            # TreeGraph, SplashScreen
│   ├── tasks/           # CalendarGrid, StickyNote, StickyNoteEditor
│   ├── notes/           # NoteCard, NoteEditor
│   ├── library/         # DocumentCard, DocumentViewer
│   ├── emotions/        # EmotionWheel, EmotionEntryForm, EmotionHistory, EmotionChart
│   ├── cbt/             # CbtBoard, CbtCard, CbtEmotionPicker, CbtDistortionPicker
│   ├── assistant/       # ChatBubble, ChatInput, ChatHistory
│   ├── report/          # ReportChart, ReportPatterns, ReportSummary
│   └── onboarding/      # OnboardingStep, TopicSelector, OptionSelector
├── composables/         # useXxx.js
├── router/              # Vue Router
├── stores/              # Pinia stores
└── views/               # Pages (XxxView.vue)
    ├── SplashView.vue
    ├── HomeView.vue
    ├── TasksView.vue
    ├── NotesView.vue
    ├── LibraryView.vue
    ├── EmotionsView.vue
    ├── AssistantView.vue
    ├── ReportView.vue
    ├── ProfileView.vue
    └── OnboardingView.vue
```

### Backend

```
diary-of-feelings-backend/
├── app/
│   ├── main.py          # FastAPI app, CORS, routers
│   ├── config.py        # Settings (pydantic-settings)
│   ├── database.py      # SQLAlchemy async engine
│   ├── models/          # SQLAlchemy models
│   ├── schemas/         # Pydantic schemas
│   ├── routers/         # API routers
│   └── services/        # Business logic
├── migrations/          # Alembic
├── requirements.txt
└── .env
```

### API Layer (frontend)

- `src/api/*.js` -- wrappers, call mock via `request(handler, { delay, timeout })`
- `src/api/mock/*.js` -- data and generators, localStorage storage
- `src/api/client.js` -- `ApiError`, `request()` with delay emulation and timeout
- When backend is ready, swap mock imports for real HTTP calls

### Stores (Pinia composition)

- Only composition syntax: `defineStore('name', () => { ... })`
- Store = global state; local state in components/composables
- Each module has its own store in `src/stores/`

### Composables

- File and function: `useXxx.js` -> `export function useXxx()`
- Return ref/computed, no UI logic
- `src/composables/`

### Themes

- CSS variables in `src/assets/theme.css` (light default, `.dark` class)
- Fonts: Inter (primary), JetBrains Mono (metrics)
- Composable `useChartColors()` for chart colors from CSS variables

## Code Conventions

### Vue Components

- Always `<script setup>` -- never Options API
- Block order: `<template>` -> `<script setup>` -> `<style scoped>`
- Styles always `scoped`; globals only in `assets/main.css`
- Components: PascalCase files, props camelCase in JS / kebab-case in templates
- Emit events: kebab-case (`@update-value`)
- **No `;` in `@click`** -- extract to method

### Pinia Stores

- Only composition syntax: `defineStore('name', () => { ... })`
- Store = global state; local state in components/composables

### Routing

- Lazy-load all pages: `component: () => import('@/views/XxxView.vue')`
- Route names: kebab-case
- Context-aware bottom nav (Tasks section vs Emotions section)

### Imports

- Alias `@` = `src/`
- Vue/libraries first, then internal modules

### Styling

- Tailwind CSS 4 -- utility-first, `@apply` only as last resort
- No inline styles
- Colors, fonts, spacing via Tailwind tokens and CSS variables

### Drag & Drop

- Use VueDraggable (vue.draggable.next) wrapping Sortable.js
- Drag preview: shadow + slight rotation (2--3deg)
- Drop zones: highlight with subtle border/background change
- Touch support required (mobile drag & drop)

### Анимации (GSAP + CSS)

- GSAP for complex sequences (splash wave, tree graph, page transitions)
- CSS transitions for simple hover/state changes
- All animations calm and smooth:
  - Hover: 0.2--0.3s ease
  - Page transitions: 0.4--0.6s ease-out
  - Background orbs: 20--25s drift cycle
  - Tree graph: gentle sway, node pulse

### Дизайн-система

**Философия:** Modern minimal + organic paper elements. Чистый интерфейс с тактильными акцентами (стикеры, бумажные текстуры, древовидный граф).

**Навигация:**
- Splash screen -> Home (tree graph) -> Sections
- Два раздела с собственным bottom nav каждый
- Tasks bottom nav: Задачи | Заметки | Библиотека
- Emotions bottom nav: Эмоции | Помощник | Отчёт
- Никаких сайдбаров -- контент по центру, `max-width: 720px`
- Header с кнопкой "домой" и аватаром

**Glassmorphism (ключевые правила):**
- `backdrop-filter: blur(20--24px)` + semi-transparent background
- Thin borders (`1px solid` with opacity 10--15%)
- Soft colored shadows (lavender, not black)
- Max 5 glass layers per screen (GPU load)
- NEVER animate backdrop-filter
- Always add `-webkit-backdrop-filter` for Safari

**Sticky Notes (стикеры):**
- 3 цвета: красный (#ffd0cc), жёлтый (#fff3b0), зелёный (#d4f0d4)
- Paper texture effect (subtle CSS noise/grain)
- Slight rotation (1--3deg random) when placed on calendar
- Shadow on drag
- Rounded corners, handwritten-feel spacing

**Calendar Grid:**
- Monthly view, grid layout
- Dates show small colored dots for placed stickers
- Current day highlighted
- Swipe between months

**Tree Graph:**
- SVG-based interactive component
- Two main branches from trunk
- Nodes pulse gently on idle
- Branch sway animation (CSS or GSAP)
- Click/tap on branch navigates to section

**Палитра:**
- Primary: indigo (actions, links, primary buttons)
- Лаванда (#c4b5e0), персик (#f8c9a0), мята (#a8dfc8), роза (#f0b8c0)
- Стикеры: красный (#ffd0cc), жёлтый (#fff3b0), зелёный (#d4f0d4)
- Тёмная тема -- тёплая, глубокая (не холодная)
- Фон -- градиент: `linear-gradient(145deg, cream -> lavender-tint -> mint-tint)`

**Типографика:**
- Inter -- primary, system-ui fallback
- Заголовки: крупные (2--2.5rem), weight 700, letter-spacing -0.03em
- Home greeting: 2.5--3rem, weight 800
- Labels: uppercase, 0.8rem, letter-spacing 0.06em, muted color
- Body: 0.9rem, line-height 1.65

**Компоненты (паттерны):**
- Cards: `.glass-card` / `.glass-card-elevated` (global classes in `main.css`)
- Pill buttons: `border-radius: var(--radius-full)`
- Icons: lucide-vue-next, `stroke-width: 1.8`, size 18--22
- All radius via CSS variables (`--radius-sm` .. `--radius-full`)

**Ссылки на дизайн-ресурсы:**
- Glassmorphism: https://ui.glass/generator
- Mental health app UX: https://gapsystudio.com/blog/mental-health-app-design/

### Formatting & Linting

- Prettier: no semicolons, single quotes, 100 chars
- Before commit: `npm run lint && npm run format`

### Язык

- Code, comments, commits: **English**
- UI text, documentation: **Russian**

### AI-интеграция

- Tone: warm, between a good friend and a zen monk
- Response format: short paragraph + one specific action
- Context: current emotions + tasks + notes + history 7 days
- Chat interface for assistant (not just cards)
- Use mocks during development

## Команды

```bash
# Frontend
npm run dev       # Dev server
npm run build     # Build
npm run preview   # Preview build
npm run lint      # Linting (oxlint + eslint --fix)
npm run format    # Prettier formatting

# Backend
cd /home/mike/projects/diary-of-feelings-backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```
