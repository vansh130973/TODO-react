import { useState, useEffect } from 'react'
import Container from './components/Layout/Container'
import Navbar from './components/Layout/Navbar'
import Sidebar from './components/Layout/Sidebar'
import Register from './components/Auth/Register'
import Login from './components/Auth/Login'
import TodoList from './components/Todo/TodoList'
import Dashboard from './components/Dashboard/Dashboard'
import { getCurrentUser, logout } from './utils/auth'
import { DATE_FORMAT_STORAGE_KEY } from './utils/dateUtils'

function App() {
  const [currentView, setCurrentView] = useState('register')
  const [currentUser, setCurrentUser] = useState(null)
  const [loggedInView, setLoggedInView] = useState('dashboard')
  const [todoRefreshKey, setTodoRefreshKey] = useState(0)
  const [dateFormat, setDateFormat] = useState(() => {
    return localStorage.getItem(DATE_FORMAT_STORAGE_KEY) || '12h'
  })

  const handleDateFormatChange = (format) => {
    setDateFormat(format)
    localStorage.setItem(DATE_FORMAT_STORAGE_KEY, format)
  }

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

  const isLoggedIn = !!currentUser

  return (
    <div className="min-vh-100 bg-light">
      <Navbar
        currentUser={currentUser}
        onNavigate={setCurrentView}
        onLogout={handleLogout}
        onTodoAdded={() => setTodoRefreshKey((k) => k + 1)}
        dateFormat={dateFormat}
        onDateFormatChange={handleDateFormatChange}
      />
      {isLoggedIn && currentView === 'todo' ? (
        <div className="d-flex">
          <Sidebar activeView={loggedInView} onNavigate={setLoggedInView} />
          <main className="flex-grow-1 bg-light">
            {loggedInView === 'dashboard' && (
              <Dashboard currentUser={currentUser} refreshKey={todoRefreshKey} />
            )}
            {loggedInView === 'list' && (
              <Container>
                <TodoList currentUser={currentUser} refreshKey={todoRefreshKey} dateFormat={dateFormat} />
              </Container>
            )}
          </main>
        </div>
      ) : (
        <Container>
          {currentView === 'register' && (
            <Register onLoginClick={switchToLogin} onRegisterSuccess={handleRegisterSuccess} />
          )}
          {currentView === 'login' && (
            <Login onRegisterClick={switchToRegister} onLoginSuccess={handleLoginSuccess} />
          )}
          {currentView === 'todo' && !currentUser && (
            <div className="container py-5 text-center text-muted">
              Log in to view your todos.
            </div>
          )}
        </Container>
      )}
    </div>
  )
}

export default App