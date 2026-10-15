import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getWorkforceSummary } from '../api/workforceApi';
import { ExecutiveCommandCenter } from '../components/ExecutiveCommandCenter';

export function DashboardPage() {
  const navigate = useNavigate();

  const { data: summary, isLoading, isError, error } = useQuery({
    queryKey: ['workforceSummary'],
    queryFn: getWorkforceSummary,
  });

  function handleNavigate(tab: string, employeeId?: string) {
    if (tab === 'employees') {
      navigate('/employees');
    } else if (tab === 'skills') {
      navigate('/skill-mapping');
    } else if (tab === 'whatif') {
      navigate(employeeId ? `/what-if?employeeId=${employeeId}` : '/what-if');
    } else if (tab === 'reports') {
      navigate('/reports');
    }
  }

  if (isError) {
    return (
      <div className="view-container" style={{ padding: '40px 20px' }}>
        <div className="panel" style={{ textAlign: 'center', borderColor: 'var(--danger)' }}>
          <h3 style={{ color: 'var(--danger)', marginBottom: '8px' }}>Failed to Load Workforce Telemetry</h3>
          <p style={{ color: 'var(--text-soft)', marginBottom: '16px' }}>
            {error instanceof Error ? error.message : 'Unable to connect to the backend analytics service.'}
          </p>
          <button className="primary-button" onClick={() => window.location.reload()}>
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <ExecutiveCommandCenter
      summary={summary}
      isLoading={isLoading}
      onNavigate={handleNavigate}
    />
  );
}
