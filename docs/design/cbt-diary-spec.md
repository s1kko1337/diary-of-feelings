# Дизайн-спецификация: КПТ-дневник (СМЭР)

**Проект:** Diary of Feelings
**Дата:** 2026-03-05
**Автор:** UI/UX Design Architect Agent
**Статус:** Ready for implementation

---

## Цветовая схема СМЭР-разделов

Прежде чем описывать экраны — ключевое решение: каждый раздел СМЭР получает свой цветовой акцент. Это создаёт визуальный язык и помогает пользователю ориентироваться.

| Раздел | Смысл | Цвет | CSS-переменная | Hex |
|--------|-------|------|----------------|-----|
| С — Ситуация | Объективное, нейтральное | Мята | `--color-mint` | `#a8dfc8` |
| М — Мысли | Ментальное, когнитивное | Лаванда | `--color-lavender` | `#c4b5e0` |
| Э — Эмоции | Чувственное, телесное | Персик | `--color-peach` | `#f8c9a0` |
| Р — Реакция | Поведение, действие | Розовый | `--color-rose` | `#f0b8c0` |
| Оспаривание | Трансформация, рост | Смешанный (мята + лаванда) | gradient | — |

**Логика:** Мята — спокойствие факта. Лаванда — размышление. Персик — тепло чувств. Розовый — действие. Последовательность создаёт ощущение пути от наблюдения к изменению.

---

## 1. CbtView.vue — Список записей СМЭР

### 1.1. Обзор

- **Название:** CbtView
- **Тип:** Страница (View)
- **Цель:** Точка входа в КПТ-дневник. Обзор всех записей, статистики, фильтрация.
- **Эмоциональный тон:** Спокойный, поддерживающий, структурированный без клинической холодности. Пользователь должен чувствовать, что это его личное пространство для роста, а не медицинская карта.

### 1.2. Структура и Layout

#### Мобильный вариант (< 768px)

```
┌──────────────────────────────┐
│  [AppHeader]                 │
├──────────────────────────────┤
│  Заголовок + кнопка          │
│  "КПТ-дневник"    [+ Запись] │
├──────────────────────────────┤
│  Статистика (3 пилюли)       │
│  [12 записей] [Катастроф.] [↑]│
├──────────────────────────────┤
│  Фильтры (горизонтальный     │
│  скролл пилюль)              │
│  [Все] [Неделя] [Месяц] ...  │
├──────────────────────────────┤
│  Карточка записи 1           │
│  Карточка записи 2           │
│  ...                         │
├──────────────────────────────┤
│  [AppBottomNav]              │
└──────────────────────────────┘
```

#### Десктоп (≥ 768px)

```
┌─────────────────────────────────────────┐
│  [AppNavbar — floating pill]            │
├─────────────────────────────────────────┤
│         max-width: 720px, centered      │
│                                         │
│  КПТ-дневник          [+ Новая запись]  │
│  Помогает понять связь мыслей и эмоций  │
│                                         │
│  ┌─────────┐ ┌─────────┐ ┌──────────┐  │
│  │  12     │ │Катастр. │ │  +3 за   │  │
│  │ записей │ │ топ     │ │  неделю  │  │
│  └─────────┘ └─────────┘ └──────────┘  │
│                                         │
│  [Все] [Эта неделя] [Этот месяц]        │
│  [▾ Искажение]                          │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Карточка записи                 │    │
│  └─────────────────────────────────┘    │
│  ...                                    │
└─────────────────────────────────────────┘
```

**Отступы:**
- Страница: `padding: 1rem 0` (мобайл) / `padding: 1.5rem 0` (десктоп)
- Секции: `gap: 1.25rem` между блоками
- Карточки: `padding: 1.25rem` (мобайл) / `padding: 1.5rem` (десктоп)
- Статистика: горизонтальный flex с `gap: 10px`

### 1.3. Визуальный дизайн

#### Hero-секция

Нет тяжёлого hero — только заголовок и подзаголовок. Декоративный мини-орб слева от заголовка (как в `AppNavbar` navbar-logo-orb, но 32×32px), gradient: лаванда → персик.

```css
.cbt-header-orb {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-lavender), var(--color-peach));
  box-shadow: 0 4px 16px rgb(196 181 224 / 0.3);
  pointer-events: none;
}
```

#### Блок статистики

Три стекло-карточки в ряд. На мобайле — горизонтальный скролл без скроллбара.

```css
/* Контейнер */
display: flex;
gap: 10px;
overflow-x: auto;
scrollbar-width: none; /* Firefox */
-ms-overflow-style: none; /* IE */

/* Отдельная стат-карточка */
background: var(--color-surface);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid var(--color-border);
border-radius: var(--radius-lg);
padding: 1rem 1.25rem;
min-width: 120px;
flex-shrink: 0;
box-shadow: var(--shadow-soft);
```

Значение — `font-family: var(--font-mono)`, `font-size: 1.5rem`, `font-weight: 700`, `color: var(--color-text)`.
Подпись — `font-size: 0.7rem`, `text-transform: uppercase`, `letter-spacing: 0.06em`, `color: var(--color-text-muted)`.

