# Архитектура приложения — Diary of Feelings

> Актуально для версии 2.0 (2026-03)

---

## Структура проекта (frontend)

```
src/
├── main.js
├── App.vue                         # Корневой компонент: splash → layout + router-view
│
├── api/                            # API-слой
│   ├── client.js                   # ApiError, api.get/post/patch/delete, 401/429/5xx handling, GET дедупликация
│   ├── emotions.js                 # Дневник эмоций: create (маппинг camelCase→snake_case), getByDate, getHistory, getStats
│   ├── cbt.js                      # КПТ (СМЭР): create, update, list, delete
│   ├── tasks.js                    # Задачи: CRUD, toggle done, getByDate
│   ├── notes.js                    # Заметки: CRUD, search
│   ├── assistant.js                # AI-чат: sendMessage
│   ├── recommendations.js          # Рекомендации: getTodayRecommendations, markRead, markOpened, markHelpful, getPortrait
│   ├── auth.js                     # Аутентификация: login, register, logout
│   └── mock/                       # Мок-данные (localStorage)
│       ├── emotions.mock.js
│       ├── cbt.mock.js
│       ├── tasks.mock.js
│       └── notes.mock.js
│
├── assets/
│   ├── main.css                    # Глобальные стили: .glass-card, .glass-card-elevated, импорт Tailwind
│   └── theme.css                   # CSS-переменные: палитра, шрифты, радиусы, тени (light + .dark)
│
├── components/
│   ├── layout/
│   │   ├── AppHeader.vue           # Шапка: кнопка "домой", аватар/профиль
│   │   └── AppBottomNav.vue        # Единая 5-табовая навигация [Задачи|Эмоции|🏠|Помощник|Отчёт]
│   │
│   ├── home/
│   │   ├── SplashScreen.vue        # Волновая SVG-анимация при запуске
│   │   ├── TreeGraph.vue           # Интерактивный SVG-граф с двумя ветками
│   │   ├── RecommendationsWidget.vue  # 3 статьи дня (утро/день/вечер) с match score и фидбеком
│   │   └── PortraitBadge.vue       # Стресс / тренд настроения / продуктивность / топ искажение
│   │
│   ├── tasks/
│   │   ├── CalendarGrid.vue        # Месячный грид, свайп по месяцам, today-кнопка
│   │   ├── StickyNote.vue          # Стикер на дате (3 цвета, наклон, completed/priority)
│   │   ├── StickyNoteEditor.vue    # Редактор стикера (модал)
│   │   └── DateTasksPanel.vue      # Список задач для выбранной даты с checkbox
│   │
│   ├── notes/
│   │   ├── NoteCard.vue            # Карточка заметки (2-строчный превью, относительная дата, pin/color)
│   │   └── NoteEditor.vue          # Редактор с автосохранением (debounce 1.5s)
│   │
│   ├── library/
│   │   ├── DocumentCard.vue
│   │   └── DocumentViewer.vue
│   │
│   ├── emotions/
│   │   ├── EmotionWheel.vue        # Двухуровневое колесо выбора эмоции
│   │   ├── EmotionEntryForm.vue    # Форма записи (intensity + note + time capsule)
│   │   ├── EmotionHistory.vue      # Timeline-лента с фильтрами и стриком
│   │   └── EmotionChart.vue        # Недельный мини-граф (7 цветных точек)
│   │
│   ├── cbt/
│   │   ├── CbtBoard.vue            # Kanban board (Новая / В работе / Проработана)
│   │   ├── CbtCard.vue             # Карточка СМЭР (прогресс-бар, тег искажения, stale highlight)
│   │   ├── CbtEmotionPicker.vue
│   │   └── CbtDistortionPicker.vue # Визуальная сетка когнитивных искажений
│   │
│   ├── assistant/
│   │   ├── ChatBubble.vue
│   │   ├── ChatInput.vue
│   │   └── ChatHistory.vue
│   │
│   ├── report/
│   │   ├── ReportEmotionBars.vue   # Горизонтальные CSS-бары топ эмоций
│   │   ├── ReportHeatmap.vue       # Тепловая карта (7-колоночная сетка)
│   │   ├── ReportInsights.vue      # 3 AI-инсайта на основе данных
│   │   └── ReportEmptyState.vue
│   │
│   └── onboarding/
│       ├── OnboardingStep.vue
│       ├── TopicSelector.vue
│       └── OptionSelector.vue
│
├── composables/
│   ├── useTheme.js                 # Dark theme: system pref + localStorage
│   ├── useOfflineStatus.js         # online/offline detection
│   └── useChartColors.js           # Цвета графиков из CSS-переменных
│
├── router/index.js                 # Все маршруты (lazy-load)
│
├── stores/                         # Pinia (composition syntax)
│   ├── emotions.js
│   ├── cbt.js
│   ├── tasks.js
│   ├── notes.js
│   ├── assistant.js                # messages (cap 100), streaming typewriter
│   ├── recommendations.js          # daily recs + portrait + markHelpful/markOpened
│   └── user.js
│
└── views/
    ├── SplashView.vue
    ├── HomeView.vue                # Tree graph + RecommendationsWidget + PortraitBadge
    ├── TasksView.vue               # Объединённый вид: Tasks/Notes/Library через ?tab=
    ├── EmotionsView.vue            # Дневник эмоций + КПТ kanban (секционные вкладки)
    ├── AssistantView.vue
    ├── ReportView.vue
    ├── ProfileView.vue
    └── OnboardingView.vue
```

