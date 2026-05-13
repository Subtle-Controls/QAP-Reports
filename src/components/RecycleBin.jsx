import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

export default function RecycleBin() {
  const [deletedReports, setDeletedReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeletedReports()
  }, [])

  async function fetchDeletedReports() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('deleted_qap_reports')
        .select('*')
        .order('deleted_at', { ascending: false })

      if (error) throw error
      setDeletedReports(data || [])
    } catch (err) {
      console.error('Error fetching deleted reports:', err)
    } finally {
      setLoading(false)
    }
  }

  async function restoreReport(report) {
    try {
      // Insert back into qap_reports
      const { error: insertError } = await supabase
        .from('qap_reports')
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

      // Delete from deleted_qap_reports
      const { error: deleteError } = await supabase
        .from('deleted_qap_reports')
        .delete()
        .eq('id', report.id)

      if (deleteError) throw deleteError

      setDeletedReports(prev => prev.filter(r => r.id !== report.id))
    } catch (err) {
      console.error('Error restoring report:', err)
      alert('Failed to restore report. Please try again.')
    }
  }

  async function permanentDelete(report) {
    if (!confirm(`Permanently delete "${report.project_name || report.id}"? This cannot be undone.`)) return

    try {
      const { error } = await supabase
        .from('deleted_qap_reports')
        .delete()
        .eq('id', report.id)

      if (error) throw error

      setDeletedReports(prev => prev.filter(r => r.id !== report.id))
    } catch (err) {
      console.error('Error permanently deleting report:', err)
      alert('Failed to delete report. Please try again.')
    }
  }

  if (loading) {
    return <div className="loading">Loading recycle bin...</div>
  }

  return (
    <div className="recycle-bin">
      <div className="reports-header">
        <h1>Recycle Bin</h1>
        <p className="subtitle">Deleted reports can be restored or permanently removed.</p>
      </div>

      {deletedReports.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">🗑️</div>
          <p>Recycle bin is empty.</p>
        </div>
      ) : (
        <div className="card table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Customer</th>
                <th>Report Type</th>
                <th>Deleted At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deletedReports.map(report => (
                <tr key={report.id}>
                  <td>{report.project_name || '—'}</td>
                  <td>{report.customer || '—'}</td>
                  <td>{report.report_type || '—'}</td>
                  <td>{report.deleted_at ? new Date(report.deleted_at).toLocaleDateString() : '—'}</td>
                  <td className="actions-cell">
                    <button className="btn btn-outline btn-sm" onClick={() => restoreReport(report)}>Restore</button>
                    <button className="btn btn-danger btn-sm" onClick={() => permanentDelete(report)}>Delete Forever</button>
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
