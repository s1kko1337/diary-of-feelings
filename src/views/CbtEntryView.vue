<template>
  <div class="cbt-entry-page" :class="{ 'cbt-entry-page--mounted': isMounted }">
    <!-- Top bar -->
    <div class="entry-topbar">
      <button class="back-btn" aria-label="Назад" @click="goBack">
        <ArrowLeftIcon :size="18" :stroke-width="1.8" />
        <span class="back-btn-text">Назад</span>
      </button>
      <h1 class="entry-page-title">
        {{ isViewMode ? 'Запись СМЭР' : 'Новая запись' }}
      </h1>
      <div class="topbar-actions">
        <button v-if="isViewMode" class="edit-btn" aria-label="Редактировать" @click="toggleEdit">
          <PencilIcon :size="18" :stroke-width="1.8" />
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="entry-loading">
      <div class="skeleton-section" />
      <div class="skeleton-section" />
      <div class="skeleton-section" />
    </div>

    <template v-else>
      <!-- Progress bar -->
      <CbtProgressBar :steps="progressSteps" />

      <!-- S — Situation -->
      <section
        class="smear-section"
        :style="{ '--section-color': 'var(--color-mint)' }"
        role="group"
        aria-labelledby="section-s-title"
      >
        <div class="section-header">
          <div class="section-icon-wrapper">
            <MapPinIcon :size="18" :stroke-width="1.8" />
          </div>
          <div class="section-info">
            <span class="section-letter">С — Ситуация</span>
            <span id="section-s-title" class="section-title"> Что произошло? </span>
            <span class="section-hint"> Просто опиши факты, без оценок </span>
          </div>
          <CheckIcon
            v-if="isSituationDone"
            class="section-done-icon"
            :size="18"
            :stroke-width="2"
          />
        </div>
        <textarea
          v-model="form.situation"
          class="smear-textarea"
          :class="{ 'smear-textarea--readonly': isReadonly }"
          :readonly="isReadonly"
          placeholder="Просто опиши, что случилось. Только факты, без оценок."
          maxlength="1000"
          rows="3"
        />
        <span class="char-count">{{ form.situation.length }} / 1000</span>
      </section>

      <!-- M — Thoughts -->
      <section
        class="smear-section"
        :class="{ 'smear-section--locked': !isSituationDone }"
        :style="{ '--section-color': 'var(--color-lavender)' }"
        role="group"
        aria-labelledby="section-m-title"
      >
        <div class="section-header">
          <div class="section-icon-wrapper">
            <BrainIcon :size="18" :stroke-width="1.8" />
          </div>
          <div class="section-info">
            <span class="section-letter">М — Мысли</span>
            <span id="section-m-title" class="section-title"> Какие мысли возникли? </span>
            <span class="section-hint"> Автоматические мысли — первое, что пришло в голову </span>
          </div>
          <CheckIcon v-if="isThoughtsDone" class="section-done-icon" :size="18" :stroke-width="2" />
        </div>
        <textarea
          v-model="form.thoughts"
          class="smear-textarea"
          :class="{ 'smear-textarea--readonly': isReadonly }"
          :readonly="isReadonly"
          placeholder="Что пронеслось в голове в тот момент?"
          maxlength="1000"
          rows="3"
        />
        <span class="char-count">{{ form.thoughts.length }} / 1000</span>
      </section>

      <!-- E — Emotions -->
      <section
        class="smear-section"
        :class="{ 'smear-section--locked': !isThoughtsDone }"
        :style="{ '--section-color': 'var(--color-peach)' }"
        role="group"
        aria-labelledby="section-e-title"
      >
        <div class="section-header">
          <div class="section-icon-wrapper">
            <HeartIcon :size="18" :stroke-width="1.8" />
          </div>
          <div class="section-info">
            <span class="section-letter">Э — Эмоции</span>
            <span id="section-e-title" class="section-title"> Что ты почувствовал(а)? </span>
            <span class="section-hint"> Добавь эмоции и оцени их интенсивность </span>
          </div>
          <CheckIcon v-if="isEmotionsDone" class="section-done-icon" :size="18" :stroke-width="2" />
        </div>
        <CbtEmotionPicker v-if="!isReadonly" v-model="form.emotions" />
        <div v-else class="readonly-emotions">
          <span v-for="em in form.emotions" :key="em.key" class="readonly-emotion-badge">
            {{ em.label }}
            <span class="readonly-emotion-intensity metric-value">
              {{ em.intensity }}
            </span>
          </span>
        </div>
      </section>

      <!-- R — Reaction -->
      <section
        class="smear-section"
        :class="{ 'smear-section--locked': !isEmotionsDone }"
        :style="{ '--section-color': 'var(--color-rose)' }"
        role="group"
        aria-labelledby="section-r-title"
      >
        <div class="section-header">
          <div class="section-icon-wrapper">
            <ZapIcon :size="18" :stroke-width="1.8" />
          </div>
          <div class="section-info">
            <span class="section-letter">Р — Реакция</span>
            <span id="section-r-title" class="section-title"> Что ты сделал(а)? </span>
            <span class="section-hint"> Как ты отреагировал(а) — действия, поведение </span>
          </div>
          <CheckIcon v-if="isReactionDone" class="section-done-icon" :size="18" :stroke-width="2" />
        </div>
        <textarea
          v-model="form.reaction"
          class="smear-textarea"
          :class="{ 'smear-textarea--readonly': isReadonly }"
          :readonly="isReadonly"
          placeholder="Что ты сделал(а) или почувствовал(а) физически?"
          maxlength="1000"
          rows="3"
        />
        <span class="char-count">{{ form.reaction.length }} / 1000</span>
      </section>

      <!-- Advanced toggle -->
      <button
        v-if="!isReadonly || hasAdvancedData"
        class="advanced-toggle"
        :aria-expanded="isAdvancedOpen"
        @click="toggleAdvanced"
      >
        <SparklesIcon :size="18" :stroke-width="1.8" class="advanced-toggle-icon" />
        <div class="advanced-toggle-text">
          <span class="advanced-toggle-title">
            {{ isAdvancedOpen ? 'Скрыть подробности' : 'Добавить подробности' }}
          </span>
          <span class="advanced-toggle-hint">
            Когнитивное искажение, оспаривание и переоценка
          </span>
        </div>
        <ChevronRightIcon
          :size="16"
          :stroke-width="1.8"
          class="advanced-toggle-chevron"
          :class="{ 'advanced-toggle-chevron--open': isAdvancedOpen }"
        />
      </button>

      <!-- Advanced sections -->
      <div class="advanced-sections" :class="{ 'advanced-sections--open': isAdvancedOpen }">
        <div class="advanced-sections-inner">
          <!-- Distortion picker -->
          <section class="smear-section" :style="{ '--section-color': 'var(--color-lavender)' }">
            <div class="section-header">
              <div class="section-info">
                <span class="section-letter">Когнитивное искажение</span>
                <span class="section-title"> Замечаешь ли искажение мышления? </span>
              </div>
            </div>
            <CbtDistortionPicker v-if="!isReadonly" v-model="form.distortion" />
            <div v-else-if="form.distortion" class="readonly-distortion">
              <span class="distortion-badge-readonly">
                {{ distortionLabel }}
              </span>
            </div>
            <p v-else class="readonly-empty">Не указано</p>
          </section>

          <!-- Challenge -->
          <section class="smear-section" :style="{ '--section-color': 'var(--color-mint)' }">
            <div class="section-header">
              <div class="section-info">
                <span class="section-letter">Оспаривание</span>
                <span class="section-title"> Есть ли доказательства этой мысли? </span>
                <span class="section-hint"> Как бы ты посоветовал(а) другу? </span>
              </div>
            </div>
            <textarea
              v-model="form.challenge"
              class="smear-textarea"
              :class="{ 'smear-textarea--readonly': isReadonly }"
              :readonly="isReadonly"
              placeholder="Есть ли доказательства этой мысли? Как ты мог(ла) бы посоветовать другу?"
              maxlength="1000"
              rows="3"
            />
          </section>

          <!-- Alternative thought -->
          <section class="smear-section" :style="{ '--section-color': 'var(--color-lavender)' }">
            <div class="section-header">
              <div class="section-info">
                <span class="section-letter">Альтернативная мысль</span>
                <span class="section-title"> Более реалистичная интерпретация </span>
              </div>
            </div>
            <textarea
              v-model="form.alternative"
              class="smear-textarea"
              :class="{ 'smear-textarea--readonly': isReadonly }"
              :readonly="isReadonly"
              placeholder="Более реалистичная интерпретация ситуации"
              maxlength="1000"
              rows="3"
            />
          </section>

          <!-- Emotions after -->
          <section class="smear-section" :style="{ '--section-color': 'var(--color-peach)' }">
            <div class="section-header">
              <div class="section-info">
                <span class="section-letter">Эмоции после</span>
                <span class="section-title"> Как ты чувствуешь себя сейчас? </span>
              </div>
            </div>
            <CbtEmotionPicker v-if="!isReadonly" v-model="form.emotionsAfter" />
            <div v-else class="readonly-emotions">
              <span v-for="em in form.emotionsAfter" :key="em.key" class="readonly-emotion-badge">
                {{ em.label }}
                <span class="readonly-emotion-intensity metric-value">
                  {{ em.intensity }}
                </span>
              </span>
              <p v-if="form.emotionsAfter.length === 0" class="readonly-empty">Не указано</p>
            </div>
          </section>
        </div>
      </div>

      <!-- Save button -->
      <div v-if="!isReadonly" class="save-button-wrapper">
        <button class="save-btn" :disabled="!canSave || isSaving" @click="handleSave">
          <template v-if="isSaving">Сохраняем...</template>
          <template v-else>Сохранить запись</template>
        </button>
        <div v-if="saveError" class="save-error">
          <AlertCircleIcon :size="14" :stroke-width="1.8" />
          <span>Не удалось сохранить. Попробуй ещё раз.</span>
        </div>
      </div>

      <!-- Delete button (view mode) -->
      <div v-if="isViewMode && isReadonly" class="delete-wrapper">
        <button class="delete-btn" @click="handleDelete">
          <Trash2Icon :size="16" :stroke-width="1.8" />
          Удалить запись
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ArrowLeftIcon,
  PencilIcon,
  CheckIcon,
  MapPinIcon,
  BrainIcon,
  HeartIcon,
  ZapIcon,
  SparklesIcon,
  ChevronRightIcon,
  AlertCircleIcon,
  Trash2Icon,
} from 'lucide-vue-next'
import { useCbtStore } from '@/stores/cbt'
import { getDistortion } from '@/api/mock/data/distortions'
import CbtProgressBar from '@/components/cbt/CbtProgressBar.vue'
import CbtEmotionPicker from '@/components/cbt/CbtEmotionPicker.vue'
import CbtDistortionPicker from '@/components/cbt/CbtDistortionPicker.vue'

