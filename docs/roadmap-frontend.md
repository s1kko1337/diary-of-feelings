# Frontend Roadmap -- Diary of Feelings

> Версия 2.0, 2026-03-07

---

## Phase 0: Foundation (Аудит и подготовка)

**Цель:** Определить, что переиспользуется из v1, что удаляется, что переделывается.

### Переиспользуется (без изменений)
| Компонент | Файлы |
|-----------|-------|
| API client | `api/client.js` (ApiError, request()) |
| Theme system | `theme.css`, `useTheme.js` |
| Emotion wheel data | `api/mock/data/emotions-wheel.js` |
| Distortions data | `api/mock/data/distortions.js` |
| Chart colors | `useChartColors.js` |
| Global styles | `main.css` (glass-card classes) |
| Linting config | ESLint, oxlint, Prettier |

### Переиспользуется с адаптацией
| Компонент | Что менять |
|-----------|-----------|
| `App.vue` | Убрать pill-navbar, добавить splash -> main layout routing |
| `router/index.js` | Новая структура маршрутов (splash, home, tasks/*, emotions/*) |
| `AppHeader.vue` | Упростить: логотип + кнопка домой + аватар |
| `AppBottomNav.vue` | Сделать контекстным (Tasks nav vs Emotions nav) |
| `stores/user.js` | Добавить текущий раздел (tasks/emotions) |
| `stores/emotions.js` | Без изменений API, адаптировать actions |
| `stores/cbt.js` | Адаптировать под kanban board state |
| Emotion components | EmotionWheel, EmotionEntryForm, EmotionHistory -- адаптировать layout |
| CBT components | Переделать из списка в kanban board |

### Удаляется
| Компонент | Причина |
|-----------|---------|
| `AppNavbar.vue` | Заменяется tree graph на главной |
| `MoreView.vue` | Нет overflow nav, всё в bottom nav |
| `HomeView.vue` (текущий) | Полная переделка: hero -> tree graph |
| `TasksView.vue` (stub) | Переписывается с нуля (календарь + стикеры) |
| `NotesView.vue` (stub) | Переписывается (iOS Notes стиль) |
| `LibraryView.vue` (stub) | Переписывается (документы) |
| `ArticleView.vue` (stub) | Удаляется (статьи убраны из концепции) |
| `TimeTrackerView.vue` (stub) | Удаляется (убран из концепции) |

### Задачи Phase 0
- [ ] Установить GSAP: `npm install gsap`
- [ ] Установить VueDraggable: `npm install vuedraggable@next`
- [ ] Удалить неиспользуемые stub views
- [ ] Удалить `AppNavbar.vue`
- [ ] Реструктурировать `router/index.js` под новую архитектуру
- [ ] Адаптировать `AppBottomNav.vue` для контекстного переключения
- [ ] Обновить `App.vue` layout

---

## Phase 1: Home + Navigation

**Цель:** Splash screen, главная с tree graph, навигация между разделами.

**Зависимости:** Phase 0

### Компоненты

| Компонент | Файл | Описание |
|-----------|------|----------|
| SplashScreen | `components/home/SplashScreen.vue` | Волновая SVG-анимация, брендинг, auto-dismiss |
| TreeGraph | `components/home/TreeGraph.vue` | SVG interactive tree, две ветки, анимация |
| HomeView | `views/HomeView.vue` | Приветствие + TreeGraph |
| SplashView | `views/SplashView.vue` | Full-screen splash wrapper |
| AppHeader | `components/layout/AppHeader.vue` | Кнопка домой + аватар |
| AppBottomNav | `components/layout/AppBottomNav.vue` | Контекстный: tasks nav / emotions nav |

### Stores / Composables

| Файл | Описание |
|------|----------|
| `stores/app.js` | Текущий раздел, splash shown, navigation state |
| `composables/useSwipeNavigation.js` | Свайп-жесты для переходов |

### Routing

```
/splash          -> SplashView (redirect to /home after animation)
/home            -> HomeView (tree graph)
/tasks           -> TasksView (redirect to /tasks/calendar)
/tasks/calendar  -> TasksView (calendar tab)
/tasks/notes     -> NotesView
/tasks/library   -> LibraryView
/emotions        -> EmotionsView (redirect to /emotions/diary)
/emotions/diary  -> EmotionsView
/emotions/assistant -> AssistantView
/emotions/report -> ReportView
/profile         -> ProfileView
/onboarding      -> OnboardingView
```

### Acceptance Criteria
- [ ] Splash отображается при первом запуске, плавно переходит на /home
- [ ] Tree graph рендерится как SVG, ветки кликабельны
- [ ] Клик по ветке -> свайп-анимация перехода в раздел
- [ ] Bottom nav переключается в зависимости от текущего раздела
- [ ] Свайп-жесты работают на мобилке
- [ ] Кнопка "домой" возвращает на tree graph

---

## Phase 2: Tasks Section

**Цель:** Календарь, стикеры, drag & drop, заметки, библиотека.

**Зависимости:** Phase 1, Backend Tasks API

### 2.1 Задачи (Calendar + Sticky Notes)

| Компонент | Файл | Описание |
|-----------|------|----------|
| CalendarGrid | `components/tasks/CalendarGrid.vue` | Месячный grid, навигация по месяцам |
| StickyNote | `components/tasks/StickyNote.vue` | Карточка-стикер (3 цвета), paper texture |
| StickyNoteEditor | `components/tasks/StickyNoteEditor.vue` | Модальное "бумажное" окно: текст, категория, уведомления |
| StickyNotePool | `components/tasks/StickyNotePool.vue` | Пул незакреплённых стикеров для перетаскивания |
| TasksView | `views/TasksView.vue` | CalendarGrid + StickyNotePool + drag & drop |

| Store / API | Файл |
|-------------|------|
| `stores/tasks.js` | CRUD задач, позиции на календаре, фильтры |
| `api/tasks.js` | API wrapper |
| `api/mock/tasks.mock.js` | Mock с localStorage |

### 2.2 Заметки

| Компонент | Файл | Описание |
|-----------|------|----------|
| NoteCard | `components/notes/NoteCard.vue` | Превью заметки |
| NoteEditor | `components/notes/NoteEditor.vue` | Inline-редактор |
| NotesView | `views/NotesView.vue` | Список + поиск + создание |

| Store / API | Файл |
|-------------|------|
| `stores/notes.js` | CRUD заметок, поиск, теги |
| `api/notes.js` | API wrapper |
| `api/mock/notes.mock.js` | Mock |

### 2.3 Библиотека

| Компонент | Файл | Описание |
|-----------|------|----------|
| DocumentCard | `components/library/DocumentCard.vue` | Превью документа |
| DocumentViewer | `components/library/DocumentViewer.vue` | Просмотр содержимого |
| LibraryView | `views/LibraryView.vue` | Список + загрузка + поиск |

| Store / API | Файл |
|-------------|------|
| `stores/library.js` | Документы, теги, поиск |
| `api/library.js` | API wrapper |
| `api/mock/library.mock.js` | Mock |

### Acceptance Criteria
- [ ] Календарь показывает текущий месяц, навигация стрелками
- [ ] 3 типа стикеров создаются и перетаскиваются на даты
- [ ] Drag & drop работает на desktop и mobile (touch)
- [ ] При перетаскивании открывается редактор стикера
- [ ] Заметки: создание, редактирование, удаление, поиск
- [ ] Библиотека: загрузка файлов, просмотр, теги

---

## Phase 3: Emotions Section

**Цель:** Дневник эмоций, КПТ kanban board.

**Зависимости:** Phase 1, Backend Emotions API

### 3.1 Дневник эмоций (адаптация существующего)

Переиспользуются с адаптацией layout:
- `EmotionWheel.vue` -- без изменений
- `EmotionEntryForm.vue` -- адаптация layout
- `EmotionHistory.vue` -- адаптация layout
- `EmotionChart.vue` -- без изменений
- `EmotionsView.vue` -- новый layout (вкладки: дневник / КПТ)

### 3.2 КПТ Kanban Board (переделка)

| Компонент | Файл | Описание |
|-----------|------|----------|
| CbtBoard | `components/cbt/CbtBoard.vue` | Kanban: 3 колонки, drag & drop |
| CbtCard | `components/cbt/CbtCard.vue` | Карточка СМЭР для доски |
| CbtCardEditor | `components/cbt/CbtCardEditor.vue` | Модальный редактор записи |
| CbtEmotionPicker | `components/cbt/CbtEmotionPicker.vue` | Переиспользуется |
| CbtDistortionPicker | `components/cbt/CbtDistortionPicker.vue` | Переиспользуется |

Kanban колонки:
1. **Новая** -- только создана
2. **В работе** -- начата проработка (оспаривание)
3. **Проработана** -- альтернативная мысль сформулирована

### Acceptance Criteria
- [ ] EmotionsView содержит вкладки: Дневник / КПТ
- [ ] Дневник эмоций работает как раньше
- [ ] КПТ отображается как kanban board
- [ ] Карточки перетаскиваются между колонками
- [ ] Клик по карточке открывает редактор
- [ ] Drag & drop на mobile (touch)

---

## Phase 4: AI Assistant Chat

**Цель:** Чат-интерфейс с AI-агентом.

**Зависимости:** Phase 3 (emotions data), Backend AI API

| Компонент | Файл | Описание |
|-----------|------|----------|
| ChatBubble | `components/assistant/ChatBubble.vue` | Пузырь сообщения (user / assistant) |
| ChatInput | `components/assistant/ChatInput.vue` | Поле ввода с кнопкой отправки |
| ChatHistory | `components/assistant/ChatHistory.vue` | Скролл-лента сообщений |
| AssistantView | `views/AssistantView.vue` | Полный чат-интерфейс |

| Store / API | Файл |
|-------------|------|
| `stores/assistant.js` | История чата, отправка, стриминг |
| `api/assistant.js` | API wrapper (Claude API) |
| `api/mock/assistant.mock.js` | Mock ответы |

### Acceptance Criteria
- [ ] Чат-интерфейс с пузырями сообщений
- [ ] AI отвечает в тёплом тоне
- [ ] Контекст: эмоции + задачи + заметки + история
- [ ] Стриминг ответа (поэтапное отображение)
- [ ] История чата сохраняется

---

## Phase 5: Reports + Library Integration

**Цель:** Аналитика, генерация отчётов.

**Зависимости:** Phase 3, Phase 4, Backend Reports API

| Компонент | Файл | Описание |
|-----------|------|----------|
| ReportChart | `components/report/ReportChart.vue` | Графики эмоций (ECharts) |
| ReportPatterns | `components/report/ReportPatterns.vue` | AI-паттерны |
| ReportSummary | `components/report/ReportSummary.vue` | Текстовая сводка |
| PeriodSelector | `components/report/PeriodSelector.vue` | Неделя / месяц / произвольный |
| ReportView | `views/ReportView.vue` | Полный отчёт |

### Acceptance Criteria
- [ ] Выбор периода отчёта
- [ ] Графики динамики эмоций
- [ ] AI-паттерны за период
- [ ] Корреляции задачи <-> эмоции
- [ ] Экспорт/шаринг отчёта (stretch goal)

---

## Phase 6: PWA, Notifications, Polish

**Цель:** Оффлайн, пуш-уведомления, финальная полировка.

### Задачи
- [ ] Workbox service worker для оффлайн-режима
- [ ] Web Push API: одно уведомление в день
- [ ] Lighthouse score 90+
- [ ] Адаптивное тестирование: 320--428px / 768--1024px / 1200px+
- [ ] Page transition animations polish
- [ ] Тёмная тема -- полный аудит
- [ ] Accessibility audit (a11y)
- [ ] Bundle optimization, code splitting

---

## Статус

| Phase | Статус | Блокер |
|-------|--------|--------|
| Phase 0 | Pending | -- |
| Phase 1 | Pending | Phase 0 |
| Phase 2 | Pending | Phase 1 + Backend Tasks API |
| Phase 3 | Pending | Phase 1 + Backend Emotions API |
| Phase 4 | Pending | Phase 3 + Backend AI API |
| Phase 5 | Pending | Phase 3, 4 + Backend Reports API |
| Phase 6 | Pending | Phase 1--5 |
