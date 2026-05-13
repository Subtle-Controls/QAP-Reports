import React, { useState } from 'react'
import { uid, createParam, countParams, countFilled } from './helpers'
import ProgressBar from './ProgressBar'

export default function InspectionChecks({ sections, setSections, setStep }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [showParamModal, setShowParamModal] = useState(false)
  const [paramTarget, setParamTarget] = useState(null)
  const [newParamDesc, setNewParamDesc] = useState('')

  const sec = sections[activeIdx]
  if (!sec) return <div>No sections available</div>

  function updateParam(secIdx, groupKey, paramIdx, field, value) {
    setSections(prev => {
      const copy = JSON.parse(JSON.stringify(prev))
      const s = copy[secIdx]
      let arr
      if (groupKey === 'main') arr = s.params
      else { const gi = parseInt(groupKey.replace('g', '')); arr = s.subGroups[gi].params }
      arr[paramIdx][field] = value
      if (field === 'appl' && !value) arr[paramIdx].status = 'na'
      if (field === 'appl' && value && arr[paramIdx].status === 'na') arr[paramIdx].status = ''
      return copy
    })
  }

  function deleteParam(secIdx, groupKey, paramIdx) {
    if (!confirm('Delete this parameter?')) return
    setSections(prev => {
      const copy = JSON.parse(JSON.stringify(prev))
      const s = copy[secIdx]
      let arr
      if (groupKey === 'main') arr = s.params
      else { const gi = parseInt(groupKey.replace('g', '')); arr = s.subGroups[gi].params }
      arr.splice(paramIdx, 1)
      return copy
    })
  }

  function addParam() {
    if (!newParamDesc.trim()) return
    setSections(prev => {
      const copy = JSON.parse(JSON.stringify(prev))
      const s = copy[paramTarget.secIdx]
      let arr
      if (paramTarget.groupKey === 'main') arr = s.params
      else { const gi = parseInt(paramTarget.groupKey.replace('g', '')); arr = s.subGroups[gi].params }
      arr.push(createParam(newParamDesc.trim()))
      return copy
    })
    setNewParamDesc('')
    setShowParamModal(false)
  }

  function toggleSubGroup(secIdx, gi) {
    setSections(prev => {
      const copy = JSON.parse(JSON.stringify(prev))
      copy[secIdx].subGroups[gi].enabled = !copy[secIdx].subGroups[gi].enabled
      return copy
    })
  }

  function renderTable(params, secIdx, groupKey) {
    return (
      <div className="ed-tbl-wrap">
        <table className="ed-ptbl">
          <thead><tr><th>S/N</th><th>Parameter Description</th><th>Appl.</th><th>Status</th><th>Value</th><th>Remarks</th><th></th></tr></thead>
          <tbody>
            {params.map((param, pi) => (
              <tr key={param.id} className={!param.appl ? 'na-row' : ''}>
                <td className="ed-sn">{secIdx + 1}.{String(pi + 1).padStart(2, '0')}</td>
                <td className="ed-pd">{param.desc}</td>
                <td>
                  <div className="ed-appl">
                    <button className={`ed-abtn ${param.appl ? 'ay' : ''}`} onClick={() => updateParam(secIdx, groupKey, pi, 'appl', true)}>Appl</button>
                    <button className={`ed-abtn ${!param.appl ? 'an' : ''}`} onClick={() => updateParam(secIdx, groupKey, pi, 'appl', false)}>N/A</button>
                  </div>
                </td>
                <td>
                  <select className={`ed-pst ${param.status}`} value={param.status} disabled={!param.appl}
                    onChange={e => updateParam(secIdx, groupKey, pi, 'status', e.target.value)}>
                    <option value="">— Select</option>
                    <option value="ok">✓ OK</option>
                    <option value="notok">✗ NOT OK</option>
                    <option value="na">— N/A</option>
                  </select>
                </td>
                <td><input className="ed-pv" value={param.value} disabled={!param.appl} onChange={e => updateParam(secIdx, groupKey, pi, 'value', e.target.value)} placeholder="Value..." /></td>
                <td><input className="ed-pv" value={param.remarks} onChange={e => updateParam(secIdx, groupKey, pi, 'remarks', e.target.value)} placeholder="Remarks..." /></td>
                <td><button className="ed-del-btn" onClick={() => deleteParam(secIdx, groupKey, pi)}>×</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="ed-btn-add" style={{ margin: '8px 14px' }} onClick={() => { setParamTarget({ secIdx, groupKey }); setNewParamDesc(''); setShowParamModal(true) }}>+ Add Parameter</button>
      </div>
    )
  }

  return (
    <div className="ed-checks-layout">
      {/* Sidebar */}
      <div className="ed-checks-sidebar">
        <div className="ed-sb-label">SECTIONS</div>
        {sections.map((s, i) => {
          const filled = countFilled(s)
          const total = countParams(s)
          const done = s.enabled && filled > 0 && filled === total
          return (
            <div key={s.id} className={`ed-sb-item ${i === activeIdx ? 'active' : ''} ${done ? 'done' : ''} ${!s.enabled ? 'off' : ''}`} onClick={() => setActiveIdx(i)}>
              <div className="ed-sb-dot" />
              <span className="ed-sb-name">{s.title}</span>
            </div>
          )
        })}
      </div>

      {/* Content */}
      <div className="ed-checks-content">
        <ProgressBar sections={sections} />
        
        <div className="ed-card">
          <div className="ed-card-hd">
            <span className="ed-card-num">{activeIdx + 1}</span>
            <span className="ed-card-title">{sec.title}</span>
            {!sec.enabled && <span className="ed-badge-off">Section Disabled</span>}
          </div>

          {!sec.enabled ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-3)' }}>Section disabled. Enable it from Section Setup.</div>
          ) : sec.type === 'relay' && sec.subGroups ? (
            sec.subGroups.map((sg, gi) => (
              <div key={sg.id}>
                <div className="ed-sub-hd">
                  <span>{sg.label}</span>
                  <div className={`ed-toggle ${sg.enabled !== false ? 'on' : ''}`} onClick={() => toggleSubGroup(activeIdx, gi)} />
                </div>
                {sg.enabled !== false ? renderTable(sg.params, activeIdx, 'g' + gi) : (
                  <div style={{ padding: '8px 14px', fontSize: 11, color: 'var(--text-3)', background: '#f9f9f9' }}>Disabled</div>
                )}
              </div>
            ))
          ) : (
            renderTable(sec.params || [], activeIdx, 'main')
          )}

          <div className="ed-card-foot" style={{ justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Filled: {countFilled(sec)}/{countParams(sec)}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {activeIdx > 0 && <button className="ed-btn ed-btn-outline" onClick={() => setActiveIdx(activeIdx - 1)}>‹ Prev</button>}
              {activeIdx < sections.length - 1 ? (
                <button className="ed-btn ed-btn-navy" onClick={() => setActiveIdx(activeIdx + 1)}>Next Section ›</button>
              ) : (
                <button className="ed-btn ed-btn-navy" onClick={() => setStep(4)}>Finish Checks ›</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showParamModal && (
        <div className="ed-modal-bg" onClick={() => setShowParamModal(false)}>
          <div className="ed-modal" onClick={e => e.stopPropagation()}>
            <h3>Add New Parameter</h3>
            <div className="ed-fg"><label>Description</label><input value={newParamDesc} onChange={e => setNewParamDesc(e.target.value)} placeholder="Parameter description" autoFocus /></div>
            <div className="ed-modal-foot">
              <button className="ed-btn ed-btn-outline" onClick={() => setShowParamModal(false)}>Cancel</button>
              <button className="ed-btn ed-btn-navy" onClick={addParam}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
