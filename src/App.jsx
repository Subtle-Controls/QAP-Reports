import React, { useState } from 'react'
import Layout from './components/Layout.jsx'
import Dashboard from './components/Dashboard.jsx'
import ReportsList from './components/ReportsList.jsx'
import ReportEditor from './components/ReportEditor.jsx'
import RecycleBin from './components/RecycleBin.jsx'

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [editingReportId, setEditingReportId] = useState(null)

  function navigateTo(page) {
    setCurrentPage(page)
    setEditingReportId(null)
  }

  function editReport(id) {
    setEditingReportId(id)
    setCurrentPage('editor')
  }

  function newReport() {
    setEditingReportId(null)
    setCurrentPage('editor')
  }

  function backToReports() {
    setEditingReportId(null)
    setCurrentPage('reports')
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
