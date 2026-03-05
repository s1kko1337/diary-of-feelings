/**
 * Seed data for CBT diary entries (SMEAR model)
 * 5 test entries with varying levels of completeness
 */
export const seedEntries = [
  {
    id: 'cbt-seed-1',
    createdAt: '2026-03-05T14:30:00Z',
    date: '2026-03-05',
    situation: 'Коллега не ответил на моё сообщение за 3 часа',
    thoughts:
      'Он меня игнорирует. Я сделал что-то не так. Может, он злится на меня из-за вчерашнего совещания.',
    emotions: [
      { key: 'anxiety', label: 'Тревога', intensity: 7 },
      { key: 'resentment', label: 'Обида', intensity: 5 },
    ],
    reaction: 'Написал ещё три сообщения подряд, проверял телефон каждые 5 минут',
    distortion: 'mind-reading',
    challenge: 'Есть ли доказательства, что он злится? Нет. Может, он просто занят на встрече.',
    alternative: 'Возможно, он на встрече или загружен работой. Не всё связано со мной.',
    emotionsAfter: [{ key: 'anxiety', label: 'Тревога', intensity: 3 }],
  },
  {
    id: 'cbt-seed-2',
    createdAt: '2026-03-04T09:15:00Z',
    date: '2026-03-04',
    situation: 'Получил критику по проекту от руководителя при всей команде',
    thoughts: 'Все видели, как я облажался. Я некомпетентен. Меня точно уволят.',
    emotions: [
      { key: 'shame', label: 'Стыд', intensity: 8 },
      { key: 'fear', label: 'Страх', intensity: 6 },
      { key: 'anger', label: 'Злость', intensity: 4 },
    ],
    reaction: 'Замолчал на остаток совещания, потом долго не мог начать работать',
    distortion: 'catastrophizing',
    challenge: null,
    alternative: null,
    emotionsAfter: [],
  },
  {
    id: 'cbt-seed-3',
    createdAt: '2026-03-03T20:00:00Z',
    date: '2026-03-03',
    situation: 'Друг отменил встречу в последний момент',
    thoughts: 'Ему всегда не до меня. Никто не хочет проводить со мной время.',
    emotions: [
      { key: 'loneliness', label: 'Одиночество', intensity: 6 },
      { key: 'disappointment', label: 'Разочарование', intensity: 5 },
    ],
    reaction: 'Остался дома, листал соцсети весь вечер',
    distortion: 'overgeneralization',
    challenge:
      'Он отменял встречи раньше? Да, но обычно по уважительным причинам. Мы виделись на прошлой неделе.',
    alternative:
      'У него могли возникнуть срочные дела. Одна отмена не означает, что дружба под угрозой.',
    emotionsAfter: [
      { key: 'loneliness', label: 'Одиночество', intensity: 3 },
      { key: 'calm', label: 'Спокойствие', intensity: 4 },
    ],
  },
  {
    id: 'cbt-seed-4',
    createdAt: '2026-03-01T16:45:00Z',
    date: '2026-03-01',
    situation: 'Сдал отчёт вовремя, но нашёл мелкую опечатку после отправки',
    thoughts: 'Я не могу сделать ничего нормально. Все заметят ошибку.',
    emotions: [
      { key: 'guilt', label: 'Вина', intensity: 5 },
      { key: 'anxiety', label: 'Тревога', intensity: 4 },
    ],
    reaction: 'Перепроверял все старые отчёты до позднего вечера',
    distortion: 'black-white',
    challenge: null,
    alternative: null,
    emotionsAfter: [],
  },
  {
    id: 'cbt-seed-5',
    createdAt: '2026-02-28T11:20:00Z',
    date: '2026-02-28',
    situation: 'На улице незнакомец посмотрел в мою сторону с недовольным выражением',
    thoughts: 'Что со мной не так? Наверное, я выгляжу странно.',
    emotions: [
      { key: 'anxiety', label: 'Тревога', intensity: 3 },
      { key: 'confusion', label: 'Растерянность', intensity: 4 },
    ],
    reaction: 'Проверил внешний вид в отражении витрины',
    distortion: null,
    challenge: null,
    alternative: null,
    emotionsAfter: [],
  },
]
