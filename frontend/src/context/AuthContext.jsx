import { createContext, useContext, useState, useEffect } from 'react'
import { storage } from '../lib/utils'
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../lib/constants'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => storage.get('niramay_admin'))

  const login = (username, password) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const adminData = { username, token: btoa(`${username}:${Date.now()}`) }
      storage.set('niramay_admin', adminData)
      setAdmin(adminData)
      return { success: true }
    }
    return { success: false, message: 'Invalid username or password.' }
  }

  const logout = () => {
    storage.remove('niramay_admin')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, login, logout, isLoggedIn: !!admin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}