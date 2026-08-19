import axios from 'axios'

// In dev, Vite proxies /api -> http://localhost:8080 (see vite.config.js),
// which is where your api-gateway module should be listening.
// In prod, set VITE_API_BASE_URL to your deployed gateway URL.
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

const client = axios.create({ baseURL })

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('bank_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('bank_token')
      localStorage.removeItem('bank_user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default client
