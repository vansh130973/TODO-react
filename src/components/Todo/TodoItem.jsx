import { formatUtcForDisplay, isDatePassed } from '../../utils/dateUtils'

function TodoItem({
  todo,
  onEdit,
  onDelete,
  onToggleComplete,
  dateFormat = '12h'
}) {
  const use24hr = dateFormat === '24h'
  const completeDatePassed = isDatePassed(todo.targetCompleteDate)
  const remainderDatePassed = isDatePassed(todo.remainderDate)

  let rowClass = ''
  if (todo.completed) {
    rowClass = 'table-secondary'
  } else if (completeDatePassed) {
    rowClass = 'table-danger'
  } else if (remainderDatePassed) {
    rowClass = 'table-warning'
  }

  return (
    <tr className={rowClass}>
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
        <span className={`todo-text ${todo.completed ? 'text-decoration-line-through text-muted' : ''}`}>
          {todo.text}
        </span>
      </td>
      <td>{formatUtcForDisplay(todo.createdDate, use24hr)}</td>
      <td>{formatUtcForDisplay(todo.updatedDate, use24hr)}</td>
      <td>{formatUtcForDisplay(todo.targetCompleteDate, use24hr)}</td>
      <td>{formatUtcForDisplay(todo.remainderDate, use24hr)}</td>
      <td>
        <button
          className="btn btn-warning btn-sm me-2"
          onClick={() => onEdit(todo)}
        >
          Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(todo.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  )
}

export default TodoItem
