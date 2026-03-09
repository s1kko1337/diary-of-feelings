<template>
  <Teleport to="body">
    <div v-if="show" class="editor-overlay" @click.self="$emit('close')">
      <div class="editor-card">
        <h3 class="editor-title">{{ isEdit ? 'Редактировать' : 'Новая задача' }}</h3>

        <!-- Color picker -->
        <div class="editor-colors">
          <button
            v-for="color in COLORS"
            :key="color.value"
            class="editor-color-btn"
            :class="{ active: form.color === color.value }"
            :style="{ background: color.hex }"
            @click="form.color = color.value"
          />
        </div>

        <textarea
          v-model="form.text"
          class="editor-textarea"
          placeholder="Что нужно сделать?"
          rows="3"
          autofocus
        />

        <!-- Row: category + time -->
        <div class="editor-row">
          <input
            v-model="form.category"
            class="editor-input"
            placeholder="Категория"
          />
          <input
            v-model="form.time"
            class="editor-input editor-input--time"
            type="time"
            placeholder="Время"
          />
        </div>

        <!-- Priority -->
        <div class="editor-priority">
          <span class="editor-priority__label">Приоритет:</span>
          <button
            v-for="p in PRIORITIES"
            :key="p.value"
            class="priority-btn"
            :class="{ active: form.priority === p.value }"
            @click="form.priority = p.value"
          >
            <span class="priority-dot" :style="{ background: p.color }" />
            {{ p.label }}
          </button>
        </div>

        <div class="editor-actions">
          <button class="editor-btn editor-btn--cancel" @click="$emit('close')">Отмена</button>
          <button
            class="editor-btn editor-btn--save"
            :disabled="!form.text.trim()"
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
import { ref, watch } from 'vue'

const COLORS = [
  { value: 'yellow', hex: '#fff3b0' },
  { value: 'red', hex: '#ffd0cc' },
  { value: 'green', hex: '#d4f0d4' },
]

const PRIORITIES = [
  { value: 'none', label: 'Нет', color: 'transparent' },
  { value: 'normal', label: 'Средний', color: '#f59e0b' },
  { value: 'high', label: 'Высокий', color: '#ef4444' },
]

const props = defineProps({
  modelValue: { type: Object, default: null },
  show: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'save', 'close'])

const form = ref({ text: '', color: 'yellow', category: '', time: '', priority: 'none' })
const isEdit = ref(false)

watch(
  () => props.modelValue,
  (task) => {
    if (task) {
      form.value = {
        text: task.text,
        color: task.color,
        category: task.category || '',
        time: task.time || '',
        priority: task.priority || 'none',
      }
      isEdit.value = true
    } else {
      form.value = { text: '', color: 'yellow', category: '', time: '', priority: 'none' }
      isEdit.value = false
    }
  },
  { immediate: true },
)

function handleSave() {
  if (!form.value.text.trim()) return
  emit('save', {
    ...props.modelValue,
    ...form.value,
    time: form.value.time || null,
  })
  emit('close')
}
</script>

<style scoped>
.editor-overlay {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.editor-card {
  background: #fffdf5;
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 20px 60px rgb(0 0 0 / 0.2);
}

.editor-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 1rem;
}

.editor-colors {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.editor-color-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition:
    transform 0.15s,
    border-color 0.15s;
}

.editor-color-btn.active {
  border-color: var(--color-text);
  transform: scale(1.15);
}

.editor-textarea {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.6rem 0.75rem;
  font-size: 0.9rem;
  font-family: inherit;
  color: var(--color-text);
  background: white;
  resize: none;
  box-sizing: border-box;
  margin-bottom: 0.6rem;
}

.editor-textarea:focus {
  outline: none;
  border-color: var(--color-accent);
}

.editor-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.editor-input {
  flex: 1;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.6rem 0.75rem;
  font-size: 0.9rem;
  font-family: inherit;
  color: var(--color-text);
  background: white;
  box-sizing: border-box;
  min-width: 0;
}

.editor-input--time {
  flex: 0 0 auto;
  width: 110px;
}

.editor-input:focus {
  outline: none;
  border-color: var(--color-accent);
}

/* Priority */
.editor-priority {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.editor-priority__label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-right: 0.2rem;
}

.priority-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.65rem;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--color-border);
  background: transparent;
  font-size: 0.78rem;
  font-family: inherit;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}

.priority-btn.active {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-mist);
}

.priority-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  flex-shrink: 0;
}

.editor-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.editor-btn {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: 600;
}

.editor-btn--cancel {
  background: var(--color-surface);
  color: var(--color-text-muted);
}

.editor-btn--save {
  background: var(--color-accent);
  color: white;
}

.editor-btn--save:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
