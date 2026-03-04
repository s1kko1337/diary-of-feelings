import { request } from './client'
import * as mock from './mock/emotions.mock'

export function create(data) {
  return request(() => mock.create(data))
}

export function getByDate(date) {
  return request(() => mock.getByDate(date))
}

export function getHistory(range) {
  return request(() => mock.getHistory(range))
}

export function getTimeCapsules() {
  return request(() => mock.getTimeCapsules())
}

export function remove(id) {
  return request(() => mock.remove(id))
}

export function getPatterns() {
  return request(() => mock.getPatterns())
}
