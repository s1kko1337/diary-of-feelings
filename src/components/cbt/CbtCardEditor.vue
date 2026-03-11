<template>
  <Teleport to="body">
    <div v-if="show" class="cbt-editor-overlay" @click.self="handleClose">
      <div class="cbt-editor">
        <div class="cbt-editor__header">
          <h3 class="cbt-editor__title">
            {{ isEdit ? 'Запись СМЭР' : 'Новая запись' }}
          </h3>
          <div class="cbt-editor__header-actions">
            <!-- Advanced mode toggle -->
            <button
              class="advanced-toggle"
              :class="{ active: advancedMode }"
              @click="advancedMode = !advancedMode"
            >
              {{ advancedMode ? 'Базовый режим' : 'Продвинутый' }}
            </button>
            <button class="cbt-editor__close" @click="handleClose">
              <XIcon :size="20" />
            </button>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="cbt-progress">
          <div class="cbt-progress__bar" :style="{ width: fillPercent + '%' }" />
        </div>

        <!-- S — Situation -->
        <div class="cbt-field">
          <label class="cbt-field__label">С — Ситуация</label>
          <textarea
            v-model="form.situation"
            class="cbt-field__input"
            placeholder="Что произошло объективно?"
            rows="2"
          />
        </div>

        <!-- M — Thoughts -->
        <div class="cbt-field">
          <label class="cbt-field__label">М — Мысли</label>
          <textarea
            v-model="form.thoughts"
            class="cbt-field__input"
            placeholder="Автоматические мысли..."
            rows="2"
          />
        </div>

        <!-- E — Emotions -->
        <div class="cbt-field">
          <label class="cbt-field__label">Э — Эмоции</label>
          <CbtEmotionPicker v-model="form.emotions" />
        </div>

        <!-- R — Reaction -->
        <div class="cbt-field">
          <label class="cbt-field__label">Р — Реакция</label>
          <textarea
            v-model="form.reaction"
            class="cbt-field__input"
            placeholder="Что сделал(а)?"
            rows="2"
          />
        </div>

        <!-- ADVANCED FIELDS -->
        <template v-if="advancedMode">
          <!-- Cognitive distortion -->
          <div class="cbt-field">
            <label class="cbt-field__label">Когнитивное искажение</label>
            <div class="distortion-grid">
              <button
                v-for="d in distortions"
                :key="d.key"
                class="distortion-chip"
                :class="{ active: form.distortion === d.key }"
                :title="d.hint"
                @click="form.distortion = form.distortion === d.key ? '' : d.key"
              >
                {{ d.label }}
              </button>
            </div>
          </div>

          <!-- Challenge -->
          <div class="cbt-field">
            <label class="cbt-field__label">Оспаривание мысли</label>
            <textarea
              v-model="form.challenge"
              class="cbt-field__input"
              placeholder="Есть ли доказательства? Что бы сказал друг?"
              rows="2"
            />
          </div>

          <!-- Alternative thought -->
          <div class="cbt-field">
            <label class="cbt-field__label">Альтернативная мысль</label>
            <textarea
              v-model="form.alternativeThought"
              class="cbt-field__input"
              placeholder="Более сбалансированный взгляд..."
              rows="2"
            />
          </div>

          <!-- Intensity after -->
          <div class="cbt-field">
            <label class="cbt-field__label">Эмоции после проработки</label>
            <div class="cbt-intensity-row">
              <span class="cbt-intensity-label">Интенсивность после: {{ form.intensityAfter }}/10</span>
              <input
                v-model.number="form.intensityAfter"
                type="range"
                min="1"
                max="10"
                class="cbt-slider"
              />
            </div>
          </div>

          <!-- Reflection (only in processed status) -->
          <div v-if="form.status === 'processed'" class="cbt-field">
            <label class="cbt-field__label">Рефлексия</label>
            <textarea
              v-model="form.reflection"
              class="cbt-field__input"
              placeholder="Что понял(а) в процессе проработки?"
              rows="2"
            />
          </div>
        </template>

        <!-- Status selector -->
        <div class="cbt-field">
          <label class="cbt-field__label">Статус</label>
          <div class="status-chips">
            <button
              v-for="s in STATUSES"
              :key="s.value"
              class="status-chip"
              :class="{ active: form.status === s.value }"
              @click="form.status = s.value"
            >
              {{ s.label }}
            </button>
          </div>
        </div>

        <div class="cbt-editor__actions">
          <button class="cbt-btn cbt-btn--cancel" @click="handleClose">Отмена</button>
          <button
            class="cbt-btn cbt-btn--save"
            :disabled="!form.situation.trim()"
            @click="handleSave"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { X as XIcon } from 'lucide-vue-next'
import { distortions } from '@/api/mock/data/distortions.js'
import CbtEmotionPicker from '@/components/cbt/CbtEmotionPicker.vue'

const STATUSES = [
  { value: 'new', label: 'Новая' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'processed', label: 'Проработана' },
]

