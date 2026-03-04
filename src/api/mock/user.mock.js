const STORAGE_KEY = 'diary-user-profile'

const defaultProfile = {
  id: crypto.randomUUID(),
  name: '',
  createdAt: new Date().toISOString(),
  onboarding: {
    difficulties: [],
    goals: [],
    dayType: null,
    topics: [],
    feedbackStyle: null,
  },
  preferences: {
    theme: 'light',
    notificationTime: '09:00',
    notificationsEnabled: false,
    soundEnabled: true,
    cbtMode: 'basic',
  },
  onboardingCompleted: false,
}

function load() {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : { ...defaultProfile }
}

function save(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  return profile
}

export function getProfile() {
  return load()
}

export function updateProfile(data) {
  const current = load()
  return save({ ...current, ...data })
}

export function updatePreferences(data) {
  const current = load()
  return save({
    ...current,
    preferences: { ...current.preferences, ...data },
  })
}

export function completeOnboarding(answers) {
  const current = load()
  return save({
    ...current,
    name: answers.name || current.name,
    onboarding: { ...current.onboarding, ...answers },
    onboardingCompleted: true,
  })
}

export function resetProfile() {
  localStorage.removeItem(STORAGE_KEY)
  return { ...defaultProfile, id: crypto.randomUUID() }
}
