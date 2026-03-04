export class ApiError extends Error {
  constructor(message, code = 500) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

function randomDelay(min = 300, max = 800) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export async function request(handler, { delay, timeout = 10000 } = {}) {
  const ms = delay ?? randomDelay()

  return Promise.race([
    new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const result = await handler()
          resolve(result)
        } catch (err) {
          reject(err instanceof ApiError ? err : new ApiError(err.message))
        }
      }, ms)
    }),
    new Promise((_, reject) => {
      setTimeout(() => reject(new ApiError('Request timeout', 408)), timeout)
    }),
  ])
}
