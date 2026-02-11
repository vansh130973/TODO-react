import { useMemo, useState } from 'react'
import TodoItem from './TodoItem'
import { getUserTodos, saveUserTodos } from '../../utils/auth'
import { useToast } from '../../context/useToast'
import { nowUtc, utcNowForInput, toUtcDate, utcToDateTimeInput } from '../../utils/dateUtils'

const FILTER_ALL = 'all'
const FILTER_UPCOMING = 'upcoming'
const FILTER_COMPLETED = 'completed'

function normalizeTodos(rawTodos) {
  return rawTodos.map((t) => ({
    ...t,
    completed: t.completed ?? false,
    createdDate: t.createdDate ?? t.date,
    updatedDate: t.updatedDate ?? null,
    targetCompleteDate: t.targetCompleteDate ?? null,
    remainderDate: t.remainderDate ?? null
  }))
}

function completeTimeOrInfinity(todo) {
  if (!todo.targetCompleteDate) return Infinity
  const time = new Date(todo.targetCompleteDate).getTime()
  return Number.isNaN(time) ? Infinity : time
}

function TodoList({ currentUser, dateFormat }) {
  const { showToast } = useToast()
  const [todos, setTodos] = useState(() => normalizeTodos(getUserTodos(currentUser)))
  const [filter, setFilter] = useState(FILTER_ALL)
  const [showEditPopup, setShowEditPopup] = useState(false)
  const [editTodo, setEditTodo] = useState(null)
  const [editText, setEditText] = useState('')
  const [editCompleteDate, setEditCompleteDate] = useState('')
  const [editRemainderDate, setEditRemainderDate] = useState('')

  const utcMin = utcNowForInput()

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id)
    setTodos(updatedTodos)
    saveUserTodos(currentUser, updatedTodos)
  }

  const openEditPopup = (todo) => {
    setEditTodo(todo)
    setEditText(todo.text)
    setEditCompleteDate(utcToDateTimeInput(todo.targetCompleteDate))
    setEditRemainderDate(utcToDateTimeInput(todo.remainderDate))
    setShowEditPopup(true)
  }

  const closeEditPopup = () => {
    setShowEditPopup(false)
    setEditTodo(null)
    setEditText('')
    setEditCompleteDate('')
    setEditRemainderDate('')
  }

  const saveEdit = (e) => {
    e.preventDefault()
    
    if (!editText.trim()) {
      showToast('Todo text is required', 'danger')
      return
    }

    if (!editCompleteDate || !editRemainderDate) {
      showToast('Both Complete Date and Remainder Date are required', 'danger')
      return
    }

    const currentUtc = new Date()
    const completeUtc = toUtcDate(editCompleteDate)
    const remainderUtc = toUtcDate(editRemainderDate)

    if (completeUtc < currentUtc) {
      showToast('Complete date/time cannot be in the past', 'danger')
      return
    }

    if (remainderUtc < currentUtc) {
      showToast('Remainder date/time cannot be in the past', 'danger')
      return
    }

    if (remainderUtc > completeUtc) {
      showToast('Remainder date/time must be on or before the complete date/time', 'danger')
      return
    }

    const updatedTodos = todos.map(todo =>
      todo.id === editTodo.id
        ? {
            ...todo,
            text: editText.trim(),
            targetCompleteDate: completeUtc.toISOString(),
            remainderDate: remainderUtc.toISOString(),
            updatedDate: nowUtc()
          }
        : todo
    )

    setTodos(updatedTodos)
    saveUserTodos(currentUser, updatedTodos)
    showToast('Todo updated successfully', 'success')
    closeEditPopup()
  }

  const toggleComplete = (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
    setTodos(updatedTodos)
    saveUserTodos(currentUser, updatedTodos)
  }

  const filteredAndSortedTodos = useMemo(() => {
    if (filter === FILTER_COMPLETED) {
      return todos.filter((t) => t.completed)
    }

    const incomplete = todos.filter((t) => !t.completed)
    const completed = todos.filter((t) => t.completed)
    const incompleteSorted = [...incomplete].sort((a, b) => completeTimeOrInfinity(a) - completeTimeOrInfinity(b))

    if (filter === FILTER_UPCOMING) return incompleteSorted
    return [...incompleteSorted, ...completed] // FILTER_ALL
  }, [filter, todos])

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <h3 className="mb-0">My Todos</h3>
        <div>
          <label htmlFor="filterSelect" className="form-label me-2 mb-0">Filter:</label>
          <select
            id="filterSelect"
            className="form-select d-inline-block"
            style={{ width: 'auto', minWidth: '150px' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value={FILTER_ALL}>All</option>
            <option value={FILTER_UPCOMING}>Upcoming</option>
            <option value={FILTER_COMPLETED}>Completed</option>
          </select>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Todo</th>
              <th>Created Date</th>
              <th>Updated Date</th>
              <th>Complete Date</th>
              <th>Remainder Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedTodos.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  {filter === FILTER_UPCOMING && 'No upcoming todos'}
                  {filter === FILTER_COMPLETED && 'No completed todos'}
                  {filter === FILTER_ALL && 'No todos yet'}
                </td>
              </tr>
            ) : (
              filteredAndSortedTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onEdit={() => openEditPopup(todo)}
                  onDelete={deleteTodo}
                  onToggleComplete={toggleComplete}
                  dateFormat={dateFormat}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Todo popup modal */}
      {showEditPopup && editTodo && (
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
                <h5 className="modal-title">Edit Todo</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeEditPopup}
                />
              </div>
              <form onSubmit={saveEdit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="editTodoText" className="form-label">Todo</label>
                    <input
                      id="editTodoText"
                      type="text"
                      className="form-control"
                      placeholder="Enter todo..."
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      autoFocus
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="editCompleteDate" className="form-label">
                      Complete Date (UTC)
                    </label>
                    <input
                      id="editCompleteDate"
                      type="datetime-local"
                      className="form-control"
                      value={editCompleteDate}
                      min={utcMin}
                      onChange={(e) => {
                        setEditCompleteDate(e.target.value)
                        if (editRemainderDate && editRemainderDate > e.target.value) {
                          setEditRemainderDate('')
                        }
                      }}
                    />
                  </div>
                  
                  <div className="mb-0">
                    <label htmlFor="editRemainderDate" className="form-label">
                      Remainder Date (UTC)
                    </label>
                    <input
                      id="editRemainderDate"
                      type="datetime-local"
                      className="form-control"
                      value={editRemainderDate}
                      min={utcMin}
                      onChange={(e) => setEditRemainderDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeEditPopup}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TodoList