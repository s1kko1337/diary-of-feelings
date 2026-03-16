<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-bold text-ink-900">Пользователи</h1>
        <p class="text-sm text-ink-400 mt-0.5">{{ admin.usersTotal }} {{ pluralize(admin.usersTotal, 'пользователь', 'пользователя', 'пользователей') }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl border border-ink-100 p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="flex-1 relative">
          <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск по email или имени..."
            class="w-full rounded-xl border border-ink-200 bg-white pl-10 pr-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100"
          />
        </div>
        <select
          v-model="statusFilter"
          class="rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-700 focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100"
        >
          <option :value="null">Все статусы</option>
          <option :value="true">Активные</option>
          <option :value="false">Заблокированные</option>
        </select>
        <select
          v-model="admin.usersFilters.sortBy"
          @change="doSearch"
          class="rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-700 focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100"
        >
          <option value="created_at">По дате</option>
          <option value="username">По имени</option>
          <option value="email">По email</option>
        </select>
        <button
          @click="toggleSortOrder"
          class="px-3 py-2.5 rounded-xl border border-ink-200 hover:bg-cream-100 transition-colors text-ink-600"
          :title="admin.usersFilters.sortOrder === 'desc' ? 'По убыванию' : 'По возрастанию'"
        >
          <ArrowDownAZ v-if="admin.usersFilters.sortOrder === 'asc'" class="w-4 h-4" />
          <ArrowUpAZ v-else class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Table (desktop) -->
    <div class="hidden sm:block bg-white rounded-xl border border-ink-100 overflow-hidden">
      <div v-if="admin.usersLoading" class="p-8 text-center">
        <div class="inline-flex items-center gap-2 text-ink-400 text-sm">
          <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25" />
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75" />
          </svg>
          Загрузка...
        </div>
      </div>
      <table v-else class="w-full">
        <thead>
          <tr class="border-b border-ink-100 text-left">
            <th class="px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">Пользователь</th>
            <th class="px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">Email</th>
            <th class="px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">Статус</th>
            <th class="px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">Роли</th>
            <th class="px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">Дата</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in admin.users"
            :key="user.id"
            @click="goToUser(user.id)"
            class="border-b border-ink-50 hover:bg-cream-50 cursor-pointer transition-colors"
          >
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-terra-100 flex items-center justify-center text-terra-600 text-xs font-bold shrink-0">
                  {{ user.username?.[0]?.toUpperCase() || '?' }}
                </div>
                <span class="text-sm font-medium text-ink-800">{{ user.username }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-sm text-ink-600">{{ user.email }}</td>
            <td class="px-4 py-3">
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                :class="user.isActive ? 'bg-forest-200/50 text-forest-700' : 'bg-rose-300/30 text-rose-600'"
              >
                {{ user.isActive ? 'Активен' : 'Заблокирован' }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="role in (user.roles || [])"
                  :key="role.id"
                  class="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                  :class="roleColor(role.name)"
                >
                  {{ role.name }}
                </span>
                <span v-if="!user.roles?.length" class="text-xs text-ink-400">—</span>
              </div>
            </td>
            <td class="px-4 py-3 text-xs text-ink-400">{{ formatDate(user.createdAt) }}</td>
          </tr>
          <tr v-if="!admin.users.length && !admin.usersLoading">
            <td colspan="5" class="px-4 py-12 text-center text-sm text-ink-400">
              Пользователи не найдены
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Cards (mobile) -->
    <div class="sm:hidden space-y-2">
      <div v-if="admin.usersLoading" class="p-8 text-center text-sm text-ink-400">Загрузка...</div>
      <div
        v-for="user in admin.users"
        :key="user.id"
        @click="goToUser(user.id)"
        class="bg-white rounded-xl border border-ink-100 p-4 active:bg-cream-50 transition-colors cursor-pointer"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-terra-100 flex items-center justify-center text-terra-600 text-sm font-bold shrink-0">
            {{ user.username?.[0]?.toUpperCase() || '?' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-ink-800 truncate">{{ user.username }}</p>
            <p class="text-xs text-ink-400 truncate">{{ user.email }}</p>
          </div>
          <span
            class="px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0"
            :class="user.isActive ? 'bg-forest-200/50 text-forest-700' : 'bg-rose-300/30 text-rose-600'"
          >
            {{ user.isActive ? 'Активен' : 'Заблокирован' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="admin.usersPages > 1" class="flex items-center justify-center gap-2">
      <button
        @click="changePage(admin.usersPage - 1)"
        :disabled="admin.usersPage <= 1"
        class="px-3 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-white border border-ink-200 hover:bg-cream-100 text-ink-700"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>
      <span class="text-sm text-ink-500 px-3">
        {{ admin.usersPage }} из {{ admin.usersPages }}
      </span>
      <button
        @click="changePage(admin.usersPage + 1)"
        :disabled="admin.usersPage >= admin.usersPages"
        class="px-3 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-white border border-ink-200 hover:bg-cream-100 text-ink-700"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { Search, ArrowDownAZ, ArrowUpAZ, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const router = useRouter()
const admin = useAdminStore()

const searchQuery = ref(admin.usersFilters.search)
const statusFilter = ref(admin.usersFilters.isActive)
let searchTimeout = null

watch(searchQuery, (val) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    admin.usersFilters.search = val
    admin.fetchUsers(1)
  }, 300)
})

watch(statusFilter, (val) => {
  admin.usersFilters.isActive = val
  admin.fetchUsers(1)
})

function toggleSortOrder() {
  admin.usersFilters.sortOrder = admin.usersFilters.sortOrder === 'desc' ? 'asc' : 'desc'
  admin.fetchUsers(1)
}

function doSearch() {
  admin.fetchUsers(1)
}

function changePage(page) {
  admin.fetchUsers(page)
}

function goToUser(id) {
  router.push({ name: 'admin-user-detail', params: { id } })
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

function roleColor(name) {
  if (name === 'superadmin') return 'bg-terra-100 text-terra-600'
  if (name === 'admin') return 'bg-violet-300/30 text-violet-600'
  if (name === 'moderator') return 'bg-sky-300/30 text-sky-600'
  return 'bg-cream-200 text-ink-600'
}

function pluralize(n, one, few, many) {
  const r = n % 10
  const t = n % 100
  if (t >= 11 && t <= 19) return many
  if (r === 1) return one
  if (r >= 2 && r <= 4) return few
  return many
}

onMounted(() => {
  admin.fetchUsers(1)
})
</script>
