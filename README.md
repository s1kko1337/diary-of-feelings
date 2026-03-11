# Diary of Feelings — Frontend

Vue 3 + Vite приложение. PWA, Tailwind CSS 4, Pinia, GSAP.

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
# Dev-сервер (proxy на localhost:8000)
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
├── api/          # API-обёртки + mock-данные
├── assets/       # main.css (глобальные стили) + theme.css (CSS-переменные)
├── components/   # Vue-компоненты по модулям
├── composables/  # useTheme, useOfflineStatus, useChartColors
├── router/       # Vue Router (lazy-load)
├── stores/       # Pinia stores (composition syntax)
└── views/        # Страницы (SplashView, HomeView, TasksView, EmotionsView, ...)
```

## Соглашения

- `<script setup>` — всегда, никакого Options API
- Порядок блоков: `<template>` → `<script setup>` → `<style scoped>`
- Стили всегда `scoped`; глобальные только в `assets/main.css`
- Pinia — только composition syntax (`defineStore('name', () => {...})`)
- Prettier: без `;`, одинарные кавычки, 100 символов в строке
- Коммиты и комментарии — English; UI-текст — Russian

## IDE

VS Code + [Vue Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (отключить Vetur).

Devtools: [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) для Chrome.

## Документация

- `docs/concept.md` — концепция продукта
- `docs/architecture.md` — архитектура frontend + backend
- `docs/roadmap-improvements.md` — план качественных улучшений
- `docs/design/navigation-and-screens.md` — дизайн-спецификация экранов
- `docs/design/cbt-diary-spec.md` — спецификация КПТ-дневника
- `CLAUDE.md` — конвенции для AI-агентов
