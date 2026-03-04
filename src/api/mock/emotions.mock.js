const STORAGE_KEY = 'diary-emotions'

function loadAll() {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveAll(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function create(data) {
  const entries = loadAll()
  const entry = {
    id: crypto.randomUUID(),
    date: data.date || new Date().toISOString().slice(0, 10),
    emotion: data.emotion,
    emotionCategory: data.emotionCategory,
    intensity: data.intensity ?? 5,
    note: data.note || '',
    isTimeCapsule: data.isTimeCapsule || false,
    timeCapsuleRevealDate: data.isTimeCapsule
      ? new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
      : null,
    createdAt: new Date().toISOString(),
  }
  entries.unshift(entry)
  saveAll(entries)
  return entry
}

export function getByDate(date) {
  return loadAll().filter((e) => e.date === date)
}

export function getHistory({ from, to } = {}) {
  let entries = loadAll()
  if (from) entries = entries.filter((e) => e.date >= from)
  if (to) entries = entries.filter((e) => e.date <= to)
  return entries
}

export function getTimeCapsules() {
  const today = new Date().toISOString().slice(0, 10)
  return loadAll().filter(
    (e) => e.isTimeCapsule && e.timeCapsuleRevealDate && e.timeCapsuleRevealDate <= today,
  )
}

export function remove(id) {
  const entries = loadAll().filter((e) => e.id !== id)
  saveAll(entries)
  return true
}

export function getPatterns() {
  const entries = loadAll()
  const last7 = entries.filter((e) => {
    const diff = Date.now() - new Date(e.createdAt).getTime()
    return diff <= 7 * 86400000
  })

  const freq = {}
  for (const e of last7) {
    freq[e.emotion] = (freq[e.emotion] || 0) + 1
  }

  return {
    totalEntries: last7.length,
    topEmotions: Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([emotion, count]) => ({ emotion, count })),
    averageIntensity:
      last7.length > 0
        ? Math.round((last7.reduce((s, e) => s + e.intensity, 0) / last7.length) * 10) / 10
        : 0,
  }
}
