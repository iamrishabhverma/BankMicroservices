import { createContext, useContext, useState, useCallback } from 'react'
import { authService } from '../api/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('bank_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback(async (credentials) => {
    const { data } = await authService.login(credentials)
    // Expected shape: { token: string, user: {...} }. Adjust if your
    // auth-service returns a different payload.
    localStorage.setItem('bank_token', data.token)
    const nextUser = data.user || { username: credentials.username }
    localStorage.setItem('bank_user', JSON.stringify(nextUser))
    setUser(nextUser)
    return nextUser
  }, [])

  const register = useCallback(async (payload) => {
    const { data } = await authService.register(payload)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('bank_token')
    localStorage.removeItem('bank_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
