# Дорожная карта разработки — Diary of Feelings

> Актуальное состояние на 2026-03-05

---

## Реализованные модули

### Фаза 0 — Фундамент

| Компонент | Статус | Файлы |
|-----------|--------|-------|
| Темизация и глобальные стили | Done | `theme.css`, `main.css` (light + dark, CSS variables) |
| API-клиент | Done | `api/client.js` (ApiError, request(), delay, timeout) |
| Layout и навигация | Done | `AppNavbar.vue` (pill, desktop), `AppHeader.vue` (mobile), `AppBottomNav.vue` (mobile bottom), `MoreView.vue` (overflow nav) |
| Роутер | Done | `router/index.js` (lazy-load, onboarding guard) |
| Store пользователя | Done | `stores/user.js`, `api/user.js`, `api/mock/user.mock.js` |
| Composables | Done | `useTheme.js`, `useChartColors.js`, `useEmotionWheel.js` |

### Фаза 2 — Дневник эмоций

| Компонент | Статус | Файлы |
|-----------|--------|-------|
| Store и API эмоций | Done | `stores/emotions.js`, `api/emotions.js`, `api/mock/emotions.mock.js` |
| Колесо эмоций | Done | `EmotionWheel.vue`, `useEmotionWheel.js`, `emotions-wheel.js` data |
| Запись эмоции | Done | `EmotionEntryForm.vue` (intensity slider, note, time capsule) |
| История и визуализация | Done | `EmotionHistory.vue`, `EmotionChart.vue` (ECharts line chart) |
| EmotionsView | Done | Loading skeleton, error state, patterns, chart, history |

### Фаза 3 — КПТ-дневник (СМЭР)

| Компонент | Статус | Файлы |
|-----------|--------|-------|
| Store и API | Done | `stores/cbt.js`, `api/cbt.js`, `api/mock/cbt.js`, `data/distortions.js` |
| CbtView (список) | Done | Stats, filters (time + distortion), skeleton loading, error/empty states, TransitionGroup |
| CbtEntryView (форма) | Done | Full SMEAR form, basic + advanced mode, progress bar, mount animation |
| CbtEntryCard | Done | Glass card with orb, date, situation preview, emotion/distortion badges |
| CbtStatCard | Done | Glass card with metric value, label, trend icon |
| CbtProgressBar | Done | 4-step progress (S-M-E-R) with check icons |
| CbtEmotionPicker | Done | Multi-emotion picker with search, intensity sliders, transitions |
| CbtDistortionPicker | Done | Grid picker with icons, descriptions, selection states |

### Фаза 7 — Онбординг и профиль

| Компонент | Статус | Файлы |
|-----------|--------|-------|
| Онбординг | Done | `OnboardingView.vue`, 6-step flow (name, difficulties, goals, day type, topics, feedback style) |
| Компоненты онбординга | Done | `OnboardingStep.vue`, `OnboardingProgress.vue`, `TopicSelector.vue`, `OptionSelector.vue` |
| Профиль и настройки | Done | `ProfileView.vue` (name, theme, notifications, CBT mode, sound, data reset) |

### Главная страница

| Компонент | Статус | Примечание |
|-----------|--------|------------|
| HomeView | Done (partial) | Hero + quick emotions + article stubs (static) + AI advice placeholder |
| App.vue shell | Done | 3 decorative orbs, navbar + header + bottom nav + main area |

---

## Заглушки (только заголовок, без функциональности)

| View | Маршрут | Следующий приоритет |
|------|---------|---------------------|
| ArticleView | `/article/:id` | High -- Daily Articles |
| TasksView | `/tasks` | Medium |
| NotesView | `/notes` | Medium |
| LibraryView | `/library` | Medium-Low |
| TimeTrackerView | `/time` | Low |
| ReportView | `/report` | Low (depends on data) |

---

## Запланировано -- Приоритет 1

### Ежедневные статьи (Фаза 1)

Центральная контент-фича. HomeView уже показывает 3 карточки-заглушки, нужна реальная реализация.

**Что нужно:**
- Store и API: `stores/articles.js`, `api/articles.js`, `api/mock/articles.mock.js`
- Mock: генерация 3 статей с тонами (разогрев / глубина / рефлексия)
- `ArticleView.vue` -- полноэкранный ридер с прогресс-баром чтения
- Компоненты: `ArticleCard.vue`, `ArticleReader.vue`, `ThoughtOfDay.vue`
- Кнопка "Сохранить в библиотеку"
- Привязка карточек на HomeView к реальным данным

**Зависимости:** нет (самостоятельный модуль)

### AI-ассистент (Фаза 5)

Тёплые советы на основе данных пользователя. HomeView уже содержит placeholder.

**Что нужно:**
- Store и API: `stores/ai.js`, `api/ai.js`, `api/mock/ai.mock.js`
- Mock: шаблоны советов по эмоциям, паттерны по дням недели
- `AiAdviceCard.vue` -- карточка совета на главной
- `AiPatternCard.vue` -- обнаруженная закономерность
- Интеграция в КПТ-дневник: кнопка "Помощь AI" для подсказки искажения и оспаривания

