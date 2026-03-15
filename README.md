# Diary of Feelings — Frontend

Vue 3 + Vite приложение. PWA, Tailwind CSS 4, Pinia, GSAP.

> **Фронтенд переписывается с нуля.** API-модули готовы, компоненты и страницы ещё не реализованы.

## Требования

- Node.js 20+
- npm 10+
- Backend запущен на `http://localhost:8000` (или через Docker)

## Установка

```bash
npm install
```

## Разработка

```bash
# Dev-сервер
npm run dev

# Сборка для продакшна
VITE_API_URL=/api npm run build

# Превью сборки
npm run preview

# Линтинг (oxlint + eslint --fix)
npm run lint

# Форматирование (Prettier)
npm run format
```

## Структура

```
src/
├── api/              # API-модули (готовы к использованию)
│   ├── client.js     # HTTP-клиент (fetch, JWT, snake→camelCase, dedup, errors)
│   ├── auth.js       # login, register, getMe, logout
│   ├── emotions.js   # create, getByDate, getHistory, getStats, remove
│   ├── tasks.js      # getTasks, createTask, updateTask, deleteTask, moveToDate
│   ├── notes.js      # getNotes, createNote, updateNote, deleteNote
│   ├── cbt.js        # getAll, getById, create, update, updateStatus, remove
│   ├── assistant.js  # getHistory, sendMessage, clearHistory
│   ├── reports.js    # getEmotionReport, getCbtReport, getTasksReport
│   ├── recommendations.js  # getTodayRecommendations, markRead, markHelpful, markOpened, getPortrait
│   └── user.js       # stub — backend endpoints не реализованы
├── assets/
│   └── main.css      # Tailwind CSS entry
├── main.js           # Entry point (Vue + Pinia)
└── App.vue           # Root component (placeholder)
```

## Соглашения

- `<script setup>` — всегда, никакого Options API
- Порядок блоков: `<template>` -> `<script setup>` -> `<style scoped>`
- Стили всегда `scoped`; глобальные только в `assets/main.css`
- Pinia — только composition syntax (`defineStore('name', () => {...})`)
- Prettier: без `;`, одинарные кавычки, 100 символов в строке
- Коммиты и комментарии — English; UI-текст — Russian

## Backend API документация

Полная документация бэкенда находится в `../diary-of-feelings-backend/`:

| Документ | Описание |
|----------|----------|
| [`SPECIFICATION.md`](../diary-of-feelings-backend/SPECIFICATION.md) | Полная спецификация API (модели, эндпоинты, бизнес-логика, скоринг рекомендаций) |
| [`openapi.yaml`](../diary-of-feelings-backend/openapi.yaml) | OpenAPI 3.1 / Swagger спецификация (все схемы, параметры, примеры) |
| [`README.md`](../diary-of-feelings-backend/README.md) | Инструкция по запуску бэкенда |

**Swagger UI** доступен по адресу `GET /api/docs` при запуске бэкенда с `DEBUG=true`.

## IDE

VS Code + [Vue Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (отключить Vetur).
