import { useMemo } from 'react'
import { getUserTodos } from '../../utils/auth'

function Dashboard({ currentUser, refreshKey }) {
  const todos = useMemo(() => {
    // refreshKey intentionally forces recompute when todos change
    void refreshKey
    const userTodos = getUserTodos(currentUser)
    return userTodos.map(t => ({ ...t, completed: t.completed ?? false }))
  }, [currentUser, refreshKey])

  const total = todos.length
  const completedCount = todos.filter(t => t.completed).length
  const pending = total - completedCount

  return (
    <div className="p-4">
      <h2 className="mb-4">Dashboard</h2>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card border-primary h-100">
            <div className="card-body">
              <h5 className="card-title text-primary">Total</h5>
              <p className="card-text display-6 fw-bold">{total}</p>
              <p className="card-text small text-muted mb-0">All todos</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-success h-100">
            <div className="card-body">
              <h5 className="card-title text-success">Completed</h5>
              <p className="card-text display-6 fw-bold">{completedCount}</p>
              <p className="card-text small text-muted mb-0">Done</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-warning h-100">
            <div className="card-body">
              <h5 className="card-title text-warning">Pending</h5>
              <p className="card-text display-6 fw-bold">{pending}</p>
              <p className="card-text small text-muted mb-0">To do</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
