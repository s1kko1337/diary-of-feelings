import { ref, computed } from 'vue'
import { emotionCategories, getEmotion } from '@/api/mock/data/emotions-wheel'

export function useEmotionWheel() {
  const selectedCategory = ref(null)
  const selectedEmotion = ref(null)

  const categories = emotionCategories

  const currentEmotions = computed(() => {
    if (!selectedCategory.value) return []
    const cat = categories.find((c) => c.key === selectedCategory.value)
    return cat ? cat.emotions : []
  })

  const selectedEmotionInfo = computed(() => {
    if (!selectedEmotion.value) return null
    return getEmotion(selectedEmotion.value)
  })

  function selectCategory(key) {
    selectedCategory.value = key
    selectedEmotion.value = null
  }

  function selectEmotion(key) {
    selectedEmotion.value = key
  }

  function reset() {
    selectedCategory.value = null
    selectedEmotion.value = null
  }

  return {
    categories,
    selectedCategory,
    selectedEmotion,
    currentEmotions,
    selectedEmotionInfo,
    selectCategory,
    selectEmotion,
    reset,
  }
}
