<template>
  <div class="wheel">
    <!-- Categories ring -->
    <div v-if="!selectedCategory" class="wheel-ring">
      <button
        v-for="cat in categories"
        :key="cat.key"
        class="wheel-item"
        :style="{ '--item-color': cat.color, '--item-bg': cat.colorSoft }"
        @click="selectCategory(cat.key)"
      >
        <span class="wheel-item-emoji">{{ cat.emoji }}</span>
        <span class="wheel-item-label">{{ cat.label }}</span>
      </button>
    </div>

    <!-- Emotions within category -->
    <div v-else class="wheel-inner">
      <button class="wheel-back" @click="goBack">
        <ChevronLeftIcon :size="16" :stroke-width="2" />
        {{ activeCategoryLabel }}
      </button>

      <div class="wheel-ring">
        <button
          v-for="emo in currentEmotions"
          :key="emo.key"
          class="wheel-item"
          :class="{ 'wheel-item--selected': selectedEmotion === emo.key }"
          :style="{ '--item-color': activeColor, '--item-bg': activeColorSoft }"
          @click="handleSelect(emo.key)"
        >
          <span class="wheel-item-emoji">{{ emo.emoji }}</span>
          <span class="wheel-item-label">{{ emo.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeftIcon } from 'lucide-vue-next'
import { useEmotionWheel } from '@/composables/useEmotionWheel'

const emit = defineEmits(['select'])

const {
  categories,
  selectedCategory,
  selectedEmotion,
  currentEmotions,
  selectCategory,
  selectEmotion,
} = useEmotionWheel()

const activeCategory = computed(() => categories.find((c) => c.key === selectedCategory.value))
const activeCategoryLabel = computed(() => activeCategory.value?.label ?? '')
const activeColor = computed(() => activeCategory.value?.color ?? '')
const activeColorSoft = computed(() => activeCategory.value?.colorSoft ?? '')

function goBack() {
  selectedCategory.value = null
  selectedEmotion.value = null
}

function handleSelect(key) {
  selectEmotion(key)
  emit('select', {
    emotion: key,
    emotionCategory: selectedCategory.value,
  })
}
</script>

<style scoped>
.wheel {
  width: 100%;
}

.wheel-ring {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.wheel-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 16px;
  min-width: 90px;
  border-radius: var(--radius-lg);
  border: 1px solid transparent;
  background: var(--item-bg);
  cursor: pointer;
  transition: all 0.25s ease;
}

.wheel-item:hover {
  transform: translateY(-2px);
  border-color: var(--item-color);
  box-shadow: 0 4px 16px var(--item-bg);
}

.wheel-item--selected {
  border-color: var(--item-color);
  background: var(--item-color);
}

.wheel-item--selected .wheel-item-label {
  color: white;
}

.wheel-item-emoji {
  font-size: 1.5rem;
}

.wheel-item-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text);
}

/* Back button */
.wheel-inner {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wheel-back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  align-self: flex-start;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  border: none;
  background: var(--color-surface-hover);
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  font-weight: 500;
  font-family: var(--font-main);
  cursor: pointer;
  transition: all 0.2s ease;
}

.wheel-back:hover {
  color: var(--color-text);
}
</style>