---

## Маршруты

| Путь | Имя | View | Описание |
|------|-----|------|----------|
| `/` | `home` | HomeView | Splash → Tree graph + рекомендации |
| `/tasks` | `tasks` | TasksView | Задачи (`?tab=tasks\|notes\|library`) |
| `/tasks?tab=notes` | — | TasksView | Заметки (вкладка внутри TasksView) |
| `/tasks?tab=library` | — | TasksView | Библиотека (вкладка внутри TasksView) |
| `/notes` | — | redirect | → `/tasks?tab=notes` |
| `/library` | — | redirect | → `/tasks?tab=library` |
| `/emotions` | `emotions` | EmotionsView | Дневник эмоций + КПТ |
| `/assistant` | `assistant` | AssistantView | AI-чат |
| `/report` | `report` | ReportView | Аналитика |
| `/profile` | `profile` | ProfileView | Профиль и настройки |
| `/onboarding` | `onboarding` | OnboardingView | Первый вход |
| `/auth` | `auth` | AuthView | Вход / регистрация |

**Навигация:** AppBottomNav с 5 вкладками — [Задачи | Эмоции | 🏠 (elevated circle) | Помощник | Отчёт]. Нет сайдбара.

**Свайп в TasksView:** CSS slide-переходы (`slide-left` / `slide-right`) + touch swipe (порог 50px). Состояние вкладки в `route.query.tab`. `router.replace()` без push (не засоряет history).

---

## Stores (Pinia composition syntax)

Все stores — `defineStore('name', () => { ... })`. Только composition API.

### `emotions.js`
```
State:   todayEntries[], history[], patterns, isLoading
Actions: createEntry, loadToday, loadHistory, loadPatterns, removeEntry
Getters: hasEntryToday, recentEmotions
```

### `tasks.js`
```
State:   tasks[], byDate{}, isLoading
Actions: createTask, updateTask, deleteTask, toggleDone, loadByDate, loadAll
```

### `notes.js`
```
State:   notes[], isLoading, searchQuery
Actions: createNote, updateNote, deleteNote, loadNotes
Getters: filteredNotes, pinnedNotes
```

### `cbt.js`
```
State:   entries[], isLoading
Actions: createEntry, updateEntry, deleteEntry, loadEntries
Getters: byStatus
```

### `assistant.js`
```
State:   messages[] (cap MAX_MESSAGES=100), isLoading, conversationId
Actions: sendMessage
Важно:   typewriter-стриминг через messages.value[messages.value.length - 1]
         (reactive proxy после push, не исходный plain object)
```

### `recommendations.js`
```
State:   recommendations[], portrait, loading
Actions: fetchToday, fetchPortrait, markRead, markOpened, markHelpful
         (все мутации — optimistic update с rollback при ошибке)
```

---

## API-клиент (`src/api/client.js`)

```
api.get(url)              — с GET-дедупликацией (_inflight Map)
api.post/patch/delete()   — стандартные

Обработка ошибок:
  401 → clearToken() + redirect('/auth')
  429 → ApiError("Слишком много запросов, подождите немного")
  5xx → ApiError("Произошла ошибка на сервере. Попробуйте позже")
```

**Маппинг полей в `api/emotions.js`:** фронтенд camelCase → бэкенд snake_case в `create()`:
```js
{ emotion_name, emotion_category, intensity, note, is_time_capsule }
```

---

## Темизация

CSS-переменные в `src/assets/theme.css`. Тёмная тема — класс `.dark` на `<html>`. Инициализация в `useTheme.js` (system pref + localStorage).

```css
:root {
  --color-bg:              #FFF8F0;   /* кремовый */
  --color-surface:         #FFFFFF;
  --color-primary:         #6366f1;   /* indigo */
  --color-accent-lavender: #c4b5e0;
  --color-accent-peach:    #f8c9a0;
  --color-accent-mint:     #a8dfc8;
  --color-accent-rose:     #f0b8c0;
}
.dark {
  --color-bg:      #1C1714;           /* тёплый тёмный */
  --color-surface: #2A2219;
}
```

Glassmorphism: `backdrop-filter: blur(20–24px)` + полупрозрачный фон. Не анимировать `backdrop-filter`. Классы `.glass-card` / `.glass-card-elevated` — глобальные в `main.css`.

