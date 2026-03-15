<template>
  <BaseModal v-model="open" title="Редактировать эмоцию">
    <div class="space-y-5">
      <!-- Category selector -->
      <div>
        <p class="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Категория</p>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="cat in categories"
            :key="cat.key"
            @click="form.emotionCategory = cat.key"
            class="rounded-xl p-2.5 text-center transition-all border-2"
            :class="form.emotionCategory === cat.key
              ? `${cat.border} ${cat.bg} shadow-sm`
              : `border-transparent ${cat.bg} opacity-60 hover:opacity-80`"
          >
            <span class="text-lg block">{{ cat.emoji }}</span>
            <span class="text-[10px] font-semibold block mt-0.5" :class="cat.text">{{ cat.label }}</span>
          </button>
        </div>
      </div>

      <!-- Emotion name -->
      <BaseInput
        v-model="form.emotionName"
        label="Название эмоции"
        placeholder="Например: Радость, Тревога..."
      />

      <!-- Intensity -->
      <div>
        <div class="flex items-baseline justify-between mb-2">
          <p class="text-sm font-medium text-ink-700">Интенсивность</p>
          <span class="font-display text-2xl font-bold tabular-nums" :class="intensityColor">{{ form.intensity }}</span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          v-model.number="form.intensity"
          class="w-full accent-terra-500"
        />
        <div class="flex justify-between text-[10px] text-ink-400 mt-1">
          <span>0</span>
          <span>10</span>
        </div>
      </div>

      <!-- Note -->
      <BaseTextarea
        v-model="form.note"
        label="Заметка"
        placeholder="Что произошло?"
        :rows="3"
      />
    </div>

    <template #footer>
      <div class="flex gap-3">
        <BaseButton variant="secondary" class="flex-1" @click="open = false">Отмена</BaseButton>
        <BaseButton class="flex-1" :loading="saving" @click="save">Сохранить</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  modelValue: Boolean,
  entry: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue', 'save'])

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const saving = ref(false)
const form = reactive({
  emotionCategory: '',
  emotionName: '',
  intensity: 5,
  note: '',
})

watch(() => props.entry, (e) => {
  if (e) {
    form.emotionCategory = e.emotionCategory || ''
    form.emotionName = e.emotionName || ''
    form.intensity = e.intensity ?? 5
    form.note = e.note || ''
  }
}, { immediate: true })

const categories = [
  { key: 'joy', label: 'Радость', emoji: '\u2728', bg: 'bg-gold-200/60', border: 'border-gold-500', text: 'text-gold-600' },
  { key: 'sadness', label: 'Грусть', emoji: '\uD83D\uDCA7', bg: 'bg-sky-300/40', border: 'border-sky-500', text: 'text-sky-600' },
  { key: 'anger', label: 'Злость', emoji: '\uD83D\uDD25', bg: 'bg-rose-300/40', border: 'border-rose-500', text: 'text-rose-600' },
  { key: 'anxiety', label: 'Тревога', emoji: '\uD83C\uDF00', bg: 'bg-coral-300/40', border: 'border-coral-500', text: 'text-coral-600' },
  { key: 'fear', label: 'Страх', emoji: '\uD83D\uDCA8', bg: 'bg-violet-300/40', border: 'border-violet-500', text: 'text-violet-600' },
  { key: 'disgust', label: 'Отвращение', emoji: '\uD83C\uDF43', bg: 'bg-forest-200/50', border: 'border-forest-500', text: 'text-forest-700' },
]

const intensityColor = computed(() => {
  if (form.intensity <= 3) return 'text-forest-500'
  if (form.intensity <= 6) return 'text-gold-600'
  return 'text-coral-500'
})

async function save() {
  saving.value = true
  try {
    await emit('save', {
      emotion_category: form.emotionCategory,
      emotion_name: form.emotionName,
      intensity: form.intensity,
      note: form.note || null,
    })
    open.value = false
  } finally {
    saving.value = false
  }
}
</script>
