import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

export default function Dashboard({ editReport }) {
  const [stats, setStats] = useState({ total: 0, inProgress: 0, completed: 0, customers: 0 })
  const [recentReports, setRecentReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    setLoading(true)
    try {
      const { data: reports, error } = await supabase
        .from('qap_reports')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) { console.error('[QAP] Dashboard fetch error:', error.message); throw error }
      console.log(`[QAP] Fetched ${reports?.length || 0} reports from Supabase`)

      const all = reports || []
      const total = all.length
      const inProgress = all.filter(r => r.status === 'inprogress' || r.status === 'In Progress').length
      const completed = all.filter(r => r.status === 'completed' || r.status === 'Completed').length
      const customers = new Set(all.map(r => r.customer).filter(Boolean)).size

      setStats({ total, inProgress, completed, customers })
      setRecentReports(all.slice(0, 5))
    } catch (err) {
      console.error('[QAP] Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div className="dashboard">
      <div className="welcome-banner">
        <h1>Welcome to QAP Report System</h1>
        <p>Manage your Quality Assurance Plan test reports for Subtle Controls projects.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Reports</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.customers}</div>
          <div className="stat-label">Unique Customers</div>
        </div>
      </div>

      <div className="card">
        <h2>Recent Reports</h2>
        {recentReports.length === 0 ? (
          <p className="empty-state">No reports yet. Create your first report!</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map(report => (
                <tr key={report.id} className="clickable-row" onClick={() => editReport(report.id)}>
                  <td>{report.project_name || '—'}</td>
                  <td>{report.customer || '—'}</td>
                  <td>
                    <span className={`status-badge ${report.status === 'completed' || report.status === 'Completed' ? 'status-completed' : 'status-progress'}`}>
                      {report.status === 'completed' || report.status === 'Completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </td>
                  <td>{report.updated_at ? new Date(report.updated_at).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