---

## Backend (`diary-of-feelings-backend/`)

```
app/
├── main.py              # FastAPI, CORS (ограниченный), middleware, routers
├── config.py            # pydantic-settings, anthropic_model = 'claude-haiku-4-5-20251001'
├── database.py          # SQLAlchemy async engine (pool_size=20, max_overflow=10, pool_recycle=1800)
├── models/
│   ├── user.py
│   ├── emotion_entry.py
│   ├── cbt_entry.py
│   ├── task.py
│   ├── note.py
│   ├── chat_message.py
│   ├── portrait.py       # UserPortrait
│   ├── article.py        # Article (60 статей)
│   ├── recommendation.py # DailyRecommendation (3/день: morning/afternoon/evening)
│   └── preference.py     # UserPreference (liked/disliked categories + tones)
├── schemas/              # Pydantic v2 (max_length на всех полях)
├── routers/
│   ├── auth.py           # rate limited: login 10/min, register 5/5min
│   ├── emotions.py       # + _rebuild_portrait_bg после каждой мутации
│   ├── tasks.py          # + _rebuild_portrait_bg
│   ├── cbt.py            # + _rebuild_portrait_bg
│   ├── notes.py
│   ├── assistant.py
│   ├── reports.py
│   └── recommendations.py  # today, portrait, read, helpful, opened
├── services/
│   ├── chat.py           # Claude API + SYSTEM_PROMPT + mock fallback
│   ├── context_builder.py  # Redis cache 2min, portrait summary в начале контекста
│   ├── portrait.py       # build_portrait (exponential decay, note analysis, stress=median)
│   └── recommendations.py  # Многофакторный скоринг + diversity constraint + stress gate
├── middleware/
│   ├── logging.py        # Request timing
│   ├── security.py       # SecurityHeadersMiddleware (HSTS, CSP, XFO, XSS)
│   └── rate_limit.py     # Redis sliding window
└── data/
    └── articles_seed.py  # 60 статей по 8 категориям с tone/for_high_stress/slot_preference

migrations/versions/
  76d0d9e73b41  initial
  a1b2c3d4e5f6  task completed + priority
  b2c3d4e5f6a7  note pinned + color
  c3d4e5f6a7b8  performance indexes
  d4e5f6a7b8c9  portrait + articles + recommendations
  e5f6a7b8c9d0  rag pipeline v2 (user_preferences, article enrichment, recommendation enrichment)
```

---

## RAG-система рекомендаций

### Эмоциональный портрет (`UserPortrait`)

Перестраивается fire-and-forget через `asyncio.create_task()` после каждой мутации эмоций/задач/КПТ.

| Поле | Описание |
|------|----------|
| `dominant_emotion` / `dominant_category` | Топ за 30 дней с exponential decay (half-life 14 дней) |
| `mood_trend` | `improving` / `stable` / `declining` (rolling 3-day avg) |
| `stress_level` | Медиана интенсивности негативных эмоций за 7 дней |
| `productivity_rate` | completed/total tasks за 30 дней |
| `top_distortions` | `{distortion: count}` — частота КПТ-искажений |
| `active_themes` | Топ-5 тем из ситуаций КПТ + текстов заметок |
| `data_quality` | 0–1 (новый пользователь → 0, 30+ записей → 1) |

### Скоринг статей

```
score = tag_overlap     × 0.40   # пересечение тегов портрета и статьи
      + stress/tone     × 0.30   # stress≥7 → for_high_stress бонус; иначе tone-match по trend
      + slot_match      × 0.10   # совпадение slot_preference статьи
      + user_feedback   × 0.15   # UserPreference liked/disliked categories+tones
      + popularity      × 0.05   # popularity_score (0–1)
```

**Stress gate:** `stress_level ≥ 7` → статьи без `for_high_stress` получают штраф **−0.50**.

**Diversity:** не более 1 статьи из одной категории в день.

**Feedback loop:** `PATCH /{id}/helpful` → обновляет `UserPreference` → учитывается в завтрашнем скоринге.

---

## Безопасность

| Механизм | Описание |
|----------|----------|
| DB pool | `pool_size=20`, `max_overflow=10` |
| Rate limiting | Redis sliding window: login 10/min, register 5/5min per IP |
| Security headers | HSTS, CSP, X-Frame-Options, X-XSS-Protection, Referrer-Policy |
| Redis context cache | AI-контекст 2 мин TTL, инвалидируется при мутациях |
| DB indexes | Составные по `user_id+date`, `user_id+status` для всех таблиц |
| Input validation | `max_length` на всех Pydantic полях |
| Error sanitization | 500-ошибки не возвращают стектрейс клиенту |
| CSP | `<meta>` тег на фронтенде + заголовок от бэкенда |
