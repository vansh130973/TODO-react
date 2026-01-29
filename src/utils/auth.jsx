// Utility functions for authentication and localStorage

export const registerUser = (username, password) => {
  const users = JSON.parse(localStorage.getItem('users') || '{}')
  
  if (users[username]) {
    return { success: false, message: 'User already exists' }
  }

  users[username] = { password }
  localStorage.setItem('users', JSON.stringify(users))

  // Initialize empty todos for new user
  const todos = JSON.parse(localStorage.getItem('todos') || '{}')
  todos[username] = []
  localStorage.setItem('todos', JSON.stringify(todos))

  return { success: true, message: 'Registration successful' }
}

export const loginUser = (username, password) => {
  const users = JSON.parse(localStorage.getItem('users') || '{}')
  
  if (!users[username]) {
    return { success: false, type: 'username', message: 'Username not found.' }
  }
  
  if (users[username].password !== password) {
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