<template>
  <div class="emotion-picker">
    <!-- Added emotions list -->
    <TransitionGroup name="emotion-slide" tag="div" class="added-emotions">
      <div v-for="(emotion, index) in modelValue" :key="emotion.key" class="added-emotion-row">
        <span class="added-emotion-name">{{ emotion.label }}</span>
        <input
          type="range"
          min="0"
          max="10"
          :value="emotion.intensity"
          class="added-emotion-slider"
          aria-label="Интенсивность эмоции"
          :aria-valuemin="0"
          :aria-valuemax="10"
          :aria-valuenow="emotion.intensity"
          @input="updateIntensity(index, $event)"
        />
        <span class="added-emotion-value metric-value">
          {{ emotion.intensity }}
        </span>
        <button
          class="remove-emotion-btn"
          aria-label="Удалить эмоцию"
          @click="removeEmotion(index)"
        >
          <XIcon :size="16" :stroke-width="1.8" />
        </button>
      </div>
    </TransitionGroup>

    <!-- Add emotion button + dropdown -->
    <div v-if="modelValue.length < maxEmotions" class="add-emotion-wrapper">
      <button class="add-emotion-btn" @click="toggleDropdown">
        <PlusIcon :size="16" :stroke-width="1.8" />
        Добавить эмоцию
      </button>

      <div v-if="isDropdownOpen" class="emotion-dropdown glass-card">
        <div class="emotion-search-wrapper">
          <SearchIcon :size="14" :stroke-width="1.8" class="emotion-search-icon" />
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            class="emotion-search"
            placeholder="Поиск..."
          />
        </div>
        <div class="emotion-options">
          <button
            v-for="emo in filteredEmotions"
            :key="emo.key"
            class="emotion-option"
            :disabled="isSelected(emo.key)"
            @click="addEmotion(emo)"
          >
            {{ emo.label }}
          </button>
          <p v-if="filteredEmotions.length === 0" class="emotion-no-results">Ничего не найдено</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { PlusIcon, XIcon, SearchIcon } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  maxEmotions: { type: Number, default: 5 },
})

const emit = defineEmits(['update:modelValue'])

const availableEmotions = [
  { key: 'anxiety', label: 'Тревога' },
  { key: 'fear', label: 'Страх' },
  { key: 'sadness', label: 'Грусть' },
  { key: 'anger', label: 'Злость' },
  { key: 'resentment', label: 'Обида' },
  { key: 'guilt', label: 'Вина' },
  { key: 'shame', label: 'Стыд' },
  { key: 'disappointment', label: 'Разочарование' },
  { key: 'loneliness', label: 'Одиночество' },
  { key: 'exhaustion', label: 'Усталость' },
  { key: 'confusion', label: 'Растерянность' },
  { key: 'joy', label: 'Радость' },
  { key: 'gratitude', label: 'Благодарность' },
  { key: 'calm', label: 'Спокойствие' },
]

const isDropdownOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

const filteredEmotions = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return availableEmotions
  return availableEmotions.filter((e) => e.label.toLowerCase().includes(q))
})

function isSelected(key) {
  return props.modelValue.some((e) => e.key === key)
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
  if (isDropdownOpen.value) {
    searchQuery.value = ''
    nextTick(() => searchInput.value?.focus())
  }
}

function addEmotion(emo) {
  if (isSelected(emo.key)) return
  const updated = [...props.modelValue, { key: emo.key, label: emo.label, intensity: 5 }]
  emit('update:modelValue', updated)
  isDropdownOpen.value = false
  searchQuery.value = ''
}

function removeEmotion(index) {
  const updated = props.modelValue.filter((_, i) => i !== index)
  emit('update:modelValue', updated)
}

function updateIntensity(index, event) {
  const value = parseInt(event.target.value, 10)
  const updated = props.modelValue.map((e, i) => (i === index ? { ...e, intensity: value } : e))
  emit('update:modelValue', updated)
}
</script>

<style scoped>
.emotion-picker {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.added-emotions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.added-emotion-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  background: var(--color-peach-soft);
  border: 1px solid rgb(248 201 160 / 0.25);
}

.added-emotion-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
  min-width: 80px;
}

.added-emotion-slider {
  flex: 1;
  accent-color: var(--color-peach);
  cursor: pointer;
}

.added-emotion-value {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-text);
  min-width: 20px;
  text-align: center;
}

.remove-emotion-btn {
  color: var(--color-text-muted);
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
}

.remove-emotion-btn:hover {
  color: var(--color-danger);
}

.add-emotion-wrapper {
  position: relative;
}

.add-emotion-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  border: 1px dashed var(--color-border);
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-emotion-btn:hover {
  border-color: var(--color-peach);
  color: var(--color-text);
  background: var(--color-peach-soft);
}

.emotion-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 20;
  width: 240px;
  max-height: 280px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.emotion-search-wrapper {
  position: relative;
  margin-bottom: 4px;
}

.emotion-search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  pointer-events: none;
}

.emotion-search {
  width: 100%;
  padding: 7px 10px 7px 30px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface-hover);
  color: var(--color-text);
  font-size: 0.82rem;
  font-family: var(--font-main);
  outline: none;
}

.emotion-search:focus {
  border-color: var(--color-peach);
}

.emotion-options {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.emotion-option {
  padding: 7px 10px;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--color-text);
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease;
}

.emotion-option:hover:not(:disabled) {
  background: var(--color-peach-soft);
}

.emotion-option:disabled {
  opacity: 0.4;
  cursor: default;
}

.emotion-no-results {
  padding: 12px 10px;
  font-size: 0.78rem;
  color: var(--color-text-muted);
  text-align: center;
}

/* Transition for added emotions */
.emotion-slide-enter-active {
  transition: all 0.25s ease;
}

.emotion-slide-leave-active {
  transition: all 0.2s ease;
}

.emotion-slide-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.emotion-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.add-emotion-btn:focus-visible,
.remove-emotion-btn:focus-visible,
.emotion-option:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