#### Фильтры

Горизонтальный скролл пилюль-кнопок:

```css
.filter-pill {
  padding: 6px 16px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: transparent;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-pill--active {
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
  color: var(--color-text);
}
```

Фильтр по искажениям — выпадающий список (нативный `<select>` со стилизацией или кастомный дропдаун, стилизованный как пилюля с иконкой `ChevronDownIcon`).

#### Карточки записей

Используют глобальный класс `.glass-card` плюс дополнительные стили.

```
┌────────────────────────────────────────┐
│ 04 марта · Пн               [5 мин назад] │
│                                        │
│ Ситуация                               │
│ Коллега не ответил на сообщение за...  │
│                                        │
│ [Тревога 7] [Обида 5]      [Чтение↓]  │
│                              мыслей    │
│                          [→ Открыть]  │
└────────────────────────────────────────┘
```

**Структура карточки:**
- Верхняя строка: дата (`font-size: 0.75rem`, `color: var(--color-text-muted)`) + время (muted, right-aligned)
- Лейбл раздела «Ситуация» — micro-label, цвет `--color-mint`, uppercase
- Текст preview — 2 строки, `line-clamp: 2`, `font-size: 0.9rem`, `line-height: 1.65`
- Нижняя строка: emotion-badges + badge искажения (если есть) + кнопка «Открыть»
- Декоративный мини-орб в правом верхнем углу: `position: absolute`, `width: 48px`, `height: 48px`, `blur: 24px`, `opacity: 0.4`, `pointer-events: none`, цвет — акцент первой эмоции

**Emotion badge:**
```css
.emotion-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  background: var(--color-peach-soft);
  border: 1px solid rgb(248 201 160 / 0.3);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-text);
}
/* Число интенсивности */
.emotion-badge-intensity {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-text-muted);
}
```

**Distortion badge** (если заполнено искажение):
```css
.distortion-badge {
  padding: 3px 10px;
  border-radius: var(--radius-full);
  background: var(--color-lavender-soft);
  border: 1px solid rgb(196 181 224 / 0.25);
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}
```

**Кнопка «Открыть»** — ghost-ссылка, `font-size: 0.78rem`, `color: var(--color-primary)`, inline-flex с `ArrowRightIcon` (size 13), gap растёт при hover (0.2s ease).

#### Пустое состояние

```
┌────────────────────────────────────────┐
│                                        │
│         [иллюстрация-орб]              │
│                                        │
│    Здесь будут твои записи СМЭР        │
│                                        │
│  Первая запись — шаг к пониманию       │
│  себя. Занимает 2–3 минуты.            │
│                                        │
│         [Начать запись →]              │
│                                        │
└────────────────────────────────────────┘
```

Иллюстрация: орб-градиент `linear-gradient(135deg, var(--color-lavender-soft), var(--color-mint-soft))`, `width: 80px`, `height: 80px`, `border-radius: 50%`, `margin: 0 auto 1.5rem`. Текст — `color: var(--color-text-secondary)`. Кнопка — pill, `background: var(--color-primary)`, цвет `white`.

Тон: никакого «У вас нет записей». Только тёплое приглашение.

### 1.4. Состояния

| Состояние | Визуальное изменение |
|-----------|---------------------|
| **Loading** | Карточки заменяются skeleton-блоками: `background: var(--color-surface-hover)`, `border-radius: var(--radius-lg)`, shimmer-анимация через CSS gradient |
| **Empty** | Специальный пустой стейт (описан выше) |
| **Error** | Тонкий баннер сверху списка, `background: var(--color-rose-soft)`, `border: 1px solid rgb(240 184 192 / 0.3)`, иконка `AlertCircleIcon`, текст «Не удалось загрузить записи. Попробуй ещё раз.» |
| **Filtered empty** | «По этому фильтру записей не найдено» — без иллюстрации, только текст muted + кнопка сброса |
| **Hover (карточка)** | `translateY(-2px)`, `box-shadow: var(--shadow-float)`, 0.2s ease |

### 1.5. Анимации и переходы

- Карточки при загрузке: fade-in + `translateY(8px → 0)`, stagger 60ms между карточками
- Hover на карточке: `transform: translateY(-2px)`, `box-shadow` усиливается, `transition: all 0.2s ease`
- Skeleton shimmer:
  ```css
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  background: linear-gradient(
    90deg,
    var(--color-surface-hover) 25%,
    var(--color-surface) 50%,
    var(--color-surface-hover) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  ```
- Фильтры: при смене фильтра список обновляется с `opacity: 0 → 1` (150ms)
- Никакого `backdrop-filter` в keyframes

### 1.6. Типографика

| Элемент | font-size | font-weight | color | letter-spacing |
|---------|-----------|-------------|-------|----------------|
| Заголовок страницы | 1.75rem | 700 | `--color-text` | -0.03em |
| Подзаголовок | 0.9rem | 400 | `--color-text-secondary` | — |
| Стат-значение | 1.5rem | 700, mono | `--color-text` | — |
| Стат-подпись | 0.7rem | 600 | `--color-text-muted` | 0.06em |
| Дата карточки | 0.75rem | 500 | `--color-text-muted` | — |
| Preview текст | 0.9rem | 400 | `--color-text` | — |
| Badge-текст | 0.72rem | 600 | `--color-text` | — |
| Кнопка «Открыть» | 0.78rem | 600 | `--color-primary` | — |

