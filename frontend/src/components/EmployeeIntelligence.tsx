import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Briefcase,
  CheckCircle,
  ChevronRight,
  Clock,
  DollarSign,
  GraduationCap,
  HelpCircle,
  Search,
  Sliders,
  TrendingDown,
  TrendingUp,
  User,
  X,
  Zap,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  getEmployees,
  getEmployeeDetail,
  type EmployeeListItem,
  type EmployeeDetailResponse,
} from '../api/workforceApi';

interface EmployeeIntelligenceProps {
  initialEmployeeId?: string;
  onNavigateWhatIf: (employeeId: string) => void;
}

export function EmployeeIntelligence({
  initialEmployeeId,
  onNavigateWhatIf,
}: EmployeeIntelligenceProps) {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [riskTier, setRiskTier] = useState('All');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(initialEmployeeId || null);

  const employeesQuery = useQuery({
    queryKey: ['employees', search, department, riskTier, page],
    queryFn: () =>
      getEmployees({
        search: search.trim() || undefined,
        department: department !== 'All' ? department : undefined,
        risk_tier: riskTier !== 'All' ? riskTier : undefined,
        page,
        pageSize: 15,
      }),
  });

  const employeeDetailQuery = useQuery({
    queryKey: ['employeeDetail', selectedId],
    queryFn: () => (selectedId ? getEmployeeDetail(selectedId) : null),
    enabled: !!selectedId,
  });

  const selectedEmp = employeeDetailQuery.data;

  return (
    <div className="view-container">
      {/* Search and Filter Header */}
      <section className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 260 }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            className="filter-input"
            style={{ width: '100%' }}
            placeholder="Search by name, role, or ID (e.g., Marcus Vance, EMP-104)..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <select
          className="filter-select"
          value={department}
          onChange={(e) => {
            setDepartment(e.target.value);
            setPage(1);
          }}
        >
          <option value="All">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Sales & Revenue">Sales & Revenue</option>
          <option value="People & Culture">People & Culture</option>
          <option value="Finance & Operations">Finance & Operations</option>
          <option value="Customer Support">Customer Support</option>
        </select>

        <select
          className="filter-select"
          value={riskTier}
          onChange={(e) => {
            setRiskTier(e.target.value);
            setPage(1);
          }}
        >
          <option value="All">All Risk Tiers</option>
          <option value="Critical">Critical (81-100%)</option>
          <option value="High">High (61-80%)</option>
          <option value="Medium">Medium (31-60%)</option>
          <option value="Low">Low (0-30%)</option>
        </select>

        <button
          className="ghost-button"
          onClick={() => setSelectedId('EMP-104')}
          title="Jump directly to the demo showcase employee"
        >
          <Zap size={14} style={{ color: 'var(--primary)' }} />
          Showcase: EMP-104
        </button>
      </section>

      {/* Employee Roster Table */}
      <section className="table-wrapper">
        <table className="strata-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee Name</th>
              <th>Department</th>
              <th>Role & Level</th>
              <th>Compa-Ratio</th>
              <th>Tenure</th>
              <th>Performance</th>
              <th>Satisfaction</th>
              <th>Attrition Risk</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employeesQuery.isLoading ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '36px' }}>
                  Loading workforce records...
                </td>
              </tr>
            ) : employeesQuery.data?.data.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-soft)' }}>
                  No employees matched the active filter criteria.
                </td>
              </tr>
            ) : (
              employeesQuery.data?.data.map((emp) => {
                const tierClass = emp.riskTier.toLowerCase();
                return (
                  <tr key={emp.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedId(emp.employeeNumber)}>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{emp.employeeNumber}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{emp.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emp.email}</div>
                    </td>
                    <td>{emp.department}</td>
                    <td>
                      <div>{emp.roleTitle}</div>
                      <span style={{ fontSize: 11, color: 'var(--text-soft)' }}>{emp.level}</span>
                    </td>
                    <td>
                      <span
                        style={{
                          color: emp.compaRatio < 0.9 ? '#f87171' : 'var(--text)',
                          fontWeight: emp.compaRatio < 0.9 ? 700 : 400,
                        }}
                      >
                        {(emp.compaRatio * 100).toFixed(0)}%
                        {emp.compaRatio < 0.9 && ' (Underpaid)'}
                      </span>
                    </td>
                    <td>{emp.tenureYears} yrs</td>
                    <td>
                      <span style={{ color: emp.performanceScore >= 4.0 ? 'var(--primary)' : 'inherit' }}>
                        {emp.performanceScore} / 5.0
                      </span>
                    </td>
                    <td>{emp.engagementScore}%</td>
                    <td>
                      <span className={`risk-badge ${tierClass}`}>
                        {emp.riskTier} • {emp.attritionRisk}%
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="ghost-button"
                        style={{ padding: '4px 10px', fontSize: 12 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(emp.employeeNumber);
                        }}
                      >
                        Explain AI
                        <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>

      {/* Pagination Controls */}
      {employeesQuery.data && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
          <span style={{ color: 'var(--text-muted)' }}>
            Showing page {employeesQuery.data.page} of {Math.ceil(employeesQuery.data.total / employeesQuery.data.pageSize)} (
            {employeesQuery.data.total} total employees)
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="ghost-button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              Previous
            </button>
            <button
              className="ghost-button"
              disabled={page >= Math.ceil(employeesQuery.data.total / employeesQuery.data.pageSize)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Selected Employee Detailed Modal Drawer */}
      {selectedId && (
        <div className="modal-overlay" onClick={() => setSelectedId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {employeeDetailQuery.isLoading || !selectedEmp ? (
              <div style={{ padding: 48, textAlign: 'center' }}>
                <Activity size={28} className="spinning-icon" style={{ margin: '0 auto 12px' }} />
                <p>Generating SHAP Explainability & Profile Synthesis...</p>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981, #0284c7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 18,
                        color: '#fff',
                      }}
                    >
                      {selectedEmp.firstName[0]}
                      {selectedEmp.lastName[0]}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700 }}>{selectedEmp.fullName}</h3>
                        <span className="workspace-badge">{selectedEmp.employeeNumber}</span>
                      </div>
                      <p style={{ color: 'var(--text-soft)', fontSize: 13, marginTop: 2 }}>
                        {selectedEmp.roleTitle} • {selectedEmp.department} ({selectedEmp.level})
                      </p>
                    </div>
                  </div>
                  <button className="icon-button" onClick={() => setSelectedId(null)}>
                    <X size={20} />
                  </button>
                </div>

                <div className="modal-body">
                  {/* Attrition Risk Headline Card */}
                  <div
                    style={{
                      background:
                        selectedEmp.riskTier === 'Critical'
                          ? 'rgba(239, 68, 68, 0.12)'
                          : selectedEmp.riskTier === 'High'
                          ? 'rgba(249, 115, 22, 0.12)'
                          : 'rgba(32, 201, 151, 0.12)',
                      border: `1px solid ${
                        selectedEmp.riskTier === 'Critical'
                          ? 'rgba(239, 68, 68, 0.4)'
                          : selectedEmp.riskTier === 'High'
                          ? 'rgba(249, 115, 22, 0.4)'
                          : 'rgba(32, 201, 151, 0.4)'
                      }`,
                      borderRadius: 12,
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                        Model Prediction Output
                      </div>
                      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>
                        Attrition Risk: {selectedEmp.attritionRisk}% —{' '}
                        <span style={{ textTransform: 'uppercase' }}>{selectedEmp.riskTier}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 2 }}>
                        Model Confidence: {selectedEmp.confidenceScore * 100}% ROC-AUC (Random Forest Ensemble)
                      </div>
                    </div>
                    <button
                      className="primary-button"
                      onClick={() => onNavigateWhatIf(selectedEmp.employeeNumber)}
                    >
                      <Sliders size={15} />
                      Simulate Interventions
                    </button>
                  </div>

                  {/* Core Metrics Summary Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                    <div className="panel" style={{ padding: 12 }}>
                      <span className="kpi-label">Annual Salary</span>
                      <strong style={{ fontSize: 16 }}>${selectedEmp.salary.toLocaleString()}</strong>
                      <span style={{ fontSize: 11, color: selectedEmp.compaRatio < 0.9 ? '#f87171' : 'inherit', display: 'block' }}>
                        {(selectedEmp.compaRatio * 100).toFixed(0)}% of market
                      </span>
                    </div>
                    <div className="panel" style={{ padding: 12 }}>
                      <span className="kpi-label">Monthly Hours</span>
                      <strong style={{ fontSize: 16 }}>{selectedEmp.monthlyHours}h</strong>
                      <span style={{ fontSize: 11, color: selectedEmp.overtimeHours > 20 ? '#f87171' : 'inherit', display: 'block' }}>
                        +{selectedEmp.overtimeHours}h overtime
                      </span>
                    </div>
                    <div className="panel" style={{ padding: 12 }}>
                      <span className="kpi-label">Satisfaction</span>
                      <strong style={{ fontSize: 16 }}>{selectedEmp.satisfactionScore}%</strong>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>Pulse Index</span>
                    </div>
                    <div className="panel" style={{ padding: 12 }}>
                      <span className="kpi-label">Tenure</span>
                      <strong style={{ fontSize: 16 }}>{selectedEmp.tenureYears} yrs</strong>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>
                        {selectedEmp.yearsSinceLastPromotion}y since promo
                      </span>
                    </div>
                    <div className="panel" style={{ padding: 12 }}>
                      <span className="kpi-label">Manager Rating</span>
                      <strong style={{ fontSize: 16 }}>{selectedEmp.managerRating} / 5</strong>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>{selectedEmp.managerName}</span>
                    </div>
                  </div>

                  {/* Explainable AI: SHAP-Style Factor Attribution */}
                  <div className="panel" style={{ padding: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Activity size={16} style={{ color: 'var(--primary)' }} />
                        Why is this employee at risk? (Explainable AI Attribution)
                      </h4>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>SHAP Tree Explainer</span>
                    </div>

                    <div className="factor-list">
                      {selectedEmp.contributingFactors.map((factor, idx) => (
                        <div
                          key={idx}
                          className={`factor-item ${factor.is_risk_driver ? 'risk-driver' : 'protective'}`}
                        >
                          <div>
                            <div style={{ fontWeight: 600 }}>{factor.label}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-soft)', marginTop: 2 }}>
                              Current: {factor.value} vs. Benchmark: {factor.baseline} • {factor.action}
                            </div>
                          </div>
                          <span className={`factor-impact ${factor.is_risk_driver ? 'positive' : 'negative'}`}>
                            {factor.impact_display}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Employee Skills Profile */}
                  <div className="panel" style={{ padding: 18 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <GraduationCap size={16} style={{ color: 'var(--primary)' }} />
                      Verified Skills Inventory
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {selectedEmp.skills.map((s) => (
                        <div key={s.id} className="skill-badge">
                          <span>{s.name}</span>
                          <span className="prof-indicator">{s.proficiencyLabel}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prescriptive Interventions */}
                  <div className="panel" style={{ padding: 18 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle size={16} style={{ color: 'var(--primary)' }} />
                      Prescriptive Retention Interventions
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {selectedEmp.recommendations.map((rec) => (
                        <div
                          key={rec.id}
                          style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-soft)',
                            padding: '10px 14px',
                            borderRadius: 8,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{rec.title}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>{rec.description}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span className={`priority priority-${rec.priority.toLowerCase()}`}>{rec.priority}</span>
                            <div style={{ fontSize: 11, color: '#34d399', marginTop: 2 }}>
                              -{rec.estimatedRiskReduction}% risk
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Internal Mobility Opportunities */}
                  {selectedEmp.internalRoleMatches.length > 0 && (
                    <div className="panel" style={{ padding: 18 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Briefcase size={16} style={{ color: 'var(--primary)' }} />
                        Internal Mobility Opportunities (Hire Less. Develop Within.)
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {selectedEmp.internalRoleMatches.map((match, idx) => (
                          <div
                            key={idx}
                            style={{
                              background: 'var(--bg-card)',
                              padding: '10px 14px',
                              borderRadius: 8,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 13 }}>{match.projectName}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-soft)' }}>
                                Missing: {match.missingSkills.join(', ') || 'Fully Qualified'}
                              </div>
                            </div>
                            <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 14 }}>
                              {match.matchScore}% Match
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button className="ghost-button" onClick={() => setSelectedId(null)}>
                    Close Profile
                  </button>
                  <button
                    className="primary-button"
                    onClick={() => {
                      const empNum = selectedEmp.employeeNumber;
                      setSelectedId(null);
                      onNavigateWhatIf(empNum);
                    }}
                  >
                    Simulate What-If Interventions
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
