import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, Lock, Activity, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../layout/AuthContext';
import { getAuditLogs, type AuditLogEntry } from '../api/workforceApi';

export function AuditLogPage() {
  const { session } = useAuth();

  const { data: logsResponse, isLoading } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: getAuditLogs,
  });

  const auditEvents = logsResponse?.data || [];

  return (
    <div className="view-container">
      {/* Header Banner */}
      <section
        style={{
          background: 'rgba(32, 201, 151, 0.08)',
          border: '1px solid rgba(32, 201, 151, 0.25)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start',
        }}
      >
        <ShieldCheck size={22} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '14px' }}>
            Immutable Security & Compliance Audit Trail
          </div>
          <div style={{ color: 'var(--text-soft)', fontSize: '13px', marginTop: '4px', lineHeight: 1.5 }}>
            Access restricted to authorized Administrative and HR Compliance personnel. All authentication events, resume processing runs, prediction model lookups, and parameter updates are cryptographically hashed and logged.
          </div>
        </div>
      </section>

      {/* Audit Log Table */}
      <section className="panel">
        <div className="panel-header">
          <div>
            <div className="panel-eyebrow">Enterprise Telemetry</div>
            <h3 className="panel-title">Recent Security & Intelligence Operations</h3>
          </div>
        </div>

        <div style={{ overflowX: 'auto', padding: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-soft)' }}>
                <th style={{ padding: '10px 12px' }}>Event ID</th>
                <th style={{ padding: '10px 12px' }}>Timestamp</th>
                <th style={{ padding: '10px 12px' }}>Actor</th>
                <th style={{ padding: '10px 12px' }}>Role</th>
                <th style={{ padding: '10px 12px' }}>Action</th>
                <th style={{ padding: '10px 12px' }}>Target Resource</th>
                <th style={{ padding: '10px 12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {auditEvents.map((evt) => (
                <tr key={evt.id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{evt.id}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-soft)' }}>{evt.timestamp}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{evt.actor}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ fontSize: '11px', padding: '2px 6px', background: 'var(--bg-card)', borderRadius: '4px' }}>
                      {evt.role}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>{evt.action}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-soft)' }}>{evt.target}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor:
                          evt.status === 'SUCCESS'
                            ? 'rgba(32, 201, 151, 0.2)'
                            : 'rgba(239, 68, 68, 0.2)',
                        color: evt.status === 'SUCCESS' ? 'var(--primary)' : '#f87171',
                      }}
                    >
                      {evt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
