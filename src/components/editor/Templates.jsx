import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase.js'
import { uid } from './helpers'

export default function TemplateManager({ sections, onLoadTemplate, onClose }) {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [saveName, setSaveName] = useState('')
  const [saveDesc, setSaveDesc] = useState('')
  const [showSave, setShowSave] = useState(false)

  useEffect(() => { fetchTemplates() }, [])

  async function fetchTemplates() {
    setLoading(true)
    try {
      // Fetch from Supabase first
      const { data, error } = await supabase.from('qap_templates').select('*').order('created_at', { ascending: false })
      if (!error && data && data.length > 0) {
        const tpls = data.map(row => row.data || row)
        setTemplates(tpls)
        // Also cache in localStorage
        localStorage.setItem('qap_templates', JSON.stringify(tpls))
      } else {
        // Fallback to localStorage
        const saved = JSON.parse(localStorage.getItem('qap_templates') || '[]')
        setTemplates(saved)
      }
    } catch {
      const saved = JSON.parse(localStorage.getItem('qap_templates') || '[]')
      setTemplates(saved)
    }
    setLoading(false)
  }

  async function saveTemplate() {
    if (!saveName.trim()) return
    const tpl = { id: uid(), name: saveName.trim(), description: saveDesc.trim(), sections: JSON.parse(JSON.stringify(sections)), createdAt: new Date().toISOString() }
    const all = [...templates, tpl]
    localStorage.setItem('qap_templates', JSON.stringify(all))
    setTemplates(all)
    // Save to Supabase
    supabase.from('qap_templates').upsert({ id: tpl.id, data: tpl, name: tpl.name, created_at: tpl.createdAt }, { onConflict: 'id' }).then(({ error }) => {
      if (error) console.warn('[QAP] Template save error:', error.message)
    })
    setSaveName(''); setSaveDesc(''); setShowSave(false)
  }

  async function deleteTemplate(id) {
    if (!confirm('Delete this template?')) return
    const all = templates.filter(t => t.id !== id)
    localStorage.setItem('qap_templates', JSON.stringify(all))
    setTemplates(all)
    // Delete from Supabase
    supabase.from('qap_templates').delete().eq('id', id).then(({ error }) => {
      if (error) console.warn('[QAP] Template delete error:', error.message)
    })
  }

  function loadTemplate(tpl) {
    if (confirm(`Load template "${tpl.name}"? This will replace current sections.`)) {
      onLoadTemplate(tpl.sections)
      onClose()
    }
  }

  return (
    <div className="ed-modal-bg" onClick={onClose}>
      <div className="ed-modal" style={{maxWidth:560,maxHeight:'80vh',overflow:'auto'}} onClick={e=>e.stopPropagation()}>
        <h3>📋 Report Templates</h3>
        
        {!showSave ? (
          <button className="ed-btn ed-btn-navy" style={{marginBottom:14}} onClick={()=>setShowSave(true)}>+ Save Current as Template</button>
        ) : (
          <div style={{background:'var(--bg)',borderRadius:8,padding:12,marginBottom:14,border:'1px solid var(--border)'}}>
            <div style={{marginBottom:8}}><label style={{fontSize:10,fontWeight:700,color:'var(--text-3)',textTransform:'uppercase'}}>Template Name *</label><input value={saveName} onChange={e=>setSaveName(e.target.value)} placeholder="e.g. Hydro PLC Panel Standard" style={{width:'100%',padding:'8px 10px',border:'1px solid var(--border)',borderRadius:6,fontSize:13,marginTop:4}}/></div>
            <div style={{marginBottom:8}}><label style={{fontSize:10,fontWeight:700,color:'var(--text-3)',textTransform:'uppercase'}}>Description</label><textarea value={saveDesc} onChange={e=>setSaveDesc(e.target.value)} placeholder="What this template is for..." rows={2} style={{width:'100%',padding:'8px 10px',border:'1px solid var(--border)',borderRadius:6,fontSize:12,marginTop:4,resize:'vertical'}}/></div>
            <div style={{display:'flex',gap:8}}><button className="ed-btn ed-btn-green" onClick={saveTemplate}>Save Template</button><button className="ed-btn ed-btn-outline" onClick={()=>setShowSave(false)}>Cancel</button></div>
          </div>
        )}

        {loading ? <div style={{padding:20,textAlign:'center',color:'var(--text-3)'}}>Loading...</div> :
          templates.length === 0 ? <div style={{padding:20,textAlign:'center',color:'var(--text-3)'}}>No templates saved yet. Save your current report sections as a template.</div> :
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {templates.map(tpl => (
              <div key={tpl.id} style={{border:'1px solid var(--border)',borderRadius:8,padding:'12px 14px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{fontWeight:600,fontSize:13}}>{tpl.name}</div>
                  {tpl.description && <div style={{fontSize:11,color:'var(--text-3)',marginTop:2}}>{tpl.description}</div>}
                  <div style={{fontSize:10,color:'var(--text-3)',marginTop:3}}>{tpl.sections?.length||0} sections · {new Date(tpl.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={{display:'flex',gap:6}}>
                  <button className="ed-btn ed-btn-navy" style={{fontSize:10,padding:'4px 10px'}} onClick={()=>loadTemplate(tpl)}>Load</button>
                  <button className="ed-btn ed-btn-outline" style={{fontSize:10,padding:'4px 10px',color:'#dc2626'}} onClick={()=>deleteTemplate(tpl.id)}>×</button>
                </div>
              </div>
            ))}
          </div>
        }

        <div style={{marginTop:14,display:'flex',justifyContent:'flex-end'}}><button className="ed-btn ed-btn-outline" onClick={onClose}>Close</button></div>
      </div>
    </div>
  )
}
