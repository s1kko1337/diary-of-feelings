<template>
  <div class="space-y-5">
    <!-- Back -->
    <RouterLink to="/admin/users" class="inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-600 transition-colors">
      <ArrowLeft class="w-4 h-4" />
      Назад к списку
    </RouterLink>

    <!-- Loading -->
    <div v-if="admin.currentUserLoading && !admin.currentUser" class="bg-white rounded-2xl p-8 border border-ink-100 text-center">
      <p class="text-sm text-ink-400">Загрузка...</p>
    </div>

    <template v-if="u">
      <!-- Profile header -->
      <div class="bg-white rounded-2xl border border-ink-100 shadow-sm overflow-hidden">
        <div class="bg-gradient-to-r from-ink-800 to-ink-900 px-6 py-5">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-full bg-terra-500/20 flex items-center justify-center text-terra-400 text-xl font-bold shrink-0 border-2 border-terra-500/30">
              {{ u.username?.[0]?.toUpperCase() || '?' }}
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="font-display text-xl font-bold text-cream-100">{{ u.username }}</h1>
              <p class="text-sm text-ink-400">{{ u.email }}</p>
            </div>
            <span
              class="px-3 py-1 rounded-full text-xs font-semibold shrink-0"
              :class="u.isActive ? 'bg-forest-500/20 text-forest-300' : 'bg-rose-500/20 text-rose-300'"
            >
              {{ u.isActive ? 'Активен' : 'Заблокирован' }}
            </span>
          </div>
        </div>

        <div class="px-6 py-4 flex flex-wrap gap-2">
          <button v-if="u.isActive" @click="showBlock = true" class="px-3 py-1.5 rounded-xl text-xs font-medium bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors">
            Заблокировать
          </button>
          <button v-else @click="handleUnblock" class="px-3 py-1.5 rounded-xl text-xs font-medium bg-forest-200/50 text-forest-700 hover:bg-forest-200/70 transition-colors">
            Разблокировать
          </button>
          <button @click="showResetPw = true" class="px-3 py-1.5 rounded-xl text-xs font-medium bg-cream-200 text-ink-700 hover:bg-cream-300 transition-colors">
            Сменить пароль
          </button>
          <button @click="showDelete = true" class="px-3 py-1.5 rounded-xl text-xs font-medium bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors ml-auto">
            Удалить
          </button>
        </div>
      </div>

      <!-- Edit + Roles grid -->
      <div class="grid lg:grid-cols-2 gap-5">
        <!-- Edit profile -->
        <div class="bg-white rounded-2xl border border-ink-100 p-5">
          <h2 class="font-display text-base font-semibold text-ink-900 mb-4">Профиль</h2>
          <form @submit.prevent="handleUpdateProfile" class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-ink-500 mb-1">Имя пользователя</label>
              <input v-model="editForm.username" class="w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100" />
            </div>
            <div>
              <label class="block text-xs font-medium text-ink-500 mb-1">Email</label>
              <input v-model="editForm.email" type="email" class="w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100" />
            </div>
            <div>
              <label class="block text-xs font-medium text-ink-500 mb-1">Зарегистрирован</label>
              <p class="text-sm text-ink-600">{{ formatDate(u.createdAt) }}</p>
            </div>
            <button type="submit" :disabled="saving" class="px-4 py-2 rounded-xl text-sm font-medium bg-terra-500 text-white hover:bg-terra-600 disabled:opacity-50 transition-colors">
              {{ saving ? 'Сохранение...' : 'Сохранить' }}
            </button>
          </form>
        </div>

        <!-- Roles -->
        <div class="bg-white rounded-2xl border border-ink-100 p-5">
          <h2 class="font-display text-base font-semibold text-ink-900 mb-4">Роли</h2>
          <div class="space-y-2 mb-4">
            <div
              v-for="role in (u.roles || [])"
              :key="role.id"
              class="flex items-center justify-between py-2 px-3 rounded-xl bg-cream-50"
            >
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="roleColor(role.name)">
                  {{ role.name }}
                </span>
                <span v-if="role.isSystem" class="text-[10px] text-ink-400">системная</span>
              </div>
              <button @click="handleRemoveRole(role.id)" class="p-1 rounded-lg hover:bg-cream-200 text-ink-400 hover:text-rose-500 transition-colors">
                <X class="w-3.5 h-3.5" />
              </button>
            </div>
            <p v-if="!u.roles?.length" class="text-sm text-ink-400 py-2">Нет назначенных ролей</p>
          </div>
          <div class="flex gap-2">
            <select v-model="selectedRoleId" class="flex-1 rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-700 focus:border-terra-400 focus:outline-none">
              <option value="">Выберите роль...</option>
              <option v-for="role in availableRoles" :key="role.id" :value="role.id">{{ role.name }}</option>
            </select>
            <button @click="handleAssignRole" :disabled="!selectedRoleId" class="px-4 py-2 rounded-xl text-sm font-medium bg-terra-500 text-white hover:bg-terra-600 disabled:opacity-50 transition-colors">
              Добавить
            </button>
          </div>
        </div>
      </div>

      <!-- Content tabs -->
      <div class="bg-white rounded-2xl border border-ink-100 overflow-hidden">
        <div class="border-b border-ink-100 px-4 flex gap-0 overflow-x-auto">
          <button
            v-for="tab in contentTabs"
            :key="tab.type"
            @click="activeTab = tab.type"
            class="px-4 py-3 text-sm font-medium border-b-2 transition-colors shrink-0"
            :class="activeTab === tab.type ? 'border-terra-500 text-terra-600' : 'border-transparent text-ink-400 hover:text-ink-600'"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="p-4">
          <div v-if="admin.userContentLoading" class="py-8 text-center text-sm text-ink-400">Загрузка...</div>
          <div v-else-if="!admin.userContent.length" class="py-8 text-center text-sm text-ink-400">Нет записей</div>
          <div v-else class="space-y-2">
            <div
              v-for="item in admin.userContent"
              :key="item.id"
              class="flex items-start justify-between gap-3 py-3 px-3 rounded-xl hover:bg-cream-50 transition-colors"
            >
              <div class="flex-1 min-w-0">
                <p class="text-sm text-ink-800 line-clamp-2">{{ contentPreview(item) }}</p>
                <p class="text-xs text-ink-400 mt-0.5">{{ formatDate(item.createdAt) }}</p>
              </div>
              <button @click="handleDeleteContent(item.id)" class="p-1.5 rounded-lg hover:bg-rose-50 text-ink-400 hover:text-rose-500 transition-colors shrink-0">
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- Content pagination -->
          <div v-if="admin.userContentPages > 1" class="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-ink-100">
            <button
              @click="fetchContent(admin.userContentPage - 1)"
              :disabled="admin.userContentPage <= 1"
              class="px-3 py-1.5 rounded-lg text-xs font-medium border border-ink-200 hover:bg-cream-100 disabled:opacity-40 transition-colors"
            >
              Назад
            </button>
            <span class="text-xs text-ink-400">{{ admin.userContentPage }} / {{ admin.userContentPages }}</span>
            <button
              @click="fetchContent(admin.userContentPage + 1)"
              :disabled="admin.userContentPage >= admin.userContentPages"
              class="px-3 py-1.5 rounded-lg text-xs font-medium border border-ink-200 hover:bg-cream-100 disabled:opacity-40 transition-colors"
            >
              Далее
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Block confirmation modal -->
    <BaseModal v-model="showBlock" title="Заблокировать пользователя?">
      <p class="text-sm text-ink-600">Пользователь <strong>{{ u?.username }}</strong> не сможет войти в систему.</p>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button @click="showBlock = false" class="px-4 py-2 rounded-xl text-sm font-medium bg-cream-200 text-ink-700 hover:bg-cream-300 transition-colors">Отмена</button>
          <button @click="handleBlock" class="px-4 py-2 rounded-xl text-sm font-medium bg-rose-500 text-white hover:bg-rose-600 transition-colors">Заблокировать</button>
        </div>
      </template>
    </BaseModal>

    <!-- Delete confirmation modal -->
    <BaseModal v-model="showDelete" title="Удалить пользователя?">
      <p class="text-sm text-ink-600">Аккаунт <strong>{{ u?.username }}</strong> будет деактивирован. Это действие необратимо.</p>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button @click="showDelete = false" class="px-4 py-2 rounded-xl text-sm font-medium bg-cream-200 text-ink-700 hover:bg-cream-300 transition-colors">Отмена</button>
          <button @click="handleDelete" class="px-4 py-2 rounded-xl text-sm font-medium bg-rose-500 text-white hover:bg-rose-600 transition-colors">Удалить</button>
        </div>
      </template>
    </BaseModal>

    <!-- Reset password modal -->
    <BaseModal v-model="showResetPw" title="Сменить пароль">
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-medium text-ink-500 mb-1">Новый пароль</label>
          <input v-model="newPassword" type="password" minlength="8" class="w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100" placeholder="Минимум 8 символов" />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button @click="showResetPw = false" class="px-4 py-2 rounded-xl text-sm font-medium bg-cream-200 text-ink-700 hover:bg-cream-300 transition-colors">Отмена</button>
          <button @click="handleResetPassword" :disabled="newPassword.length < 8" class="px-4 py-2 rounded-xl text-sm font-medium bg-terra-500 text-white hover:bg-terra-600 disabled:opacity-50 transition-colors">Сменить</button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import BaseModal from '@/components/ui/BaseModal.vue'
