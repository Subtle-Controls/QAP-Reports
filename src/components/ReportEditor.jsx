import React, { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'
import { uid } from './editor/helpers'
import { buildDefaultSections } from './editor/defaultSections'
import Stepper from './editor/Stepper'
import ProjectDetails from './editor/ProjectDetails'
import SectionSetup from './editor/SectionSetup'
import InspectionChecks from './editor/InspectionChecks'
import ConclusionSignoff from './editor/ConclusionSignoff'
import GenerateReport from './editor/GenerateReport'

function blankProj() {
  return { customer:'', projName:'', reportNo:'', projNo:'', poNo:'', date:'', supplier:'Subtle Controls I Pvt Ltd', place:'', item:'', drawing:'', refDocs:'', units:'', unit1sn:'', unit2sn:'', conclusion:'', inspName:'', inspDesig:'', inspDate:'', revName:'', revDesig:'', revDate:'' }
}

export default function ReportEditor({ reportId, onBack }) {
  const [loading, setLoading] = useState(!!reportId)
  const [step, setStep] = useState(1)
  const [rptType, setRptType] = useState('internal')
  const [status, setStatus] = useState('inprogress')
  const [proj, setProj] = useState(blankProj)
  const [sections, setSections] = useState(() => buildDefaultSections())
  const [currentId, setCurrentId] = useState(reportId || ('qap_' + uid()))
  const [toast, setToast] = useState(null)
  const saveTimer = useRef(null)

  // Load from Supabase if editing existing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlId = params.get('reportId')
    const loadId = reportId || urlId

    if (loadId) {
      setCurrentId(loadId)
      setLoading(true)
      supabase.from('qap_reports').select('*').eq('id', loadId).single().then(({ data }) => {
        if (data && data.data) {
          const d = data.data
          if (d.proj) setProj(d.proj)
          if (d.sections) setSections(d.sections)
          if (d.rptType) setRptType(d.rptType)
          if (d.status) setStatus(d.status)
          if (d.step) setStep(d.step)
        }
        setLoading(false)
      })
    } else {
      // Pre-fill from URL params (Subtle OS integration)
      const fields = { customer:'customer', projName:'projName', projNo:'projNo', poNo:'poNo', date:'date', supplier:'supplier', place:'place', item:'item' }
      let filled = false
      Object.entries(fields).forEach(([param, key]) => {
        const val = params.get(param)
        if (val) { setProj(p => ({ ...p, [key]: decodeURIComponent(val) })); filled = true }
      })
      if (params.get('rptType') === 'witness') setRptType('witness')
    }
  }, [reportId])

  // Auto-save to Supabase (debounced)
  const autoSave = useCallback(() => {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      const row = {
        id: currentId,
        project_id: proj.projNo || '',
        project_no: proj.projNo || '',
        project_name: proj.projName || '',
        customer: proj.customer || '',
        report_type: rptType === 'witness' ? 'Witness Report' : 'Internal Test Report',
        status: status,
        data: { proj, sections, rptType, status, step, reportId: currentId },
        updated_at: new Date().toISOString()
      }
      supabase.from('qap_reports').upsert(row, { onConflict: 'id' }).then(({ error }) => {
        if (error) console.warn('[QAP] auto-save error:', error.message)
      })
    }, 3000)
  }, [currentId, proj, sections, rptType, status, step])

  useEffect(() => { if (!loading) autoSave() }, [proj, sections, rptType, status, step, autoSave, loading])

  // Manual save
  function handleSave() {
    clearTimeout(saveTimer.current)
    const row = {
      id: currentId,
      project_id: proj.projNo || '',
      project_no: proj.projNo || '',
      project_name: proj.projName || '',
      customer: proj.customer || '',
      report_type: rptType === 'witness' ? 'Witness Report' : 'Internal Test Report',
      status: status,
      data: { proj, sections, rptType, status, step, reportId: currentId },
      updated_at: new Date().toISOString()
    }
    supabase.from('qap_reports').upsert(row, { onConflict: 'id' }).then(({ error }) => {
      if (error) { alert('Save failed: ' + error.message); return }
      setToast('✓ Report saved successfully')
      setTimeout(() => setToast(null), 3000)
    })
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)' }}>Loading report...</div>

  return (
    <div className="ed-wrap">
      {toast && <div className="ed-toast">{toast}</div>}
      
      {/* Top bar */}
      <div className="ed-topbar">
        <button className="ed-btn ed-btn-outline" onClick={onBack}>← Back to Reports</button>
        <div style={{ flex: 1 }} />
        <select className="ed-status-sel" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="inprogress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button className="ed-btn ed-btn-green" onClick={handleSave}>💾 Save Report</button>
      </div>

      <Stepper step={step} setStep={setStep} />

      <div className="ed-body">
        {step === 1 && <ProjectDetails proj={proj} setProj={setProj} rptType={rptType} setRptType={setRptType} setStep={setStep} />}
        {step === 2 && <SectionSetup sections={sections} setSections={setSections} setStep={setStep} />}
        {step === 3 && <InspectionChecks sections={sections} setSections={setSections} setStep={setStep} />}
        {step === 4 && <ConclusionSignoff proj={proj} setProj={setProj} setStep={setStep} />}
        {step === 5 && <GenerateReport sections={sections} proj={proj} rptType={rptType} setStep={setStep} />}
      </div>
    </div>
  )
}
