import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize default admin user if it doesn't exist
    const storedUsers = JSON.parse(localStorage.getItem('foodipy_users') || '[]')
    const adminExists = storedUsers.find(u => u.email === 'admin@foodipy.com')
    
    if (!adminExists) {
      const defaultAdmin = {
        id: 'admin-001',
        name: 'Admin User',
        email: 'admin@foodipy.com',
        password: 'admin123', // Default password
        role: 'admin',
        createdAt: new Date().toISOString(),
      }
      storedUsers.push(defaultAdmin)
      localStorage.setItem('foodipy_users', JSON.stringify(storedUsers))
    }

    // Check for stored user data
    const storedUser = localStorage.getItem('foodipy_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const register = (userData) => {
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      role: userData.email === 'admin@foodipy.com' ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
    }
    
    // Store user without password in current session
    const userWithoutPassword = { ...newUser }
    delete userWithoutPassword.password
    
    setUser(userWithoutPassword)
    localStorage.setItem('foodipy_user', JSON.stringify(userWithoutPassword))
    return { success: true, user: userWithoutPassword }
  }

  const login = (email, password) => {
    // In a real app, this would be an API call
    const storedUsers = JSON.parse(localStorage.getItem('foodipy_users') || '[]')
    const user = storedUsers.find(u => u.email === email && u.password === password)
    
    if (user) {
      const userData = { ...user }
      delete userData.password
      setUser(userData)
      localStorage.setItem('foodipy_user', JSON.stringify(userData))
      return { success: true, user: userData }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('foodipy_user')
  }

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData }
    setUser(updatedUser)
    localStorage.setItem('foodipy_user', JSON.stringify(updatedUser))
    
    // Also update in users list
    const storedUsers = JSON.parse(localStorage.getItem('foodipy_users') || '[]')
    const userIndex = storedUsers.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      storedUsers[userIndex] = { ...storedUsers[userIndex], ...updatedData }
      localStorage.setItem('foodipy_users', JSON.stringify(storedUsers))
    }
  }

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    isAdmin: user?.role === 'admin',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

