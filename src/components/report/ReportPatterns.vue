<template>
  <div class="patterns">
    <div v-if="topEmotions.length" class="patterns-section">
      <h4 class="patterns-title">Топ эмоций</h4>
      <div v-for="item in topEmotions" :key="item.name" class="patterns-item">
        <span class="patterns-item__name">{{ item.name }}</span>
        <div class="patterns-bar-wrap">
          <div
            class="patterns-bar"
            :style="{
              width: barWidth(item.count, maxEmotionCount) + '%',
              background: '#c4b5e0',
            }"
          />
        </div>
        <span class="patterns-item__count">{{ item.count }}</span>
      </div>
    </div>
    <div v-if="topDistortions.length" class="patterns-section">
      <h4 class="patterns-title">Частые искажения</h4>
      <div v-for="item in topDistortions" :key="item.name" class="patterns-item">
        <span class="patterns-item__name">{{ item.name }}</span>
        <div class="patterns-bar-wrap">
          <div
            class="patterns-bar"
            :style="{
              width: barWidth(item.count, maxDistortionCount) + '%',
              background: '#ffd0cc',
            }"
          />
        </div>
        <span class="patterns-item__count">{{ item.count }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  emotionReport: { type: Object, default: null },
  cbtReport: { type: Object, default: null },
})

const topEmotions = computed(() => props.emotionReport?.topEmotions?.slice(0, 4) ?? [])
const topDistortions = computed(() =>
  (props.cbtReport?.topDistortions ?? [])
    .map((d) => (typeof d === 'string' ? { name: d, count: 1 } : d))
    .slice(0, 4),
)

const maxEmotionCount = computed(() => Math.max(...topEmotions.value.map((e) => e.count), 1))
const maxDistortionCount = computed(() => Math.max(...topDistortions.value.map((d) => d.count), 1))

function barWidth(count, max) {
  return Math.round((count / max) * 100)
}
</script>

<style scoped>
.patterns-section {
  margin-bottom: 1.25rem;
}

.patterns-section:last-child {
  margin-bottom: 0;
}

.patterns-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  margin: 0 0 0.6rem;
}

.patterns-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

.patterns-item__name {
  font-size: 0.82rem;
  color: var(--color-text);
  min-width: 100px;
  flex-shrink: 0;
}

.patterns-bar-wrap {
  flex: 1;
  height: 6px;
  background: var(--color-surface);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.patterns-bar {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.4s ease;
}

.patterns-item__count {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  min-width: 20px;
  text-align: right;
}
</style>
