import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
})

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── 全局回调 ──
let onUnauthorized: (() => void) | null = null
let onServerError: (() => void) | null = null
let onNetworkError: (() => void) | null = null

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler
}

export function setServerErrorHandler(handler: () => void) {
  onServerError = handler
}

export function setNetworkErrorHandler(handler: () => void) {
  onNetworkError = handler
}

// ── 响应拦截 ──
request.interceptors.response.use(
  (response) => {
    const data = response.data
    if (data && data.code === 401) {
      onUnauthorized?.()
    }
    return data
  },
  (error) => {
    if (error.response) {
      const code = error.response.data?.code || error.response.status
      if (code === 401) {
        onUnauthorized?.()
      } else if (code >= 500) {
        onServerError?.()
      }
    } else {
      onNetworkError?.()
    }
    return Promise.reject(error)
  }
)

export default request

export function setToken(token: string) {
  localStorage.setItem('token', token)
}

export function getToken(): string | null {
  return localStorage.getItem('token')
}

export function clearToken() {
  localStorage.removeItem('token')
}