### 1.7. Props / Emit API

CbtView — страница, не принимает props. Взаимодействует только через store.

**События роутера:**
- Клик «Новая запись» → `router.push('/cbt/new')`
- Клик «Открыть» на карточке → `router.push('/cbt/:id')`

### 1.8. Tailwind-скелет (ключевые элементы)

```html
<!-- Заголовок страницы -->
<div class="flex items-start justify-between mb-5">
  <div class="flex items-center gap-3">
    <div class="cbt-header-orb" />
    <div>
      <h1 class="text-2xl font-bold tracking-tight" style="color: var(--color-text)">
        КПТ-дневник
      </h1>
      <p class="text-sm mt-0.5" style="color: var(--color-text-secondary)">
        Помогает понять связь мыслей и эмоций
      </p>
    </div>
  </div>
  <button class="new-entry-btn">
    <PlusIcon :size="16" :stroke-width="1.8" />
    Новая запись
  </button>
</div>

<!-- Статистика -->
<div class="stats-row">
  <div class="stat-card glass-card">
    <span class="stat-value metric-value">12</span>
    <span class="stat-label">записей</span>
  </div>
  ...
</div>

<!-- Карточка записи -->
<article class="entry-card glass-card" @click="openEntry(entry.id)">
  <div class="entry-card-orb" />
  <div class="entry-header">
    <time class="entry-date">{{ formatDate(entry.date) }}</time>
    <span class="entry-time">{{ formatTime(entry.createdAt) }}</span>
  </div>
  <p class="entry-label">Ситуация</p>
  <p class="entry-preview">{{ entry.situation }}</p>
  <div class="entry-footer">
    <div class="entry-badges">
      <span v-for="em in entry.emotions" :key="em.key" class="emotion-badge">
        {{ em.label }}
        <span class="emotion-badge-intensity">{{ em.intensity }}</span>
      </span>
      <span v-if="entry.distortion" class="distortion-badge">
        {{ entry.distortion }}
      </span>
    </div>
    <button class="entry-open-btn">
      Открыть
      <ArrowRightIcon :size="13" :stroke-width="2" />
    </button>
  </div>
</article>
```

---

## 2. CbtEntryView.vue — Форма создания/просмотра записи

### 2.1. Обзор

- **Название:** CbtEntryView
- **Тип:** Страница (View), два режима: create / view (read-only)
- **Цель:** Создание новой СМЭР-записи (wizard) или просмотр существующей. Продвинутый режим — опциональный.
- **Эмоциональный тон:** Поддерживающий, без давления. Форма-разговор, а не анкета. Каждый шаг — отдельный момент рефлексии.

### 2.2. Структура и Layout

#### UX-паттерн: Scroll-секции с якорями

Не wizard (многошаговый), а длинная страница с чётко разделёнными секциями. Пользователь скроллит вниз. Секции «открываются» постепенно: следующая становится активной, когда предыдущая заполнена. Это снижает тревогу — всё видно сразу, но не давит.

```
┌─────────────────────────────────┐
│  [← Назад]    Новая запись      │
│                                 │
│  ●────●────○────○  Прогресс     │
│  С    М    Э    Р               │
│                                 │
│  ┌───────────────────────────┐  │
│  │ [МЯТА] С — Ситуация  ✓   │  │  ← активная/заполненная
│  │ Что произошло?            │  │
│  │ [текстовое поле]          │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ [ЛАВАНДА] М — Мысли      │  │  ← активная
│  │ Какие мысли возникли?     │  │
│  │ [текстовое поле]          │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │  ← заблокированная (dimmed)
│  │ [ПЕРСИК] Э — Эмоции      │  │
│  │ ...                       │  │
│  └───────────────────────────┘  │
│                                 │
│  [Подробнее / продвинутый режим]│
│                                 │
│  [Сохранить запись]             │
└─────────────────────────────────┘
```

#### Мобайл (< 768px)

Полноэкранный скролл. Секции идут друг за другом с `gap: 1rem`. Кнопка «Сохранить» — sticky bottom (над bottom nav):

```css
.save-button-wrapper {
  position: sticky;
  bottom: calc(var(--bottom-nav-height) + 12px);
  z-index: 10;
  padding: 0 0 8px;
}
```

#### Десктоп (≥ 768px)

Контент `max-width: 720px`, центрированный. Sticky progress-bar сверху (под navbar). Кнопка «Сохранить» — в конце страницы, не sticky.

### 2.3. Прогресс-индикатор

Горизонтальная полоска с 4 точками (С, М, Э, Р). Подписи под точками. Точка активна — залита цветом акцента раздела. Заполнена — чекмарк.

