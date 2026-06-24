import React, { useEffect } from 'react'

export default function ReportPreview({ sections, proj, rptType, onClose, autoPrint }) {
  useEffect(() => {
    if (autoPrint) {
      const t = setTimeout(() => window.print(), 300)
      return () => clearTimeout(t)
    }
  }, [autoPrint])
  const rLabel = rptType === 'witness' ? 'WITNESS REPORT' : rptType === 'checklist' ? 'PANEL TESTING CHECKLIST' : 'INTERNAL TEST REPORT'
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  const rptNo = proj.reportNo || ('SC/' + (proj.projNo || 'XXXX') + '/QAP/' + new Date().getFullYear())
  const enabled = sections.filter(s => s.enabled)

  function renderParams(params, secNo) {
    return (
      <table className="rpt-tbl">
        <thead><tr><th>S/N</th><th>Parameter</th><th>Design</th><th>Actual</th><th>Remarks</th><th>Status</th></tr></thead>
        <tbody>
          {params.map((p, i) => {
            const st = !p.appl ? 'N/A' : p.status === 'ok' ? 'OK' : p.status === 'notok' ? 'NOT OK' : p.status === 'na' ? 'N/A' : '—'
            const cls = p.status === 'ok' ? 'ok-r' : p.status === 'notok' ? 'nok-r' : !p.appl ? 'na-r' : ''
            return (
              <tr key={p.id} className={cls}>
                <td className="rpt-sn">{secNo}.{String(i + 1).padStart(2, '0')}</td>
                <td>{p.desc}</td>
                <td>{p.design || '—'}</td>
                <td>{p.value || '—'}</td>
                <td>{p.remarks || ''}</td>
                <td><span className={`rpt-st rpt-st-${p.status || 'na'}`}>{st}</span></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  let secN = 0

  return (
    <div className="rpt-overlay" id="rpt-overlay">
      <div className="rpt-toolbar no-print">
        <button className="ed-btn ed-btn-outline" style={{background:'#fff',color:'var(--text)',boxShadow:'0 2px 8px rgba(0,0,0,.2)'}} onClick={onClose}>✕ Close</button>
        <button className="ed-btn ed-btn-green" style={{boxShadow:'0 2px 8px rgba(5,150,105,.3)'}} onClick={() => window.print()}>🖨 Print / PDF</button>
      </div>
      <div className="rpt-doc">
        {/* Header */}
        <div className="rpt-hdr">
          <div className="rpt-co"><div className="rpt-co1">SUBTLE <span style={{ color: '#22B050' }}>CONTROLS</span> I PVT LTD</div><div className="rpt-co2">Plot No 473, Sector 68, IMT Faridabad, Haryana</div></div>
        </div>
        <div className="rpt-title"><h1>{rLabel}</h1><p>Report No: {rptNo} | Date: {today}</p></div>

        {/* Project Info */}
        <div className="rpt-proj">
          <table><tbody>
            {[['Customer', proj.customer], ['Report Number', rptNo], ['Project Name', proj.projName], ['Project Number', proj.projNo], ['Purchase Order No.', proj.poNo], ['Date of Inspection', proj.date], ['Supplier', proj.supplier], ['Item / Assembly', proj.item], ['Drawing & Rev.', proj.drawing], ['Reference Documents', proj.refDocs], ['Place of Inspection', proj.place], ['No. of Units', proj.units], ['Unit-1 S/N', proj.unit1sn], ['Unit-2 S/N', proj.unit2sn]].filter(r => r[1]).map(([k, v]) => (
              <tr key={k}><td className="rpt-proj-k">{k}</td><td className="rpt-proj-v">{v}</td></tr>
            ))}
          </tbody></table>
        </div>

        {/* Sections */}
        {enabled.map(sec => {
          secN++
          return (
            <div key={sec.id} className="rpt-sec">
              <div className="rpt-sec-hd"><span className="rpt-sec-num">{secN}</span><span className="rpt-sec-title">{sec.title}</span></div>
              {sec.type === 'relay' && sec.subGroups ? (
                sec.subGroups.filter(sg => sg.enabled !== false).map(sg => (
                  <div key={sg.id}>
                    <div className="rpt-sub-hd">{sg.label}</div>
                    {renderParams(sg.params, secN)}
                  </div>
                ))
              ) : renderParams(sec.params || [], secN)}
            </div>
          )
        })}

        {/* Conclusion */}
        <div className="rpt-conc">
          <h3>Conclusion</h3>
          <div className="rpt-conc-txt">{proj.conclusion || '—'}</div>
        </div>

        {/* Sign-off */}
        <div className="rpt-sign">
          <div className="rpt-sign-box">
            <h4>Tested By</h4>
            <table><tbody><tr><td>Name:</td><td><b>{proj.testName}</b></td></tr><tr><td>Designation:</td><td>{proj.testDesig}</td></tr><tr><td>Date:</td><td>{proj.testDate}</td></tr></tbody></table>
            <div style={{display:'flex',gap:12,marginTop:8,alignItems:'center'}}>
              {proj.testSignatureImg && <img src={proj.testSignatureImg} alt="Tester Signature" style={{maxWidth:150,maxHeight:60,objectFit:'contain'}} />}
              {proj.testStampImg && <img src={proj.testStampImg} alt="Tester Stamp" style={{maxWidth:100,maxHeight:60,objectFit:'contain'}} />}
            </div>
          </div>
          <div className="rpt-sign-box">
            <h4>Reviewed By</h4>
            <table><tbody><tr><td>Name:</td><td><b>{proj.inspName}</b></td></tr><tr><td>Designation:</td><td>{proj.inspDesig}</td></tr><tr><td>Date:</td><td>{proj.inspDate}</td></tr></tbody></table>
            <div style={{display:'flex',gap:12,marginTop:8,alignItems:'center'}}>
              {proj.inspSignatureImg && <img src={proj.inspSignatureImg} alt="Inspector Signature" style={{maxWidth:150,maxHeight:60,objectFit:'contain'}} />}
              {proj.inspStampImg && <img src={proj.inspStampImg} alt="Inspector Stamp" style={{maxWidth:100,maxHeight:60,objectFit:'contain'}} />}
            </div>
          </div>
          <div className="rpt-sign-box">
            <h4>{proj.revType === 'witnessed' ? 'Report Witnessed By' : proj.revType === 'virtually_witnessed' ? 'Product Virtually Witnessed By' : 'Report Reviewed By'}</h4>
            <table><tbody><tr><td>Name:</td><td><b>{proj.revName}</b></td></tr><tr><td>Designation:</td><td>{proj.revDesig}</td></tr><tr><td>Date:</td><td>{proj.revDate}</td></tr></tbody></table>
            <div style={{display:'flex',gap:12,marginTop:8,alignItems:'center'}}>
              {proj.revSignatureImg && <img src={proj.revSignatureImg} alt="Reviewer Signature" style={{maxWidth:150,maxHeight:60,objectFit:'contain'}} />}
              {proj.revStampImg && <img src={proj.revStampImg} alt="Reviewer Stamp" style={{maxWidth:100,maxHeight:60,objectFit:'contain'}} />}
            </div>
          </div>
        </div>

        <div className="rpt-foot"><span>{rLabel} | {rptNo}</span><span>Subtle Controls I Pvt Ltd | Confidential</span></div>
      </div>
    </div>
  )
}