const router = useRouter()
const route = useRoute()
const store = useCbtStore()

const entryId = computed(() => route.params.id || null)
const isViewMode = computed(() => !!entryId.value)
const isReadonly = ref(false)
const isAdvancedOpen = ref(false)
const isSaving = ref(false)
const saveError = ref(false)
const isLoading = ref(false)
const isMounted = ref(false)

const form = ref({
  situation: '',
  thoughts: '',
  emotions: [],
  reaction: '',
  distortion: null,
  challenge: '',
  alternative: '',
  emotionsAfter: [],
})

// Section completion checks
const isSituationDone = computed(() => form.value.situation.trim().length > 0)
const isThoughtsDone = computed(
  () => isSituationDone.value && form.value.thoughts.trim().length > 0,
)
const isEmotionsDone = computed(() => isThoughtsDone.value && form.value.emotions.length > 0)
const isReactionDone = computed(() => isEmotionsDone.value && form.value.reaction.trim().length > 0)

const canSave = computed(() => isSituationDone.value)

const hasAdvancedData = computed(() => {
  return (
    form.value.distortion ||
    form.value.challenge ||
    form.value.alternative ||
    form.value.emotionsAfter.length > 0
  )
})

const distortionLabel = computed(() => {
  if (!form.value.distortion) return null
  const d = getDistortion(form.value.distortion)
  return d ? d.label : form.value.distortion
})

