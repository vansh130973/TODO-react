// Utility functions for authentication and localStorage
import bcrypt from 'bcryptjs'

// Password rules: 1 uppercase, 1 special char, 1 number, min 8 characters
export const validatePassword = (password) => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least 1 uppercase letter' }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least 1 number' }
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { valid: false, message: 'Password must contain at least 1 special character' }
  }
  return { valid: true }
}

export const registerUser = async (username, password) => {
  const users = JSON.parse(localStorage.getItem('users') || '{}')
  
  if (users[username]) {
    return { success: false, message: 'User already exists' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  users[username] = { password: hashedPassword }
  localStorage.setItem('users', JSON.stringify(users))

  // Initialize empty todos for new user
  const todos = JSON.parse(localStorage.getItem('todos') || '{}')
  todos[username] = []
  localStorage.setItem('todos', JSON.stringify(todos))

  return { success: true, message: 'Registration successful' }
}

export const loginUser = async (username, password) => {
  const users = JSON.parse(localStorage.getItem('users') || '{}')
  
  if (!users[username]) {
    return { success: false, type: 'username', message: 'Username not found.' }
  }

  const isMatch = await bcrypt.compare(password, users[username].password)
  if (!isMatch) {
    return { success: false, type: 'password', message: 'Incorrect password. Please try again.' }
  }

  localStorage.setItem('loggedInUser', username)
  return { success: true, message: 'Login successful' }
}

export const getCurrentUser = () => {
  return localStorage.getItem('loggedInUser')
}

export const logout = () => {
  localStorage.removeItem('loggedInUser')
}

export const getUserTodos = (username) => {
  const todos = JSON.parse(localStorage.getItem('todos') || '{}')
  return todos[username] || []
}

export const saveUserTodos = (username, todos) => {
  const allTodos = JSON.parse(localStorage.getItem('todos') || '{}')
  allTodos[username] = todos
  localStorage.setItem('todos', JSON.stringify(allTodos))
}