<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-ink-700 mb-1.5">{{ label }}</label>
    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      class="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 placeholder:text-ink-400 transition-colors resize-none focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100"
      :class="error ? 'border-rose-400' : ''"
      @input="onInput"
      v-bind="$attrs"
    />
    <div class="flex items-center justify-between mt-1">
      <p v-if="error" class="text-sm text-rose-500">{{ error }}</p>
      <p v-if="maxLength" class="text-xs text-ink-400 ml-auto">{{ (modelValue || '').length }}/{{ maxLength }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' },
  label: String,
  placeholder: String,
  error: String,
  id: String,
  rows: { type: Number, default: 3 },
  autoResize: Boolean,
  maxLength: Number,
})
const emit = defineEmits(['update:modelValue'])

function onInput(e) {
  emit('update:modelValue', e.target.value)
  if (props.autoResize) {
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }
}
</script>
