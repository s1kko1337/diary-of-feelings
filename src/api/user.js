import { request } from './client'
import * as mock from './mock/user.mock'

export function getProfile() {
  return request(() => mock.getProfile())
}

export function updateProfile(data) {
  return request(() => mock.updateProfile(data))
}

export function updatePreferences(data) {
  return request(() => mock.updatePreferences(data))
}

export function completeOnboarding(answers) {
  return request(() => mock.completeOnboarding(answers))
}

export function resetProfile() {
  return request(() => mock.resetProfile())
}
