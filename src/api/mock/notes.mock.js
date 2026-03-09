const STORAGE_KEY = 'diary_notes'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function save(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

export function mockGetNotes({ search } = {}) {
  let notes = load()
  if (search) {
    const q = search.toLowerCase()
    notes = notes.filter(
      (n) => n.title?.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q),
    )
  }
  // Pinned first, then by updatedAt
  return notes.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return new Date(b.updatedAt) - new Date(a.updatedAt)
  })
}

export function mockCreateNote(data) {
  const notes = load()
  const note = {
    pinned: false,
    color: 'default',
    ...data,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  notes.unshift(note)
  save(notes)
  return note
}

export function mockUpdateNote(id, data) {
  const notes = load()
  const idx = notes.findIndex((n) => n.id === id)
  if (idx === -1) throw new Error('Note not found')
  notes[idx] = { ...notes[idx], ...data, updatedAt: new Date().toISOString() }
  save(notes)
  return notes[idx]
}

export function mockDeleteNote(id) {
  save(load().filter((n) => n.id !== id))
}
