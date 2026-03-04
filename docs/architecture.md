# Архитектура приложения

## Структура проекта (целевая)

```
src/
├── main.js                          # Точка входа
├── App.vue                          # Корневой компонент (layout + router-view)
│
├── api/                             # API-слой
│   ├── client.js                    # ApiError, request() с эмуляцией задержки
│   ├── articles.js                  # Статьи: getDailySet, getById, markAsRead
│   ├── emotions.js                  # Дневник эмоций: create, getByDate, getRange
│   ├── cbt.js                       # КПТ-дневник (СМЭР): create, update, list
│   ├── tasks.js                     # Задачи: CRUD, toggleDone, getByDate
│   ├── timeTracker.js               # Трекер времени: logEntry, getSummary
│   ├── notes.js                     # Заметки: CRUD, search by tag
│   ├── library.js                   # Библиотека: save, remove, list by type
│   ├── ai.js                        # AI-ассистент: getAdvice, getPatterns, getCbtHelp
│   ├── user.js                      # Профиль: getProfile, updateProfile, onboarding
│   └── mock/                        # Мок-данные
│       ├── articles.mock.js
│       ├── emotions.mock.js
│       ├── cbt.mock.js
│       ├── tasks.mock.js
│       ├── timeTracker.mock.js
│       ├── notes.mock.js
│       ├── library.mock.js
│       ├── ai.mock.js
│       └── user.mock.js
│
├── assets/
│   ├── main.css                     # Глобальные стили, импорт Tailwind
│   └── theme.css                    # CSS-переменные: палитра, шрифты, тени
│
├── components/
│   ├── layout/                      # Каркас приложения
│   │   ├── AppSidebar.vue           # Боковое меню навигации
│   │   ├── AppHeader.vue            # Шапка: заголовок, тема, стрик
│   │   └── AppBottomNav.vue         # Мобильная нижняя навигация
│   │
│   ├── emotions/                    # Дневник эмоций
│   │   ├── EmotionWheel.vue         # Колесо выбора эмоций
│   │   ├── EmotionEntry.vue         # Карточка одной записи
│   │   ├── EmotionIntensity.vue     # Слайдер интенсивности 0–10
│   │   └── EmotionCalendar.vue      # Календарь-тепловая карта
│   │
│   ├── cbt/                         # КПТ-дневник (СМЭР)
│   │   ├── CbtEntryForm.vue         # Форма записи (базовый/продвинутый режим)
│   │   ├── CbtEntryCard.vue         # Карточка записи в списке
│   │   ├── CbtDistortionPicker.vue  # Выбор когнитивного искажения
│   │   └── CbtChallenge.vue         # Блок оспаривания мысли
│   │
│   ├── articles/                    # Статьи
│   │   ├── ArticleCard.vue          # Превью статьи в ленте
│   │   ├── ArticleReader.vue        # Полноэкранный ридер с прогресс-баром
│   │   └── ThoughtOfDay.vue         # «Мысль дня» после прочтения
│   │
│   ├── tasks/                       # Трекер задач
│   │   ├── TaskItem.vue             # Одна задача с чекбоксом
│   │   ├── TaskList.vue             # Список задач по категории
│   │   └── TaskIntention.vue        # Поле «зачем это важно»
│   │
│   ├── time/                        # Трекер времени
│   │   ├── TimeLogForm.vue          # Форма записи времени
│   │   └── TimeWeekChart.vue        # Недельный график (ECharts)
│   │
│   ├── notes/                       # Заметки
│   │   ├── NoteCard.vue             # Карточка заметки
│   │   └── NoteEditor.vue           # Редактор (тег + текст)
│   │
│   ├── ai/                          # AI-ассистент
│   │   ├── AiAdviceCard.vue         # Карточка совета
│   │   └── AiPatternCard.vue        # Карточка обнаруженного паттерна
│   │
│   ├── library/                     # Библиотека
│   │   └── LibraryItem.vue          # Единица сохранённого контента
│   │
│   └── ui/                          # Общие UI-компоненты (shadcn-vue + кастомные)
│       ├── BaseModal.vue            # Модальное окно
│       ├── BaseCard.vue             # Универсальная карточка
│       ├── StreakBadge.vue          # Индикатор стрика
│       └── TimeCapsuleBanner.vue    # Баннер тайм-капсулы
│
├── composables/
│   ├── useTheme.js                  # Переключение light/dark
│   ├── useChartColors.js            # Цвета графиков из CSS-переменных
│   ├── useStreak.js                 # Подсчёт и отображение стрика
│   ├── useTimeCapsule.js            # Логика тайм-капсул (30 дней)
│   ├── useOnboarding.js             # Состояние онбординга
│   └── useNotification.js           # Web Push API обёртка
│
├── router/
│   └── index.js                     # Все маршруты (lazy-load)
│
├── stores/
│   ├── articles.js                  # Ежедневный сет, прочитанные, прогресс
│   ├── emotions.js                  # Записи, текущая эмоция, история
│   ├── cbt.js                       # СМЭР-записи, режим (базовый/продвинутый)
│   ├── tasks.js                     # Задачи по категориям, статусы
│   ├── timeTracker.js               # Записи времени, сводка
│   ├── notes.js                     # Заметки, теги, поиск
│   ├── library.js                   # Избранное по типам
│   ├── ai.js                        # Советы, паттерны, контекст
│   └── user.js                      # Профиль, настройки, онбординг
│
└── views/
    ├── HomeView.vue                 # Главная: сет статей + эмоция дня + совет AI
    ├── ArticleView.vue              # Чтение одной статьи
    ├── EmotionsView.vue             # Дневник эмоций: запись + история + календарь
    ├── CbtView.vue                  # КПТ-дневник: список записей + новая запись
    ├── CbtEntryView.vue             # Одна СМЭР-запись (просмотр/редактирование)
    ├── TasksView.vue                # Трекер задач
    ├── TimeTrackerView.vue          # Трекер времени
    ├── NotesView.vue                # Заметки и идеи
    ├── LibraryView.vue              # Личная библиотека
    ├── ProfileView.vue              # Профиль и настройки
    ├── OnboardingView.vue           # Онбординг (5–7 вопросов)
    └── ReportView.vue               # Месячный отчёт
```

