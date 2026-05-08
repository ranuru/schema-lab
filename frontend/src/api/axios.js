import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  const credentials = localStorage.getItem('auth_credentials')
  if (credentials) {
    config.headers.Authorization = `Basic ${credentials}`
  }
  return config
})

export default api
