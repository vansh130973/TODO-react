import { useState, useEffect } from 'react'
import Container from './components/Layout/Container'
import Register from './components/Auth/Register'
import Login from './components/Auth/Login'
import TodoList from './components/Todo/TodoList'
import { getCurrentUser, logout } from './utils/auth'

function App() {
  const [currentView, setCurrentView] = useState('register')
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setCurrentUser(user)
      setCurrentView('todo')
    }
  }, [])

  const handleLoginSuccess = (username) => {
    setCurrentUser(username)
    setCurrentView('todo')
  }

  const handleRegisterSuccess = (username) => {
    localStorage.setItem('loggedInUser', username)
    setCurrentUser(username)
    setCurrentView('todo')
  }

  const handleLogout = () => {
    logout()
    setCurrentUser(null)
    setCurrentView('login')
  }

  const switchToLogin = () => setCurrentView('login')
  const switchToRegister = () => setCurrentView('register')

  return (
    <Container>
      {currentView === 'register' && (
        <Register onLoginClick={switchToLogin} onRegisterSuccess={handleRegisterSuccess} />
      )}
      
      {currentView === 'login' && (
        <Login onRegisterClick={switchToRegister} onLoginSuccess={handleLoginSuccess} />
      )}
      
      {currentView === 'todo' && currentUser && (
        <TodoList currentUser={currentUser} onLogout={handleLogout} />
      )}
    </Container>
  )
}

export default App