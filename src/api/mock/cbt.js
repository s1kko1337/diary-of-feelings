import { seedEntries } from './data/cbt-entries'

const STORAGE_KEY = 'diary-cbt-entries'

function loadAll() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    saveAll(seedEntries)
    return [...seedEntries]
  }
  return JSON.parse(raw)
}

function saveAll(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function getAll() {
  return loadAll().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function getById(id) {
  const entry = loadAll().find((e) => e.id === id)
  if (!entry) throw new Error('Entry not found')
  return entry
}

export function create(data) {
  const entries = loadAll()
  const entry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    date: data.date || new Date().toISOString().slice(0, 10),
    situation: data.situation || '',
    thoughts: data.thoughts || '',
    emotions: data.emotions || [],
    reaction: data.reaction || '',
    distortion: data.distortion || null,
    challenge: data.challenge || null,
    alternative: data.alternative || null,
    emotionsAfter: data.emotionsAfter || [],
    status: data.status || 'new',
  }
  entries.unshift(entry)
  saveAll(entries)
  return entry
}

export function update(id, data) {
  const entries = loadAll()
  const idx = entries.findIndex((e) => e.id === id)
  if (idx === -1) throw new Error('Entry not found')

  entries[idx] = { ...entries[idx], ...data }
  saveAll(entries)
  return entries[idx]
}

export function remove(id) {
  const entries = loadAll().filter((e) => e.id !== id)
  saveAll(entries)
  return true
}
