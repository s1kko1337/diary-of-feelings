/**
 * Emotion wheel data — tree structure: category -> emotions
 * Each emotion has a unique key, Russian label, emoji, and color accent.
 */
export const emotionCategories = [
  {
    key: 'joy',
    label: 'Радость',
    emoji: '\u{1F60A}',
    color: 'var(--color-peach)',
    colorSoft: 'var(--color-peach-soft)',
    emotions: [
      { key: 'happiness', label: 'Счастье', emoji: '\u{1F604}' },
      { key: 'delight', label: 'Восторг', emoji: '\u{1F929}' },
      { key: 'gratitude', label: 'Благодарность', emoji: '\u{1F64F}' },
      { key: 'excitement', label: 'Воодушевление', emoji: '\u{1F31F}' },
      { key: 'tenderness', label: 'Нежность', emoji: '\u{1F970}' },
      { key: 'pride', label: 'Гордость', emoji: '\u{1F60C}' },
    ],
  },
  {
    key: 'calm',
    label: 'Спокойствие',
    emoji: '\u{1F9D8}',
    color: 'var(--color-mint)',
    colorSoft: 'var(--color-mint-soft)',
    emotions: [
      { key: 'peace', label: 'Умиротворение', emoji: '\u{1F343}' },
      { key: 'serenity', label: 'Безмятежность', emoji: '\u{2601}\uFE0F' },
      { key: 'relief', label: 'Облегчение', emoji: '\u{1F60C}' },
      { key: 'contentment', label: 'Удовлетворение', emoji: '\u{263A}\uFE0F' },
      { key: 'safety', label: 'Безопасность', emoji: '\u{1F3E0}' },
    ],
  },
  {
    key: 'sadness',
    label: 'Грусть',
    emoji: '\u{1F622}',
    color: 'var(--color-lavender)',
    colorSoft: 'var(--color-lavender-soft)',
    emotions: [
      { key: 'melancholy', label: 'Тоска', emoji: '\u{1F614}' },
      { key: 'loneliness', label: 'Одиночество', emoji: '\u{1F9CD}' },
      { key: 'disappointment', label: 'Разочарование', emoji: '\u{1F61E}' },
      { key: 'grief', label: 'Горе', emoji: '\u{1F62D}' },
      { key: 'nostalgia', label: 'Ностальгия', emoji: '\u{1F4F8}' },
      { key: 'helplessness', label: 'Беспомощность', emoji: '\u{1F625}' },
    ],
  },
  {
    key: 'anxiety',
    label: 'Тревога',
    emoji: '\u{1F630}',
    color: 'var(--color-rose)',
    colorSoft: 'var(--color-rose-soft)',
    emotions: [
      { key: 'worry', label: 'Беспокойство', emoji: '\u{1F61F}' },
      { key: 'fear', label: 'Страх', emoji: '\u{1F628}' },
      { key: 'panic', label: 'Паника', emoji: '\u{1F631}' },
      { key: 'uncertainty', label: 'Неопределённость', emoji: '\u{1F914}' },
      { key: 'tension', label: 'Напряжение', emoji: '\u{1F62C}' },
    ],
  },
  {
    key: 'anger',
    label: 'Злость',
    emoji: '\u{1F621}',
    color: 'var(--color-danger)',
    colorSoft: 'rgb(232 160 160 / 0.15)',
    emotions: [
      { key: 'irritation', label: 'Раздражение', emoji: '\u{1F624}' },
      { key: 'frustration', label: 'Фрустрация', emoji: '\u{1F620}' },
      { key: 'resentment', label: 'Обида', emoji: '\u{1F612}' },
      { key: 'rage', label: 'Ярость', emoji: '\u{1F92C}' },
      { key: 'envy', label: 'Зависть', emoji: '\u{1F611}' },
    ],
  },
  {
    key: 'fatigue',
    label: 'Усталость',
    emoji: '\u{1F62A}',
    color: 'var(--color-lavender)',
    colorSoft: 'var(--color-lavender-soft)',
    emotions: [
      { key: 'exhaustion', label: 'Истощение', emoji: '\u{1F634}' },
      { key: 'burnout', label: 'Выгорание', emoji: '\u{1F525}' },
      { key: 'apathy', label: 'Апатия', emoji: '\u{1F636}' },
      { key: 'boredom', label: 'Скука', emoji: '\u{1F971}' },
      { key: 'overwhelm', label: 'Перегрузка', emoji: '\u{1F635}' },
    ],
  },
  {
    key: 'surprise',
    label: 'Удивление',
    emoji: '\u{1F62F}',
    color: 'var(--color-peach)',
    colorSoft: 'var(--color-peach-soft)',
    emotions: [
      { key: 'amazement', label: 'Изумление', emoji: '\u{1F632}' },
      { key: 'confusion', label: 'Замешательство', emoji: '\u{1F615}' },
      { key: 'curiosity', label: 'Любопытство', emoji: '\u{1F9D0}' },
      { key: 'awe', label: 'Трепет', emoji: '\u{1FA77}' },
    ],
  },
]

/**
 * Flat map: emotion key -> { key, label, emoji, category, categoryLabel, color, colorSoft }
 */
export const emotionsMap = new Map()
for (const cat of emotionCategories) {
  for (const emo of cat.emotions) {
    emotionsMap.set(emo.key, {
      ...emo,
      category: cat.key,
      categoryLabel: cat.label,
      color: cat.color,
      colorSoft: cat.colorSoft,
    })
  }
}

/**
 * Get emotion info by key
 */
export function getEmotion(key) {
  return emotionsMap.get(key) ?? null
}
