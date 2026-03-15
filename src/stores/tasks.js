import { defineStore } from 'pinia'
import { ref } from 'vue'
import { tasksApi } from '@/api/tasks'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])
  const loading = ref(false)

  async function fetchTasks(params) {
    loading.value = true
    try {
      tasks.value = await tasksApi.getTasks(params)
    } finally {
      loading.value = false
    }
  }

  async function addTask(data) {
    const task = await tasksApi.createTask(data)
    tasks.value.push(task)
    return task
  }

  async function updateTask(id, data) {
    const updated = await tasksApi.updateTask(id, data)
    const idx = tasks.value.findIndex(t => t.id === id)
    if (idx !== -1) tasks.value[idx] = updated
    return updated
  }

  async function removeTask(id) {
    await tasksApi.deleteTask(id)
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  async function moveTask(id, date) {
    const updated = await tasksApi.moveToDate(id, date)
    const idx = tasks.value.findIndex(t => t.id === id)
    if (idx !== -1) tasks.value[idx] = updated
    return updated
  }

  return { tasks, loading, fetchTasks, addTask, updateTask, removeTask, moveTask }
})
