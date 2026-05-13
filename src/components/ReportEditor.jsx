import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

export default function ReportEditor({ reportId, onBack }) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const [formData, setFormData] = useState({
    id: '',
    customer: '',
    project_name: '',
    project_no: '',
    po_no: '',
    date: '',
    supplier: '',
    place: '',
    item: '',
    drawing: '',
    reference_docs: '',
    units: '',
    unit1_sn: '',
    unit2_sn: '',
    report_type: 'Internal Test Report',
    status: 'In Progress',
    conclusion: '',
    inspector_name: '',
    inspector_designation: '',
    inspector_date: '',
    reviewer_name: '',
    reviewer_designation: '',
    reviewer_date: ''
  })

  useEffect(() => {
    // Check URL params for Subtle OS integration
    const params = new URLSearchParams(window.location.search)
    const urlReportId = params.get('reportId')
    const urlCustomer = params.get('customer')
    const urlProjName = params.get('projName')
    const urlProjNo = params.get('projNo')
    const urlPoNo = params.get('poNo')
    const urlDate = params.get('date')
    const urlSupplier = params.get('supplier')
    const urlPlace = params.get('place')
    const urlItem = params.get('item')
    const urlRptType = params.get('rptType')

    if (urlReportId) {
      loadReport(urlReportId)
    } else if (reportId) {
      loadReport(reportId)
    } else {
      // Pre-fill from URL params if creating new
      const newId = 'qap_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
      setFormData(prev => ({
        ...prev,
        id: newId,
        customer: urlCustomer || '',
        project_name: urlProjName || '',
        project_no: urlProjNo || '',
        po_no: urlPoNo || '',
        date: urlDate || '',
        supplier: urlSupplier || '',
        place: urlPlace || '',
        item: urlItem || '',
        report_type: urlRptType || 'Internal Test Report'
      }))
    }
  }, [reportId])

  async function loadReport(id) {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('qap_reports')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      if (data) {
        const reportData = data.data || {}
        setFormData({
          id: data.id,
          customer: data.customer || '',
          project_name: data.project_name || '',
          project_no: data.project_no || '',
          po_no: reportData.po_no || '',
          date: reportData.date || '',
          supplier: reportData.supplier || '',
          place: reportData.place || '',
          item: reportData.item || '',
          drawing: reportData.drawing || '',
          reference_docs: reportData.reference_docs || '',
          units: reportData.units || '',
          unit1_sn: reportData.unit1_sn || '',
          unit2_sn: reportData.unit2_sn || '',
          report_type: data.report_type || 'Internal Test Report',
          status: data.status || 'In Progress',
          conclusion: reportData.conclusion || '',
          inspector_name: reportData.inspector_name || '',
          inspector_designation: reportData.inspector_designation || '',
          inspector_date: reportData.inspector_date || '',
          reviewer_name: reportData.reviewer_name || '',
          reviewer_designation: reportData.reviewer_designation || '',
          reviewer_date: reportData.reviewer_date || ''
        })
      }
    } catch (err) {
      console.error('Error loading report:', err)
      alert('Failed to load report.')
    } finally {
      setLoading(false)
    }
  }

  async function saveReport(e) {
    e.preventDefault()
    setSaving(true)

    try {
      const now = new Date().toISOString()
      const record = {
        id: formData.id,
        project_id: formData.project_no,
        project_no: formData.project_no,
        project_name: formData.project_name,
        customer: formData.customer,
        report_type: formData.report_type,
        status: formData.status,
        data: {
          po_no: formData.po_no,
          date: formData.date,
          supplier: formData.supplier,
          place: formData.place,
          item: formData.item,
          drawing: formData.drawing,
          reference_docs: formData.reference_docs,
          units: formData.units,
          unit1_sn: formData.unit1_sn,
          unit2_sn: formData.unit2_sn,
          conclusion: formData.conclusion,
          inspector_name: formData.inspector_name,
          inspector_designation: formData.inspector_designation,
          inspector_date: formData.inspector_date,
          reviewer_name: formData.reviewer_name,
          reviewer_designation: formData.reviewer_designation,
          reviewer_date: formData.reviewer_date
        },
        updated_at: now
      }

      // If new report, set created_at
      if (!reportId) {
        record.created_at = now
      }

      const { error } = await supabase
        .from('qap_reports')
        .upsert(record, { onConflict: 'id' })

      if (error) throw error

      showToast('Report saved successfully!')
    } catch (err) {
      console.error('Error saving report:', err)
      alert('Failed to save report. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  function showToast(message) {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  function handleChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return <div className="loading">Loading report...</div>
  }

  return (
    <div className="report-editor">
      {toast && <div className="toast">{toast}</div>}

      <div className="editor-header">
        <button className="btn btn-outline" onClick={onBack}>← Back to Reports</button>
        <h1>{reportId ? 'Edit Report' : 'New Report'}</h1>
      </div>

      <form onSubmit={saveReport}>
        {/* Report Type Toggle */}
        <div className="card">
          <h2>Report Type</h2>
          <div className="report-type-toggle">
            <button
              type="button"
              className={`toggle-btn ${formData.report_type === 'Internal Test Report' ? 'active' : ''}`}
              onClick={() => handleChange('report_type', 'Internal Test Report')}
            >
              Internal Test Report
            </button>
            <button
              type="button"
              className={`toggle-btn ${formData.report_type === 'Witness Report' ? 'active' : ''}`}
              onClick={() => handleChange('report_type', 'Witness Report')}
            >
              Witness Report
            </button>
          </div>
        </div>

        {/* Project Details */}
        <div className="card">
          <h2>Project Details</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Customer</label>
              <input type="text" value={formData.customer} onChange={e => handleChange('customer', e.target.value)} placeholder="Customer name" />
            </div>
            <div className="form-group">
              <label>Project Name</label>
              <input type="text" value={formData.project_name} onChange={e => handleChange('project_name', e.target.value)} placeholder="Project name" />
            </div>
            <div className="form-group">
              <label>Project No</label>
              <input type="text" value={formData.project_no} onChange={e => handleChange('project_no', e.target.value)} placeholder="Project number" />
            </div>
            <div className="form-group">
              <label>PO No</label>
              <input type="text" value={formData.po_no} onChange={e => handleChange('po_no', e.target.value)} placeholder="Purchase order number" />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={formData.date} onChange={e => handleChange('date', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Supplier</label>
              <input type="text" value={formData.supplier} onChange={e => handleChange('supplier', e.target.value)} placeholder="Supplier name" />
            </div>
            <div className="form-group">
              <label>Place</label>
              <input type="text" value={formData.place} onChange={e => handleChange('place', e.target.value)} placeholder="Location" />
            </div>
            <div className="form-group">
              <label>Item</label>
              <input type="text" value={formData.item} onChange={e => handleChange('item', e.target.value)} placeholder="Item description" />
            </div>
            <div className="form-group">
              <label>Drawing</label>
              <input type="text" value={formData.drawing} onChange={e => handleChange('drawing', e.target.value)} placeholder="Drawing reference" />
            </div>
            <div className="form-group">
              <label>Reference Docs</label>
              <input type="text" value={formData.reference_docs} onChange={e => handleChange('reference_docs', e.target.value)} placeholder="Reference documents" />
            </div>
            <div className="form-group">
              <label>Units</label>
              <input type="text" value={formData.units} onChange={e => handleChange('units', e.target.value)} placeholder="Number of units" />
            </div>
            <div className="form-group">
              <label>Unit 1 SN</label>
              <input type="text" value={formData.unit1_sn} onChange={e => handleChange('unit1_sn', e.target.value)} placeholder="Unit 1 serial number" />
            </div>
            <div className="form-group">
              <label>Unit 2 SN</label>
              <input type="text" value={formData.unit2_sn} onChange={e => handleChange('unit2_sn', e.target.value)} placeholder="Unit 2 serial number" />
            </div>
          </div>
        </div>

        {/* Status & Conclusion */}
        <div className="card">
          <h2>Status & Conclusion</h2>
          <div className="form-group">
            <label>Status</label>
            <select value={formData.status} onChange={e => handleChange('status', e.target.value)}>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="form-group">
            <label>Conclusion</label>
            <textarea
              value={formData.conclusion}
              onChange={e => handleChange('conclusion', e.target.value)}
              placeholder="Enter test conclusion and remarks..."
              rows={4}
            />
          </div>
        </div>

        {/* Sign-off */}
        <div className="card">
          <h2>Sign-off</h2>
          <div className="signoff-grid">
            <div className="signoff-section">
              <h3>Inspector</h3>
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={formData.inspector_name} onChange={e => handleChange('inspector_name', e.target.value)} placeholder="Inspector name" />
              </div>
              <div className="form-group">
                <label>Designation</label>
                <input type="text" value={formData.inspector_designation} onChange={e => handleChange('inspector_designation', e.target.value)} placeholder="Designation" />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={formData.inspector_date} onChange={e => handleChange('inspector_date', e.target.value)} />
              </div>
            </div>
            <div className="signoff-section">
              <h3>Reviewer</h3>
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={formData.reviewer_name} onChange={e => handleChange('reviewer_name', e.target.value)} placeholder="Reviewer name" />
              </div>
              <div className="form-group">
                <label>Designation</label>
                <input type="text" value={formData.reviewer_designation} onChange={e => handleChange('reviewer_designation', e.target.value)} placeholder="Designation" />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={formData.reviewer_date} onChange={e => handleChange('reviewer_date', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="editor-actions">
          <button type="button" className="btn btn-outline" onClick={onBack}>Back to Reports</button>
          <button type="submit" className="btn btn-green btn-lg" disabled={saving}>
            {saving ? 'Saving...' : 'Save Report'}
          </button>
        </div>
      </form>
    </div>
  )
}