**Зависимости:** Emotion Diary (done), CBT (done), Articles (in progress)

---

## Запланировано -- Приоритет 2

### Заметки и идеи (Фаза 6.2)

Quick capture с тегами. Простой модуль, не требует сложного дизайна.

**Что нужно:**
- Store и API: `stores/notes.js`, `api/notes.js`, `api/mock/notes.mock.js`
- `NotesView.vue` -- лента заметок, инлайн-создание, фильтр по тегам
- `NoteCard.vue`, `NoteEditor.vue`
- Теги: идея, план, цитата, вопрос себе

### Трекер задач (Фаза 4)

Контекстный планировщик с намерениями.

**Что нужно:**
- Store и API: `stores/tasks.js`, `api/tasks.js`, `api/mock/tasks.mock.js`
- `TasksView.vue` -- список по категориям
- `TaskItem.vue`, `TaskList.vue`, `TaskIntention.vue`
- Категории: работа / личное / здоровье / развитие
- Дайджест на главной

### Личная библиотека (Фаза 6.3)

Агрегация сохранённого контента.

**Что нужно:**
- Store и API: `stores/library.js`, `api/library.js`, `api/mock/library.mock.js`
- `LibraryView.vue` -- всё сохранённое по типам
- Фильтрация: статьи / советы AI / записи / заметки

**Зависимости:** Articles, AI, Notes (хотя бы частично)

---

## Запланировано -- Приоритет 3

### Трекер времени (Фаза 6.1)

Лёгкий инструмент для осознанности, не для продуктивности.

**Что нужно:**
- Store и API: `stores/timeTracker.js`, `api/timeTracker.js`, `api/mock/timeTracker.mock.js`
- `TimeTrackerView.vue` -- форма + недельный график
- `TimeLogForm.vue`, `TimeWeekChart.vue` (ECharts)

### Стрики (Фаза 8.1)

Мягкие, без давления. "Рады, что вернулся" вместо "ты сломал серию".

**Что нужно:**
- `useStreak.js` composable
- `StreakBadge.vue` -- мягкий индикатор в хедере

### Уведомления (Фаза 8.2)

Одно в день, как письмо.

**Что нужно:**
- `useNotification.js` -- Web Push API
- Тон: "Твои статьи на сегодня готовы. Хорошего утра."

### Месячный отчёт (Фаза 8.3)

Рефлексивная сводка.

**Что нужно:**
- `ReportView.vue` -- графики, паттерны AI, динамика эмоций
- Зависит от накопленных данных всех модулей

---

## Идеи / Долгосрочно

| Идея | Описание |
|------|----------|
| PWA + оффлайн | Workbox service worker, кеширование, оффлайн-запись, синхронизация |
| Тайм-капсулы | Баннер "У тебя есть послание из прошлого" (useTimeCapsule composable) |
| Page transitions | Анимации при переходах между страницами |
| Сезонные акценты | Адаптация палитры под время года |
| shadcn-vue | Интеграция UI-библиотеки (в стеке, но ещё не подключена) |
| Бэкенд | Реальный API вместо localStorage моков |
| Адаптивное тестирование | 320-428px (mobile), 768-1024px (tablet), 1200px+ (desktop) |
| Lighthouse 90+ | Оптимизация бандла, code splitting, производительность |

---

## Архитектурные паттерны (установлены)

| Паттерн | Описание |
|---------|----------|
| API Layer | `api/xxx.js` wraps `api/mock/xxx.mock.js` via `request()` |
| Mock Storage | localStorage with STORAGE_KEY constant |
| Pinia Store | Composition syntax, async actions wrapping API calls |
| Composables | `useXxx.js` -> `export function useXxx()` returning refs/computed |
| Theme | Singleton isDark ref, shared across instances |
| Emotion Wheel | Two-level drill-down, data in emotions-wheel.js |
| Glass Cards | `.glass-card` / `.glass-card-elevated` global classes in main.css |
| Design Tokens | CSS variables in theme.css, no hardcoded colors |
| CBT Form | Progressive disclosure: basic SMER -> advanced with distortions/challenging |

---

## Дизайн-аудит (завершён 2026-03-05)

Исправлены:
- Missing `-webkit-backdrop-filter` в AppHeader
- Hardcoded `white` / `#fff` заменены на `var(--color-surface-solid)` (ProfileView, EmotionEntryForm, EmotionChart, OnboardingView)
- EmotionsView: добавлены loading skeleton + error state
- EmotionHistory: warm empty state с декоративным орбом
- MoreView: glassmorphism + hover lift на ссылках, исправлен вес заголовка
- AppBottomNav: добавлен hover state для неактивных элементов
- EmotionHistory: исправлен dead CSS (transition без hover), добавлен hover lift
- HomeView: article cards получили glass effect + hover shadow
- HomeView: убрано дублирование glassmorphism в `.card`, AI-секция получила `glass-card-elevated`
- useChartColors: добавлен `surfaceSolid` ref
- Все stub views: consistent page-title pattern (1.75rem, 700, -0.03em)
