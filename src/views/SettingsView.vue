<template>
  <div class="space-y-6">
    <h1 class="font-display text-3xl font-bold text-ink-900">Настройки</h1>

    <!-- Profile section -->
    <section class="bg-white rounded-2xl border border-ink-100 overflow-hidden">
      <div class="px-5 pt-5 pb-4">
        <h2 class="font-display text-lg font-semibold text-ink-900">Профиль</h2>
      </div>
      <div class="px-5 pb-5">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-16 h-16 rounded-full bg-terra-100 flex items-center justify-center text-terra-600 text-2xl font-bold font-display">
            {{ auth.user?.username?.[0]?.toUpperCase() || '?' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-lg font-semibold text-ink-900 truncate">{{ auth.user?.username }}</p>
            <p class="text-sm text-ink-400 truncate">{{ auth.user?.email }}</p>
          </div>
          <button
            v-if="!editingProfile"
            @click="startEditProfile"
            class="px-3 py-1.5 rounded-lg text-sm font-medium text-terra-500 hover:bg-terra-50 transition-colors"
          >
            Редактировать
          </button>
        </div>

        <Transition name="fade">
          <div v-if="editingProfile" class="space-y-3 pt-2 border-t border-ink-100">
            <BaseInput v-model="profileForm.username" label="Имя пользователя" placeholder="username" />
            <BaseInput v-model="profileForm.email" label="Email" type="email" placeholder="you@example.com" />
            <p v-if="profileError" class="text-sm text-rose-500">{{ profileError }}</p>
            <p v-if="profileSuccess" class="text-sm text-forest-600">Профиль обновлён</p>
            <div class="flex gap-3">
              <BaseButton variant="secondary" @click="editingProfile = false">Отмена</BaseButton>
              <BaseButton :loading="profileSaving" @click="saveProfile">Сохранить</BaseButton>
            </div>
          </div>
        </Transition>
      </div>
    </section>

    <!-- Security section -->
    <section class="bg-white rounded-2xl border border-ink-100 overflow-hidden">
      <div class="px-5 pt-5 pb-4">
        <h2 class="font-display text-lg font-semibold text-ink-900">Безопасность</h2>
      </div>
      <div class="px-5 pb-5">
        <button
          v-if="!editingPassword"
          @click="editingPassword = true"
          class="text-sm font-medium text-terra-500 hover:text-terra-600 transition-colors"
        >
          Сменить пароль
        </button>

        <Transition name="fade">
          <div v-if="editingPassword" class="space-y-3">
            <BaseInput v-model="passwordForm.currentPassword" label="Текущий пароль" type="password" />
            <BaseInput v-model="passwordForm.newPassword" label="Новый пароль" type="password" />
            <BaseInput v-model="passwordForm.confirmPassword" label="Подтверждение" type="password" :error="confirmError" />
            <p v-if="passwordError" class="text-sm text-rose-500">{{ passwordError }}</p>
            <p v-if="passwordSuccess" class="text-sm text-forest-600">Пароль изменён</p>
            <div class="flex gap-3">
              <BaseButton variant="secondary" @click="editingPassword = false">Отмена</BaseButton>
              <BaseButton :loading="passwordSaving" @click="savePassword">Сменить пароль</BaseButton>
            </div>
          </div>
        </Transition>
      </div>
    </section>

    <!-- Data export section -->
    <section class="bg-white rounded-2xl border border-ink-100 overflow-hidden">
      <div class="px-5 pt-5 pb-4">
        <h2 class="font-display text-lg font-semibold text-ink-900">Данные</h2>
        <p class="text-xs text-ink-400 mt-1">Экспортируйте все ваши данные. Доступно 1 раз в час.</p>
      </div>
      <div class="px-5 pb-5 flex flex-wrap gap-3">
        <BaseButton variant="secondary" :loading="exportingJson" @click="exportData('json')">
          <Download class="w-4 h-4 mr-2" />
          Экспорт JSON
        </BaseButton>
        <BaseButton variant="secondary" :loading="exportingCsv" @click="exportData('csv')">
          <Download class="w-4 h-4 mr-2" />
          Экспорт CSV
        </BaseButton>
      </div>
      <p v-if="exportError" class="px-5 pb-4 text-sm text-rose-500">{{ exportError }}</p>
    </section>

    <!-- Account section -->
    <section class="bg-white rounded-2xl border border-ink-100 overflow-hidden">
      <div class="px-5 pt-5 pb-4">
        <h2 class="font-display text-lg font-semibold text-ink-900">Аккаунт</h2>
      </div>
      <div class="px-5 pb-5 space-y-3">
        <BaseButton variant="secondary" @click="handleLogout">
          <LogOut class="w-4 h-4 mr-2" />
          Выйти из аккаунта
        </BaseButton>
        <div>
          <BaseButton variant="danger" @click="showDeleteModal = true">
            <Trash2 class="w-4 h-4 mr-2" />
            Удалить аккаунт
          </BaseButton>
        </div>
      </div>
    </section>

    <!-- Delete confirmation modal -->
    <BaseModal v-model="showDeleteModal" title="Удаление аккаунта" size="sm">
      <div class="text-center py-2">
        <div class="w-16 h-16 rounded-full bg-rose-300/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle class="w-8 h-8 text-rose-500" />
        </div>
        <p class="text-sm text-ink-600 leading-relaxed">
          Это действие необратимо. Все ваши данные будут безвозвратно удалены, включая записи эмоций, задачи, заметки и КПТ-дневник.
        </p>
      </div>
      <template #footer>
        <div class="flex gap-3">
          <BaseButton variant="secondary" class="flex-1" @click="showDeleteModal = false">Отмена</BaseButton>
          <BaseButton variant="danger" class="flex-1" :loading="deleting" @click="handleDeleteAccount">
            Удалить навсегда
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { BASE_URL } from '@/api/client'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { Download, LogOut, Trash2, AlertTriangle } from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()

// Profile editing
const editingProfile = ref(false)
const profileSaving = ref(false)
const profileError = ref('')
const profileSuccess = ref(false)
const profileForm = reactive({ username: '', email: '' })

function startEditProfile() {
  profileForm.username = auth.user?.username || ''
  profileForm.email = auth.user?.email || ''
  profileError.value = ''
  profileSuccess.value = false
  editingProfile.value = true
}

async function saveProfile() {
  profileSaving.value = true
  profileError.value = ''
  profileSuccess.value = false
  try {
    await auth.updateProfile({
      username: profileForm.username,
      email: profileForm.email,
    })
    profileSuccess.value = true
    setTimeout(() => { editingProfile.value = false; profileSuccess.value = false }, 1500)
  } catch (e) {
    profileError.value = e.message || 'Не удалось обновить профиль'
  } finally {
    profileSaving.value = false
  }
}

// Password
const editingPassword = ref(false)
const passwordSaving = ref(false)
const passwordError = ref('')
const passwordSuccess = ref(false)
const passwordForm = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })

