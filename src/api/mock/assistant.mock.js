const STORAGE_KEY = 'diary-chat-history'

const MOCK_RESPONSES = [
  'Я слышу тебя. Это звучит непросто — расскажи подробнее, что сейчас происходит?',
  'Знаешь, такие чувства абсолютно нормальны. Что, как тебе кажется, за этим стоит?',
  'Ты молодец, что замечаешь это. Попробуй сделать три глубоких вдоха — это поможет немного успокоить нервную систему.',
  'Интересно. А как ты себя чувствовал(а) сразу после этого момента?',
  'Я понимаю. Иногда просто нужно выговориться — продолжай, я здесь.',
  'Это похоже на ситуацию, когда ожидания не совпадают с реальностью. Что ты сейчас хочешь больше всего?',
  'Ты уже делаешь важную работу — просто осознаёшь своё состояние. Это первый шаг.',
  'Попробуй на секунду представить, что бы ты посоветовал(а) близкому другу в такой ситуации.',
  'Давай попробуем разобрать это по частям. Что случилось сначала?',
  'Мне кажется, ты очень требователен(на) к себе. Можно быть чуть мягче — ты заслуживаешь этого.',
]

function getRandomResponse() {
  return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)]
}

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function save(messages) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
}

export function getHistory() {
  return load()
}

export function sendMessage(content) {
  const messages = load()

  const userMsg = {
    id: crypto.randomUUID(),
    role: 'user',
    content,
    createdAt: new Date().toISOString(),
  }
  messages.push(userMsg)

  const aiMsg = {
    id: crypto.randomUUID(),
    role: 'assistant',
    content: getRandomResponse(),
    createdAt: new Date().toISOString(),
  }
  messages.push(aiMsg)

  save(messages)
  return { userMessage: userMsg, assistantMessage: aiMsg }
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY)
}
