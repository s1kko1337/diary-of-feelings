<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-ink-700 mb-1.5">{{ label }}</label>
    <div class="relative">
      <div v-if="$slots.icon" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">
        <slot name="icon" />
      </div>
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        class="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-ink-900 placeholder:text-ink-400 transition-colors focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100"
        :class="[
          error ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-100' : '',
          $slots.icon ? 'pl-11' : '',
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
        v-bind="$attrs"
      />
    </div>
    <p v-if="error" class="mt-1 text-sm text-rose-500">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  error: String,
  id: String,
})
defineEmits(['update:modelValue'])
</script>
