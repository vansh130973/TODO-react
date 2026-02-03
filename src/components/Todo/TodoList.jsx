import { useState, useEffect } from 'react'
import TodoItem from './TodoItem'
import { getUserTodos, saveUserTodos } from '../../utils/auth'
import { nowUtc } from '../../utils/dateUtils'

function TodoList({ currentUser, refreshKey, dateFormat }) {
  const [todos, setTodos] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    const userTodos = getUserTodos(currentUser)
    setTodos(userTodos.map(t => {
      const { completedDate, ...rest } = t
      return {
        ...rest,
        completed: t.completed ?? false,
        createdDate: t.createdDate ?? t.date,
        updatedDate: t.updatedDate ?? null,
        targetCompleteDate: t.targetCompleteDate ?? null
      }
    }))
  }, [currentUser, refreshKey])

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id)
    setTodos(updatedTodos)
    saveUserTodos(currentUser, updatedTodos)
  }

  const startEdit = (id, text) => {
    setEditingId(id)
    setEditText(text)
  }

  const saveEdit = (id) => {
    if (!editText.trim()) return

    const updatedTodos = todos.map(todo =>
      todo.id === id
        ? { ...todo, text: editText, updatedDate: nowUtc() }
        : todo
    )

    setTodos(updatedTodos)
    saveUserTodos(currentUser, updatedTodos)
    setEditingId(null)
    setEditText('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const toggleComplete = (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
    setTodos(updatedTodos)
    saveUserTodos(currentUser, updatedTodos)
  }

  return (
    <div className="container py-4">
      <h3 className="mb-3">My Todos</h3>
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Todo</th>
              <th>Created Date</th>
              <th>Updated Date</th>
              <th>Complete Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No todos yet
                </td>
              </tr>
            ) : (
              todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  isEditing={editingId === todo.id}
                  editText={editText}
                  onEditTextChange={setEditText}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  onDelete={deleteTodo}
                  onToggleComplete={toggleComplete}
                  dateFormat={dateFormat}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TodoList