```css
.progress-bar {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 1rem 0 1.5rem;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
  position: relative;
}

/* Линия между шагами */
.progress-step::after {
  content: '';
  position: absolute;
  top: 10px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: var(--color-border);
}

.progress-step:last-child::after {
  display: none;
}

.progress-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  z-index: 1;
  transition: all 0.3s ease;
}

.progress-dot--active {
  border-color: var(--step-color);
  background: var(--step-color);
  box-shadow: 0 0 0 4px rgb(from var(--step-color) r g b / 0.2);
}

.progress-dot--done {
  border-color: var(--step-color);
  background: var(--step-color);
}

.progress-label {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}
```

Каждый шаг получает `--step-color`:
- С: `var(--color-mint)`
- М: `var(--color-lavender)`
- Э: `var(--color-peach)`
- Р: `var(--color-rose)`

### 2.4. Секции формы

#### Общий стиль секции

```css
.smear-section {
  background: var(--color-surface);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  box-shadow: var(--shadow-soft);
  transition: opacity 0.3s ease, transform 0.3s ease;
  position: relative;
  overflow: hidden;
}

/* Цветной левый акцент (тонкий бордер) */
.smear-section::before {
  content: '';
  position: absolute;
  left: 0;
  top: 1.5rem;
  bottom: 1.5rem;
  width: 3px;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  background: var(--section-color); /* CSS custom prop */
}

/* Заблокированная секция */
.smear-section--locked {
  opacity: 0.45;
  pointer-events: none;
}

/* Заполненная (collapsed view) */
.smear-section--done {
  padding: 1rem 1.5rem;
}
```

**Декоративный орб внутри секции:**
```css
.section-orb {
  position: absolute;
  top: -16px;
  right: -16px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--section-color);
  filter: blur(20px);
  opacity: 0.3;
  pointer-events: none;
}
```

#### Заголовок секции

```
[иконка]  С — Ситуация                [✓ Заполнено]
          Что произошло объективно?
```

```css
.section-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 1.25rem;
}

.section-icon-wrapper {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: rgb(from var(--section-color) r g b / 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--section-color);
  /* filter: не используем для shadow из-за GPU */
}

.section-letter {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--section-color);
  margin-bottom: 2px;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.01em;
}

.section-hint {
  font-size: 0.82rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin-top: 2px;
}
```

**Иконки секций (lucide-vue-next):**
- С — Ситуация: `MapPinIcon` (size 18, stroke-width 1.8), цвет `--color-mint`
- М — Мысли: `BrainIcon` (size 18, stroke-width 1.8), цвет `--color-lavender`
- Э — Эмоции: `HeartIcon` (size 18, stroke-width 1.8), цвет `--color-peach`
- Р — Реакция: `ZapIcon` (size 18, stroke-width 1.8), цвет `--color-rose`

#### Поля ввода

**Textarea (ситуация, мысли, реакция):**

```css
.smear-textarea {
  width: 100%;
  min-height: 100px;
  max-height: 200px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface-hover);
  color: var(--color-text);
  font-size: 0.9rem;
  font-family: var(--font-main);
  line-height: 1.65;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.smear-textarea:focus {
  border-color: var(--section-color);
  box-shadow: 0 0 0 3px rgb(from var(--section-color) r g b / 0.12);
}

.smear-textarea::placeholder {
  color: var(--color-text-muted);
  font-style: italic;
}
```

Placeholder — тёплая подсказка (не техническая):
- С: «Просто опиши, что случилось. Только факты, без оценок.»
- М: «Что пронеслось в голове в тот момент?»
- Э: «Добавь эмоции ниже»
- Р: «Что ты сделал(а) или почувствовал(а) физически?»

Счётчик символов — `font-size: 0.7rem`, `color: var(--color-text-muted)`, right-aligned под полем.

#### Блок выбора эмоций (секция Э)

Пользователь добавляет несколько эмоций с интенсивностью. Компонент `CbtEmotionPicker`.

```
┌─────────────────────────────────────┐
│ [+ Добавить эмоцию]                 │
│                                     │
│ ┌──────────────────────────────┐    │
│ │ Тревога      ━━━━━●───  7  [×]│   │
│ └──────────────────────────────┘    │
│ ┌──────────────────────────────┐    │
│ │ Обида        ━━●──────  5  [×]│   │
│ └──────────────────────────────┘    │
└─────────────────────────────────────┘
```

Кнопка «+ Добавить эмоцию»: открывает выпадающий список популярных эмоций (10–15 вариантов) + поле поиска. Пилюли в попапе — стиль emotion-pill из HomeView.vue.

Добавленная эмоция:
```css
.added-emotion-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  background: var(--color-peach-soft);
  border: 1px solid rgb(248 201 160 / 0.25);
}

.added-emotion-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
  min-width: 80px;
}

/* Слайдер — как в EmotionEntryForm.vue, accent = --color-peach */
.added-emotion-slider { flex: 1; }

.added-emotion-value {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-text);
  min-width: 20px;
  text-align: center;
}

.remove-emotion-btn {
  color: var(--color-text-muted);
  transition: color 0.2s ease;
}
.remove-emotion-btn:hover { color: var(--color-danger); }
```

#### Продвинутый режим (toggle)

Кнопка-аккордеон в конце базовых секций:

```
┌─────────────────────────────────────┐
│ ✦  Добавить подробности              │
│    Когнитивное искажение, оспаривание│
│    и переоценка                      │
│                                 [▸]  │
└─────────────────────────────────────┘
```

