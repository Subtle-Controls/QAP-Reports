import React, { useState, useEffect } from 'react'
import Layout from './components/Layout.jsx'
import Dashboard from './components/Dashboard.jsx'
import ReportsList from './components/ReportsList.jsx'
import ReportEditor from './components/ReportEditor.jsx'
import RecycleBin from './components/RecycleBin.jsx'

export default function App() {
  // Check URL params on load — if reportId or customer params exist, go straight to editor
  const [currentPage, setCurrentPage] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('reportId') || params.get('customer') || params.get('projName')) {
      return 'editor'
    }
    return 'dashboard'
  })
  const [editingReportId, setEditingReportId] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('reportId') || null
  })

  function navigateTo(page) {
    setCurrentPage(page)
    setEditingReportId(null)
    // Clear URL params when navigating away from editor
    if (page !== 'editor') {
      window.history.replaceState({}, '', window.location.pathname)
    }
  }

  function editReport(id) {
    setEditingReportId(id)
    setCurrentPage('editor')
  }

  function newReport() {
    setEditingReportId(null)
    setCurrentPage('editor')
    // Clear URL params for fresh report
    window.history.replaceState({}, '', window.location.pathname)
  }

  function backToReports() {
    setEditingReportId(null)
    setCurrentPage('reports')
    window.history.replaceState({}, '', window.location.pathname)
  }

  return (
    <Layout currentPage={currentPage} navigateTo={navigateTo} newReport={newReport}>
      {currentPage === 'dashboard' && (
        <Dashboard editReport={editReport} />
      )}
      {currentPage === 'reports' && (
        <ReportsList editReport={editReport} />
      )}
      {currentPage === 'editor' && (
        <ReportEditor reportId={editingReportId} onBack={backToReports} />
      )}
      {currentPage === 'recycle' && (
        <RecycleBin />
      )}
    </Layout>
  )
}
