import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  TrendingUp,
  Users,
  Compass,
  Briefcase,
  Layers,
  ArrowUpRight,
  TrendingDown,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  getWorkforceSummary,
  getSuccessionPipeline,
  getFutureSkillForecasts,
} from '../api/workforceApi';

export function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'CAPACITY' | 'SUCCESSION' | 'TRENDS'>('CAPACITY');

  const summaryQuery = useQuery({
    queryKey: ['workforceSummary'],
    queryFn: getWorkforceSummary,
  });

  const successionQuery = useQuery({
    queryKey: ['successionPipeline'],
    queryFn: getSuccessionPipeline,
  });

  const forecastQuery = useQuery({
    queryKey: ['futureSkillForecasts'],
    queryFn: getFutureSkillForecasts,
  });

  const summary = summaryQuery.data;
  const succession = successionQuery.data?.successionPlans || [];
  const forecasts = forecastQuery.data?.forecasts || [];

  return (
    <div className="view-container">
      {/* Sub-navigation */}
      <section className="subnav-tabs">
        <button
          className={`subnav-tab ${activeTab === 'CAPACITY' ? 'active' : ''}`}
          onClick={() => setActiveTab('CAPACITY')}
        >
          <BarChart3 size={15} style={{ marginRight: 6, display: 'inline' }} />
          Department Capacity & Risk Dynamics
        </button>
        <button
          className={`subnav-tab ${activeTab === 'SUCCESSION' ? 'active' : ''}`}
          onClick={() => setActiveTab('SUCCESSION')}
        >
          <Compass size={15} style={{ marginRight: 6, display: 'inline' }} />
          Leadership Succession Pipeline
        </button>
        <button
          className={`subnav-tab ${activeTab === 'TRENDS' ? 'active' : ''}`}
          onClick={() => setActiveTab('TRENDS')}
        >
          <TrendingUp size={15} style={{ marginRight: 6, display: 'inline' }} />
          Longitudinal Attrition Telemetry
        </button>
      </section>

      {activeTab === 'CAPACITY' && (
        <section className="dashboard-grid" style={{ marginTop: '20px' }}>
          <article className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-eyebrow">Capacity Allocation</div>
                <h3 className="panel-title">Headcount by Business Unit</h3>
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary?.departmentRisks || []} margin={{ left: -10, right: 10, top: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="department" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Bar dataKey="employeeCount" fill="#20c997" radius={[6, 6, 0, 0]} name="Headcount" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-eyebrow">Strategic Horizon</div>
                <h3 className="panel-title">High-Growth Competency Forecast</h3>
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {forecasts.slice(0, 4).map((f) => (
                  <div
                    key={f.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 14px',
                      background: 'var(--bg-card)',
                      borderRadius: '8px',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text)' }}>{f.skill}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-soft)', marginTop: '2px' }}>
                        Current coverage: {f.currentCoverage}% • Projected 3Yr: {f.projected3YrDemand}%
                      </div>
                    </div>
                    <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '14px' }}>
                      +{f.growthRate}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </section>
      )}

      {activeTab === 'SUCCESSION' && (
        <section style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {succession.length === 0 && (
            <div className="panel" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-soft)' }}>
              No succession plans available.
            </div>
          )}
          {succession.map((plan: any) => {
            const isReady = plan.readinessTier === 'Ready Now';
            return (
              <article key={`${plan.roleTitle}-${plan.department}`} className="panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{plan.roleTitle}</h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-soft)' }}>
                      Current Incumbent: <strong>{plan.currentHolder}</strong> • {plan.department}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      backgroundColor: isReady
                        ? 'rgba(32, 201, 151, 0.15)'
                        : 'rgba(251, 191, 36, 0.15)',
                      color: isReady ? 'var(--primary)' : 'var(--warning)',
                      fontWeight: 600,
                    }}
                  >
                    {isReady ? 'Pipeline Ready' : plan.readinessTier}
                  </span>
                </div>

                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-soft)', marginBottom: '8px' }}>
                  IDENTIFIED SUCCESSOR
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '14px' }}>{plan.successorName}</span>
                      <strong style={{ color: 'var(--primary)' }}>{plan.readinessScore}% Ready</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-soft)', marginTop: '4px' }}>
                      Readiness Tier: {plan.readinessTier}
                      {plan.missingSkills && plan.missingSkills.length > 0 && (
                        <span> • Gaps: {plan.missingSkills.join(', ')}</span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {activeTab === 'TRENDS' && (
        <section className="panel" style={{ marginTop: '20px' }}>
          <div className="panel-header">
            <div>
              <div className="panel-eyebrow">Enterprise Telemetry</div>
              <h3 className="panel-title">Monthly Longitudinal Risk vs Benchmark</h3>
            </div>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary?.attritionTrend || []} margin={{ left: -10, right: 10, top: 10 }}>
                  <defs>
                    <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#20c997" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#20c997" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v: any) => [`${v}%`]} />
                  <Area
                    type="monotone"
                    dataKey="attritionRisk"
                    stroke="#20c997"
                    fill="url(#riskGrad)"
                    strokeWidth={2}
                    name="Enterprise Attrition Risk"
                  />
                  <Area
                    type="monotone"
                    dataKey="industryBenchmark"
                    stroke="#818cf8"
                    strokeDasharray="4 4"
                    fill="none"
                    strokeWidth={2}
                    name="Industry Benchmark"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
