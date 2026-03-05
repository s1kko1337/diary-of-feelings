import { request } from './client'
import * as mock from './mock/cbt'

export function getAll() {
  return request(() => mock.getAll())
}

export function getById(id) {
  return request(() => mock.getById(id))
}

export function create(data) {
  return request(() => mock.create(data))
}

export function update(id, data) {
  return request(() => mock.update(id, data))
}

export function remove(id) {
  return request(() => mock.remove(id))
}
