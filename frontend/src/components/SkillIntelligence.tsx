import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  CheckCircle,
  Clock,
  Compass,
  GraduationCap,
  Layers,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  getSkillGaps,
  getFutureSkillForecasts,
  type SkillGapItem,
  type FutureSkillForecastItem,
} from '../api/workforceApi';

export function SkillIntelligence() {
  const [activeTab, setActiveTab] = useState<'GAPS' | 'FORECASTING' | 'SKILL_MAP'>('GAPS');

  const gapsQuery = useQuery({
    queryKey: ['skillGaps'],
    queryFn: getSkillGaps,
  });

  const forecastQuery = useQuery({
    queryKey: ['futureForecasts'],
    queryFn: getFutureSkillForecasts,
  });

  const gaps = gapsQuery.data?.gaps || [];
  const forecasts = forecastQuery.data?.forecasts || [];

  return (
    <div className="view-container">
      {/* Sub-Navigation Tabs */}
      <section className="subnav-tabs">
        <button
          className={`subnav-tab ${activeTab === 'GAPS' ? 'active' : ''}`}
          onClick={() => setActiveTab('GAPS')}
        >
          <AlertTriangle size={15} style={{ marginRight: 6, display: 'inline' }} />
          Skill Gap Intelligence (Active Projects)
        </button>
        <button
          className={`subnav-tab ${activeTab === 'FORECASTING' ? 'active' : ''}`}
          onClick={() => setActiveTab('FORECASTING')}
        >
          <Sparkles size={15} style={{ marginRight: 6, display: 'inline' }} />
          Future Skill Forecasting (1Yr & 3Yr Demand)
        </button>
        <button
          className={`subnav-tab ${activeTab === 'SKILL_MAP' ? 'active' : ''}`}
          onClick={() => setActiveTab('SKILL_MAP')}
        >
          <Compass size={15} style={{ marginRight: 6, display: 'inline' }} />
          Organization Skill Map
        </button>
      </section>

      {/* TAB 1: SKILL GAPS */}
      {activeTab === 'GAPS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Project-Critical Skill Gap Analysis</h3>
              <p style={{ color: 'var(--text-soft)', fontSize: 13, marginTop: 2 }}>
                Cross-references active architectural projects against verified employee proficiency levels.
              </p>
            </div>
            <span className="workspace-badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
              {gapsQuery.data?.criticalGapsCount || 0} Critical Architectural Deficits
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            {gaps.map((gap, idx) => {
              const tierColor =
                gap.gapTier === 'CRITICAL' ? '#f87171' : gap.gapTier === 'HIGH' ? '#fb923c' : '#fcd34d';

              return (
                <article
                  key={idx}
                  className="panel"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    borderLeft: `4px solid ${tierColor}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{gap.skill}</div>
                    <span
                      className="risk-badge"
                      style={{
                        backgroundColor: `${tierColor}22`,
                        color: tierColor,
                        border: `1px solid ${tierColor}66`,
                      }}
                    >
                      {gap.gapTier} GAP • {gap.gapPercent}%
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: 8,
                      background: 'var(--bg-card)',
                      padding: '10px 14px',
                      borderRadius: 8,
                      textAlign: 'center',
                    }}
                  >
                    <div>
                      <span className="kpi-label">Required</span>
                      <strong style={{ fontSize: 16 }}>{gap.requiredHeadcount}</strong>
                    </div>
                    <div>
                      <span className="kpi-label">Qualified</span>
                      <strong style={{ fontSize: 16, color: 'var(--primary)' }}>{gap.availableHeadcount}</strong>
                    </div>
                    <div>
                      <span className="kpi-label">Net Deficit</span>
                      <strong style={{ fontSize: 16, color: '#f87171' }}>-{gap.deficit}</strong>
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>
                    <strong>Affected Projects: </strong>
                    {gap.affectedProjects.join(', ')}
                  </div>

                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    <strong>Recommended Action: </strong>
                    {gap.recommendedAction}
                  </div>

                  {gap.potentialCandidates.length > 0 && (
                    <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--border-soft)' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
                        Fast-Track Internal Upskilling Pipeline:
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {gap.potentialCandidates.map((c) => (
                          <span
                            key={c.employeeId}
                            className="workspace-badge"
                            style={{ fontSize: 11, padding: '2px 8px' }}
                          >
                            {c.name} ({c.department})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: FUTURE SKILL FORECASTING */}
      {activeTab === 'FORECASTING' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Strategic Future Skill Demand Forecasting</h3>
              <p style={{ color: 'var(--text-soft)', fontSize: 13, marginTop: 2 }}>
                Anticipate skill shifts 12 to 36 months in advance. Build internal talent before market scarcity drives cost.
              </p>
            </div>
            <span className="workspace-badge" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
              Multi-Year Architectural Horizon
            </span>
          </div>

          <div className="table-wrapper">
            <table className="strata-table">
              <thead>
                <tr>
                  <th>Future Skill Domain</th>
                  <th>Category</th>
                  <th>Current Coverage</th>
                  <th>Projected 1-Yr Demand</th>
                  <th>Projected 3-Yr Demand</th>
                  <th>YoY Growth Rate</th>
                  <th>Deficit Urgency</th>
                  <th>Strategic Rationale</th>
                </tr>
              </thead>
              <tbody>
                {forecasts.map((f) => (
                  <tr key={f.id}>
                    <td style={{ fontWeight: 700, color: 'var(--text)' }}>{f.skill}</td>
                    <td>
                      <span className="skill-badge">{f.category}</span>
                    </td>
                    <td>{f.currentCoverage}%</td>
                    <td>
                      <strong style={{ color: 'var(--cyan)' }}>{f.projected1YrDemand}%</strong>
                    </td>
                    <td>
                      <strong style={{ color: '#34d399' }}>{f.projected3YrDemand}%</strong>
                    </td>
                    <td>
                      <span style={{ color: '#34d399', fontWeight: 700, display: 'inline-flex', alignItems: 'center' }}>
                        <ArrowUpRight size={14} />
                        +{f.growthRate}%
                      </span>
                    </td>
                    <td>
                      <span
                        className={`risk-badge ${
                          f.gapTier === 'CRITICAL'
                            ? 'critical'
                            : f.gapTier === 'HIGH'
                            ? 'high'
                            : 'medium'
                        }`}
                      >
                        {f.gapTier}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-soft)', maxWidth: 300 }}>
                      {f.strategicRationale}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              background: 'var(--bg-panel)',
              border: '1px solid var(--border-soft)',
              padding: 16,
              borderRadius: 12,
              fontSize: 12,
              color: 'var(--text-muted)',
            }}
          >
            <strong>Forecasting Methodology Disclaimer: </strong>
            {forecastQuery.data?.methodology}
          </div>
        </div>
      )}

      {/* TAB 3: ORGANIZATION SKILL MAP */}
      {activeTab === 'SKILL_MAP' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Organization-Wide Skill Taxonomy Map</h3>
            <p style={{ color: 'var(--text-soft)', fontSize: 13, marginTop: 2 }}>
              Inventory of 23 canonical technical and leadership skills across the enterprise.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              {
                category: 'AI & Machine Learning',
                skills: ['Machine Learning', 'Generative AI', 'PyTorch', 'MLOps'],
                status: 'High Growth',
                color: '#34d399',
              },
              {
                category: 'Cloud & Infrastructure',
                skills: ['AWS', 'Azure', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD'],
                status: 'Core Foundation',
                color: '#38bdf8',
              },
              {
                category: 'Cybersecurity',
                skills: ['Cloud Security', 'Zero Trust Architecture'],
                status: 'High Urgency',
                color: '#f87171',
              },
              {
                category: 'Programming Languages',
                skills: ['Python', 'TypeScript', 'Go', 'SQL'],
                status: 'Stable',
                color: '#818cf8',
              },
              {
                category: 'Frameworks & Web',
                skills: ['React', 'FastAPI', 'Node.js'],
                status: 'Active',
                color: '#fcd34d',
              },
              {
                category: 'Leadership & Strategy',
                skills: ['Executive Communication', 'Engineering Leadership', 'Agile / Scrum'],
                status: 'Cross-Org',
                color: '#f472b6',
              },
            ].map((cat, idx) => (
              <div key={idx} className="panel" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700 }}>{cat.category}</h4>
                  <span
                    className="workspace-badge"
                    style={{ backgroundColor: `${cat.color}22`, color: cat.color }}
                  >
                    {cat.status}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {cat.skills.map((s, sIdx) => (
                    <div key={sIdx} className="skill-badge">
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
