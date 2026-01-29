import { useState, useEffect } from 'react'
import TodoForm from './TodoForm'
import TodoItem from './TodoItem'
import { getUserTodos, saveUserTodos } from '../../utils/auth'

function TodoList({ currentUser, onLogout }) {
  const [todos, setTodos] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    const userTodos = getUserTodos(currentUser)
    setTodos(userTodos)
  }, [currentUser])

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      date: new Date().toLocaleString()
    }
    
    const updatedTodos = [...todos, newTodo]
    setTodos(updatedTodos)
    saveUserTodos(currentUser, updatedTodos)
  }

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
      todo.id === id ? { ...todo, text: editText } : todo
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

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>My Todos</h3>
        <button className="btn btn-danger btn-sm" onClick={onLogout}>
          Logout
        </button>
      </div>
      
      <TodoForm onAddTodo={addTodo} />
      
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Todo</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No todos yet
                </td>
              </tr>
            ) : (
              todos.map((todo, index) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  index={index}
                  isEditing={editingId === todo.id}
                  editText={editText}
                  onEditTextChange={setEditText}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  onDelete={deleteTodo}
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