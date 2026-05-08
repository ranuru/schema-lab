import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('auth_user')
    return stored ? JSON.parse(stored) : null
  })

  async function login(username, password) {
    const credentials = btoa(`${username}:${password}`)
    const res = await api.post('/auth/login', null, {
      headers: { Authorization: `Basic ${credentials}` },
    })
    localStorage.setItem('auth_credentials', credentials)
    localStorage.setItem('auth_user', JSON.stringify(res.data))
    setUser(res.data)
    return res.data
  }

  async function register(username, password) {
    await api.post('/auth/register', { username, password })
    return login(username, password)
  }

  function logout() {
    localStorage.removeItem('auth_credentials')
    localStorage.removeItem('auth_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