const confirmError = computed(() => {
  if (passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword) {
    return 'Пароли не совпадают'
  }
  return ''
})

async function savePassword() {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) return
  passwordSaving.value = true
  passwordError.value = ''
  passwordSuccess.value = false
  try {
    await auth.changePassword({
      current_password: passwordForm.currentPassword,
      new_password: passwordForm.newPassword,
    })
    passwordSuccess.value = true
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    setTimeout(() => { editingPassword.value = false; passwordSuccess.value = false }, 1500)
  } catch (e) {
    passwordError.value = e.message || 'Не удалось сменить пароль'
  } finally {
    passwordSaving.value = false
  }
}

// Export
const exportingJson = ref(false)
const exportingCsv = ref(false)
const exportError = ref('')

async function exportData(format) {
  const isJson = format === 'json'
  if (isJson) exportingJson.value = true
  else exportingCsv.value = true
  exportError.value = ''
  try {
    const token = localStorage.getItem('dof-token')
    const res = await fetch(`${BASE_URL}/export/${format}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.detail || `Ошибка экспорта (${res.status})`)
    }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = isJson ? 'diary-export.json' : 'diary-export.zip'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  } catch (e) {
    exportError.value = e.message
  } finally {
    exportingJson.value = false
    exportingCsv.value = false
  }
}

// Account
const showDeleteModal = ref(false)
const deleting = ref(false)

async function handleLogout() {
  await auth.logout()
  router.push({ name: 'auth' })
}

async function handleDeleteAccount() {
  deleting.value = true
  try {
    await auth.deleteAccount()
    router.push({ name: 'auth' })
  } catch {
    deleting.value = false
  }
}
</script>