```css
.advanced-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: var(--radius-lg);
  border: 1px dashed var(--color-border);
  background: transparent;
  cursor: pointer;
  transition: all 0.25s ease;
  width: 100%;
  text-align: left;
}

.advanced-toggle:hover {
  background: var(--color-lavender-soft);
  border-color: var(--color-lavender);
}

.advanced-toggle-icon {
  color: var(--color-lavender);
  flex-shrink: 0;
}
```

При открытии — плавно раскрывается (`max-height` transition, 0.4s ease). Внутри:

1. **Когнитивное искажение** — компонент `CbtDistortionPicker` (описан ниже)
2. **Оспаривание** — textarea, `border-color: --color-lavender`, hint: «Есть ли доказательства этой мысли? Как ты мог(ла) бы посоветовать другу?»
3. **Альтернативная мысль** — textarea, hint: «Более реалистичная интерпретация»
4. **Эмоции после** — блок аналогичный блоку Э, но с заголовком «Как ты чувствуешь себя сейчас?»

### 2.5. Режим просмотра (view mode)

Та же страница, но все поля read-only:

```css
.smear-section--readonly .smear-textarea {
  border-color: transparent;
  background: var(--color-surface-hover);
  cursor: default;
  resize: none;
  pointer-events: none;
}
```

Сверху страницы — кнопка «Редактировать» (иконка `PencilIcon`). Кнопка «Удалить» — ghost, `color: var(--color-danger)`, появляется в нижнем правом углу (или в мобайл-шторке).

### 2.6. Состояния

| Состояние | Визуальное изменение |
|-----------|---------------------|
| **Поле пустое** | Placeholder-текст, border `var(--color-border)` |
| **Поле в фокусе** | border = `var(--section-color)`, glow `0 0 0 3px color/0.12` |
| **Поле заполнено** | border = `var(--section-color)` с opacity 40%, тихое подтверждение |
| **Секция заполнена** | Схлопывается в compact-view, зелёная галочка (`CheckIcon`, `--color-success`) |
| **Секция заблокирована** | `opacity: 0.45`, `pointer-events: none`, tooltip «Заполни предыдущий раздел» |
| **Сохранение** | Кнопка «Сохранить» → loading spinner (inline), текст «Сохраняем...» |
| **Ошибка сохранения** | Баннер под кнопкой, `--color-rose-soft`, `AlertCircleIcon` |
| **Успех** | Краткая `toast`-нотификация снизу, затем роутер → `/cbt` |

### 2.7. Анимации и переходы

- Секция раскрывается: `transition: max-height 0.4s ease, opacity 0.3s ease`
- Секция схлопывается (done): плавно уменьшается `padding` + `max-height`
- Прогресс-точка заполнена: `transform: scale(1 → 1.2 → 1)`, 0.3s
- Продвинутый режим разворачивается: `max-height 0.4s ease`
- Кнопка «Сохранить» при нажатии: `transform: scale(0.98)`, 0.1s
- Mount анимация страницы: `opacity: 0 → 1` + `translateY(12px → 0)`, 0.35s
- Добавление эмоции в список: `slideInDown` — `opacity: 0 + translateY(-8px) → нормал`, 0.25s

### 2.8. Типографика

| Элемент | font-size | font-weight | color |
|---------|-----------|-------------|-------|
| Заголовок страницы | 1.5rem | 700 | `--color-text` |
| Буква раздела (С/М/Э/Р) | 0.65rem | 700 | `--section-color` |
| Название раздела | 1rem | 700 | `--color-text` |
| Подсказка раздела | 0.82rem | 400 | `--color-text-muted` |
| Текст в поле | 0.9rem | 400 | `--color-text` |
| Placeholder | 0.9rem | 400 | `--color-text-muted`, italic |
| Лейбл добавленной эмоции | 0.85rem | 600 | `--color-text` |
| Значение интенсивности | 0.85rem | 700, mono | `--color-text` |

### 2.9. Props / Emit API

```javascript
// Props
defineProps({
  id: { type: String, default: null },  // null = create mode
})

// Events (внутренние, через store и router)
// emit не нужен — страница сама управляет роутером
```

---

## 3. CbtDistortionPicker.vue — Пикер когнитивных искажений

### 3.1. Обзор

- **Название:** CbtDistortionPicker
- **Тип:** Компонент
- **Цель:** Выбор одного из 10 когнитивных искажений. Должен быть понятным, не пугающим, немного образовательным.
- **Эмоциональный тон:** Нейтрально-дружелюбный. Без клинической сухости. Каждое искажение — это что-то узнаваемое, «я и сам(а) так думаю».

### 3.2. Данные искажений

