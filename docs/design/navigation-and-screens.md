# Дизайн-спецификация: Навигация и Ключевые Экраны

> Задача для дизайнера. Версия 1.0, 2026-03-07

---

## 1. Splash Screen

### Назначение
Полноэкранный сплэш при запуске приложения. Создаёт первое впечатление -- спокойствие и тепло.

### Спецификация
- **Фон:** градиент от cream к lavender-tint (из текущей палитры)
- **Анимация:** волновая SVG-анимация (liquid wave)
  - 2--3 слоя волн разной opacity и скорости
  - Цвета волн: лаванда, персик, мята (из палитры)
  - Длительность одного цикла: 3--4 секунды
  - Анимация через CSS `@keyframes` или GSAP timeline
- **Логотип:** название "Diary of Feelings" по центру
  - Шрифт: Inter, weight 700, 1.5rem
  - Появление: fade-in с задержкой 0.3s
- **Длительность:** 1.5--2 секунды, затем fade-out переход на Home
- **Адаптивность:** волны масштабируются по viewport

### Технические ограничения
- SVG для волн (не canvas) -- лучше для accessibility
- Анимация через CSS transforms (не path morphing -- дорого)
- `will-change: transform` на анимируемых элементах

---

## 2. Home Screen -- Tree Graph

### Назначение
Центральный элемент навигации. Метафора дерева: ствол = пользователь, ветки = два направления (Задачи и Эмоции).

### Спецификация
- **Layout:** по центру экрана, `max-width: 720px`
- **Приветствие:** сверху, крупный текст
  - "Привет! Как ты сегодня?"
  - Inter, weight 800, 2.5--3rem, letter-spacing -0.03em
  - Цвет: `var(--color-text-primary)`
- **Граф (SVG):**
  - Ствол: вертикальная линия/кривая снизу вверх
  - Две ветки расходятся от ствола:
    - **Левая: Задачи** -- наклон влево, индиго/синие тона
    - **Правая: Эмоции** -- наклон вправо, лаванда/розовые тона
  - На концах веток -- узлы (круги) с иконками и подписями
  - Стиль линий: плавные bezier curves, stroke-width 2--3px
  - Цвет ствола: нейтральный (muted)
  - Цвет веток: градиент от ствола к цвету раздела
- **Анимация idle:**
  - Мягкое покачивание веток (CSS transform rotate, 8--12s cycle)
  - Пульсация узлов (scale 1 -> 1.05, 4s cycle)
  - Листья/точки вдоль веток -- мерцание opacity
- **Интерактивность:**
  - Hover на ветке: подсветка (усиление opacity + glow)
  - Клик/тап: ветка "вырастает" (scale + highlight), затем свайп-переход
  - Touch feedback на мобилке
- **Размеры:**
  - Desktop: граф занимает ~60% viewport height
  - Mobile: ~50% viewport height
  - Узлы: 48--56px diameter
  - Иконки в узлах: lucide, 22--24px, stroke-width 1.8

### Узлы веток

| Ветка | Узел | Иконка | Цвет |
|-------|------|--------|------|
| Задачи | Задачи | `calendar-check` | индиго |
| Задачи | Заметки | `notebook-pen` | индиго (lighter) |
| Задачи | Библиотека | `book-open` | индиго (lightest) |
| Эмоции | Эмоции | `heart` | лаванда |
| Эмоции | Помощник | `message-circle` | роза |
| Эмоции | Отчёт | `bar-chart-3` | мята |

### Декор
- Фоновые орбы: 2--3 штуки, fixed, blur 60--70px, медленный drift
- Основание дерева: мягкий radial-gradient "земля" (opacity 0.1)

---

## 3. Переходы между разделами

### Механика свайп-анимаций

**Home -> Tasks (свайп влево или клик):**
- Home-контент slide-out влево (translateX -100%)
- Tasks-контент slide-in справа (translateX 100% -> 0)
- Длительность: 0.4--0.5s, ease-out
- Bottom nav Tasks появляется снизу (translateY 100% -> 0, 0.3s)

**Home -> Emotions (свайп вправо или клик):**
- Home-контент slide-out вправо (translateX 100%)
- Emotions-контент slide-in слева (translateX -100% -> 0)
- Длительность: 0.4--0.5s, ease-out
- Bottom nav Emotions появляется снизу

**Section -> Home (кнопка домой или свайп):**
- Обратная анимация
- Bottom nav раздела уходит вниз

**Внутри раздела (переключение вкладок):**
- Fade transition, 0.2--0.3s
- Без горизонтального свайпа (чтобы не конфликтовать с drag & drop)

### Технические ограничения
- Использовать Vue `<Transition>` или GSAP
- `will-change: transform` на анимируемых контейнерах
- Отключить scroll во время перехода
- Touch gestures: Hammer.js или нативные pointer events

---

## 4. Sticky Notes (Стикеры задач)

### Цвета

