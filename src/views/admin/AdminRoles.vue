<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-display text-2xl font-bold text-ink-900">Роли и права</h1>
        <p class="text-sm text-ink-400 mt-0.5">Управление ролями и разрешениями</p>
      </div>
      <button @click="showCreate = true" class="px-4 py-2.5 rounded-xl text-sm font-medium bg-terra-500 text-white hover:bg-terra-600 transition-colors shadow-sm">
        Новая роль
      </button>
    </div>

    <!-- Loading -->
    <div v-if="admin.rolesLoading" class="bg-white rounded-2xl p-8 border border-ink-100 text-center text-sm text-ink-400">
      Загрузка...
    </div>

    <!-- Roles list -->
    <div v-else class="grid gap-3">
      <div
        v-for="role in admin.roles"
        :key="role.id"
        class="bg-white rounded-2xl border border-ink-100 overflow-hidden transition-shadow"
        :class="selectedRole?.id === role.id ? 'shadow-md border-terra-200' : 'shadow-sm'"
      >
        <div class="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-cream-50 transition-colors" @click="toggleRole(role)">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center" :class="roleIconBg(role.name)">
              <KeyRound class="w-4.5 h-4.5" :class="roleIconColor(role.name)" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-semibold text-ink-800">{{ role.name }}</h3>
                <span v-if="role.isSystem" class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-ink-100 text-ink-500">
                  Системная
                </span>
              </div>
              <p class="text-xs text-ink-400 mt-0.5">{{ role.description || 'Нет описания' }}</p>
            </div>
          </div>
          <ChevronDown class="w-4 h-4 text-ink-400 transition-transform" :class="{ 'rotate-180': selectedRole?.id === role.id }" />
        </div>

        <!-- Expanded permissions -->
        <Transition name="expand">
          <div v-if="selectedRole?.id === role.id" class="border-t border-ink-100 px-5 py-4">
            <!-- Edit name/description for non-system roles -->
            <div v-if="!role.isSystem" class="mb-4 pb-4 border-b border-ink-100">
              <div class="grid sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-ink-500 mb-1">Название</label>
                  <input v-model="editRoleForm.name" class="w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-ink-500 mb-1">Описание</label>
                  <input v-model="editRoleForm.description" class="w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100" />
                </div>
              </div>
              <div class="flex gap-2 mt-3">
                <button @click="handleUpdateRole(role)" class="px-3 py-1.5 rounded-xl text-xs font-medium bg-terra-500 text-white hover:bg-terra-600 transition-colors">
                  Сохранить
                </button>
                <button @click="showDeleteRole = role" class="px-3 py-1.5 rounded-xl text-xs font-medium bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors">
                  Удалить
                </button>
              </div>
            </div>

            <!-- Permissions -->
            <h4 class="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-3">Разрешения</h4>
            <div class="space-y-4">
              <div v-for="group in admin.permissionGroups" :key="group.permissionGroup">
                <p class="text-xs font-semibold text-ink-500 mb-2 capitalize">{{ group.permissionGroup }}</p>
                <div class="grid sm:grid-cols-2 gap-1.5">
                  <label
                    v-for="perm in group.permissions"
                    :key="perm.id"
                    class="flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg hover:bg-cream-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      :checked="selectedPermIds.has(perm.id)"
                      @change="togglePermission(perm.id)"
                      class="w-4 h-4 rounded border-ink-300 text-terra-500 focus:ring-terra-400"
                    />
                    <div>
                      <span class="text-xs font-medium text-ink-700">{{ perm.codename }}</span>
                      <p v-if="perm.description" class="text-[11px] text-ink-400">{{ perm.description }}</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <button
              @click="handleSavePermissions(role.id)"
              :disabled="savingPerms"
              class="mt-4 px-4 py-2 rounded-xl text-sm font-medium bg-terra-500 text-white hover:bg-terra-600 disabled:opacity-50 transition-colors"
            >
              {{ savingPerms ? 'Сохранение...' : 'Сохранить разрешения' }}
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Create role modal -->
    <BaseModal v-model="showCreate" title="Новая роль">
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-medium text-ink-500 mb-1">Название</label>
          <input v-model="createForm.name" class="w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100" placeholder="Название роли" />
        </div>
        <div>
          <label class="block text-xs font-medium text-ink-500 mb-1">Описание</label>
          <input v-model="createForm.description" class="w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100" placeholder="Описание роли" />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button @click="showCreate = false" class="px-4 py-2 rounded-xl text-sm font-medium bg-cream-200 text-ink-700 hover:bg-cream-300 transition-colors">Отмена</button>
          <button @click="handleCreate" :disabled="!createForm.name || createForm.name.length < 3" class="px-4 py-2 rounded-xl text-sm font-medium bg-terra-500 text-white hover:bg-terra-600 disabled:opacity-50 transition-colors">Создать</button>
        </div>
      </template>
    </BaseModal>

    <!-- Delete role modal -->
    <BaseModal v-model="showDeleteRoleModal" title="Удалить роль?">
      <p class="text-sm text-ink-600">Роль <strong>{{ showDeleteRole?.name }}</strong> будет удалена. Убедитесь, что она не используется.</p>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button @click="showDeleteRole = null" class="px-4 py-2 rounded-xl text-sm font-medium bg-cream-200 text-ink-700 hover:bg-cream-300 transition-colors">Отмена</button>
          <button @click="handleDeleteRole" class="px-4 py-2 rounded-xl text-sm font-medium bg-rose-500 text-white hover:bg-rose-600 transition-colors">Удалить</button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import BaseModal from '@/components/ui/BaseModal.vue'
