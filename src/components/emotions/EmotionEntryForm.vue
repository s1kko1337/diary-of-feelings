<template>
  <div class="entry-form">
    <!-- Selected emotion display -->
    <div v-if="selectedEmotionInfo" class="selected-emotion">
      <span class="selected-emoji">{{ selectedEmotionInfo.emoji }}</span>
      <span class="selected-label">{{ selectedEmotionInfo.label }}</span>
      <button class="change-btn" @click="emit('change-emotion')">Изменить</button>
    </div>

    <!-- Intensity slider -->
    <div class="field">
      <label class="field-label">Интенсивность: {{ intensity }}/10</label>
      <input
        v-model.number="intensity"
        type="range"
        min="0"
        max="10"
        step="1"
        class="intensity-slider"
        :style="{ '--fill': `${intensity * 10}%`, '--accent': selectedEmotionInfo?.color }"
      />
      <div class="intensity-labels">
        <span>Слабо</span>
        <span>Сильно</span>
      </div>
    </div>

    <!-- Note -->
    <div class="field">
      <label class="field-label">Одним предложением</label>
      <input
        v-model="note"
        type="text"
        class="note-input"
        placeholder="Что происходит?"
        maxlength="200"
        @keydown.enter="handleSubmit"
      />
    </div>

    <!-- Time capsule toggle -->
    <div class="capsule-row" @click="isTimeCapsule = !isTimeCapsule">
      <div class="capsule-info">
        <ClockIcon :size="16" :stroke-width="1.8" />
        <span>Тайм-капсула</span>
      </div>
      <span class="capsule-hint">Увидишь через 30 дней</span>
      <div class="toggle" :class="{ 'toggle--on': isTimeCapsule }">
        <div class="toggle-knob" />
      </div>
    </div>

    <!-- Submit -->
    <button class="submit-btn" :disabled="!canSubmit" @click="handleSubmit">
      <PenLineIcon :size="16" :stroke-width="1.8" />
      Записать
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ClockIcon, PenLineIcon } from 'lucide-vue-next'
import { getEmotion } from '@/api/mock/data/emotions-wheel'

const props = defineProps({
  emotion: { type: String, default: null },
  emotionCategory: { type: String, default: null },
})

const emit = defineEmits(['submit', 'change-emotion'])

const intensity = ref(5)
const note = ref('')
const isTimeCapsule = ref(false)

const selectedEmotionInfo = computed(() => (props.emotion ? getEmotion(props.emotion) : null))

const canSubmit = computed(() => props.emotion !== null)

function handleSubmit() {
  if (!canSubmit.value) return
  emit('submit', {
    emotion: props.emotion,
    emotionCategory: props.emotionCategory,
    intensity: intensity.value,
    note: note.value,
    isTimeCapsule: isTimeCapsule.value,
  })
  intensity.value = 5
  note.value = ''
  isTimeCapsule.value = false
}
</script>

<style scoped>
.entry-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Selected emotion */
.selected-emotion {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  background: var(--color-surface-hover);
}

.selected-emoji {
  font-size: 1.5rem;
}

.selected-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
  flex: 1;
}

.change-btn {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: none;
  font-size: 0.75rem;
  font-weight: 500;
  font-family: var(--font-main);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.change-btn:hover {
  color: var(--color-text);
  border-color: var(--color-primary);
}

/* Field */
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
}

/* Intensity slider */
.intensity-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: var(--radius-full);
  background: linear-gradient(
    to right,
    var(--accent, var(--color-primary)) 0%,
    var(--accent, var(--color-primary)) var(--fill, 50%),
    var(--color-border) var(--fill, 50%),
    var(--color-border) 100%
  );
  outline: none;
  cursor: pointer;
}

.intensity-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-surface-solid);
  border: 2px solid var(--accent, var(--color-primary));
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.15);
  cursor: grab;
}

.intensity-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-surface-solid);
  border: 2px solid var(--accent, var(--color-primary));
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.15);
  cursor: grab;
}

.intensity-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: var(--color-text-muted);
}

/* Note input */
.note-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.9rem;
  font-family: var(--font-main);
  outline: none;
  transition: all 0.2s ease;
}

.note-input::placeholder {
  color: var(--color-text-muted);
}

.note-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

/* Time capsule */
.capsule-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  background: var(--color-surface-hover);
  cursor: pointer;
  transition: background 0.2s ease;
}

.capsule-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: var(--color-text);
}

.capsule-hint {
  flex: 1;
  text-align: right;
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.toggle {
  width: 36px;
  height: 20px;
  border-radius: var(--radius-full);
  background: var(--color-border);
  padding: 2px;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.toggle--on {
  background: var(--color-primary);
}

.toggle-knob {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-surface-solid);
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.15);
  transition: transform 0.2s ease;
}

.toggle--on .toggle-knob {
  transform: translateX(16px);
}

/* Submit */
.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  border-radius: var(--radius-lg);
  border: none;
  background: var(--color-primary);
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: var(--font-main);
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover {
  opacity: 0.85;
}

.submit-btn:disabled {
  opacity: 0.4;
  pointer-events: none;
}
</style>
