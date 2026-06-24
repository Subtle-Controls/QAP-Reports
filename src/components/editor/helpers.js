// Utility functions for the editor
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export function createParam(desc) {
  return { id: uid(), desc, appl: true, status: '', value: '', design: '', remarks: '' }
}

export function countParams(section) {
  if (section.type === 'relay' && section.subGroups) {
    return section.subGroups.filter(sg => sg.enabled !== false).reduce((t, sg) => t + sg.params.length, 0)
  }
  return (section.params || []).length
}

export function countFilled(section) {
  let count = 0
  const check = (p) => { if (!p.appl || p.status !== '') count++ }
  if (section.type === 'relay' && section.subGroups) {
    section.subGroups.filter(sg => sg.enabled !== false).forEach(sg => sg.params.forEach(check))
  } else {
    (section.params || []).forEach(check)
  }
  return count
}

export function countByStatus(sections) {
  let ok = 0, nok = 0, na = 0, total = 0, filled = 0
  sections.filter(s => s.enabled).forEach(sec => {
    const check = (p) => {
      total++
      if (!p.appl) { na++; filled++ }
      else if (p.status === 'ok') { ok++; filled++ }
      else if (p.status === 'notok') { nok++; filled++ }
      else if (p.status === 'na') { na++; filled++ }
    }
    if (sec.type === 'relay' && sec.subGroups) {
      sec.subGroups.filter(sg => sg.enabled !== false).forEach(sg => sg.params.forEach(check))
    } else {
      (sec.params || []).forEach(check)
    }
  })
  return { ok, nok, na, total, filled, pct: total ? Math.round(filled / total * 100) : 0 }
}
