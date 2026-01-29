function TodoItem({
  todo,
  index,
  isEditing,
  editText,
  onEditTextChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete
}) {
  return (
    <tr>
      <td>{index + 1}</td>
      <td>{todo.date}</td>
      <td>
        {isEditing ? (
          <input
            type="text"
            className="form-control form-control-sm"
            value={editText}
            onChange={(e) => onEditTextChange(e.target.value)}
            autoFocus
          />
        ) : (
          <span className="todo-text">{todo.text}</span>
        )}
      </td>
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