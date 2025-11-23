export const getUsers = () => {
  const users = JSON.parse(localStorage.getItem('foodipy_users') || '[]')
  return users
}

export const createUser = (userData) => {
  const users = getUsers()
  
  // Check if email already exists
  if (users.find(u => u.email === userData.email)) {
    return { success: false, error: 'Email already exists' }
  }

  const newUser = {
    id: Date.now().toString(),
    ...userData,
    role: userData.email === 'admin@foodipy.com' ? 'admin' : (userData.role || 'user'),
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  localStorage.setItem('foodipy_users', JSON.stringify(users))
  return { success: true, user: newUser }
}

export const updateUser = (userId, updatedData) => {
  const users = getUsers()
  const userIndex = users.findIndex(u => u.id === userId)
  
  if (userIndex === -1) {
    return { success: false, error: 'User not found' }
  }

  // Check if email is being changed and if it conflicts
  if (updatedData.email && updatedData.email !== users[userIndex].email) {
    if (users.find(u => u.email === updatedData.email && u.id !== userId)) {
      return { success: false, error: 'Email already exists' }
    }
  }

  users[userIndex] = {
    ...users[userIndex],
    ...updatedData,
    role: updatedData.email === 'admin@foodipy.com' ? 'admin' : users[userIndex].role,
  }
  
  localStorage.setItem('foodipy_users', JSON.stringify(users))
  return { success: true, user: users[userIndex] }
}

export const deleteUser = (userId) => {
  const users = getUsers()
  const filteredUsers = users.filter(u => u.id !== userId)
  localStorage.setItem('foodipy_users', JSON.stringify(filteredUsers))
  return { success: true }
}

