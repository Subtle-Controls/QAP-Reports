import React from 'react'
import { countByStatus } from './helpers'

export default function ProgressBar({ sections }) {
  const { ok, nok, na, pct } = countByStatus(sections)
  return (
    <div className="ed-progress">
      <span className="ed-prog-label">Inspection Progress:</span>
      <div className="ed-prog-track"><div className="ed-prog-fill" style={{ width: pct + '%' }} /></div>
      <span className="ed-prog-pct">{pct}%</span>
      <div className="ed-prog-chips">
        <span className="ed-chip ed-chip-ok">✓ {ok} OK</span>
        <span className="ed-chip ed-chip-nok">✗ {nok} Issues</span>
        <span className="ed-chip ed-chip-na">— {na} N/A</span>
      </div>
    </div>
  )
}
