# Diary of Feelings — Frontend

Vue 3 SPA. Tailwind CSS v4, Pinia, Lucide Icons, GSAP.

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
npm run dev          # Vite dev server (:5173)
npm run build        # Сборка для продакшна
npm run preview      # Превью сборки
npm run lint         # Линтинг (oxlint + eslint)
npm run format       # Форматирование (Prettier)
```

## Структура

```
src/
├── api/                  # HTTP-клиент и API-модули
│   ├── client.js         # fetch + JWT + snake↔camelCase + dedup + retry
│   ├── auth.js           # login, register, refresh, logout
│   ├── emotions.js       # CRUD эмоций, статистика, капсулы
│   ├── tasks.js          # CRUD задач
│   ├── notes.js          # CRUD заметок
│   ├── cbt.js            # CRUD КПТ-записей
│   ├── assistant.js      # Чат (REST + SSE стриминг), беседы
│   ├── reports.js        # Аналитика (эмоции, КПТ, задачи)
│   ├── recommendations.js  # Рекомендации, портрет
│   ├── user.js           # Профиль, пароль, удаление аккаунта
│   ├── insights.js       # Mood-score, серии, паттерны
│   ├── search.js         # Глобальный поиск
│   └── export.js         # Экспорт JSON/CSV
├── components/
│   ├── layout/           # AppSidebar, AppMobileNav
│   ├── ui/               # BaseModal, BaseButton, BaseInput, BaseTextarea
│   ├── emotions/         # EmotionPicker, EmotionCard, EmotionEditModal
│   ├── cbt/              # CbtForm
│   └── search/           # SearchModal
├── stores/               # Pinia stores (composition API)
│   ├── auth.js           # Авторизация, refresh-токены
│   ├── emotions.js       # Эмоции, капсулы
│   ├── tasks.js          # Задачи
│   ├── notes.js          # Заметки
│   ├── cbt.js            # КПТ
│   ├── assistant.js      # Чат (SSE стриминг, беседы, typewriter)
│   └── reports.js        # Аналитика
├── views/                # 11 страниц + admin/
│   ├── AuthView.vue
│   ├── HomeView.vue
│   ├── EmotionsView.vue
│   ├── TasksView.vue
│   ├── NotesView.vue
│   ├── CbtView.vue
│   ├── AssistantView.vue
│   ├── ReportsView.vue
│   ├── RecommendationsView.vue
│   ├── PortraitView.vue
│   ├── SettingsView.vue
│   └── admin/            # Админ-панель
├── router/               # Vue Router (lazy loading)
├── assets/
│   └── main.css          # Tailwind CSS entry
└── main.js               # Entry point
```

## Соглашения

- `<script setup>` — всегда, никакого Options API
- Порядок блоков: `<template>` → `<script setup>` → `<style scoped>`
- Pinia — только composition syntax (`defineStore('name', () => {...})`)
- UI-текст — русский