// Progress bar steps
const progressSteps = computed(() => [
  {
    key: 'situation',
    label: 'С',
    color: 'var(--color-mint)',
    done: isSituationDone.value,
    active: !isSituationDone.value,
  },
  {
    key: 'thoughts',
    label: 'М',
    color: 'var(--color-lavender)',
    done: isThoughtsDone.value,
    active: isSituationDone.value && !isThoughtsDone.value,
  },
  {
    key: 'emotions',
    label: 'Э',
    color: 'var(--color-peach)',
    done: isEmotionsDone.value,
    active: isThoughtsDone.value && !isEmotionsDone.value,
  },
  {
    key: 'reaction',
    label: 'Р',
    color: 'var(--color-rose)',
    done: isReactionDone.value,
    active: isEmotionsDone.value && !isReactionDone.value,
  },
])

function goBack() {
  router.push({ name: 'cbt' })
}

function toggleEdit() {
  isReadonly.value = !isReadonly.value
}

function toggleAdvanced() {
  isAdvancedOpen.value = !isAdvancedOpen.value
}

async function handleSave() {
  isSaving.value = true
  saveError.value = false

  try {
    const data = {
      situation: form.value.situation,
      thoughts: form.value.thoughts,
      emotions: form.value.emotions,
      reaction: form.value.reaction,
      distortion: form.value.distortion,
      challenge: form.value.challenge || null,
      alternative: form.value.alternative || null,
      emotionsAfter: form.value.emotionsAfter,
    }

    if (isViewMode.value) {
      await store.updateEntry(entryId.value, data)
    } else {
      await store.createEntry(data)
    }

    router.push({ name: 'cbt' })
  } catch {
    saveError.value = true
  } finally {
    isSaving.value = false
  }
}

