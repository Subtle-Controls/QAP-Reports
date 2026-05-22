import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

export default function ReportsList({ editReport }) {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    fetchReports()
  }, [])

  async function fetchReports() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('qap_reports')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setReports(data || [])
    } catch (err) {
      console.error('Error fetching reports:', err)
    } finally {
      setLoading(false)
    }
  }

  async function deleteReport(report) {
    if (!confirm(`Delete report "${report.project_name || report.id}"? It will be moved to the Recycle Bin.`)) return

    try {
      // Move to deleted_qap_reports
      const { error: insertError } = await supabase
        .from('deleted_qap_reports')
        .insert({
          id: report.id,
          project_id: report.project_id,
          project_no: report.project_no,
          project_name: report.project_name,
          customer: report.customer,
          report_type: report.report_type,
          status: report.status,
          data: report.data,
          created_at: report.created_at,
          updated_at: report.updated_at
        })

      if (insertError) throw insertError

      // Delete from qap_reports
      const { error: deleteError } = await supabase
        .from('qap_reports')
        .delete()
        .eq('id', report.id)

      if (deleteError) throw deleteError

      setReports(prev => prev.filter(r => r.id !== report.id))
    } catch (err) {
      console.error('Error deleting report:', err)
      alert('Failed to delete report. Please try again.')
    }
  }

  const filtered = reports.filter(r => {
    const matchesSearch = search === '' || 
      (r.project_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.customer || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.project_no || '').toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <div className="loading">Loading reports...</div>
  }

  return (
    <div className="reports-list">
      <div className="reports-header">
        <h1>All Reports</h1>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by project name, customer, or project no..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="status-filters">
          {['All', 'In Progress', 'Completed'].map(status => (
            <button
              key={status}
              className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state">
          <p>No reports found.</p>
        </div>
      ) : (
        <div className="card table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Report Type</th>
                <th>Project Name</th>
                <th>Panel / Item</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(report => (
                <tr key={report.id}>
                  <td>{report.report_type || 'Internal Test Report'}</td>
                  <td>{report.project_name || '—'}</td>
                  <td style={{fontWeight:500}}>{report.data?.proj?.item || '—'}</td>
                  <td>{report.customer || '—'}</td>
                  <td>
                    <span className={`status-badge ${report.status === 'completed' || report.status === 'Completed' ? 'status-completed' : 'status-progress'}`}>
                      {report.status === 'completed' || report.status === 'Completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </td>
                  <td>{report.updated_at ? new Date(report.updated_at).toLocaleDateString() : '—'}</td>
                  <td className="actions-cell">
                    <button className="btn btn-outline btn-sm" onClick={() => editReport(report.id)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteReport(report)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
