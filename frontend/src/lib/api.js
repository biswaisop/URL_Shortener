const DEFAULT_API_BASE_URL = 'http://localhost:8000'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(
  /\/+$/,
  '',
)

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`

    try {
      const payload = await response.json()
      if (typeof payload?.detail === 'string') {
        message = payload.detail
      }
    } catch {
      // Keep the status-based error when the body is not JSON.
    }

    throw new Error(message)
  }

  return response.json()
}

export function healthCheck() {
  return requestJson('/api/v1/health')
}

export function shortenUrl(url) {
  return requestJson('/api/v1/shorten', {
    method: 'POST',
    body: JSON.stringify({ url }),
  })
}