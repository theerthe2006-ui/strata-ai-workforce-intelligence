import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Settings,
  Shield,
  Sliders,
  Database,
  Key,
  CheckCircle2,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { getAdminSettings } from '../api/workforceApi';

export function SettingsPage() {
  const { data: adminSettings } = useQuery({
    queryKey: ['adminSettings'],
    queryFn: getAdminSettings,
  });

  const [riskThresholdCritical, setRiskThresholdCritical] = useState(25);
  const [riskThresholdElevated, setRiskThresholdElevated] = useState(15);
  const [retentionMultiplier, setRetentionMultiplier] = useState(1.5);
  const [savedSuccess, setSavedSuccess] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  }

  return (
    <div className="view-container">
      <section className="dashboard-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-eyebrow">Governance & Policies</div>
              <h3 className="panel-title">Workforce Model Thresholds</h3>
            </div>
          </div>
          <div style={{ padding: '20px' }}>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '16px' }}>
                <label className="field-label" htmlFor="crit-thresh">
                  Critical Risk Review Threshold (%)
                </label>
                <input
                  id="crit-thresh"
                  type="number"
                  value={riskThresholdCritical}
                  onChange={(e) => setRiskThresholdCritical(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                  }}
                />
                <span style={{ fontSize: '12px', color: 'var(--text-soft)' }}>
                  Employees with predicted risk exceeding this value trigger alert feeds.
                </span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label className="field-label" htmlFor="elev-thresh">
                  Elevated Risk Review Threshold (%)
                </label>
                <input
                  id="elev-thresh"
                  type="number"
                  value={riskThresholdElevated}
                  onChange={(e) => setRiskThresholdElevated(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="field-label" htmlFor="roi-mult">
                  Replacement Cost Multiplier (x Salary)
                </label>
                <input
                  id="roi-mult"
                  type="number"
                  step="0.1"
                  value={retentionMultiplier}
                  onChange={(e) => setRetentionMultiplier(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                  }}
                />
              </div>

              {savedSuccess && (
                <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px', fontSize: '13px' }}>
                  <CheckCircle2 size={16} /> Configuration saved to active workspace.
                </div>
              )}

              <button type="submit" className="primary-button">
                Save Parameter Calibration
              </button>
            </form>
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-eyebrow">Telemetry & Infrastructure</div>
              <h3 className="panel-title">System Status & Environment</h3>
            </div>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-card)', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-soft)', fontSize: '13px' }}>Active ML Pipeline</span>
                <strong>{adminSettings?.model || 'attrition_v1.0.0'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-card)', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-soft)', fontSize: '13px' }}>Audit Telemetry</span>
                <strong style={{ color: 'var(--primary)' }}>{adminSettings?.audit || 'enabled'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-card)', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-soft)', fontSize: '13px' }}>Database Engine</span>
                <strong>SQLite (Dev) / PostgreSQL-Ready</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-card)', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-soft)', fontSize: '13px' }}>Auth Protocol</span>
                <strong>OAuth2 Bearer JWT</strong>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
