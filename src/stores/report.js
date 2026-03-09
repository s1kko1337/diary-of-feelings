import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { reportsApi } from '@/api/reports.js'

export const useReportStore = defineStore('report', () => {
  const period = ref('week')
  const emotionReport = ref(null)
  const cbtReport = ref(null)
  const tasksReport = ref(null)
  const loading = ref(false)

  const positiveDelta = computed(() => {
    const report = emotionReport.value
    if (!report) return null
    const current = report.positiveRatio ?? null
    const prev = report.previousPositiveRatio ?? null
    if (current === null || prev === null) return null
    const diff = current - prev
    if (diff === 0) return null
    return diff
  })

  const hasData = computed(() => {
    const entries = emotionReport.value?.entries
    return entries && entries.length > 0
  })

  async function fetchAll() {
    loading.value = true
    try {
      const params = { period: period.value }
      ;[
        emotionReport.value,
        cbtReport.value,
        tasksReport.value,
      ] = await Promise.all([
        reportsApi.getEmotionReport(params),
        reportsApi.getCbtReport(params),
        reportsApi.getTasksReport(params),
      ])
    } finally {
      loading.value = false
    }
  }

  function setPeriod(p) {
    period.value = p
    fetchAll()
  }

  return {
    period,
    emotionReport,
    cbtReport,
    tasksReport,
    loading,
    positiveDelta,
    hasData,
    fetchAll,
    setPeriod,
  }
})
