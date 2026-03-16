<template>
  <div class="space-y-5">
    <!-- Header -->
    <div>
      <h1 class="font-display text-2xl font-bold text-ink-900">Журнал аудита</h1>
      <p class="text-sm text-ink-400 mt-0.5">История административных действий</p>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl border border-ink-100 p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <select v-model="admin.auditFilters.action" @change="doSearch" class="rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-700 focus:border-terra-400 focus:outline-none">
          <option value="">Все действия</option>
          <option v-for="a in actions" :key="a" :value="a">{{ a }}</option>
        </select>
        <select v-model="admin.auditFilters.targetType" @change="doSearch" class="rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-700 focus:border-terra-400 focus:outline-none">
          <option value="">Все типы</option>
          <option value="user">Пользователь</option>
          <option value="role">Роль</option>
          <option value="assistant_config">Конфигурация</option>
        </select>
        <input
          v-model="admin.auditFilters.dateFrom"
          type="date"
          @change="doSearch"
          class="rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-700 focus:border-terra-400 focus:outline-none"
          placeholder="Дата от"
        />
        <input
          v-model="admin.auditFilters.dateTo"
          type="date"
          @change="doSearch"
          class="rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-700 focus:border-terra-400 focus:outline-none"
          placeholder="Дата до"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-ink-100 overflow-hidden">
      <div v-if="admin.auditLoading" class="p-8 text-center text-sm text-ink-400">Загрузка...</div>

      <div v-else>
        <table class="w-full hidden sm:table">
          <thead>
            <tr class="border-b border-ink-100 text-left">
              <th class="px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">Дата</th>
              <th class="px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">Админ</th>
              <th class="px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">Действие</th>
              <th class="px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">Тип</th>
              <th class="px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider w-8" />
            </tr>
          </thead>
          <tbody>
            <template v-for="entry in admin.auditLogs" :key="entry.id">
              <tr
                class="border-b border-ink-50 hover:bg-cream-50 cursor-pointer transition-colors"
                @click="toggleExpand(entry.id)"
              >
                <td class="px-4 py-3 text-xs text-ink-500 whitespace-nowrap">{{ formatDate(entry.createdAt) }}</td>
                <td class="px-4 py-3 text-sm font-medium text-ink-700">{{ entry.adminUsername || '—' }}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="actionColor(entry.action)">
                    {{ entry.action }}
                  </span>
                </td>
                <td class="px-4 py-3 text-xs text-ink-500">{{ entry.targetType }}</td>
                <td class="px-4 py-3">
                  <ChevronDown class="w-4 h-4 text-ink-400 transition-transform" :class="{ 'rotate-180': expandedId === entry.id }" />
                </td>
              </tr>
              <tr v-if="expandedId === entry.id">
                <td colspan="5" class="px-4 py-4 bg-cream-50">
                  <div class="grid sm:grid-cols-2 gap-4 text-xs">
                    <div v-if="entry.targetId">
                      <p class="font-semibold text-ink-500 mb-1">ID цели</p>
                      <p class="font-mono text-ink-600 break-all">{{ entry.targetId }}</p>
                    </div>
                    <div v-if="entry.ipAddress">
                      <p class="font-semibold text-ink-500 mb-1">IP-адрес</p>
                      <p class="font-mono text-ink-600">{{ entry.ipAddress }}</p>
                    </div>
                    <div v-if="entry.oldValues" class="sm:col-span-2">
                      <p class="font-semibold text-ink-500 mb-1">Старые значения</p>
                      <pre class="bg-white rounded-lg p-3 text-ink-600 overflow-x-auto border border-ink-100">{{ JSON.stringify(entry.oldValues, null, 2) }}</pre>
                    </div>
                    <div v-if="entry.newValues" class="sm:col-span-2">
                      <p class="font-semibold text-ink-500 mb-1">Новые значения</p>
                      <pre class="bg-white rounded-lg p-3 text-ink-600 overflow-x-auto border border-ink-100">{{ JSON.stringify(entry.newValues, null, 2) }}</pre>
                    </div>
                    <div v-if="!entry.oldValues && !entry.newValues && !entry.targetId" class="sm:col-span-2">
                      <p class="text-ink-400">Нет дополнительных данных</p>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-if="!admin.auditLogs.length">
              <td colspan="5" class="px-4 py-12 text-center text-sm text-ink-400">
                Записей не найдено
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Mobile cards -->
        <div class="sm:hidden divide-y divide-ink-100">
          <div
            v-for="entry in admin.auditLogs"
            :key="entry.id"
            @click="toggleExpand(entry.id)"
            class="p-4 cursor-pointer hover:bg-cream-50 transition-colors"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="actionColor(entry.action)">
                {{ entry.action }}
              </span>
              <span class="text-xs text-ink-400">{{ formatDate(entry.createdAt) }}</span>
            </div>
            <p class="text-sm text-ink-700">{{ entry.adminUsername || '—' }}</p>
            <p class="text-xs text-ink-400">{{ entry.targetType }}</p>
            <div v-if="expandedId === entry.id" class="mt-3 pt-3 border-t border-ink-100 text-xs space-y-2">
              <div v-if="entry.oldValues">
                <p class="font-semibold text-ink-500">Было:</p>
                <pre class="bg-cream-100 rounded-lg p-2 mt-1 overflow-x-auto text-ink-600">{{ JSON.stringify(entry.oldValues, null, 2) }}</pre>
              </div>
              <div v-if="entry.newValues">
                <p class="font-semibold text-ink-500">Стало:</p>
                <pre class="bg-cream-100 rounded-lg p-2 mt-1 overflow-x-auto text-ink-600">{{ JSON.stringify(entry.newValues, null, 2) }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="admin.auditPages > 1" class="flex items-center justify-center gap-2">
      <button
        @click="changePage(admin.auditPage - 1)"
        :disabled="admin.auditPage <= 1"
        class="px-3 py-2 rounded-xl text-sm font-medium bg-white border border-ink-200 hover:bg-cream-100 disabled:opacity-40 transition-colors"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>
      <span class="text-sm text-ink-500 px-3">{{ admin.auditPage }} из {{ admin.auditPages }}</span>
      <button
        @click="changePage(admin.auditPage + 1)"
        :disabled="admin.auditPage >= admin.auditPages"
        class="px-3 py-2 rounded-xl text-sm font-medium bg-white border border-ink-200 hover:bg-cream-100 disabled:opacity-40 transition-colors"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const admin = useAdminStore()
const expandedId = ref(null)

const actions = [
  'user.edit', 'user.block', 'user.unblock', 'user.delete', 'user.reset_password',
  'role.create', 'role.edit', 'role.delete', 'role.permissions.set',
  'role.assign', 'role.remove',
  'assistant.config.create', 'assistant.config.edit', 'assistant.config.delete',
  'assistant.config.activate', 'assistant.config.test',
]

function toggleExpand(id) {
  expandedId.value = expandedId.value === id ? null : id
}

function doSearch() {
  admin.fetchAuditLogs(1)
}

function changePage(page) {
  admin.fetchAuditLogs(page)
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function actionColor(action) {
  if (action.includes('delete') || action.includes('block')) return 'bg-rose-500/10 text-rose-600'
  if (action.includes('create') || action.includes('assign') || action.includes('unblock')) return 'bg-forest-200/50 text-forest-700'
  if (action.includes('edit') || action.includes('set') || action.includes('activate')) return 'bg-gold-200/50 text-gold-600'
  return 'bg-cream-200 text-ink-600'
}

onMounted(() => {
  admin.fetchAuditLogs(1)
})
</script>
