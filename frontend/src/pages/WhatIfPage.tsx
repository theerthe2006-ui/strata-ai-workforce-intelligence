import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { WhatIfSimulator } from '../components/WhatIfSimulator';
import { WorkforceDigitalTwin } from '../components/WorkforceDigitalTwin';
import { Zap, Cpu, Info } from 'lucide-react';

export function WhatIfPage() {
  const [searchParams] = useSearchParams();
  const initialEmployeeId = searchParams.get('employeeId') || 'EMP-104';
  const [mode, setMode] = useState<'INDIVIDUAL' | 'MACRO_TWIN'>('INDIVIDUAL');

  return (
    <div className="view-container">
      {/* Sub-nav switch */}
      <section className="subnav-tabs">
        <button
          className={`subnav-tab ${mode === 'INDIVIDUAL' ? 'active' : ''}`}
          onClick={() => setMode('INDIVIDUAL')}
        >
          <Zap size={15} style={{ marginRight: 6, display: 'inline' }} />
          Individual Employee Retention Simulator
        </button>
        <button
          className={`subnav-tab ${mode === 'MACRO_TWIN' ? 'active' : ''}`}
          onClick={() => setMode('MACRO_TWIN')}
        >
          <Cpu size={15} style={{ marginRight: 6, display: 'inline' }} />
          Workforce Digital Twin (Macro Shock Simulation)
        </button>
      </section>

      {/* Disclaimers & Ethics */}
      <section
        style={{
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start',
        }}
      >
        <Info size={22} style={{ color: '#38bdf8', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontWeight: 600, color: '#e0f2fe', fontSize: '14px' }}>
            Transparent Scenario Modeling & Uncertainty Disclosure
          </div>
          <div style={{ color: 'var(--text-soft)', fontSize: '13px', marginTop: '4px', lineHeight: 1.5 }}>
            Simulations evaluate sensitivity under hypothetical parameter shifts (e.g. compa-ratio adjustments, overtime reductions, upskilling waves). These results illustrate potential directional outcomes and do not claim to forecast certain futures.
          </div>
        </div>
      </section>

      {mode === 'INDIVIDUAL' ? (
        <WhatIfSimulator initialEmployeeId={initialEmployeeId} />
      ) : (
        <WorkforceDigitalTwin />
      )}
    </div>
  );
}