import { KeyRound, ChevronDown } from 'lucide-vue-next'

const admin = useAdminStore()

const selectedRole = ref(null)
const selectedPermIds = ref(new Set())
const savingPerms = ref(false)
const showCreate = ref(false)
const showDeleteRole = ref(null)
const showDeleteRoleModal = computed({ get: () => !!showDeleteRole.value, set: (v) => { if (!v) showDeleteRole.value = null } })

const createForm = reactive({ name: '', description: '' })
const editRoleForm = reactive({ name: '', description: '' })

async function toggleRole(role) {
  if (selectedRole.value?.id === role.id) {
    selectedRole.value = null
    return
  }
  const detailed = await admin.fetchRole(role.id)
  selectedRole.value = detailed
  selectedPermIds.value = new Set((detailed.permissions || []).map(p => p.id))
  editRoleForm.name = detailed.name || ''
  editRoleForm.description = detailed.description || ''
}

function togglePermission(permId) {
  const s = new Set(selectedPermIds.value)
  if (s.has(permId)) s.delete(permId)
  else s.add(permId)
  selectedPermIds.value = s
}

async function handleSavePermissions(roleId) {
  savingPerms.value = true
  try {
    const updated = await admin.setRolePermissions(roleId, [...selectedPermIds.value])
    selectedRole.value = updated
    selectedPermIds.value = new Set((updated.permissions || []).map(p => p.id))
  } finally {
    savingPerms.value = false
  }
}

async function handleCreate() {
  await admin.createRole({ name: createForm.name, description: createForm.description })
  showCreate.value = false
  createForm.name = ''
  createForm.description = ''
}

async function handleUpdateRole(role) {
  await admin.updateRole(role.id, { name: editRoleForm.name, description: editRoleForm.description })
}

async function handleDeleteRole() {
  if (!showDeleteRole.value) return
  await admin.deleteRole(showDeleteRole.value.id)
  if (selectedRole.value?.id === showDeleteRole.value.id) selectedRole.value = null
  showDeleteRole.value = null
}

function roleIconBg(name) {
  if (name === 'superadmin') return 'bg-terra-50'
  if (name === 'admin') return 'bg-violet-300/20'
  if (name === 'moderator') return 'bg-sky-300/20'
  return 'bg-cream-200'
}

function roleIconColor(name) {
  if (name === 'superadmin') return 'text-terra-500'
  if (name === 'admin') return 'text-violet-600'
  if (name === 'moderator') return 'text-sky-600'
  return 'text-ink-500'
}

onMounted(() => {
  admin.fetchRoles()
  admin.fetchPermissions()
})
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
