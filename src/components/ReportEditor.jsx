import React, { useState, useEffect } from 'react'

export default function ReportEditor({ reportId, onBack }) {
  const [iframeUrl, setIframeUrl] = useState('')

  useEffect(() => {
    // Build URL for the legacy editor with reportId
    const params = new URLSearchParams(window.location.search)
    let url = '/editor.html'
    
    if (reportId) {
      url += '?reportId=' + encodeURIComponent(reportId)
    } else {
      // Pass through any URL params from Subtle OS
      const passParams = ['customer', 'projName', 'projNo', 'poNo', 'date', 'supplier', 'place', 'item', 'rptType']
      const newParams = new URLSearchParams()
      // Generate new ID for new reports
      newParams.set('reportId', 'qap_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6))
      passParams.forEach(p => {
        const val = params.get(p)
        if (val) newParams.set(p, val)
      })
      url += '?' + newParams.toString()
    }
    
    setIframeUrl(url)
  }, [reportId])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 110px)' }}>
      <div style={{ padding: '12px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="btn btn-outline" onClick={onBack}>← Back to Reports</button>
        <span style={{ fontSize: 13, color: 'var(--text-3)' }}>
          {reportId ? 'Editing report' : 'Creating new report'} — Save your work using the Save button in the editor
        </span>
      </div>
      {iframeUrl && (
        <iframe
          src={iframeUrl}
          style={{ flex: 1, border: 'none', width: '100%' }}
          title="QAP Report Editor"
        />
      )}
    </div>
  )
}
