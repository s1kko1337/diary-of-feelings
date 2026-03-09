import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { tasksApi } from '@/api/tasks.js'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])
  const loading = ref(false)
  const currentMonth = ref(new Date().getMonth() + 1)
  const currentYear = ref(new Date().getFullYear())

  const scheduledTasks = computed(() => tasks.value.filter((t) => t.date))
  const unscheduledTasks = computed(() => tasks.value.filter((t) => !t.date))

  function tasksByDate(dateStr) {
    return tasks.value.filter((t) => t.date === dateStr)
  }

  async function fetchTasks() {
    loading.value = true
    try {
      tasks.value = await tasksApi.getTasks()
    } finally {
      loading.value = false
    }
  }

  async function createTask(data) {
    const task = await tasksApi.createTask(data)
    tasks.value.push(task)
    return task
  }

  async function updateTask(id, data) {
    const updated = await tasksApi.updateTask(id, data)
    const idx = tasks.value.findIndex((t) => t.id === id)
    if (idx !== -1) tasks.value[idx] = updated
    return updated
  }

  async function deleteTask(id) {
    await tasksApi.deleteTask(id)
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  async function moveToDate(id, date) {
    const updated = await tasksApi.moveToDate(id, date)
    const idx = tasks.value.findIndex((t) => t.id === id)
    if (idx !== -1) tasks.value[idx] = updated
    return updated
  }

  async function toggleComplete(id) {
    const task = tasks.value.find((t) => t.id === id)
    if (!task) return
    // Optimistic update
    task.completed = !task.completed
    try {
      const updated = await tasksApi.updateTask(id, { completed: task.completed })
      const idx = tasks.value.findIndex((t) => t.id === id)
      if (idx !== -1) tasks.value[idx] = updated
    } catch {
      // Revert on error
      task.completed = !task.completed
    }
  }

  function prevMonth() {
    if (currentMonth.value === 1) {
      currentMonth.value = 12
      currentYear.value--
    } else {
      currentMonth.value--
    }
  }

  function nextMonth() {
    if (currentMonth.value === 12) {
      currentMonth.value = 1
      currentYear.value++
    } else {
      currentMonth.value++
    }
  }

  return {
    tasks,
    loading,
    currentMonth,
    currentYear,
    scheduledTasks,
    unscheduledTasks,
    tasksByDate,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    moveToDate,
    prevMonth,
    nextMonth,
    toggleComplete,
  }
})
