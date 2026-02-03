import { useState } from 'react'
import { getUserTodos, saveUserTodos } from '../../utils/auth'
import { nowUtc, dateInputToUtc } from '../../utils/dateUtils'

function Navbar({ currentUser, onNavigate, onLogout, onTodoAdded, dateFormat, onDateFormatChange }) {
  const [showTodoPopup, setShowTodoPopup] = useState(false)
  const [todoText, setTodoText] = useState('')
  const [todoCompleteDate, setTodoCompleteDate] = useState('')

  const goTo = (view) => () => onNavigate(view)

  const handleOpenTodoPopup = () => {
    setTodoText('')
    setTodoCompleteDate('')
    setShowTodoPopup(true)
  }

  const handleCloseTodoPopup = () => {
    setShowTodoPopup(false)
    setTodoText('')
    setTodoCompleteDate('')
  }

  const handleAddTodo = (e) => {
    e.preventDefault()
    if (!todoText.trim() || !currentUser) return

    const todos = getUserTodos(currentUser)
    const now = nowUtc()
    const newTodo = {
      id: Date.now(),
      text: todoText.trim(),
      completed: false,
      createdDate: now,
      targetCompleteDate: dateInputToUtc(todoCompleteDate)
    }
    saveUserTodos(currentUser, [...todos, newTodo])
    handleCloseTodoPopup()
    onTodoAdded?.()
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#0077b6' }}>
        <div className="container-fluid">
          <button
            type="button"
            className="navbar-brand btn btn-link text-white text-decoration-none fw-bold"
            onClick={goTo('todo')}
          >
            TODO
          </button>
          <div className="ms-auto d-flex align-items-center gap-2">
            {onDateFormatChange && (
              <div className="d-flex align-items-center gap-2">
                <span className="text-white small">12 hrs</span>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="dateFormatToggle"
                    checked={dateFormat === '24h'}
                    onChange={(e) => onDateFormatChange(e.target.checked ? '24h' : '12h')}
                    aria-label="12 or 24 hour format"
                  />
                </div>
                <span className="text-white small">24 hrs</span>
              </div>
            )}
            {currentUser ? (
              <>
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm"
                  onClick={handleOpenTodoPopup}
                >
                  Add Todo
                </button>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={onLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-outline-light btn-sm"
                onClick={goTo('login')}
              >
                Login
              </button>
              <button
                type="button"
                className="btn btn-outline-light btn-sm"
                onClick={goTo('register')}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>

      {/* Todo popup modal */}
      {showTodoPopup && (
        <div
            className="modal show d-block"
            tabIndex={-1}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1050
            }}
          >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Todo</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseTodoPopup}
                />
              </div>
              <form onSubmit={handleAddTodo}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="todoText" className="form-label">Todo</label>
                    <input
                      id="todoText"
                      type="text"
                      className="form-control"
                      placeholder="Enter todo..."
                      value={todoText}
                      onChange={(e) => setTodoText(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="mb-0">
                    <label htmlFor="todoCompleteDate" className="form-label">Todo Complete Date</label>
                    <input
                      id="todoCompleteDate"
                      type="date"
                      className="form-control"
                      value={todoCompleteDate}
                      onChange={(e) => setTodoCompleteDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseTodoPopup}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
