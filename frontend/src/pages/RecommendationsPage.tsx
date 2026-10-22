import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Briefcase,
  CheckCircle,
  Clock,
  Filter,
  GraduationCap,
  Sparkles,
  UserCheck,
  Users,
  ChevronRight,
  TrendingDown,
  Info,
} from 'lucide-react';
import {
  getRecommendations,
  updateRecommendationStatus,
  type RecommendationRecord,
} from '../api/workforceApi';

export function RecommendationsPage() {
  const queryClient = useQueryClient();
  const [filterDept, setFilterDept] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const { data: recsResponse, isLoading } = useQuery({
    queryKey: ['recommendations', filterPriority],
    queryFn: () =>
      getRecommendations({
        priority: filterPriority !== 'All' ? filterPriority : undefined,
      }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateRecommendationStatus(id, status),
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      setActionMessage(`Recommendation #${vars.id} status updated to ${vars.status}.`);
      setTimeout(() => setActionMessage(null), 3000);
    },
  });

  const recommendations = recsResponse?.data || [];

  const filteredRecs = recommendations.filter((rec) => {
    const matchesDept = filterDept === 'All' || rec.department === filterDept;
    const matchesType = filterType === 'All' || rec.type === filterType;
    return matchesDept && matchesType;
  });

  return (
    <div className="view-container">
      {/* Informational ethics standard */}
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
        <Info size={22} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '14px' }}>
            Evidence-Based Workforce Recommendations Engine
          </div>
          <div style={{ color: 'var(--text-soft)', fontSize: '13px', marginTop: '4px', lineHeight: 1.5 }}>
            Recommendations are synthesized using transparent rule sets combining department skill gaps, workload hours, and compensation parity. All suggested interventions require authorized human review before execution.
          </div>
        </div>
      </section>

      {actionMessage && (
        <div style={{ padding: '12px 16px', background: 'rgba(32, 201, 151, 0.15)', color: 'var(--primary)', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
          {actionMessage}
        </div>
      )}

      {/* Filter bar */}
      <section className="search-filter-bar" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-soft)', marginRight: '6px' }}>Department:</label>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Finance">Finance</option>
              <option value="HR">HR</option>
              <option value="Sales">Sales</option>
              <option value="Support">Support</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-soft)', marginRight: '6px' }}>Priority:</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-soft)', marginRight: '6px' }}>Intervention Type:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            >
              <option value="All">All Intervention Types</option>
              <option value="Role Transition">Role Transition (Internal Mobility)</option>
              <option value="Compensation">Compensation</option>
              <option value="Upskilling">Upskilling</option>
              <option value="Workload">Workload</option>
              <option value="Mentorship">Mentorship</option>
            </select>
          </div>
        </div>
      </section>

      {isLoading && <div style={{ color: 'var(--text-soft)', padding: '20px' }}>Loading recommendations...</div>}

      {/* Recommendations Cards Grid */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredRecs.map((rec) => (
          <article
            key={rec.id}
            className="panel"
            style={{
              padding: '20px',
              borderLeft: `4px solid ${
                rec.priority === 'Critical'
                  ? 'var(--danger)'
                  : rec.priority === 'High'
                  ? 'var(--warning)'
                  : 'var(--primary)'
              }`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor:
                        rec.priority === 'Critical'
                          ? 'rgba(239, 68, 68, 0.2)'
                          : rec.priority === 'High'
                          ? 'rgba(251, 191, 36, 0.2)'
                          : 'rgba(32, 201, 151, 0.2)',
                      color:
                        rec.priority === 'Critical'
                          ? '#f87171'
                          : rec.priority === 'High'
                          ? '#fbbf24'
                          : 'var(--primary)',
                    }}
                  >
                    {rec.priority}
                  </span>
                  {rec.type === 'Role Transition' && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(129, 140, 248, 0.2)',
                        color: '#818cf8',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Briefcase size={12} />
                      Internal Mobility
                    </span>
                  )}
                  <span style={{ fontSize: '12px', color: 'var(--text-soft)' }}>
                    Target: <strong>{rec.employeeName}</strong> ({rec.employeeNumber}) • {rec.department}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>• Status: {rec.status}</span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)' }}>{rec.title}</h3>
                <p style={{ color: 'var(--text-soft)', fontSize: '13px', marginTop: '6px', maxWidth: '800px', lineHeight: 1.5 }}>
                  {rec.description}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-soft)' }}>Estimated Risk Reduction</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>
                  -{rec.estimatedRiskReduction}%
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '16px',
                paddingTop: '14px',
                borderTop: '1px solid var(--border)',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', gap: '18px', fontSize: '12px', color: 'var(--text-soft)' }}>
                <span>Intervention Type: <strong>{rec.type}</strong></span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {rec.status !== 'Resolved' && (
                  <button
                    className="ghost-button"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                    onClick={() => statusMutation.mutate({ id: rec.id, status: 'In Progress' })}
                  >
                    Mark In Progress
                  </button>
                )}
                {rec.status !== 'Resolved' && (
                  <button
                    className="primary-button"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                    onClick={() => statusMutation.mutate({ id: rec.id, status: 'Resolved' })}
                  >
                    Resolve Intervention
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
