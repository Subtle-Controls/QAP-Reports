import React from 'react'

export default function ConclusionSignoff({ proj, setProj, setStep }) {
  function sf(k, v) { setProj(p => ({ ...p, [k]: v })) }

  return (
    <div className="ed-card">
      <div className="ed-card-hd"><span className="ed-card-num">4</span><span className="ed-card-title">Conclusion & Sign-off</span></div>
      
      <div style={{ padding: 16 }}>
        <div className="ed-fg">
          <label>Overall Conclusion / Summary</label>
          <textarea value={proj.conclusion} onChange={e => sf('conclusion', e.target.value)} rows={5} placeholder="e.g. The panel has been inspected as per approved QAP and found satisfactory. Panel cleared for dispatch." />
        </div>
      </div>

      <div className="ed-sign-grid">
        <div className="ed-sign-box">
          <h4>Product Inspected By</h4>
          <div className="ed-fg"><label>Name</label><input value={proj.inspName} onChange={e => sf('inspName', e.target.value)} placeholder="Full Name" /></div>
          <div className="ed-fg"><label>Designation</label><input value={proj.inspDesig} onChange={e => sf('inspDesig', e.target.value)} placeholder="e.g. QA Engineer" /></div>
          <div className="ed-fg"><label>Date</label><input type="date" value={proj.inspDate} onChange={e => sf('inspDate', e.target.value)} /></div>
        </div>
        <div className="ed-sign-box">
          <h4>Report Reviewed By</h4>
          <div className="ed-fg"><label>Name</label><input value={proj.revName} onChange={e => sf('revName', e.target.value)} placeholder="Full Name" /></div>
          <div className="ed-fg"><label>Designation</label><input value={proj.revDesig} onChange={e => sf('revDesig', e.target.value)} placeholder="e.g. QA Manager" /></div>
          <div className="ed-fg"><label>Date</label><input type="date" value={proj.revDate} onChange={e => sf('revDate', e.target.value)} /></div>
        </div>
      </div>

      <div className="ed-card-foot" style={{ justifyContent: 'space-between' }}>
        <button className="ed-btn ed-btn-outline" onClick={() => setStep(3)}>‹ Back</button>
        <button className="ed-btn ed-btn-navy" onClick={() => setStep(5)}>Next: Generate Report ›</button>
      </div>
    </div>
  )
}