---

## Маршруты

| Путь | Имя | View | Описание |
|------|-----|------|----------|
| `/` | `home` | HomeView | Главная (дашборд дня) |
| `/article/:id` | `article` | ArticleView | Чтение статьи |
| `/emotions` | `emotions` | EmotionsView | Дневник эмоций |
| `/cbt` | `cbt` | CbtView | КПТ-дневник (список) |
| `/cbt/:id` | `cbt-entry` | CbtEntryView | Одна СМЭР-запись |
| `/tasks` | `tasks` | TasksView | Трекер задач |
| `/time` | `time-tracker` | TimeTrackerView | Трекер времени |
| `/notes` | `notes` | NotesView | Заметки и идеи |
| `/library` | `library` | LibraryView | Личная библиотека |
| `/profile` | `profile` | ProfileView | Профиль и настройки |
| `/onboarding` | `onboarding` | OnboardingView | Первый вход |
| `/report` | `report` | ReportView | Месячный отчёт |

Все view загружаются через lazy-load. Онбординг — navigation guard: если профиль не заполнен → redirect на `/onboarding`.

---

## Stores (Pinia)

### `user.js`
```
State: profile, settings, isOnboarded, theme
Actions: fetchProfile, updateProfile, completeOnboarding, toggleTheme
```

### `articles.js`
```
State: dailySet (3 статьи), currentArticle, readArticles, readingProgress
Actions: fetchDailySet, fetchArticle, markAsRead, updateProgress
Getters: todayProgress, unreadCount
```

### `emotions.js`
```
State: entries, todayEntry, weekHistory
Actions: createEntry, fetchByDate, fetchRange
Getters: todayEmotion, weekPattern, monthHeatmap
```

### `cbt.js`
```
State: entries, currentEntry, mode (basic/advanced)
Actions: createEntry, updateEntry, deleteEntry, fetchEntries
Getters: recentEntries, distortionStats
```

