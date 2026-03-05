<template>
  <div class="settings">
    <h1 class="settings-title">Настройки</h1>

    <!-- Profile -->
    <section class="settings-card">
      <p class="settings-label">Профиль</p>
      <div class="field">
        <label class="field-label" for="name-input">Имя</label>
        <input
          id="name-input"
          v-model="name"
          type="text"
          class="field-input"
          placeholder="Твоё имя"
          maxlength="30"
          @blur="saveName"
        />
      </div>
    </section>

    <!-- Appearance -->
    <section class="settings-card">
      <p class="settings-label">Внешний вид</p>
      <div class="setting-row" @click="toggleTheme">
        <div class="setting-info">
          <component :is="isDark ? SunIcon : MoonIcon" :size="20" :stroke-width="1.8" />
          <span>{{ isDark ? 'Светлая тема' : 'Тёмная тема' }}</span>
        </div>
        <div class="toggle" :class="{ 'toggle--on': isDark }">
          <div class="toggle-knob" />
        </div>
      </div>
    </section>

    <!-- Notifications -->
    <section class="settings-card">
      <p class="settings-label">Уведомления</p>
      <div class="setting-row" @click="toggleNotifications">
        <div class="setting-info">
          <BellIcon :size="20" :stroke-width="1.8" />
          <span>Ежедневное напоминание</span>
        </div>
        <div class="toggle" :class="{ 'toggle--on': notificationsEnabled }">
          <div class="toggle-knob" />
        </div>
      </div>
      <div v-if="notificationsEnabled" class="field field--inline">
        <label class="field-label" for="time-input">Время</label>
        <input
          id="time-input"
          v-model="notificationTime"
          type="time"
          class="field-input field-input--small"
          @change="savePreferences"
        />
      </div>
    </section>

    <!-- CBT Mode -->
    <section class="settings-card">
      <p class="settings-label">КПТ-дневник</p>
      <div class="cbt-modes">
        <button
          class="cbt-mode-btn"
          :class="{ 'cbt-mode-btn--active': cbtMode === 'basic' }"
          @click="setCbtMode('basic')"
        >
          <span class="cbt-mode-title">Базовый</span>
          <span class="cbt-mode-desc">Ситуация + мысли + эмоции</span>
        </button>
        <button
          class="cbt-mode-btn"
          :class="{ 'cbt-mode-btn--active': cbtMode === 'advanced' }"
          @click="setCbtMode('advanced')"
        >
          <span class="cbt-mode-title">Продвинутый</span>
          <span class="cbt-mode-desc">+ искажения, оспаривание, альтернатива</span>
        </button>
      </div>
    </section>

    <!-- Sound -->
    <section class="settings-card">
      <p class="settings-label">Звук</p>
      <div class="setting-row" @click="toggleSound">
        <div class="setting-info">
          <component
            :is="soundEnabled ? Volume2Icon : VolumeXIcon"
            :size="20"
            :stroke-width="1.8"
          />
          <span>Звуковое сопровождение</span>
        </div>
        <div class="toggle" :class="{ 'toggle--on': soundEnabled }">
          <div class="toggle-knob" />
        </div>
      </div>
    </section>

    <!-- Danger zone -->
    <section class="settings-card settings-card--danger">
      <p class="settings-label">Данные</p>
      <button class="danger-btn" @click="handleReset">
        <Trash2Icon :size="16" :stroke-width="1.8" />
        Сбросить все данные
      </button>
    </section>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { MoonIcon, SunIcon, BellIcon, Volume2Icon, VolumeXIcon, Trash2Icon } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { useTheme } from '@/composables/useTheme'

const router = useRouter()
const userStore = useUserStore()
const { isDark, toggleTheme } = useTheme()

const name = ref(userStore.profile?.name ?? '')
const notificationsEnabled = ref(userStore.preferences?.notificationsEnabled ?? false)
const notificationTime = ref(userStore.preferences?.notificationTime ?? '09:00')
const cbtMode = ref(userStore.preferences?.cbtMode ?? 'basic')
const soundEnabled = ref(userStore.preferences?.soundEnabled ?? true)

watch(
  () => userStore.profile,
  (p) => {
    if (!p) return
    name.value = p.name ?? ''
    notificationsEnabled.value = p.preferences?.notificationsEnabled ?? false
    notificationTime.value = p.preferences?.notificationTime ?? '09:00'
    cbtMode.value = p.preferences?.cbtMode ?? 'basic'
    soundEnabled.value = p.preferences?.soundEnabled ?? true
  },
)

function saveName() {
  if (name.value !== userStore.profile?.name) {
    userStore.updateProfile({ name: name.value })
  }
}

function savePreferences() {
  userStore.updatePreferences({
    notificationsEnabled: notificationsEnabled.value,
    notificationTime: notificationTime.value,
    cbtMode: cbtMode.value,
    soundEnabled: soundEnabled.value,
  })
}

function toggleNotifications() {
  notificationsEnabled.value = !notificationsEnabled.value
  savePreferences()
}

function setCbtMode(mode) {
  cbtMode.value = mode
  savePreferences()
}

function toggleSound() {
  soundEnabled.value = !soundEnabled.value
  savePreferences()
}

async function handleReset() {
  localStorage.clear()
  await userStore.fetchProfile()
  router.push('/onboarding')
}
</script>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  padding: 1rem 0;
}

.settings-title {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.15;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.settings-card {
  background: var(--color-surface);
  border: none;
  border-radius: var(--radius-xl);
  padding: 1.25rem;
  box-shadow: var(--shadow-card);
}

.settings-card--danger {
  border-color: var(--color-danger);
}

.settings-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  margin-bottom: 0.75rem;
}

/* Fields */
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field--inline {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border);
}

.field-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.field-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface-hover);
  color: var(--color-text);
  font-size: 0.9rem;
  font-family: var(--font-main);
  outline: none;
  transition: all 0.2s ease;
}

.field-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

.field-input--small {
  width: auto;
  padding: 6px 12px;
  font-size: 0.85rem;
}

/* Setting row with toggle */
.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
  cursor: pointer;
}

.setting-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: var(--color-text);
}

/* Toggle */
.toggle {
  width: 44px;
  height: 24px;
  border-radius: 2px;
  background: var(--color-border);
  padding: 2px;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.toggle--on {
  background: var(--color-primary);
}

.toggle-knob {
  width: 20px;
  height: 20px;
  border-radius: 1px;
  background: var(--color-surface-solid);
  box-shadow: 0 1px 4px rgb(0 0 0 / 0.15);
  transition: transform 0.2s ease;
}

.toggle--on .toggle-knob {
  transform: translateX(20px);
}

/* CBT mode buttons */
.cbt-modes {
  display: flex;
  gap: 8px;
}

.cbt-mode-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-surface-hover);
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cbt-mode-btn:hover {
  border-color: var(--color-primary);
}

.cbt-mode-btn--active {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
}

.cbt-mode-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
}

.cbt-mode-desc {
  font-size: 0.72rem;
  color: var(--color-text-muted);
  line-height: 1.3;
}

/* Danger */
.danger-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-danger);
  background: none;
  color: var(--color-danger);
  font-size: 0.85rem;
  font-weight: 500;
  font-family: var(--font-main);
  cursor: pointer;
  transition: all 0.2s ease;
}

.danger-btn:hover {
  background: rgb(232 160 160 / 0.1);
}
</style>