async function handleDelete() {
  if (!entryId.value) return
  try {
    await store.deleteEntry(entryId.value)
    router.push({ name: 'cbt' })
  } catch {
    saveError.value = true
  }
}

function populateForm(entry) {
  form.value = {
    situation: entry.situation || '',
    thoughts: entry.thoughts || '',
    emotions: entry.emotions ? [...entry.emotions] : [],
    reaction: entry.reaction || '',
    distortion: entry.distortion || null,
    challenge: entry.challenge || '',
    alternative: entry.alternative || '',
    emotionsAfter: entry.emotionsAfter ? [...entry.emotionsAfter] : [],
  }

  if (
    entry.distortion ||
    entry.challenge ||
    entry.alternative ||
    (entry.emotionsAfter && entry.emotionsAfter.length > 0)
  ) {
    isAdvancedOpen.value = true
  }
}

// Watch route to handle navigation between entries
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      isLoading.value = true
      try {
        const entry = await store.loadEntry(newId)
        populateForm(entry)
        isReadonly.value = true
      } finally {
        isLoading.value = false
      }
    } else {
      // Reset form for new entry
      form.value = {
        situation: '',
        thoughts: '',
        emotions: [],
        reaction: '',
        distortion: null,
        challenge: '',
        alternative: '',
        emotionsAfter: [],
      }
      isReadonly.value = false
      isAdvancedOpen.value = false
    }
  },
  { immediate: false },
)

onMounted(async () => {
  if (entryId.value) {
    isLoading.value = true
    try {
      const entry = await store.loadEntry(entryId.value)
      populateForm(entry)
      isReadonly.value = true
    } finally {
      isLoading.value = false
    }
  }

  nextTick(() => {
    isMounted.value = true
  })
})
</script>

<style scoped>
.cbt-entry-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 1rem 1rem 6rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}

.cbt-entry-page--mounted {
  opacity: 1;
  transform: translateY(0);
}

@media (min-width: 768px) {
  .cbt-entry-page {
    padding: 1.5rem 0 3rem;
  }
}

/* Top bar */
.entry-topbar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--color-text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.back-btn:hover {
  color: var(--color-text);
}

.back-btn-text {
  display: none;
}

@media (min-width: 768px) {
  .back-btn-text {
    display: inline;
  }
}

.entry-page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  flex: 1;
}

.topbar-actions {
  display: flex;
  gap: 8px;
}

.edit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  color: var(--color-text);
  border-color: var(--color-primary);
}

