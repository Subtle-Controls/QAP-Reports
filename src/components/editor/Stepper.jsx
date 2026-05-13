import React from 'react'

const STEPS = ['Project Details', 'Section Setup', 'Inspection Checks', 'Conclusion & Sign-off', 'Generate Report']

export default function Stepper({ step, setStep }) {
  return (
    <div className="ed-stepper">
      {STEPS.map((label, i) => {
        const n = i + 1
        const isActive = step === n
        const isDone = step > n
        return (
          <React.Fragment key={n}>
            <div className={`ed-step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`} onClick={() => setStep(n)}>
              <div className="ed-step-num">{isDone ? '✓' : n}</div>
              <span className="ed-step-label">{label}</span>
            </div>
            {n < 5 && <span className="ed-step-arr">›</span>}
          </React.Fragment>
        )
      })}
    </div>
  )
}