### `tasks.js`
```
State: tasks, categories (work/personal/health/growth)
Actions: createTask, toggleDone, deleteTask, fetchByDate
Getters: todayTasks, completionRate, overdueCount
```

### `timeTracker.js`
```
State: entries, weekSummary, categories
Actions: logEntry, fetchSummary
Getters: todayTotal, weekByCategory
```

### `notes.js`
```
State: notes, tags, searchQuery
Actions: createNote, updateNote, deleteNote, searchByTag
Getters: filteredNotes, recentNotes
```

### `library.js`
```
State: items, filterType (article/advice/entry/note)
Actions: saveItem, removeItem, fetchItems
Getters: byType, recentSaved
```

### `ai.js`
```
State: todayAdvice, patterns, isLoading
Actions: fetchAdvice, fetchPatterns, getCbtHelp
Getters: hasAdvice
```

---

## API-клиент (`src/api/client.js`)

```js
// ApiError с кодом и сообщением
// request(handler, { delay, timeout }) — обёртка:
//   1. Эмулирует задержку сети (delay, по умолчанию 300–800ms)
//   2. Оборачивает в Promise с таймаутом
//   3. Вызывает handler (мок-функцию)
//   4. При ошибке — выбрасывает ApiError
```

Все API-обёртки (`src/api/*.js`) вызывают `request()` с соответствующим моком. При подключении бэкенда — заменяем handler на fetch/axios, интерфейс остаётся прежним.

---

## Модель данных

### EmotionEntry
```
id, date, emotion (string), intensity (0–10),
note (string), isTimeCapsule (bool), tags[]
```

### CbtEntry
```
id, date, situation, thoughts[], emotions[{ name, intensity }],
reaction, distortion (string|null), challenge (string|null),
alternativeThought (string|null), emotionsAfter[{ name, intensity }],
mode (basic|advanced)
```

### Article
```
id, date, position (1|2|3), title, content, readingTime,
thoughtOfDay, isRead, readingProgress (0–100)
```

### Task
```
id, date, title, category (work|personal|health|growth),
intention (string|null), isDone, createdAt
```

### TimeEntry
```
id, date, category, duration (minutes), note
```

### Note
```
id, title, content, tag (idea|plan|quote|question),
createdAt, remindAt (date|null)
```

### LibraryItem
```
id, type (article|advice|emotion|note), refId, title,
preview, savedAt
```

### UserProfile
```
id, name, challenges[], goals[], chronotype (morning|evening),
topics[], feedbackStyle, theme (light|dark), notificationTime,
isOnboarded, createdAt
```

---

## Навигация

**Desktop** — боковой сайдбар (AppSidebar):
- Главная (дом)
- Дневник эмоций (сердце)
- КПТ-дневник (мозг)
- Задачи (чекбокс)
- Заметки (карандаш)
- Библиотека (книга)
- ---
- Трекер времени (часы)
- Отчёт (график)
- ---
- Профиль (аватар)

**Mobile** — нижняя панель (AppBottomNav), 5 основных:
- Главная, Эмоции, КПТ, Задачи, Ещё (→ остальные)

---

## Темизация

```css
/* theme.css — CSS-переменные */
:root {
  --color-bg:         #FFF8F0;     /* кремовый */
  --color-surface:    #FFFFFF;
  --color-primary:    #C4B5E0;     /* лаванда */
  --color-secondary:  #FFDAB9;     /* персик */
  --color-accent:     #B5E8D5;     /* мятный */
  --color-text:       #2D2D2D;
  --color-text-muted: #8E8E93;
  --color-border:     #F0E6D8;
  --font-main:        'Inter', sans-serif;
  --font-mono:        'JetBrains Mono', monospace;
  /* + radius, shadow, spacing tokens */
}

.dark {
  --color-bg:         #1C1714;     /* тёплый тёмный */
  --color-surface:    #2A2219;
  --color-primary:    #D4C5F0;
  --color-secondary:  #FFE4C9;
  --color-accent:     #C5F8E5;
  --color-text:       #F5F0EB;
  --color-text-muted: #A09890;
  --color-border:     #3D3530;
}
```
