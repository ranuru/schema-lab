import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    Authorization: 'Basic ' + btoa('dev:dev'),
  },
})

export default api
