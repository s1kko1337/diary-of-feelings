import { api } from './client.js'

export function getProfile() {
  return api.get('/auth/me')
}

export function updateProfile(data) {
  return api.patch('/user/profile', data)
}

export function changePassword(data) {
  return api.post('/user/password', data)
}

export function deleteAccount() {
  return api.delete('/user/account')
}

export function updatePreferences(/* data */) {
  console.warn('[user.js] updatePreferences: not yet implemented')
  return Promise.resolve(null)
}

export function completeOnboarding(/* answers */) {
  console.warn('[user.js] completeOnboarding: not yet implemented')
  return Promise.resolve(null)
}

export function resetProfile() {
  console.warn('[user.js] resetProfile: not yet implemented')
  return Promise.resolve(null)
}
