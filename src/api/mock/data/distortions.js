/**
 * Cognitive distortions list for CBT diary (SMEAR model)
 * Each distortion has a unique key, Russian label, hint quote,
 * lucide icon name, and color accent.
 */
export const distortions = [
  {
    key: 'catastrophizing',
    label: 'Катастрофизация',
    hint: '«Это ужасно и всё пропало»',
    icon: 'AlertTriangleIcon',
    color: 'rose',
  },
  {
    key: 'mind-reading',
    label: 'Чтение мыслей',
    hint: '«Я знаю, что он обо мне думает»',
    icon: 'EyeIcon',
    color: 'lavender',
  },
  {
    key: 'black-white',
    label: 'Чёрно-белое',
    hint: '«Либо идеально, либо провал»',
    icon: 'ContrastIcon',
    color: 'peach',
  },
  {
    key: 'personalization',
    label: 'Персонализация',
    hint: '«Это всё из-за меня»',
    icon: 'UserIcon',
    color: 'rose',
  },
  {
    key: 'overgeneralization',
    label: 'Сверхобобщение',
    hint: '«Так всегда, я никогда...»',
    icon: 'InfinityIcon',
    color: 'lavender',
  },
  {
    key: 'discounting',
    label: 'Обесценивание',
    hint: '«Это не в счёт, просто повезло»',
    icon: 'MinusCircleIcon',
    color: 'peach',
  },
  {
    key: 'emotional-reasoning',
    label: 'Эмоц. обоснование',
    hint: '«Я чувствую тревогу — значит, опасно»',
    icon: 'HeartCrackIcon',
    color: 'rose',
  },
  {
    key: 'should-statements',
    label: 'Долженствование',
    hint: '«Я должен(а) быть лучше»',
    icon: 'GavelIcon',
    color: 'lavender',
  },
  {
    key: 'labeling',
    label: 'Навешивание ярлыков',
    hint: '«Я неудачник(ца)»',
    icon: 'TagIcon',
    color: 'peach',
  },
  {
    key: 'tunnel-vision',
    label: 'Тоннельное зрение',
    hint: '«Вижу только плохое»',
    icon: 'FocusIcon',
    color: 'lavender',
  },
]

/**
 * Map distortion key -> distortion object
 */
export const distortionsMap = new Map(distortions.map((d) => [d.key, d]))

/**
 * Get distortion info by key
 */
export function getDistortion(key) {
  return distortionsMap.get(key) ?? null
}
