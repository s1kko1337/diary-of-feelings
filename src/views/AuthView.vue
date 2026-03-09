<template>
  <div class="auth-bg">
    <div class="auth-orb auth-orb--1" />
    <div class="auth-orb auth-orb--2" />

    <div class="auth-card">
      <!-- Logo -->
      <div class="auth-logo">
        <div class="auth-logo-icon">💜</div>
        <h1 class="auth-title">Diary of Feelings</h1>
        <p class="auth-subtitle">Твоё личное пространство для рефлексии</p>
      </div>

      <!-- Tabs -->
      <div class="auth-tabs">
        <button
          class="auth-tab"
          :class="{ active: mode === 'login' }"
          @click="mode = 'login'"
        >
          Вход
        </button>
        <button
          class="auth-tab"
          :class="{ active: mode === 'register' }"
          @click="mode = 'register'"
        >
          Регистрация
        </button>
      </div>

      <!-- Error -->
      <Transition name="fade">
        <div v-if="error" class="auth-error">
          {{ error }}
        </div>
      </Transition>

      <!-- Login form -->
      <form v-if="mode === 'login'" class="auth-form" @submit.prevent="handleLogin">
        <div class="field">
          <label>Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
            required
          />
        </div>
        <div class="field">
          <label>Пароль</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
            required
          />
        </div>
        <button type="submit" class="auth-btn" :disabled="authStore.isLoading">
          <span v-if="authStore.isLoading">Входим...</span>
          <span v-else>Войти</span>
        </button>
      </form>

      <!-- Register form -->
      <form v-else class="auth-form" @submit.prevent="handleRegister">
        <div class="field">
          <label>Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
            required
          />
        </div>
        <div class="field">
          <label>Имя</label>
          <input
            v-model="username"
            type="text"
            placeholder="Как тебя зовут?"
            autocomplete="username"
            required
          />
        </div>
        <div class="field">
          <label>Пароль</label>
          <input
            v-model="password"
            type="password"
            placeholder="Минимум 8 символов"
            autocomplete="new-password"
            minlength="8"
            required
          />
        </div>
        <button type="submit" class="auth-btn" :disabled="authStore.isLoading">
          <span v-if="authStore.isLoading">Создаём аккаунт...</span>
          <span v-else>Создать аккаунт</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const mode = ref('login')
const email = ref('')
const username = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  error.value = ''
  try {
    await authStore.login(email.value, password.value)
    router.push({ name: 'home' })
  } catch (e) {
    error.value = e.message || 'Неверный email или пароль'
  }
}

async function handleRegister() {
  error.value = ''
  try {
    await authStore.register(email.value, username.value, password.value)
    router.push({ name: 'home' })
  } catch (e) {
    error.value = e.message || 'Не удалось создать аккаунт'
  }
}
</script>

<style scoped>
.auth-bg {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: var(--gradient-bg, linear-gradient(145deg, #faf9f7 0%, #f0ecf8 50%, #ecf6f1 100%));
  position: relative;
  overflow: hidden;
}

.auth-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
  pointer-events: none;
}
.auth-orb--1 {
  width: 400px;
  height: 400px;
  background: #c4b5e0;
  top: -100px;
  right: -100px;
  animation: drift 22s ease-in-out infinite alternate;
}
.auth-orb--2 {
  width: 300px;
  height: 300px;
  background: #a8dfc8;
  bottom: -80px;
  left: -80px;
  animation: drift 18s ease-in-out infinite alternate-reverse;
}

@keyframes drift {
  from { transform: translate(0, 0) scale(1); }
  to { transform: translate(30px, 20px) scale(1.05); }
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 24px;
  padding: 2.5rem 2rem;
  box-shadow: 0 8px 40px rgba(100, 80, 160, 0.12);
  position: relative;
  z-index: 1;
}

.auth-logo {
  text-align: center;
  margin-bottom: 2rem;
}
.auth-logo-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}
.auth-title {
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--color-text, #1a1714);
  margin: 0 0 0.3rem;
}
.auth-subtitle {
  font-size: 0.85rem;
  color: var(--color-text-secondary, rgba(26, 23, 20, 0.55));
  margin: 0;
}

.auth-tabs {
  display: flex;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 1.5rem;
}
.auth-tab {
  flex: 1;
  padding: 0.5rem;
  border: none;
  background: transparent;
  border-radius: 9px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-secondary, rgba(26, 23, 20, 0.55));
  cursor: pointer;
  transition: all 0.2s ease;
}
.auth-tab.active {
  background: white;
  color: var(--color-text, #1a1714);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.auth-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #dc2626;
  border-radius: 10px;
  padding: 0.65rem 0.9rem;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.field label {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-secondary, rgba(26, 23, 20, 0.55));
}
.field input {
  padding: 0.7rem 0.9rem;
  border: 1.5px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.8);
  color: var(--color-text, #1a1714);
  outline: none;
  transition: border-color 0.2s ease;
  font-family: inherit;
}
.field input:focus {
  border-color: #6366f1;
}
.field input::placeholder {
  color: rgba(26, 23, 20, 0.3);
}

.auth-btn {
  margin-top: 0.5rem;
  padding: 0.8rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}
.auth-btn:hover:not(:disabled) {
  background: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
}
.auth-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
