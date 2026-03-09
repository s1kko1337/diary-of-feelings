export function mockGetEmotionReport({ period = 'week' } = {}) {
  const days = period === 'month' ? 30 : 7

  const entries = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const dateStr = date.toISOString().slice(0, 10)
    const intensity = Math.floor(Math.random() * 7) + 3
    const emotions = ['Радость', 'Спокойствие', 'Тревога', 'Грусть', 'Усталость']
    const emotion = emotions[Math.floor(Math.random() * emotions.length)]
    entries.push({ date: dateStr, emotionName: emotion, intensity })
  }

  const counts = {}
  entries.forEach((e) => {
    counts[e.emotionName] = (counts[e.emotionName] || 0) + 1
  })
  const topEmotions = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }))

  const avgIntensity = entries.reduce((sum, e) => sum + e.intensity, 0) / entries.length

  const positiveNames = ['Радость', 'Спокойствие']
  const currentPositive = entries.filter(
    (e) => positiveNames.includes(e.emotionName)
  ).length
  const currentRatio = entries.length
    ? currentPositive / entries.length
    : 0
  // Simulate previous period ratio slightly different
  const prevRatio = Math.max(
    0, Math.min(1, currentRatio + (Math.random() * 0.3 - 0.15))
  )

  return {
    period,
    entries,
    topEmotions,
    averageIntensity: Math.round(avgIntensity * 10) / 10,
    total: entries.length,
    positiveRatio: Math.round(currentRatio * 100),
    previousPositiveRatio: Math.round(prevRatio * 100),
  }
}

export function mockGetCbtReport() {
  return {
    total: Math.floor(Math.random() * 10) + 2,
    byStatus: { new: 2, in_progress: 3, processed: 5 },
    topDistortions: [
      { name: 'Катастрофизация', count: 4 },
      { name: 'Черно-белое мышление', count: 3 },
      { name: 'Сверхобобщение', count: 2 },
    ],
  }
}

export function mockGetTasksReport() {
  return {
    total: Math.floor(Math.random() * 20) + 5,
    completed: Math.floor(Math.random() * 10) + 2,
    byColor: { red: 4, yellow: 8, green: 6 },
  }
}
