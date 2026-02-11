import { useState } from 'react'
import { getUserTodos, saveUserTodos } from '../../utils/auth'
import { useToast } from '../../context/useToast'
import { utcNowForInput, toUtcDate } from '../../utils/dateUtils'

function Navbar({
  currentUser,
  onNavigate,
  onLogout,
  onTodoAdded,
  dateFormat,
  onDateFormatChange
}) {
  const { showToast } = useToast()

  const [showTodoPopup, setShowTodoPopup] = useState(false)
  const [todoText, setTodoText] = useState('')
  const [todoCompleteDate, setTodoCompleteDate] = useState('')
  const [todoRemainderDate, setTodoRemainderDate] = useState('')

  const utcMin = utcNowForInput()

  const goTo = (view) => () => onNavigate(view)

  const handleOpenTodoPopup = () => {
    setTodoText('')
    setTodoCompleteDate('')
    setTodoRemainderDate('')
    setShowTodoPopup(true)
  }

  const handleCloseTodoPopup = () => {
    setShowTodoPopup(false)
    setTodoText('')
    setTodoCompleteDate('')
    setTodoRemainderDate('')
  }

  const handleAddTodo = (e) => {
    e.preventDefault()

    if (!todoText.trim() || !todoCompleteDate || !todoRemainderDate) {
      showToast('All fields are required', 'danger')
      return
    }

    const createdUtc = new Date()
    const completeUtc = toUtcDate(todoCompleteDate)
    const remainderUtc = toUtcDate(todoRemainderDate)

    if (completeUtc < createdUtc) {
      showToast('Complete date/time cannot be in the past', 'danger')
      return
    }

    if (remainderUtc < createdUtc) {
      showToast('Remainder date/time cannot be in the past', 'danger')
      return
    }

    if (remainderUtc > completeUtc) {
      showToast('Remainder date/time must be on or before the complete date/time', 'danger')
      return
    }

    const todos = getUserTodos(currentUser)

    const newTodo = {
      id: Date.now(),
      text: todoText.trim(),
      completed: false,
      createdDate: createdUtc.toISOString(),
      targetCompleteDate: completeUtc.toISOString(),
      remainderDate: remainderUtc.toISOString()
    }

    saveUserTodos(currentUser, [...todos, newTodo])

    showToast('Todo added successfully', 'success')
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
            <span className="text-white">My</span>
            <span className="text-warning">ToDoS</span>
          </button>

          <div className="ms-auto d-flex align-items-center gap-3">
            {onDateFormatChange && (
              <div className="d-flex align-items-center gap-2">
                <span className="text-white small">12 hrs</span>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={dateFormat === '24h'}
                    onChange={(e) => onDateFormatChange(e.target.checked ? '24h' : '12h')}
                  />
                </div>
                <span className="text-white small">24 hrs</span>
              </div>
            )}

            {currentUser ? (
              <>
                <button
                  className="btn btn-light btn-sm"
                  onClick={handleOpenTodoPopup}
                >
                  Add Todo
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </>
            ) : null}
          </div>
        </div>
      </nav>

      {showTodoPopup && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Todo</h5>
                <button className="btn-close" onClick={handleCloseTodoPopup} />
              </div>

              <form onSubmit={handleAddTodo}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Todo</label>
                    <input
                      className="form-control"
                      value={todoText}
                      onChange={(e) => setTodoText(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Complete Date (UTC)</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={todoCompleteDate}
                      min={utcMin}
                      onChange={(e) => {
                        setTodoCompleteDate(e.target.value)
                        if (todoRemainderDate && todoRemainderDate > e.target.value) {
                          setTodoRemainderDate('')
                        }
                      }}
                    />
                  </div>

                  <div>
                    <label className="form-label">Remainder Date (UTC)</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={todoRemainderDate}
                      min={utcMin}
                      onChange={(e) => setTodoRemainderDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseTodoPopup}>
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