| Тип | Background | Border | Shadow |
|-----|-----------|--------|--------|
| Красный (срочное) | #ffd0cc | #ffb3aa / 30% | rgba(255, 180, 170, 0.3) |
| Жёлтый (обычное) | #fff3b0 | #ffe680 / 30% | rgba(255, 230, 130, 0.3) |
| Зелёный (приятное) | #d4f0d4 | #b0e0b0 / 30% | rgba(176, 224, 176, 0.3) |

### Paper texture
- CSS `background-image`: subtle noise pattern (SVG data URI)
- Opacity: 0.03--0.05 (едва заметная текстура)
- `mix-blend-mode: multiply`

### Стикер (idle на доске / в пуле)
- `border-radius: 4px` (не слишком округлый -- имитация бумаги)
- Slight random rotation: -2deg to +3deg (CSS transform)
- Shadow: `0 2px 8px rgba(color, 0.2)`
- Размер: ~120x100px в пуле, ~24x24px метка на календаре
- Загнутый уголок (pseudo-element с triangle)

### Drag preview
- Увеличение: scale 1.05
- Усиление тени: `0 8px 24px rgba(0,0,0,0.15)`
- Rotation: текущий rotation + 2deg
- Opacity контейнера-источника: 0.3

### Бумажное окно редактора
- Modal / drawer
- Background: белый с paper texture
- Border: тонкий, цвет стикера
- Rounded corners: 8px
- Header: цвет стикера (полоска сверху)
- Поля: текст (textarea), категория (select/pills), уведомления (toggle)

---

## 5. Calendar Grid

### Месячный вид
- 7 колонок (Пн--Вс), заголовки -- сокращённые дни
- Ячейки: квадратные или слегка прямоугольные
- Текущий день: circle highlight (primary color, soft)
- Другие дни: `var(--color-text-primary)`
- Неактивные дни (другой месяц): `var(--color-text-muted)`, opacity 0.4
- Навигация: стрелки < > + название месяца (Inter, 600)

### Стикеры на датах
- Под номером дня: до 3 маленьких цветных точек (8px circles)
- Если больше 3 -- точка "..." или "+2"
- При наведении на дату: tooltip с превью задач

### Drop zone
- При перетаскивании стикера: ячейки подсвечиваются
- Активная drop-зона: border dashed, background-color стикера / 10%
- Анимация: border появляется с fade 0.15s

### Адаптивность
- Desktop: 720px grid, ячейки ~80--100px
- Mobile: full-width, ячейки ~48px, компактный вид

---

## 6. Bottom Navigation

### Общие правила
- `position: fixed; bottom: 0`
- Glassmorphism: `backdrop-filter: blur(20px)`, semi-transparent
- `-webkit-backdrop-filter` для Safari
- Height: 56--64px (mobile), 48px (desktop -- если нужен)
- Safe area padding: `padding-bottom: env(safe-area-inset-bottom)`
- Border-top: 1px solid rgba(white, 0.1)
- Max 3--4 items

### Tasks Bottom Nav

| Item | Иконка | Текст |
|------|--------|-------|
| Задачи | `calendar-check` | Задачи |
| Заметки | `notebook-pen` | Заметки |
| Библиотека | `book-open` | Библиотека |

- Active item: цвет индиго, иконка filled или bold
- Inactive: muted цвет

### Emotions Bottom Nav

| Item | Иконка | Текст |
|------|--------|-------|
| Эмоции | `heart` | Эмоции |
| Помощник | `message-circle` | Помощник |
| Отчёт | `bar-chart-3` | Отчёт |

- Active item: цвет лаванда / роза
- Inactive: muted цвет

### Анимация
- Появление: slide-up from bottom, 0.3s ease-out
- Active indicator: pill shape under active item, transition 0.2s
- Icon transition: scale 1 -> 1.1 on active, 0.2s

---

## 7. Дизайн-токены (обновление)

### Новые CSS-переменные (добавить в theme.css)

```css
/* Sticky note colors */
--color-sticky-red: #ffd0cc;
--color-sticky-red-border: rgba(255, 179, 170, 0.3);
--color-sticky-yellow: #fff3b0;
--color-sticky-yellow-border: rgba(255, 230, 128, 0.3);
--color-sticky-green: #d4f0d4;
--color-sticky-green-border: rgba(176, 224, 176, 0.3);

/* Section colors */
--color-section-tasks: var(--color-primary);  /* indigo */
--color-section-emotions: var(--color-lavender);

/* Tree graph */
--color-tree-trunk: var(--color-text-muted);
--color-tree-tasks-branch: var(--color-section-tasks);
--color-tree-emotions-branch: var(--color-section-emotions);
--color-tree-node-size: 52px;

/* Transitions */
--transition-page: 0.45s ease-out;
--transition-tab: 0.25s ease;
--transition-bottom-nav: 0.3s ease-out;

/* Calendar */
--calendar-cell-size: 80px;
--calendar-cell-size-mobile: 48px;
--calendar-dot-size: 8px;
```

### Dark theme adaptations
- Sticky notes: darken by 60%, increase saturation slightly
- Tree graph: branches glow slightly (box-shadow with branch color)
- Calendar: cell borders more visible (opacity 0.15 -> 0.25)
