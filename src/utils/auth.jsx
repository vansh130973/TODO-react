// Utility functions for authentication and localStorage
import bcrypt from 'bcryptjs'

// Password rules: 1 uppercase, 1 special char, 1 number, min 8 characters
export const validatePassword = (password) => {
  const regex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/

  if (!regex.test(password)) {
    return {
      valid: false,
      message:
        'Password must contain at least 1 uppercase letter, 1 number, 1 special character, and be minimum 8 characters long',
    }
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
  if (!username || !password) {
    return {
      success: false,
      message: 'Username and password are required',
    }
  }

  const users = JSON.parse(localStorage.getItem('users') || '{}')

  if (!users[username]) {
    return {
      success: false,
      type: 'username',
      message: 'Username not found',
    }
  }

  const isMatch = await bcrypt.compare(password, users[username].password)
  if (!isMatch) {
    return {
      success: false,
      type: 'password',
      message: 'Incorrect password',
    }
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