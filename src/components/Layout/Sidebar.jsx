function Sidebar({ activeView, onNavigate }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'list', label: 'List' }
  ]

  return (
    <aside
      className="sidebar bg-white border-end shadow-sm"
      style={{ minWidth: '220px' }}
    >
      <nav className="nav flex-column p-3 gap-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-link text-start border-0 py-2 px-3 d-flex align-items-center gap-2 ${
              activeView === item.id ? 'text-white' : 'text-dark'
            }`}
            style={activeView === item.id ? { backgroundColor: '#0077b6' } : {}}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar