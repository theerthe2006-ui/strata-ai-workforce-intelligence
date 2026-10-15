import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  ShieldAlert,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { getWorkforceAlerts, markAlertRead, type WorkforceAlertItem } from '../api/workforceApi';

export function AlertsPage() {
  const queryClient = useQueryClient();
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterRead, setFilterRead] = useState('All');

  const { data, isLoading } = useQuery({
    queryKey: ['workforceAlerts'],
    queryFn: getWorkforceAlerts,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: number) => markAlertRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workforceAlerts'] });
    },
  });

  const alerts = data?.alerts || [];

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity = filterSeverity === 'All' || alert.severity === filterSeverity;
    const matchesRead =
      filterRead === 'All'
        ? true
        : filterRead === 'UNREAD'
        ? !alert.isRead
        : alert.isRead;
    return matchesSeverity && matchesRead;
  });

  return (
    <div className="view-container">
      {/* Early Warning System Banner */}
      <section
        style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start',
        }}
      >
        <ShieldAlert size={22} style={{ color: '#f87171', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontWeight: 600, color: '#fee2e2', fontSize: '14px' }}>
            Workforce Early Warning Telemetry
          </div>
          <div style={{ color: 'var(--text-soft)', fontSize: '13px', marginTop: '4px', lineHeight: 1.5 }}>
            Automated alerts flag critical talent shifts, skill bottleneck deficits on active project sprints, and elevated risk scores requiring administrative review.
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="search-filter-bar" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-soft)', marginRight: '6px' }}>Severity:</label>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            >
              <option value="All">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-soft)', marginRight: '6px' }}>Status:</label>
            <select
              value={filterRead}
              onChange={(e) => setFilterRead(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            >
              <option value="All">All Alerts</option>
              <option value="UNREAD">Unread Only</option>
              <option value="READ">Resolved / Read</option>
            </select>
          </div>
        </div>
      </section>

      {/* Alerts Feed */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {isLoading && <div style={{ color: 'var(--text-soft)', padding: '20px' }}>Loading alerts...</div>}
        {!isLoading && filteredAlerts.length === 0 && (
          <div className="panel" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-soft)' }}>
            <CheckCircle2 size={36} style={{ color: 'var(--primary)', margin: '0 auto 12px' }} />
            <div>No alerts matching the selected filter criteria.</div>
          </div>
        )}
        {filteredAlerts.map((alert) => (
          <article
            key={alert.id}
            className="panel"
            style={{
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              opacity: alert.isRead ? 0.65 : 1,
              backgroundColor: alert.isRead ? 'var(--bg-panel)' : 'var(--bg-card)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  backgroundColor:
                    alert.severity === 'CRITICAL'
                      ? 'rgba(239, 68, 68, 0.15)'
                      : alert.severity === 'HIGH'
                      ? 'rgba(251, 191, 36, 0.15)'
                      : 'rgba(56, 189, 248, 0.15)',
                  color:
                    alert.severity === 'CRITICAL'
                      ? '#f87171'
                      : alert.severity === 'HIGH'
                      ? '#fbbf24'
                      : '#38bdf8',
                }}
              >
                {alert.severity === 'CRITICAL' ? <ShieldAlert size={20} /> : <AlertTriangle size={20} />}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    {alert.severity}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-soft)' }}>{alert.type}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>• {alert.createdAt}</span>
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>{alert.title}</h4>
                <p style={{ color: 'var(--text-soft)', fontSize: '13px', marginTop: '4px' }}>
                  {alert.description}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {!alert.isRead && (
                <button
                  className="ghost-button"
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                  onClick={() => markReadMutation.mutate(alert.id)}
                >
                  Mark as Read
                </button>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
