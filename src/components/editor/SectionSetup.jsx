import React, { useState } from 'react'
import { uid, createParam, countParams } from './helpers'

export default function SectionSetup({ sections, setSections, setStep }) {
  const [showModal, setShowModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  function toggle(i) {
    setSections(s => s.map((sec, idx) => idx === i ? { ...sec, enabled: !sec.enabled } : sec))
  }

  function deleteSection(i) {
    if (!confirm('Delete "' + sections[i].title + '"? This cannot be undone.')) return
    setSections(s => s.filter((_, idx) => idx !== i))
  }

  function addSection() {
    if (!newTitle.trim()) return
    setSections(s => [...s, { id: uid(), title: newTitle.trim(), enabled: true, params: [createParam('New parameter')] }])
    setNewTitle('')
    setShowModal(false)
  }

  return (
    <div className="ed-card">
      <div className="ed-card-hd"><span className="ed-card-num">2</span><span className="ed-card-title">Section Setup</span></div>
      <div className="ed-info-warn">⚠ Enable only the sections applicable to this control panel. Disabled sections are excluded from the final report.</div>
      
      <div className="ed-setup-grid">
        {sections.map((sec, i) => (
          <div key={sec.id} className={`ed-setup-item ${sec.enabled ? 'on' : 'off'}`} onClick={() => toggle(i)}>
            <div className={`ed-toggle ${sec.enabled ? 'on' : ''}`} />
            <span className="ed-setup-label">{sec.title}</span>
            <span className="ed-setup-cnt">{countParams(sec)}p</span>
            <button className="ed-setup-del" onClick={e => { e.stopPropagation(); deleteSection(i) }}>×</button>
          </div>
        ))}
      </div>

      <div style={{ padding: '12px 16px' }}>
        <button className="ed-btn-add" onClick={() => setShowModal(true)}>+ Add New Section</button>
      </div>

      <div className="ed-card-foot" style={{ justifyContent: 'space-between' }}>
        <button className="ed-btn ed-btn-outline" onClick={() => setStep(1)}>‹ Back</button>
        <button className="ed-btn ed-btn-navy" onClick={() => setStep(3)}>Next: Inspection Checks ›</button>
      </div>

      {showModal && (
        <div className="ed-modal-bg" onClick={() => setShowModal(false)}>
          <div className="ed-modal" onClick={e => e.stopPropagation()}>
            <h3>Add New Section</h3>
            <div className="ed-fg"><label>Section Title</label><input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Bus Bar Protection Relay" autoFocus /></div>
            <div className="ed-modal-foot">
              <button className="ed-btn ed-btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="ed-btn ed-btn-navy" onClick={addSection}>Add Section</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