import { ArrowLeft, X, Trash2 } from 'lucide-vue-next'

const props = defineProps({ id: String })
const route = useRoute()
const router = useRouter()
const admin = useAdminStore()

const u = computed(() => admin.currentUser)
const saving = ref(false)
const editForm = reactive({ username: '', email: '' })
const selectedRoleId = ref('')
const activeTab = ref('emotions')
const showBlock = ref(false)
const showDelete = ref(false)
const showResetPw = ref(false)
const newPassword = ref('')

const contentTabs = [
  { type: 'emotions', label: 'Эмоции' },
  { type: 'notes', label: 'Заметки' },
  { type: 'tasks', label: 'Задачи' },
  { type: 'cbt', label: 'КПТ' },
  { type: 'chat', label: 'Чат' },
]

const availableRoles = computed(() => {
  const userRoleIds = new Set((u.value?.roles || []).map(r => r.id))
  return admin.roles.filter(r => !userRoleIds.has(r.id))
})

watch(u, (val) => {
  if (val) {
    editForm.username = val.username || ''
    editForm.email = val.email || ''
  }
}, { immediate: true })

watch(activeTab, () => {
  if (u.value) fetchContent(1)
})

function fetchContent(page) {
  admin.fetchUserContent(props.id || route.params.id, activeTab.value, page)
}

