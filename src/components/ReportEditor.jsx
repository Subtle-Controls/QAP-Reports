import React, { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'
import { uid } from './editor/helpers'
import { buildDefaultSections, buildChecklistSections } from './editor/defaultSections'
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

  // Pre-fill from URL params helper
  // Auto-generate report number from project number
  function generateReportNo(projNo, rptType) {
    const prefix = projNo ? `SC/${projNo}/QAP` : 'SC/QAP'
    const year = new Date().getFullYear()
    const seq = String(Math.floor(Math.random() * 900 + 100))
    const typeCode = rptType === 'witness' ? 'W' : rptType === 'checklist' ? 'C' : 'I'
    return `${prefix}/${typeCode}-${seq}/${year}`
  }

  function prefillFromParams(params) {
    const fields = { customer:'customer', projName:'projName', projNo:'projNo', poNo:'poNo', date:'date', supplier:'supplier', place:'place', item:'item' }
    const updates = {}
    Object.entries(fields).forEach(([param, key]) => {
      const val = params.get(param)
      if (val) updates[key] = decodeURIComponent(val)
    })
    const rt = params.get('rptType') || 'internal'
    // Auto-generate report number
    if (!updates.reportNo && updates.projNo) {
      updates.reportNo = generateReportNo(updates.projNo, rt)
    }
    if (Object.keys(updates).length > 0) setProj(p => ({ ...p, ...updates }))
    if (rt === 'witness') setRptType('witness')
    else if (rt === 'checklist') { setRptType('checklist'); setSections(buildChecklistSections()) }
    else if (rt === 'internal') setRptType('internal')
  }

  // Load from Supabase if editing existing, otherwise pre-fill from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlId = params.get('reportId')
    const loadId = reportId || urlId

    if (loadId) {
      setCurrentId(loadId)
      setLoading(true)
      supabase.from('qap_reports').select('*').eq('id', loadId).single().then(({ data, error }) => {
        if (data && data.data && !error) {
          // Existing report found in Supabase — load it
          const d = data.data
          if (d.proj) setProj(d.proj)
          if (d.sections) setSections(d.sections)
          if (d.rptType) setRptType(d.rptType)
          if (d.status) setStatus(d.status)
          if (d.step) setStep(d.step)
        } else {
          // Report ID present but NOT found in Supabase (new report from Subtle OS)
          // Pre-fill from URL params
          prefillFromParams(params)
        }
        setLoading(false)
      }).catch(() => {
        // Supabase error — still try to pre-fill from URL params
        prefillFromParams(params)
        setLoading(false)
      })
    } else {
      // No report ID at all — pre-fill from URL params (Subtle OS integration)
      prefillFromParams(params)
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
        report_type: rptType === 'witness' ? 'Witness Report' : rptType === 'checklist' ? 'Panel Testing Checklist' : 'Internal Test Report',
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
      report_type: rptType === 'witness' ? 'Witness Report' : rptType === 'checklist' ? 'Panel Testing Checklist' : 'Internal Test Report',
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
