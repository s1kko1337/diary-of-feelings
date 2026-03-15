<template>
  <BaseModal :modelValue="!!note" @update:modelValue="$emit('close')" :title="note?.id ? 'Редактировать' : 'Новая заметка'" size="md">
    <div class="space-y-4">
      <input
        v-model="form.title"
        type="text"
        placeholder="Заголовок"
        class="w-full text-lg font-display font-semibold text-ink-900 placeholder:text-ink-400 bg-transparent border-none outline-none"
      />

      <textarea
        v-model="form.content"
        placeholder="Начните писать..."
        rows="8"
        class="w-full text-sm text-ink-800 placeholder:text-ink-400 bg-transparent border-none outline-none resize-none leading-relaxed"
      />

      <div>
        <p class="text-xs font-medium text-ink-500 mb-2">Цвет</p>
        <div class="flex gap-2">
          <button
            v-for="c in colors"
            :key="c.value"
            @click="form.color = c.value"
            class="w-7 h-7 rounded-full border-2 transition-transform"
            :class="[c.bg, form.color === c.value ? 'border-ink-500 scale-110' : 'border-transparent']"
          />
        </div>
      </div>

      <label class="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" v-model="form.pinned" class="w-4 h-4 rounded accent-terra-500" />
        <span class="text-sm text-ink-600">Закрепить</span>
      </label>
    </div>

    <template #footer>
      <div class="flex gap-2 justify-end">
        <button @click="$emit('close')" class="px-4 py-2 text-sm text-ink-600 hover:bg-cream-200 rounded-xl transition-colors">
          Отмена
        </button>
        <button
          @click="save"
          :disabled="!form.title && !form.content"
          class="px-4 py-2 text-sm font-medium bg-terra-500 text-white rounded-xl hover:bg-terra-600 transition-all disabled:opacity-40 shadow-sm"
        >
          Сохранить
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'

const props = defineProps({
  note: { type: Object, default: null },
})
const emit = defineEmits(['save', 'close'])

const colors = [
  { value: 'default', bg: 'bg-ink-100' },
  { value: 'yellow', bg: 'bg-gold-300' },
  { value: 'green', bg: 'bg-forest-300' },
  { value: 'pink', bg: 'bg-coral-400' },
  { value: 'blue', bg: 'bg-sky-400' },
  { value: 'purple', bg: 'bg-violet-400' },
]

const form = reactive({
  title: '',
  content: '',
  color: 'default',
  pinned: false,
})

watch(() => props.note, (n) => {
  if (n) {
    form.title = n.title || ''
    form.content = n.content || ''
    form.color = n.color || 'default'
    form.pinned = n.pinned || false
  }
}, { immediate: true })

function save() {
  emit('save', { ...form, id: props.note?.id })
}
</script>