| Ключ | Название | Описание-подсказка | Иконка | Цвет |
|------|----------|--------------------|--------|------|
| `catastrophizing` | Катастрофизация | «Это ужасно и всё пропало» | `AlertTriangleIcon` | rose |
| `mind-reading` | Чтение мыслей | «Я знаю, что он обо мне думает» | `EyeIcon` | lavender |
| `black-white` | Чёрно-белое | «Либо идеально, либо провал» | `CircleHalfIcon` | peach |
| `personalization` | Персонализация | «Это всё из-за меня» | `UserIcon` | rose |
| `overgeneralization` | Сверхобобщение | «Так всегда, я никогда...» | `InfinityIcon` | lavender |
| `discounting` | Обесценивание | «Это не в счёт, просто повезло» | `MinusCircleIcon` | peach |
| `emotional-reasoning` | Эмоц. обоснование | «Я чувствую тревогу — значит, опасно» | `HeartCrackIcon` | rose |
| `should-statements` | Долженствование | «Я должен(а) быть лучше» | `GavelIcon` | lavender |
| `labeling` | Навешивание ярлыков | «Я неудачник(ца)» | `TagIcon` | peach |
| `tunnel-vision` | Тоннельное зрение | «Вижу только плохое» | `FocusIcon` | lavender |

Цвета распределены между lavender, peach, rose — без mint (мята = «факт/ситуация», а искажения — это мысли, значит лаванда доминирует).

### 3.3. Структура и Layout

#### Вариант: Сетка карточек

```
┌──────────┐ ┌──────────┐ ┌──────────┐
│ [иконка] │ │ [иконка] │ │ [иконка] │
│Катастроф.│ │ Чтение   │ │Чёрно-бел.│
│ мыслей   │ │          │ │          │
└──────────┘ └──────────┘ └──────────┘
┌──────────┐ ...
```

**Мобайл:** 2 колонки
**Десктоп:** 3 колонки (≥ 480px) или 2 колонки (если внутри секции)

```css
.distortion-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

@media (min-width: 480px) {
  .distortion-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

#### Карточка искажения

```css
.distortion-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 14px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-surface-hover);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  position: relative;
  overflow: hidden;
}

.distortion-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: rgb(from var(--distortion-color) r g b / 0.06);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.distortion-card:hover::before { opacity: 1; }
.distortion-card:hover {
  border-color: rgb(from var(--distortion-color) r g b / 0.35);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgb(from var(--distortion-color) r g b / 0.12);
}

.distortion-card--selected {
  border-color: var(--distortion-color);
  background: rgb(from var(--distortion-color) r g b / 0.1);
  box-shadow: 0 0 0 2px rgb(from var(--distortion-color) r g b / 0.2);
}
.distortion-card--selected::before { opacity: 1; }
```

**Содержимое карточки:**

```
┌────────────────────────────┐
│ ╔════╗                     │
│ ║ ⚠  ║  Катастрофизация    │ ← иконка-блок + название
│ ╚════╝                     │
│ «Это ужасно и всё          │ ← подсказка (2 строки max)
│  пропало»                  │
└────────────────────────────┘
```

```css
.distortion-icon-wrapper {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  background: rgb(from var(--distortion-color) r g b / 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--distortion-color);
  flex-shrink: 0;
}

.distortion-name {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.3;
}

.distortion-hint {
  font-size: 0.72rem;
  color: var(--color-text-secondary);
  line-height: 1.45;
  font-style: italic;
}
```

**Выбранная карточка:** галочка `CheckIcon` (size 14) в правом верхнем углу:
```css
.distortion-check {
  position: absolute;
  top: 10px;
  right: 10px;
  color: var(--distortion-color);
}
```

#### Альтернативный вариант: Пилюли-список

Если карточки занимают слишком много места внутри продвинутого режима, используем вертикальный список пилюль:

```
[⚠]  Катастрофизация         ← выбранная (filled)
[👁]  Чтение мыслей           ← невыбранная (ghost)
[◐]  Чёрно-белое мышление    ← невыбранная
...
```

Рекомендуется **вариант с сеткой карточек** — он нагляднее и менее клинический.

### 3.4. Состояния компонента

| Состояние | Поведение |
|-----------|-----------|
| **Default** | Все карточки одинаковы, неактивны |
| **Hover** | translateY(-2px), цветная подсветка бордера |
| **Selected** | Карточка подсвечена цветом, чекмарк, остальные — чуть dimmed (opacity: 0.65) |
| **Disabled** | Не применимо (всегда можно менять выбор) |
| **No selection** | Над сеткой — subtle подсказка: «Необязательно — пропусти если не уверен(а)» |

### 3.5. Анимации

- Выбор: `transform: scale(0.97 → 1)`, 0.15s ease — ощущение «клика»
- Снятие выбора: мгновенно, 0.2s ease
- Dimming остальных: `opacity: 1 → 0.65`, 0.25s ease

### 3.6. Типографика

| Элемент | font-size | font-weight | color |
|---------|-----------|-------------|-------|
| Название искажения | 0.82rem | 700 | `--color-text` |
| Подсказка-цитата | 0.72rem | 400, italic | `--color-text-secondary` |
| Hint «необязательно» | 0.75rem | 400 | `--color-text-muted` |

### 3.7. Props / Emit API

```javascript
defineProps({
  modelValue: { type: String, default: null },  // ключ выбранного искажения
  compact: { type: Boolean, default: false },    // pill-list вместо grid
})

defineEmits(['update:modelValue'])

