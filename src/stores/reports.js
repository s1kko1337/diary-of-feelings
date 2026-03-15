import { defineStore } from 'pinia'
import { ref } from 'vue'
import { reportsApi } from '@/api/reports'
import { getMoodScore, getStreaks, getPatterns } from '@/api/insights'

export const useReportsStore = defineStore('reports', () => {
  const emotionReport = ref(null)
  const cbtReport = ref(null)
  const tasksReport = ref(null)
  const period = ref('week')
  const dateFrom = ref('')
  const dateTo = ref('')
  const loading = ref(false)

  // Insights
  const moodScore = ref(null)
  const streaks = ref(null)
  const patterns = ref(null)

  function getReportParams() {
    if (period.value === 'custom' && dateFrom.value && dateTo.value) {
      return { date_from: dateFrom.value, date_to: dateTo.value }
    }
    return { period: period.value }
  }

  async function fetchAll() {
    loading.value = true
    try {
      const params = getReportParams()
      const [emotions, cbt, tasks] = await Promise.all([
        reportsApi.getEmotionReport(params),
        reportsApi.getCbtReport(params),
        reportsApi.getTasksReport(params),
      ])
      emotionReport.value = emotions
      cbtReport.value = cbt
      tasksReport.value = tasks
    } finally {
      loading.value = false
    }
  }

  async function fetchInsights() {
    const [ms, st, pt] = await Promise.allSettled([
      getMoodScore(30),
      getStreaks(),
      getPatterns(),
    ])
    if (ms.status === 'fulfilled') moodScore.value = ms.value
    if (st.status === 'fulfilled') streaks.value = st.value
    if (pt.status === 'fulfilled') patterns.value = pt.value
  }

  function setPeriod(p) {
    period.value = p
  }

  function setCustomRange(from, to) {
    dateFrom.value = from
    dateTo.value = to
    period.value = 'custom'
  }

  return {
    emotionReport, cbtReport, tasksReport, period, dateFrom, dateTo, loading,
    moodScore, streaks, patterns,
    fetchAll, fetchInsights, setPeriod, setCustomRange,
  }
})
