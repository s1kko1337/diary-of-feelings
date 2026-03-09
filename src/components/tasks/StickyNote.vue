<template>
  <div
    class="sticky-note"
    :class="[`sticky-note--${task.color}`, { 'sticky-note--done': task.completed }]"
    :style="{ '--rotation': rotation }"
    @click="$emit('click', task)"
  >
    <!-- Priority flag -->
    <span v-if="task.priority && task.priority !== 'none'" class="sticky-note__priority" :class="`priority--${task.priority}`" />

    <!-- Complete toggle -->
    <button class="sticky-note__check" @click.stop="$emit('toggle-complete', task.id)">
      <CheckIcon v-if="task.completed" :size="10" :stroke-width="3" />
    </button>

    <!-- Delete -->
    <button class="sticky-note__delete" @click.stop="$emit('delete', task.id)">
      <X :size="12" />
    </button>

    <p class="sticky-note__text">{{ task.text }}</p>
    <div class="sticky-note__footer">
      <span v-if="task.time" class="sticky-note__time">{{ task.time }}</span>
      <span v-if="task.category" class="sticky-note__category">{{ task.category }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { CheckIcon, X } from 'lucide-vue-next'

const props = defineProps({
  task: { type: Object, required: true },
})

defineEmits(['click', 'delete', 'toggle-complete'])

const rotation = computed(() => {
  const seed = (props.task.id.charCodeAt(0) % 7) - 3
  return `${seed}deg`
})
</script>

<style scoped>
.sticky-note {
  position: relative;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  cursor: grab;
  transform: rotate(var(--rotation));
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.08);
}

.sticky-note:active {
  cursor: grabbing;
  transform: rotate(var(--rotation)) scale(1.04);
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.15);
}

.sticky-note--done {
  opacity: 0.55;
}

.sticky-note--done .sticky-note__text {
  text-decoration: line-through;
  text-decoration-color: rgba(45, 45, 45, 0.5);
}

.sticky-note--red { background: #ffd0cc; }
.sticky-note--yellow { background: #fff3b0; }
.sticky-note--green { background: #d4f0d4; }

/* Priority flag */
.sticky-note__priority {
  position: absolute;
  top: 0;
  right: 0.6rem;
  width: 6px;
  height: 18px;
  border-radius: 0 0 3px 3px;
}
.priority--normal { background: #f59e0b; }
.priority--high { background: #ef4444; }

/* Complete checkbox */
.sticky-note__check {
  position: absolute;
  top: 0.35rem;
  left: 0.35rem;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1.5px solid rgb(0 0 0 / 0.25);
  background: rgb(255 255 255 / 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: background 0.15s, border-color 0.15s;
}

.sticky-note--done .sticky-note__check {
  background: rgb(0 0 0 / 0.15);
  border-color: rgb(0 0 0 / 0.35);
}

.sticky-note__delete {
  position: absolute;
  top: 0.35rem;
  right: 0.35rem;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: none;
  background: rgb(0 0 0 / 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.15s;
}

.sticky-note:hover .sticky-note__delete {
  opacity: 1;
}

.sticky-note__text {
  font-size: 0.85rem;
  line-height: 1.4;
  color: #2d2d2d;
  margin: 0;
  padding: 0 1.2rem 0 1.4rem;
}

.sticky-note__footer {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.4rem;
}

.sticky-note__time {
  font-size: 0.68rem;
  font-weight: 600;
  color: rgb(0 0 0 / 0.5);
  background: rgb(0 0 0 / 0.06);
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
}

.sticky-note__category {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgb(0 0 0 / 0.45);
}
</style>
