function Sidebar({ activeView, onNavigate }) {
  const goTo = (view) => () => onNavigate(view)

  return (
    <aside className="sidebar bg-white border-end shadow-sm" style={{ minWidth: '220px' }}>
      <nav className="nav flex-column p-3 gap-1">
        <button
          type="button"
          className={`nav-link text-start rounded border-0 py-2 px-3 d-flex align-items-center gap-2 ${
            activeView === 'dashboard' ? 'bg-primary text-white' : 'text-dark'
          }`}
          onClick={goTo('dashboard')}
        >
          Dashboard
        </button>
        <button
          type="button"
          className={`nav-link text-start rounded border-0 py-2 px-3 d-flex align-items-center gap-2 ${
            activeView === 'list' ? 'bg-primary text-white' : 'text-dark'
          }`}
          onClick={goTo('list')}
        >
          List
        </button>
      </nav>
    </aside>
  )
}

export default Sidebar
