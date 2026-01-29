import { useState } from 'react'

function TodoForm({ onAddTodo }) {
  const [todoText, setTodoText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (todoText.trim()) {
      onAddTodo(todoText)
      setTodoText('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Enter todo..."
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </div>
    </form>
  )
}

export default TodoForm