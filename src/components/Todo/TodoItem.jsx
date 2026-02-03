import { formatUtcForDisplay } from '../../utils/dateUtils'

function TodoItem({
  todo,
  isEditing,
  editText,
  onEditTextChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onToggleComplete,
  dateFormat = '12h'
}) {
  const use24hr = dateFormat === '24h'
  return (
    <tr className={todo.completed ? 'table-secondary' : ''}>
      <td>
        <span className="me-2" title={todo.completed ? 'Mark incomplete' : 'Mark complete'}>
          <input
            type="checkbox"
            className="form-check-input"
            checked={!!todo.completed}
            onChange={() => onToggleComplete(todo.id)}
            aria-label="Toggle complete"
          />
        </span>
        {isEditing ? (
          <input
            type="text"
            className="form-control form-control-sm d-inline-block"
            style={{ width: 'auto', minWidth: '120px' }}
            value={editText}
            onChange={(e) => onEditTextChange(e.target.value)}
            autoFocus
          />
        ) : (
          <span className={`todo-text ${todo.completed ? 'text-decoration-line-through text-muted' : ''}`}>
            {todo.text}
          </span>
        )}
      </td>
      <td>{formatUtcForDisplay(todo.createdDate, use24hr)}</td>
      <td>{formatUtcForDisplay(todo.updatedDate, use24hr)}</td>
      <td>{formatUtcForDisplay(todo.targetCompleteDate, use24hr)}</td>
      <td>
        {isEditing ? (
          <>
            <button
              className="btn btn-success btn-sm me-2"
              onClick={() => onSaveEdit(todo.id)}
            >
              Save
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={onCancelEdit}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-warning btn-sm me-2"
              onClick={() => onStartEdit(todo.id, todo.text)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(todo.id)}
            >
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  )
}

export default TodoItem