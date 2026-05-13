import React from 'react'

export default function Layout({ children, currentPage, navigateTo, newReport }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'reports', label: 'All Reports' },
    { id: 'recycle', label: 'Recycle Bin' }
  ]

  return (
    <div className="layout">
      <header className="header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="header-logo">SUBTLE CONTROLS</span>
            <span className="header-title">QAP Report System</span>
          </div>
        </div>
      </header>

      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-tab ${currentPage === tab.id ? 'active' : ''}`}
                onClick={() => navigateTo(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button className="btn btn-green" onClick={newReport}>
            + New Report
          </button>
        </div>
      </nav>

      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