/* Loading skeleton */
.entry-loading {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-section {
  height: 180px;
  border-radius: var(--radius-xl);
  background: linear-gradient(
    90deg,
    var(--color-surface-hover) 25%,
    var(--color-surface) 50%,
    var(--color-surface-hover) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* SMEAR sections */
.smear-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
  position: relative;
  overflow: hidden;
}

.smear-section::before {
  content: '';
  position: absolute;
  left: 0;
  top: 1.5rem;
  bottom: 1.5rem;
  width: 3px;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  background: var(--section-color);
}

.smear-section--locked {
  opacity: 0.45;
  pointer-events: none;
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 1.25rem;
}

.section-icon-wrapper {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--section-color);
  background: var(--color-surface-hover);
}

.section-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.section-letter {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--section-color);
  margin-bottom: 2px;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.01em;
}

.section-hint {
  font-size: 0.82rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin-top: 2px;
}

.section-done-icon {
  color: var(--color-success);
  flex-shrink: 0;
  margin-top: 4px;
}

/* Textarea */
.smear-textarea {
  width: 100%;
  min-height: 100px;
  max-height: 200px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface-hover);
  color: var(--color-text);
  font-size: 0.9rem;
  font-family: var(--font-main);
  line-height: 1.65;
  resize: vertical;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.smear-textarea:focus {
  border-color: var(--section-color);
}

.smear-textarea::placeholder {
  color: var(--color-text-muted);
  font-style: italic;
}

.smear-textarea--readonly {
  border-color: transparent;
  background: var(--color-surface-hover);
  cursor: default;
  resize: none;
  pointer-events: none;
}

.char-count {
  display: block;
  text-align: right;
  font-size: 0.7rem;
  color: var(--color-text-muted);
  margin-top: 4px;
}

/* Readonly emotions */
.readonly-emotions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.readonly-emotion-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  background: var(--color-peach-soft);
  border: 1px solid rgb(248 201 160 / 0.3);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text);
}

.readonly-emotion-intensity {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-text-muted);
}

.readonly-empty {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  font-style: italic;
}

.readonly-distortion {
  display: flex;
}

.distortion-badge-readonly {
  padding: 6px 16px;
  border-radius: var(--radius-full);
  background: var(--color-lavender-soft);
  border: 1px solid rgb(196 181 224 / 0.25);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text);
}

/* Advanced toggle */
.advanced-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: var(--radius-lg);
  border: 1px dashed var(--color-border);
  background: transparent;
  cursor: pointer;
  transition: all 0.25s ease;
  width: 100%;
  text-align: left;
}

.advanced-toggle:hover {
  background: var(--color-accent-soft);
  border-color: var(--color-accent);
}

.advanced-toggle-icon {
  color: var(--color-lavender);
  flex-shrink: 0;
}

.advanced-toggle-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.advanced-toggle-title {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-text);
}

.advanced-toggle-hint {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.advanced-toggle-chevron {
  color: var(--color-text-muted);
  transition: transform 0.25s ease;
  flex-shrink: 0;
}

.advanced-toggle-chevron--open {
  transform: rotate(90deg);
}

/* Advanced sections container */
.advanced-sections {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease;
}

.advanced-sections--open {
  max-height: 2000px;
}

.advanced-sections-inner {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 0.5rem;
}

/* Save button */
.save-button-wrapper {
  position: sticky;
  bottom: calc(var(--bottom-nav-height, 72px) + 12px);
  z-index: 10;
  padding: 0 0 8px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
}

@media (min-width: 768px) {
  .save-button-wrapper {
    position: static;
    padding: 0;
  }
}

.save-btn {
  width: 100%;
  padding: 14px 24px;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: white;
  border: none;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.save-btn:hover:not(:disabled) {
  opacity: 0.85;
}

.save-btn:active:not(:disabled) {
  opacity: 0.75;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.save-error {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  background: var(--color-rose-soft);
  border: 1px solid rgb(240 184 192 / 0.3);
  font-size: 0.78rem;
  color: var(--color-text);
}

/* Delete button */
.delete-wrapper {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.5rem;
}

.delete-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  border: none;
  background: none;
  color: var(--color-danger);
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.delete-btn:hover {
  background: var(--color-rose-soft);
}

/* Focus styles */
.back-btn:focus-visible,
.edit-btn:focus-visible,
.advanced-toggle:focus-visible,
.save-btn:focus-visible,
.delete-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.smear-textarea:focus-visible {
  outline: none;
}
</style>
