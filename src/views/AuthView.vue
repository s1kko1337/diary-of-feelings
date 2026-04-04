<template>
  <div class="min-h-screen bg-cream-100 flex">
    <!-- Left decorative panel (desktop) -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-terra-500 via-terra-600 to-terra-700 relative overflow-hidden items-center justify-center">
      <!-- Floating shapes -->
      <div class="absolute top-16 -left-8 w-56 h-56 rounded-full bg-white/5 blur-sm" />
      <div class="absolute bottom-24 right-12 w-40 h-40 rounded-full bg-white/8" />
      <div class="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-white/5" />
      <div class="absolute bottom-1/3 left-1/4 w-16 h-16 rounded-full bg-white/10" />

      <div class="relative z-10 text-center px-12 max-w-lg">
        <h1 class="font-display text-5xl font-bold text-white leading-tight mb-6">
          Diary of<br />Feelings
        </h1>
        <div class="w-12 h-0.5 bg-white/30 mx-auto mb-6" />
        <p class="text-terra-200 text-lg leading-relaxed font-light">
          Пространство для рефлексии, осознанности и заботы о себе
        </p>
        <div class="flex justify-center gap-6 mt-10">
          <div v-for="feat in features" :key="feat.label" class="text-center">
            <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
              <component :is="feat.icon" class="w-5 h-5 text-white" />
            </div>
            <p class="text-xs text-terra-200 font-medium">{{ feat.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Right form panel -->
    <div class="flex-1 flex items-center justify-center p-6 sm:p-12">
      <div class="w-full max-w-md">
        <!-- Mobile logo -->
        <div class="lg:hidden text-center mb-10">
          <h1 class="font-display text-3xl font-bold text-ink-900">
            Diary of <span class="text-terra-500">Feelings</span>
          </h1>
          <p class="text-sm text-ink-400 mt-2">Ваш личный дневник эмоций</p>
        </div>

        <!-- Tab switch -->
        <div class="flex bg-cream-200 rounded-2xl p-1.5 mb-8">
          <button
            v-for="tab in ['login', 'register']"
            :key="tab"
            @click="mode = tab; error = ''"
            class="flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200"
            :class="mode === tab ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'"
          >
            {{ tab === 'login' ? 'Войти' : 'Регистрация' }}
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-ink-700 mb-1.5">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              placeholder="your@email.com"
              class="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 placeholder:text-ink-400 focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100 transition-colors"
            />
          </div>

          <Transition name="fade">
            <div v-if="mode === 'register'">
              <label class="block text-sm font-semibold text-ink-700 mb-1.5">Имя пользователя</label>
              <input
                v-model="form.username"
                type="text"
                required
                autocomplete="username"
                placeholder="Как вас называть?"
                minlength="3"
                class="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 placeholder:text-ink-400 focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100 transition-colors"
              />
            </div>
          </Transition>

          <div>
            <label class="block text-sm font-semibold text-ink-700 mb-1.5">Пароль</label>
            <input
              v-model="form.password"
              type="password"
              required
              :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              class="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 placeholder:text-ink-400 focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100 transition-colors"
            />
          </div>

          <Transition name="fade">
            <p v-if="error" class="text-sm text-rose-600 bg-rose-300/10 px-4 py-3 rounded-xl border border-rose-200/50">
              {{ error }}
            </p>
          </Transition>

          <button
            type="submit"
            :disabled="auth.loading"
            class="w-full py-3.5 rounded-xl bg-terra-500 text-white font-semibold hover:bg-terra-600 transition-all active:scale-[0.98] disabled:opacity-50 shadow-md hover:shadow-lg text-sm"
          >
            <span v-if="auth.loading" class="inline-flex items-center gap-2">
              <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75" />
              </svg>
              Загрузка...
            </span>
            <span v-else>{{ mode === 'login' ? 'Войти' : 'Создать аккаунт' }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { MessageSquare, Brain, Heart, BarChart3, BookOpen } from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()

const features = [
  { icon: MessageSquare, label: 'AI-ассистент' },
  { icon: Brain, label: 'КПТ-дневник' },
  { icon: Heart, label: 'Эмоции' },
  { icon: BarChart3, label: 'Аналитика' },
  { icon: BookOpen, label: 'Рекомендации' },
]

const mode = ref('login')
const error = ref('')
const form = reactive({ email: '', username: '', password: '' })

async function handleSubmit() {
  error.value = ''
  try {
    if (mode.value === 'login') {
      await auth.login(form.email, form.password)
    } else {
      await auth.register(form.email, form.username, form.password)
    }
    router.push({ name: 'home' })
  } catch (err) {
    error.value = err.message || 'Произошла ошибка'
  }
}
</script>
