import React, { useState, useRef } from 'react'
import { countByStatus } from './helpers'
import ReportPreview from './ReportPreview'

export default function GenerateReport({ sections, proj, rptType, setStep }) {
  const [showPreview, setShowPreview] = useState(false)
  const stats = countByStatus(sections)
  const enabled = sections.filter(s => s.enabled)
  const disabled = sections.filter(s => !s.enabled)
  const blank = stats.total - stats.filled

  function handlePrint() {
    setShowPreview(true)
    setTimeout(() => window.print(), 500)
  }

  return (
    <>
      <div className="ed-card">
        <div className="ed-card-hd"><span className="ed-card-num">5</span><span className="ed-card-title">Generate Report</span></div>
        
        <div className="ed-gen-banner">
          <div className="ed-gen-icon">📄</div>
          <div className="ed-gen-text">
            <h3>Ready to Generate Report</h3>
            <p>Report type: <strong style={{ color: '#7fffc4' }}>{rptType === 'witness' ? 'Witness Report' : rptType === 'checklist' ? 'Panel Testing Checklist' : 'Internal Test Report'}</strong></p>
          </div>
          <div className="ed-gen-acts">
            <button className="ed-btn ed-btn-outline" style={{background:'#fff',color:'var(--navy)',borderColor:'#fff'}} onClick={handlePrint}>🖨 Print</button>
            <button className="ed-btn ed-btn-green" onClick={() => setShowPreview(true)}>📄 Generate & Preview</button>
          </div>
        </div>

        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)', marginBottom: 10 }}>Inspection Summary</div>
          <div className="ed-stat-row">
            <div className="ed-stat-card" style={{ borderLeftColor: 'var(--navy)' }}><div className="ed-stat-val">{stats.total}</div><div className="ed-stat-lbl">Total Params</div></div>
            <div className="ed-stat-card" style={{ borderLeftColor: 'var(--green)' }}><div className="ed-stat-val" style={{ color: 'var(--green)' }}>{stats.ok}</div><div className="ed-stat-lbl">OK</div></div>
            <div className="ed-stat-card" style={{ borderLeftColor: '#dc2626' }}><div className="ed-stat-val" style={{ color: '#dc2626' }}>{stats.nok}</div><div className="ed-stat-lbl">NOT OK</div></div>
            <div className="ed-stat-card" style={{ borderLeftColor: '#6b7280' }}><div className="ed-stat-val">{stats.na}</div><div className="ed-stat-lbl">N/A</div></div>
            {blank > 0 && <div className="ed-stat-card" style={{ borderLeftColor: '#f59e0b' }}><div className="ed-stat-val" style={{ color: '#f59e0b' }}>{blank}</div><div className="ed-stat-lbl">Not Filled</div></div>}
          </div>
          {stats.nok > 0 && <div className="ed-info-err">⚠ {stats.nok} parameter(s) marked NOT OK. Review before generating report.</div>}
          {blank > 0 && <div className="ed-info-warn">{blank} parameter(s) not yet filled.</div>}
          <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-3)' }}>Enabled ({enabled.length}): {enabled.map(s => s.title).join(', ')}</div>
          {disabled.length > 0 && <div style={{ marginTop: 4, fontSize: 11, color: 'var(--text-3)' }}>Excluded ({disabled.length}): {disabled.map(s => s.title).join(', ')}</div>}
        </div>

        <div className="ed-card-foot"><button className="ed-btn ed-btn-outline" onClick={() => setStep(4)}>‹ Back to Sign-off</button></div>
      </div>

      {showPreview && <ReportPreview sections={sections} proj={proj} rptType={rptType} onClose={() => setShowPreview(false)} />}
    </>
  )
}