const props = defineProps({
  modelValue: { type: Object, default: null },
  show: { type: Boolean, default: false },
  initialStatus: { type: String, default: 'new' },
})

const emit = defineEmits(['save', 'close'])

const isEdit = ref(false)
const advancedMode = ref(false)
const form = ref({
  situation: '',
  thoughts: '',
  emotions: [],
  reaction: '',
  distortion: '',
  challenge: '',
  alternativeThought: '',
  reflection: '',
  intensityAfter: 4,
  status: 'new',
})

// Progress: count filled base fields (out of 4)
const fillPercent = computed(() => {
  const filled = [
    form.value.situation?.trim(),
    form.value.thoughts?.trim(),
    form.value.emotions?.length > 0 ? 'x' : '',
    form.value.reaction?.trim(),
  ].filter(Boolean).length
  return Math.round((filled / 4) * 100)
})

watch(
  () => props.modelValue,
  (entry) => {
    if (entry) {
      form.value = {
        situation: entry.situation || '',
        thoughts: entry.thoughts || '',
        emotions: (entry.emotions || []).map((e) => ({
          key: e.key || e.name || String(e),
          label: e.label || e.name || String(e),
          intensity: e.intensity ?? 5,
        })),
        reaction: entry.reaction || '',
        distortion: entry.distortion || '',
        challenge: entry.challenge || '',
        alternativeThought: entry.alternativeThought || '',
        reflection: entry.reflection || '',
        intensityAfter: entry.intensityAfter ?? 4,
        status: entry.status || 'new',
      }
      isEdit.value = true
      if (entry.distortion || entry.challenge || entry.alternativeThought) {
        advancedMode.value = true
      }
    } else {
      form.value = {
        situation: '',
        thoughts: '',
        emotions: [],
        reaction: '',
        distortion: '',
        challenge: '',
        alternativeThought: '',
        reflection: '',
        intensityAfter: 4,
        status: props.initialStatus,
      }
      isEdit.value = false
      advancedMode.value = false
    }
  },
  { immediate: true },
)

function handleSave() {
  if (!form.value.situation.trim()) return
  emit('save', {
    ...props.modelValue,
    ...form.value,
    emotions: form.value.emotions.map((e) => ({
      name: e.label,
      key: e.key,
      intensity: e.intensity,
    })),
  })
  emit('close')
}

function handleClose() {
  emit('close')
}
</script>

<style scoped>
.cbt-editor-overlay {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 0.45);
  display: flex;
  align-items: flex-end;
  z-index: 100;
}

.cbt-editor {
  background: white;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  padding: 1.25rem 1.5rem 1.5rem;
  width: 100%;
  max-height: 92dvh;
  overflow-y: auto;
}

.cbt-editor__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.cbt-editor__title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.cbt-editor__header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.advanced-toggle {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.3rem 0.7rem;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}

.advanced-toggle.active {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-mist);
}

.cbt-editor__close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
}

/* Progress bar */
.cbt-progress {
  height: 3px;
  background: var(--color-surface);
  border-radius: 2px;
  margin-bottom: 1.25rem;
  overflow: hidden;
}

.cbt-progress__bar {
  height: 100%;
  background: var(--color-accent);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.cbt-field {
  margin-bottom: 1rem;
}

.cbt-field__label {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-accent);
  margin-bottom: 0.35rem;
}

.cbt-field__input {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.6rem 0.75rem;
  font-size: 0.9rem;
  font-family: inherit;
  color: var(--color-text);
  resize: none;
  box-sizing: border-box;
  background: transparent;
}

.cbt-field__input:focus {
  outline: none;
  border-color: var(--color-accent);
}

/* Intensity slider */
.cbt-intensity-row {
  margin-top: 0.5rem;
}

.cbt-intensity-label {
  display: block;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-bottom: 0.25rem;
}

.cbt-slider {
  width: 100%;
  accent-color: var(--color-accent);
}

/* Distortion chips */
.distortion-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.distortion-chip {
  padding: 0.3rem 0.65rem;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--color-border);
  background: transparent;
  font-size: 0.75rem;
  font-family: inherit;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}

.distortion-chip.active {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-mist);
}

/* Status chips */
.status-chips {
  display: flex;
  gap: 0.4rem;
}

.status-chip {
  flex: 1;
  padding: 0.4rem 0.5rem;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--color-border);
  background: transparent;
  font-size: 0.8rem;
  font-family: inherit;
  color: var(--color-text-muted);
  cursor: pointer;
  font-weight: 500;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}

.status-chip.active {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-mist);
  font-weight: 600;
}

.cbt-editor__actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border);
  margin-top: 0.5rem;
}

.cbt-btn {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}

.cbt-btn--cancel {
  background: var(--color-surface);
  color: var(--color-text-muted);
}

.cbt-btn--save {
  background: var(--color-accent);
  color: white;
}

.cbt-btn--save:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