async function handleUpdateProfile() {
  saving.value = true
  try {
    await admin.updateUser(u.value.id, { username: editForm.username, email: editForm.email })
  } finally {
    saving.value = false
  }
}

async function handleBlock() {
  await admin.blockUser(u.value.id)
  showBlock.value = false
}

async function handleUnblock() {
  await admin.unblockUser(u.value.id)
}

async function handleDelete() {
  await admin.deleteUser(u.value.id)
  showDelete.value = false
  router.push({ name: 'admin-users' })
}

async function handleResetPassword() {
  await admin.resetPassword(u.value.id, newPassword.value)
  showResetPw.value = false
  newPassword.value = ''
}

async function handleAssignRole() {
  if (!selectedRoleId.value) return
  await admin.assignUserRole(u.value.id, selectedRoleId.value)
  selectedRoleId.value = ''
}

async function handleRemoveRole(roleId) {
  await admin.removeUserRole(u.value.id, roleId)
}

async function handleDeleteContent(contentId) {
  await admin.deleteContent(u.value.id, activeTab.value, contentId)
}

function contentPreview(item) {
  return item.text || item.content || item.emotionName || item.title || item.message || JSON.stringify(item).slice(0, 100)
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function roleColor(name) {
  if (name === 'superadmin') return 'bg-terra-100 text-terra-600'
  if (name === 'admin') return 'bg-violet-300/30 text-violet-600'
  if (name === 'moderator') return 'bg-sky-300/30 text-sky-600'
  return 'bg-cream-200 text-ink-600'
}

onMounted(async () => {
  const userId = props.id || route.params.id
  await Promise.all([
    admin.fetchUser(userId),
    admin.fetchRoles(),
  ])
  fetchContent(1)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
