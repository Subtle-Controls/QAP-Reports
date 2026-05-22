import React from 'react'

export default function ConclusionSignoff({ proj, setProj, setStep }) {
  function sf(k, v) { setProj(p => ({ ...p, [k]: v })) }

  function handleImageUpload(field) {
    return (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => sf(field, ev.target.result)
      reader.readAsDataURL(file)
    }
  }

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

      {/* Inspected By — Signature & Stamp Upload */}
      <div style={{ padding: '0 16px 16px' }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)', marginBottom: 8, display: 'block' }}>Inspected By — Signature & Stamp</label>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6, display: 'block' }}>Signature</label>
            <label className="ed-btn ed-btn-outline" style={{ cursor: 'pointer', display: 'inline-block', marginBottom: 8 }}>
              📎 Upload Signature
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload('inspSignatureImg')} />
            </label>
            {proj.inspSignatureImg && (
              <div style={{ marginTop: 8 }}>
                <img src={proj.inspSignatureImg} alt="Inspector Signature" style={{ maxWidth: 200, maxHeight: 80, border: '1px solid var(--border)', borderRadius: 6, padding: 4, background: '#fff' }} />
                <button className="ed-btn ed-btn-outline" style={{ fontSize: 10, padding: '2px 8px', marginLeft: 8, color: '#dc2626' }} onClick={() => sf('inspSignatureImg', '')}>Remove</button>
              </div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6, display: 'block' }}>Company Stamp</label>
            <label className="ed-btn ed-btn-outline" style={{ cursor: 'pointer', display: 'inline-block', marginBottom: 8 }}>
              📎 Upload Stamp
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload('inspStampImg')} />
            </label>
            {proj.inspStampImg && (
              <div style={{ marginTop: 8 }}>
                <img src={proj.inspStampImg} alt="Inspector Stamp" style={{ maxWidth: 200, maxHeight: 80, border: '1px solid var(--border)', borderRadius: 6, padding: 4, background: '#fff' }} />
                <button className="ed-btn ed-btn-outline" style={{ fontSize: 10, padding: '2px 8px', marginLeft: 8, color: '#dc2626' }} onClick={() => sf('inspStampImg', '')}>Remove</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviewed By — Signature & Stamp Upload */}
      <div style={{ padding: '0 16px 16px' }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)', marginBottom: 8, display: 'block' }}>Reviewed By — Signature & Stamp</label>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6, display: 'block' }}>Signature</label>
            <label className="ed-btn ed-btn-outline" style={{ cursor: 'pointer', display: 'inline-block', marginBottom: 8 }}>
              📎 Upload Signature
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload('revSignatureImg')} />
            </label>
            {proj.revSignatureImg && (
              <div style={{ marginTop: 8 }}>
                <img src={proj.revSignatureImg} alt="Reviewer Signature" style={{ maxWidth: 200, maxHeight: 80, border: '1px solid var(--border)', borderRadius: 6, padding: 4, background: '#fff' }} />
                <button className="ed-btn ed-btn-outline" style={{ fontSize: 10, padding: '2px 8px', marginLeft: 8, color: '#dc2626' }} onClick={() => sf('revSignatureImg', '')}>Remove</button>
              </div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6, display: 'block' }}>Company Stamp</label>
            <label className="ed-btn ed-btn-outline" style={{ cursor: 'pointer', display: 'inline-block', marginBottom: 8 }}>
              📎 Upload Stamp
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload('revStampImg')} />
            </label>
            {proj.revStampImg && (
              <div style={{ marginTop: 8 }}>
                <img src={proj.revStampImg} alt="Reviewer Stamp" style={{ maxWidth: 200, maxHeight: 80, border: '1px solid var(--border)', borderRadius: 6, padding: 4, background: '#fff' }} />
                <button className="ed-btn ed-btn-outline" style={{ fontSize: 10, padding: '2px 8px', marginLeft: 8, color: '#dc2626' }} onClick={() => sf('revStampImg', '')}>Remove</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="ed-card-foot" style={{ justifyContent: 'space-between' }}>
        <button className="ed-btn ed-btn-outline" onClick={() => setStep(3)}>‹ Back</button>
        <button className="ed-btn ed-btn-navy" onClick={() => setStep(5)}>Next: Generate Report ›</button>
      </div>
    </div>
  )
}
