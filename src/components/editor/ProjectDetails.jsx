import React from 'react'

export default function ProjectDetails({ proj, setProj, rptType, setRptType, setStep }) {
  function sf(k, v) { setProj(p => ({ ...p, [k]: v })) }

  return (
    <div className="ed-card">
      <div className="ed-card-hd"><span className="ed-card-num">1</span><span className="ed-card-title">Project Details</span></div>
      
      <div className="ed-rtype">
        <span className="ed-rtype-label">Report Type:</span>
        <div className="ed-rtype-group">
          <button type="button" className={`ed-rtype-btn ${rptType === 'internal' ? 'sel' : ''}`} onClick={() => setRptType('internal')}>Internal Test Report</button>
          <button type="button" className={`ed-rtype-btn ${rptType === 'witness' ? 'sel' : ''}`} onClick={() => setRptType('witness')}>Witness Report</button>
          <button type="button" className={`ed-rtype-btn ${rptType === 'checklist' ? 'sel' : ''}`} onClick={() => setRptType('checklist')}>Panel Testing Checklist</button>
        </div>
      </div>

      <div className="ed-form-grid">
        <div className="ed-fg"><label>Customer</label><input value={proj.customer} onChange={e => sf('customer', e.target.value)} placeholder="e.g. NHPC / Customer Name" /></div>
        <div className="ed-fg"><label>Project Name</label><input value={proj.projName} onChange={e => sf('projName', e.target.value)} placeholder="e.g. Bhilangna Stage-III HEP" /></div>
        <div className="ed-fg"><label>Report Number</label><input value={proj.reportNo} onChange={e => sf('reportNo', e.target.value)} placeholder="e.g. SC/BF-2024-047/QAP/2026" /></div>
        <div className="ed-fg"><label>Project Number</label><input value={proj.projNo} onChange={e => sf('projNo', e.target.value)} placeholder="e.g. BF-2024-047" /></div>
        <div className="ed-fg"><label>Purchase Order No.</label><input value={proj.poNo} onChange={e => sf('poNo', e.target.value)} placeholder="e.g. PO/NHPC/2024/1138" /></div>
        <div className="ed-fg"><label>Date of Inspection</label><input type="date" value={proj.date} onChange={e => sf('date', e.target.value)} /></div>
        <div className="ed-fg"><label>Supplier</label><input value={proj.supplier} onChange={e => sf('supplier', e.target.value)} /></div>
        <div className="ed-fg"><label>Place of Inspection</label><input value={proj.place} onChange={e => sf('place', e.target.value)} placeholder="e.g. Plot 473, IMT Faridabad" /></div>
        <div className="ed-fg"><label>Item / Assembly</label><input value={proj.item} onChange={e => sf('item', e.target.value)} placeholder="e.g. TG PLC Control Panel" /></div>
        <div className="ed-fg"><label>Drawing # & Revision</label><input value={proj.drawing} onChange={e => sf('drawing', e.target.value)} placeholder="e.g. SC-TGPLC-GA-Rev3" /></div>
        <div className="ed-fg ed-span"><label>Reference Documents</label><input value={proj.refDocs} onChange={e => sf('refDocs', e.target.value)} placeholder="e.g. IEC 60529, IS 13947, Approved GA Drawing" /></div>
        <div className="ed-fg"><label>No. of Units</label><input value={proj.units} onChange={e => sf('units', e.target.value)} placeholder="e.g. 1" /></div>
        <div className="ed-fg"><label>Unit-1 Serial No.</label><input value={proj.unit1sn} onChange={e => sf('unit1sn', e.target.value)} /></div>
        <div className="ed-fg"><label>Unit-2 Serial No.</label><input value={proj.unit2sn} onChange={e => sf('unit2sn', e.target.value)} /></div>
      </div>

      <div className="ed-card-foot"><button className="ed-btn ed-btn-navy" onClick={() => setStep(2)}>Next: Section Setup ›</button></div>
    </div>
  )
}
