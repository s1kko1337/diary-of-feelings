import { MOCK_TASKS } from './data/tasks.js'

const STORAGE_KEY = 'diary_tasks'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : [...MOCK_TASKS]
  } catch {
    return [...MOCK_TASKS]
  }
}

function save(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export function mockGetTasks({ month, year } = {}) {
  let tasks = load()
  if (month !== undefined && year !== undefined) {
    tasks = tasks.filter((t) => {
      if (!t.date) return false
      const d = new Date(t.date)
      return d.getMonth() + 1 === month && d.getFullYear() === year
    })
  }
  return tasks
}

export function mockGetUnscheduledTasks() {
  return load().filter((t) => !t.date)
}

export function mockCreateTask(data) {
  const tasks = load()
  const task = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString() }
  tasks.push(task)
  save(tasks)
  return task
}

export function mockUpdateTask(id, data) {
  const tasks = load()
  const idx = tasks.findIndex((t) => t.id === id)
  if (idx === -1) throw new Error('Task not found')
  tasks[idx] = { ...tasks[idx], ...data }
  save(tasks)
  return tasks[idx]
}

export function mockDeleteTask(id) {
  save(load().filter((t) => t.id !== id))
}

export function mockMoveTaskToDate(id, date) {
  return mockUpdateTask(id, { date })
}