// Использование:
// <CbtDistortionPicker v-model="entry.distortion" />
```

---

## 4. Вспомогательные компоненты

### 4.1. CbtEmotionPicker.vue

Компонент добавления нескольких эмоций с интенсивностью. Используется в секции Э формы СМЭР и в блоке «Эмоции после».

```javascript
defineProps({
  modelValue: { type: Array, default: () => [] },
  // Array<{ key: string, label: string, intensity: number }>
  accentColor: { type: String, default: 'var(--color-peach)' },
  maxEmotions: { type: Number, default: 5 },
})

defineEmits(['update:modelValue'])
```

### 4.2. CbtEntryCard.vue

Карточка записи в списке. Используется в CbtView.vue.

```javascript
defineProps({
  entry: { type: Object, required: true },
  // { id, date, createdAt, situation, thoughts, emotions[], reaction,
  //   distortion, challenge, alternative, emotionsAfter[] }
})

defineEmits(['open', 'delete'])
```

### 4.3. CbtStatCard.vue

Карточка статистики. Используется в CbtView.vue.

```javascript
defineProps({
  value: { type: [String, Number], required: true },
  label: { type: String, required: true },
  trend: { type: String, default: null }, // 'up' | 'down' | null
  accentColor: { type: String, default: 'var(--color-lavender)' },
})
```

---

## 5. Доступность (a11y)

- Все интерактивные элементы — `<button>` или `<a>`, не `<div>` с обработчиком клика
- `aria-label` на иконочных кнопках: «Удалить эмоцию», «Открыть запись», «Назад»
- `aria-describedby` на textarea — связь с подсказкой-placeholder
- `role="listbox"` + `aria-selected` для пикера искажений
- `aria-expanded` на toggle продвинутого режима
- Focus-visible стили для всех интерактивных элементов:
  ```css
  :focus-visible {
    outline: 2px solid var(--section-color, var(--color-primary));
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
  ```
- Слайдер интенсивности: `aria-label="Интенсивность эмоции"`, `aria-valuemin="0"`, `aria-valuemax="10"`, `aria-valuenow`
- Достаточный контраст: `--color-text` на `--color-surface` ≥ 4.5:1 (проверено для дефолтной темы)
- Секции с `role="group"` + `aria-labelledby` (заголовок секции)

---

## 6. Тёмная тема

Все цвета уже адаптированы через `.dark`-класс в theme.css. Специфические адаптации для КПТ:

- Левый акцент (`:before` на секции) — opacity снижается с `1` до `0.7` в тёмной теме
- Орбы внутри секций — opacity с `0.3` до `0.2`
- Карточки искажений: `background: var(--color-surface-hover)` → уже адаптировано переменной
- Skeleton shimmer: gradient из `var(--color-surface)` / `var(--color-surface-hover)` — адаптируется автоматически

---

## 7. Инструкции для агента-разработчика

### Файлы для создания

```
src/
├── views/
│   ├── CbtView.vue               ← ПЕРЕПИСАТЬ (сейчас заглушка)
│   └── CbtEntryView.vue          ← ПЕРЕПИСАТЬ (сейчас заглушка)
├── components/
│   └── cbt/
│       ├── CbtEntryCard.vue      ← СОЗДАТЬ
│       ├── CbtStatCard.vue       ← СОЗДАТЬ
│       ├── CbtDistortionPicker.vue ← СОЗДАТЬ
│       ├── CbtEmotionPicker.vue  ← СОЗДАТЬ
│       └── CbtProgressBar.vue    ← СОЗДАТЬ (прогресс-индикатор)
├── stores/
│   └── cbt.js                    ← СОЗДАТЬ
├── api/
│   ├── cbt.js                    ← СОЗДАТЬ (обёртка)
│   └── mock/
│       ├── cbt.js                ← СОЗДАТЬ (мок-хендлеры)
│       └── data/
│           ├── cbt-entries.js    ← СОЗДАТЬ (тестовые данные)
│           └── distortions.js    ← СОЗДАТЬ (список искажений)
└── composables/
    └── useCbt.js                 ← СОЗДАТЬ (опционально)
```

### Порядок реализации

1. **Данные:** `src/api/mock/data/distortions.js` — массив из 10 искажений с ключами, названиями, описаниями, иконками и цветами (как в таблице выше)

2. **Мок и API:** `src/api/mock/data/cbt-entries.js` — 3–5 тестовых записей (разные степени заполненности). `src/api/mock/cbt.js` — CRUD операции с localStorage. `src/api/cbt.js` — обёртки через `request()`.

3. **Store:** `src/stores/cbt.js` — composition style:
   ```javascript
   defineStore('cbt', () => {
     const entries = ref([])
     const currentEntry = ref(null)
     const isLoading = ref(false)

     async function loadEntries() { ... }
     async function loadEntry(id) { ... }
     async function createEntry(data) { ... }
     async function updateEntry(id, data) { ... }
     async function deleteEntry(id) { ... }

     const stats = computed(() => ({
       total: entries.value.length,
       topDistortion: ...,
       weekCount: ...,
     }))

     return { entries, currentEntry, isLoading, stats,
              loadEntries, loadEntry, createEntry, updateEntry, deleteEntry }
   })
   ```

4. **CbtDistortionPicker.vue** — изолированный компонент без зависимостей от store. Использует данные из `distortions.js` напрямую (импорт).

5. **CbtEmotionPicker.vue** — аналогично, список эмоций: тревога, страх, грусть, злость, обида, вина, стыд, разочарование, одиночество, усталость, растерянность, радость, благодарность, спокойствие (14 вариантов). Данные хардкодом в компоненте или в отдельном файле `src/api/mock/data/emotions-cbt.js`.

6. **CbtProgressBar.vue** — принимает prop `steps: Array<{key, label, color, done, active}>`.

7. **CbtEntryCard.vue** — принимает prop `entry`, эмитит `open` и `delete`.

8. **CbtStatCard.vue** — простой presentational компонент.

9. **CbtView.vue** — подключает store, рендерит список карточек, статистику, фильтры. Кнопка «Новая запись» → `router.push('/cbt/new')`.

10. **CbtEntryView.vue** — самый сложный компонент. Управляет режимами create/view, разворачиванием секций, прогресс-баром. Prop `id` берётся из `useRoute().params.id`.

### Структура данных записи СМЭР

```javascript
{
  id: 'uuid',
  createdAt: '2026-03-05T14:30:00Z',
  date: '2026-03-05',

  // Базовый режим
  situation: 'Коллега не ответил на сообщение за 3 часа',
  thoughts: 'Он меня игнорирует. Я сделал что-то не так.',
  emotions: [
    { key: 'anxiety', label: 'Тревога', intensity: 7 },
    { key: 'resentment', label: 'Обида', intensity: 5 },
  ],
  reaction: 'Написал ещё три сообщения подряд',

  // Продвинутый режим (опциональные, null если не заполнены)
  distortion: 'mind-reading',       // ключ из distortions.js
  challenge: 'Есть ли доказательства? Может, он просто занят?',
  alternative: 'Возможно, он на встрече или загружен работой.',
  emotionsAfter: [
    { key: 'anxiety', label: 'Тревога', intensity: 3 },
  ],
}
```

### Роутер

Добавить маршруты в `src/router/index.js`:

```javascript
{
  path: '/cbt',
  name: 'cbt',
  component: () => import('@/views/CbtView.vue'),
},
{
  path: '/cbt/new',
  name: 'cbt-new',
  component: () => import('@/views/CbtEntryView.vue'),
},
{
  path: '/cbt/:id',
  name: 'cbt-entry',
  component: () => import('@/views/CbtEntryView.vue'),
  props: true,
},
```

### Потенциальные сложности

1. **Scroll-секции с блокировкой:** Логика «следующая секция открывается при заполнении предыдущей» требует computed `sectionStates` в CbtEntryView. Минимальное условие для разблокировки секции М — `situation.value.trim().length > 0`. Для Э — `thoughts.value.trim().length > 0`. Р — хотя бы одна эмоция добавлена.

2. **`max-height` transition для продвинутого режима:** Нельзя анимировать `height: auto`. Используй `max-height` с достаточным значением (например, `max-height: 0 → max-height: 1000px`). Или Vue `<Transition>` с `onEnter`/`onLeave` хуками для задания высоты через JS.

3. **CSS `rgb(from var(...) r g b / 0.12)` — относительный цвет:** Это CSS Color Level 5 (relative color syntax). Поддерживается в Chrome 119+, Safari 16.4+, Firefox 128+. Если проект должен поддерживать старые браузеры, замени на конкретные rgba-значения для каждого цвета. Проверь текущий `browserslist` в `package.json`.

4. **`CircleHalfIcon` и `HeartCrackIcon`:** Проверь наличие этих иконок в установленной версии `lucide-vue-next`. Если отсутствуют — `CircleHalfIcon` замени на `ContrastIcon` или `SplitIcon`, `HeartCrackIcon` на `HeartIcon`.

5. **Drag-to-reorder эмоций:** Не реализовывать в MVP. Порядок фиксирован по времени добавления.

6. **Sticky кнопка «Сохранить» на мобайле:** Должна быть выше `--bottom-nav-height` (72px). Используй `bottom: calc(72px + 12px)`.

### Зависимости

- `lucide-vue-next` — уже установлен
- `pinia` — уже установлен
- Новых пакетов не требуется

### Проверочный чеклист перед PR

- [ ] CbtDistortionPicker работает как v-model
- [ ] CbtEmotionPicker позволяет добавить несколько эмоций и удалить
- [ ] Прогресс-бар корректно показывает заполненность
- [ ] Продвинутый режим разворачивается/сворачивается плавно
- [ ] На мобайле кнопка «Сохранить» не перекрывается bottom nav
- [ ] Тёмная тема не ломает цвета акцентов
- [ ] Пустое состояние CbtView показывается когда нет записей
- [ ] Роутер корректно передаёт id для режима просмотра
- [ ] Форма сбрасывается при переходе к новой записи
- [ ] `-webkit-backdrop-filter` добавлен везде где есть `backdrop-filter`

---

*Спецификация подготовлена UI/UX Design Architect Agent. Версия 1.0.*
