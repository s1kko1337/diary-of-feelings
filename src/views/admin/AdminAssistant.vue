<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-display text-2xl font-bold text-ink-900">Конфигурация ассистента</h1>
        <p class="text-sm text-ink-400 mt-0.5">Настройки LLM для AI-ассистента Леи</p>
      </div>
      <button @click="openCreate" class="px-4 py-2.5 rounded-xl text-sm font-medium bg-terra-500 text-white hover:bg-terra-600 transition-colors shadow-sm">
        Новая конфигурация
      </button>
    </div>

    <!-- Loading -->
    <div v-if="admin.configsLoading" class="bg-white rounded-2xl p-8 border border-ink-100 text-center text-sm text-ink-400">Загрузка...</div>

    <!-- Configs list -->
    <div v-else class="space-y-3">
      <div
        v-for="config in admin.configs"
        :key="config.id"
        class="bg-white rounded-2xl border shadow-sm overflow-hidden"
        :class="config.isActive && config.isGlobal ? 'border-forest-300' : 'border-ink-100'"
      >
        <div class="flex items-center justify-between px-5 py-4">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              :class="config.provider === 'anthropic' ? 'bg-violet-300/20' : 'bg-forest-200/40'">
              <Bot class="w-5 h-5" :class="config.provider === 'anthropic' ? 'text-violet-600' : 'text-forest-600'" />
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-semibold text-ink-800 truncate">{{ config.name }}</h3>
                <span v-if="config.isActive && config.isGlobal" class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-forest-200/50 text-forest-700">
                  Активна
                </span>
                <span v-if="config.isGlobal" class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-300/30 text-sky-600">
                  Глобальная
                </span>
                <span v-if="config.userId" class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gold-200/50 text-gold-600">
                  Пользовательская
                </span>
              </div>
              <div class="flex items-center gap-3 mt-0.5">
                <span class="text-xs text-ink-400">{{ config.provider }}</span>
                <span class="text-xs text-ink-400 font-mono">{{ config.modelName }}</span>
                <span v-if="config.apiKeyMasked" class="text-xs text-ink-400 font-mono">{{ config.apiKeyMasked }}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-1.5 shrink-0">
            <button @click="handleTest(config)" :disabled="testingId === config.id" class="p-2 rounded-lg hover:bg-cream-100 text-ink-400 hover:text-forest-600 transition-colors" title="Тест">
              <Play v-if="testingId !== config.id" class="w-4 h-4" />
              <svg v-else class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75" />
              </svg>
            </button>
            <button v-if="config.isGlobal && !config.isActive" @click="handleActivate(config.id)" class="p-2 rounded-lg hover:bg-forest-100 text-ink-400 hover:text-forest-600 transition-colors" title="Активировать">
              <Power class="w-4 h-4" />
            </button>
            <button @click="openEdit(config)" class="p-2 rounded-lg hover:bg-cream-100 text-ink-400 hover:text-ink-600 transition-colors" title="Редактировать">
              <Pencil class="w-4 h-4" />
            </button>
            <button @click="confirmDelete = config" class="p-2 rounded-lg hover:bg-rose-50 text-ink-400 hover:text-rose-500 transition-colors" title="Удалить">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Test result -->
        <div v-if="testResults[config.id]" class="border-t border-ink-100 px-5 py-3">
          <div v-if="testResults[config.id].success" class="flex items-start gap-2">
            <CheckCircle class="w-4 h-4 text-forest-500 mt-0.5 shrink-0" />
            <div>
              <p class="text-xs font-semibold text-forest-600">Успешно ({{ testResults[config.id].latencyMs }}мс)</p>
              <p class="text-xs text-ink-500 mt-1 whitespace-pre-wrap line-clamp-3">{{ testResults[config.id].response }}</p>
            </div>
          </div>
          <div v-else class="flex items-start gap-2">
            <XCircle class="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
            <div>
              <p class="text-xs font-semibold text-rose-600">Ошибка</p>
              <p class="text-xs text-ink-500 mt-1">{{ testResults[config.id].error }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!admin.configs.length" class="bg-white rounded-2xl border border-ink-100 p-12 text-center">
        <Bot class="w-10 h-10 text-ink-300 mx-auto mb-3" />
        <p class="text-sm text-ink-400">Нет конфигураций</p>
        <p class="text-xs text-ink-400 mt-1">Создайте первую конфигурацию для AI-ассистента</p>
      </div>
    </div>

    <!-- Models browser -->
    <div class="bg-white rounded-2xl border border-ink-100 p-5">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-display text-base font-semibold text-ink-900">Доступные модели</h2>
        <button @click="admin.fetchModels()" class="px-3 py-1.5 rounded-xl text-xs font-medium bg-cream-200 text-ink-700 hover:bg-cream-300 transition-colors">
          Обновить
        </button>
      </div>
      <div class="grid sm:grid-cols-2 gap-4">
        <div>
          <p class="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Ollama (локальные)</p>
          <div v-if="admin.models.local?.length" class="space-y-1.5">
            <div v-for="m in admin.models.local" :key="m.name" class="flex items-center justify-between py-1.5 px-3 rounded-lg bg-cream-50">
              <span class="text-sm font-mono text-ink-700">{{ m.name }}</span>
              <span class="text-xs text-ink-400">{{ formatSize(m.size) }}</span>
            </div>
          </div>
          <p v-else class="text-xs text-ink-400">Нет моделей или Ollama недоступна</p>
        </div>
        <div>
          <p class="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Anthropic</p>
          <div v-if="admin.models.anthropic?.length" class="space-y-1.5">
            <div v-for="m in admin.models.anthropic" :key="m.id" class="flex items-center justify-between py-1.5 px-3 rounded-lg bg-cream-50">
              <span class="text-sm font-mono text-ink-700">{{ m.id || m.name }}</span>
            </div>
          </div>
          <p v-else class="text-xs text-ink-400">Загрузите список моделей</p>
        </div>
      </div>
    </div>

    <!-- Create/Edit modal -->
    <BaseModal v-model="showForm" :title="editingConfig ? 'Редактировать конфигурацию' : 'Новая конфигурация'" size="lg">
      <div class="space-y-4">
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-ink-500 mb-1">Название</label>
            <input v-model="form.name" class="w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100" />
          </div>
          <div>
            <label class="block text-xs font-medium text-ink-500 mb-1">Провайдер</label>
            <select v-model="form.provider" class="w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm focus:border-terra-400 focus:outline-none">
              <option value="local">Локальный (Ollama)</option>
              <option value="anthropic">Anthropic (Claude)</option>
            </select>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-ink-500 mb-1">Модель</label>
            <input v-model="form.modelName" class="w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm font-mono focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100" placeholder="gemma3:4b" />
          </div>
          <div v-if="form.provider === 'local'">
            <label class="block text-xs font-medium text-ink-500 mb-1">API URL</label>
            <input v-model="form.apiUrl" class="w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm font-mono focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100" placeholder="http://localhost:11434/v1" />
          </div>
          <div v-if="form.provider === 'anthropic'">
            <label class="block text-xs font-medium text-ink-500 mb-1">API Key</label>
            <input v-model="form.apiKey" type="password" class="w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm font-mono focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100" placeholder="sk-ant-..." />
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-ink-500 mb-1">Температура ({{ form.temperature }})</label>
            <input v-model.number="form.temperature" type="range" min="0" max="2" step="0.1" class="w-full accent-terra-500" />
          </div>
          <div>
            <label class="block text-xs font-medium text-ink-500 mb-1">Макс. токенов</label>
            <input v-model.number="form.maxTokens" type="number" min="64" max="8192" class="w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-ink-500 mb-1">Системный промпт (опционально)</label>
          <textarea v-model="form.systemPrompt" rows="3" class="w-full rounded-xl border border-ink-200 bg-white px-3 py-3 text-sm resize-none focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100" placeholder="Переопределить стандартный системный промпт..." />
        </div>

        <label class="flex items-center gap-2.5 cursor-pointer">
          <input v-model="form.isGlobal" type="checkbox" class="w-4 h-4 rounded border-ink-300 text-terra-500 focus:ring-terra-400" />
          <span class="text-sm text-ink-700">Глобальная конфигурация</span>
        </label>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <button @click="showForm = false" class="px-4 py-2 rounded-xl text-sm font-medium bg-cream-200 text-ink-700 hover:bg-cream-300 transition-colors">Отмена</button>
          <button @click="handleSave" :disabled="!form.name || !form.modelName || savingForm" class="px-4 py-2 rounded-xl text-sm font-medium bg-terra-500 text-white hover:bg-terra-600 disabled:opacity-50 transition-colors">
            {{ savingForm ? 'Сохранение...' : (editingConfig ? 'Сохранить' : 'Создать') }}
          </button>
        </div>
      </template>
    </BaseModal>

    <!-- Delete modal -->
    <BaseModal v-model="showDeleteModal" title="Удалить конфигурацию?">
      <p class="text-sm text-ink-600">Конфигурация <strong>{{ confirmDelete?.name }}</strong> будет удалена.</p>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button @click="confirmDelete = null" class="px-4 py-2 rounded-xl text-sm font-medium bg-cream-200 text-ink-700 hover:bg-cream-300 transition-colors">Отмена</button>
          <button @click="handleDelete" class="px-4 py-2 rounded-xl text-sm font-medium bg-rose-500 text-white hover:bg-rose-600 transition-colors">Удалить</button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import BaseModal from '@/components/ui/BaseModal.vue'
import { Bot, Play, Power, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-vue-next'

const admin = useAdminStore()

const showForm = ref(false)
const editingConfig = ref(null)
const savingForm = ref(false)
const testingId = ref(null)
const testResults = reactive({})
const confirmDelete = ref(null)
const showDeleteModal = computed({ get: () => !!confirmDelete.value, set: (v) => { if (!v) confirmDelete.value = null } })

const form = reactive({
  name: '',
  provider: 'local',
  modelName: '',
  apiUrl: '',
  apiKey: '',
  systemPrompt: '',
  temperature: 0.8,
  maxTokens: 1024,
  isGlobal: true,
})

function resetForm() {
  form.name = ''
  form.provider = 'local'
  form.modelName = ''
  form.apiUrl = ''
  form.apiKey = ''
  form.systemPrompt = ''
  form.temperature = 0.8
  form.maxTokens = 1024
  form.isGlobal = true
}

function openCreate() {
  editingConfig.value = null
  resetForm()
  showForm.value = true
}

function openEdit(config) {
  editingConfig.value = config
  form.name = config.name
  form.provider = config.provider
  form.modelName = config.modelName
  form.apiUrl = config.apiUrl || ''
  form.apiKey = ''
  form.systemPrompt = config.systemPrompt || ''
  form.temperature = config.temperature
  form.maxTokens = config.maxTokens
  form.isGlobal = config.isGlobal
  showForm.value = true
}

async function handleSave() {
  savingForm.value = true
  try {
    if (editingConfig.value) {
      const data = { ...form }
      if (!data.apiKey) delete data.apiKey
      await admin.updateConfig(editingConfig.value.id, data)
    } else {
      await admin.createConfig(form)
    }
    showForm.value = false
  } finally {
    savingForm.value = false
  }
}

async function handleTest(config) {
  testingId.value = config.id
  try {
    const result = await admin.testConfig(config.id)
    testResults[config.id] = result
  } catch (e) {
    testResults[config.id] = { success: false, error: e.message }
  } finally {
    testingId.value = null
  }
}

async function handleActivate(id) {
  await admin.activateConfig(id)
}

async function handleDelete() {
  if (!confirmDelete.value) return
  await admin.deleteConfig(confirmDelete.value.id)
  confirmDelete.value = null
}

function formatSize(bytes) {
  if (!bytes) return ''
  if (bytes > 1e9) return (bytes / 1e9).toFixed(1) + ' GB'
  if (bytes > 1e6) return (bytes / 1e6).toFixed(0) + ' MB'
  return bytes + ' B'
}

onMounted(() => {
  admin.fetchConfigs()
  admin.fetchModels()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
