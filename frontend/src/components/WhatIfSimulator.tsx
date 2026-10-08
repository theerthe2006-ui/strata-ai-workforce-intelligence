import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  DollarSign,
  RotateCcw,
  ShieldCheck,
  Sliders,
  TrendingDown,
  User,
  Zap,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  getEmployeeDetail,
  simulateWhatIf,
  type WhatIfSimulationResponse,
} from '../api/workforceApi';

interface WhatIfSimulatorProps {
  initialEmployeeId?: string;
}

export function WhatIfSimulator({ initialEmployeeId = 'EMP-104' }: WhatIfSimulatorProps) {
  const [employeeId, setEmployeeId] = useState(initialEmployeeId);

  const employeeQuery = useQuery({
    queryKey: ['employeeDetail', employeeId],
    queryFn: () => getEmployeeDetail(employeeId),
  });

  const emp = employeeQuery.data;

  // Simulator intervention state
  const [satisfaction, setSatisfaction] = useState(31);
  const [engagement, setEngagement] = useState(36);
  const [monthlyHours, setMonthlyHours] = useState(224);
  const [overtimeHours, setOvertimeHours] = useState(38);
  const [compaRatio, setCompaRatio] = useState(0.82);
  const [yearsSincePromo, setYearsSincePromo] = useState(3.8);
  const [managerRating, setManagerRating] = useState(2.8);

  const [simResult, setSimResult] = useState<WhatIfSimulationResponse | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Sync state when employee data loads
  useEffect(() => {
    if (emp) {
      setSatisfaction(emp.satisfactionScore);
      setEngagement(emp.engagementScore);
      setMonthlyHours(emp.monthlyHours);
      setOvertimeHours(emp.overtimeHours);
      setCompaRatio(emp.compaRatio);
      setYearsSincePromo(emp.yearsSinceLastPromotion);
      setManagerRating(emp.managerRating);
      setSimResult(null);
    }
  }, [emp]);

  async function handleRunSimulation() {
    if (!emp) return;
    setIsSimulating(true);
    try {
      const res = await simulateWhatIf({
        employee_id: emp.employeeNumber,
        satisfaction_score: satisfaction,
        engagement_score: engagement,
        monthly_hours: monthlyHours,
        overtime_hours: overtimeHours,
        compa_ratio: compaRatio,
        years_since_last_promotion: yearsSincePromo,
        manager_rating: managerRating,
      });
      setSimResult(res);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  }

  function applyPresetRetentionPlan() {
    setSatisfaction(78);
    setEngagement(80);
    setMonthlyHours(168);
    setOvertimeHours(6);
    setCompaRatio(1.02);
    setYearsSincePromo(0.2);
    setManagerRating(4.5);
  }

  function resetToBaseline() {
    if (!emp) return;
    setSatisfaction(emp.satisfactionScore);
    setEngagement(emp.engagementScore);
    setMonthlyHours(emp.monthlyHours);
    setOvertimeHours(emp.overtimeHours);
    setCompaRatio(emp.compaRatio);
    setYearsSincePromo(emp.yearsSinceLastPromotion);
    setManagerRating(emp.managerRating);
    setSimResult(null);
  }

  return (
    <div className="view-container">
      {/* Header Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, rgba(32, 201, 151, 0.15), rgba(56, 189, 248, 0.1))',
          border: '1px solid rgba(32, 201, 151, 0.3)',
          borderRadius: 14,
          padding: '20px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sliders size={20} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>What-If Intervention Simulator</h2>
          </div>
          <p style={{ color: 'var(--text-soft)', fontSize: 13, marginTop: 4 }}>
            Test hypothetical workforce interventions. Recalculates genuine machine-learning probabilities and measures projected retention ROI.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="ghost-button" onClick={applyPresetRetentionPlan}>
            <Zap size={14} style={{ color: 'var(--primary)' }} />
            Apply Recommended Retention Package
          </button>
          <button className="icon-button" onClick={resetToBaseline} title="Reset to current baseline">
            <RotateCcw size={16} />
          </button>
        </div>
      </section>

      {/* Target Subject Selector */}
      <section className="filter-bar">
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-soft)' }}>Simulation Candidate:</span>
        <select
          className="filter-select"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        >
          <option value="EMP-104">Marcus Vance (EMP-104) — Sr. Cloud Platform Engineer [Critical Risk]</option>
          <option value="EMP-101">Sophia Patel (EMP-101) — Lead AI/ML Systems Engineer [High Risk]</option>
          <option value="EMP-102">David Chen (EMP-102) — Senior Full-Stack Developer [Medium Risk]</option>
          <option value="EMP-103">Aria Kim (EMP-103) — DevOps & SRE Specialist [Low Risk]</option>
        </select>
        {emp && (
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Baseline Risk: <strong style={{ color: '#f87171' }}>{emp.attritionRisk}% ({emp.riskTier})</strong> • Salary: ${emp.salary.toLocaleString()}
          </span>
        )}
      </section>

      {/* Simulator Workspace: Two Columns (Controls vs. Model Output) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(320px, 1fr)', gap: 24 }}>
        {/* Left Column: Interactive Intervention Sliders */}
        <section className="slider-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-soft)', paddingBottom: 10 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Intervention Levers</h3>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Adjust variables to model impact</span>
          </div>

          {/* Slider 1: Satisfaction */}
          <div className="slider-row">
            <div className="slider-header">
              <span>Job Satisfaction Index</span>
              <strong>{satisfaction}% (Base: {emp?.satisfactionScore}%)</strong>
            </div>
            <input
              type="range"
              className="slider-input"
              min={10}
              max={100}
              value={satisfaction}
              onChange={(e) => setSatisfaction(Number(e.target.value))}
            />
          </div>

          {/* Slider 2: Engagement */}
          <div className="slider-row">
            <div className="slider-header">
              <span>Workforce Engagement Index</span>
              <strong>{engagement}% (Base: {emp?.engagementScore}%)</strong>
            </div>
            <input
              type="range"
              className="slider-input"
              min={10}
              max={100}
              value={engagement}
              onChange={(e) => setEngagement(Number(e.target.value))}
            />
          </div>

          {/* Slider 3: Monthly Hours */}
          <div className="slider-row">
            <div className="slider-header">
              <span>Monthly Workload Hours</span>
              <strong>{monthlyHours} hrs (Base: {emp?.monthlyHours}h)</strong>
            </div>
            <input
              type="range"
              className="slider-input"
              min={140}
              max={240}
              value={monthlyHours}
              onChange={(e) => setMonthlyHours(Number(e.target.value))}
            />
          </div>

          {/* Slider 4: Overtime Hours */}
          <div className="slider-row">
            <div className="slider-header">
              <span>Monthly Overtime Volume</span>
              <strong>{overtimeHours} hrs (Base: {emp?.overtimeHours}h)</strong>
            </div>
            <input
              type="range"
              className="slider-input"
              min={0}
              max={50}
              value={overtimeHours}
              onChange={(e) => setOvertimeHours(Number(e.target.value))}
            />
          </div>

          {/* Slider 5: Compa-Ratio */}
          <div className="slider-row">
            <div className="slider-header">
              <span>Compensation Market Ratio</span>
              <strong>{(compaRatio * 100).toFixed(0)}% of market (Base: {emp ? (emp.compaRatio * 100).toFixed(0) : 100}%)</strong>
            </div>
            <input
              type="range"
              className="slider-input"
              min={0.70}
              max={1.30}
              step={0.01}
              value={compaRatio}
              onChange={(e) => setCompaRatio(Number(e.target.value))}
            />
          </div>

          {/* Slider 6: Years Since Promotion */}
          <div className="slider-row">
            <div className="slider-header">
              <span>Years Since Last Promotion</span>
              <strong>{yearsSincePromo} yrs (Base: {emp?.yearsSinceLastPromotion}y)</strong>
            </div>
            <input
              type="range"
              className="slider-input"
              min={0.0}
              max={5.0}
              step={0.1}
              value={yearsSincePromo}
              onChange={(e) => setYearsSincePromo(Number(e.target.value))}
            />
          </div>

          {/* Slider 7: Manager Rating */}
          <div className="slider-row">
            <div className="slider-header">
              <span>Manager Relationship Rating</span>
              <strong>{managerRating} / 5.0 (Base: {emp?.managerRating})</strong>
            </div>
            <input
              type="range"
              className="slider-input"
              min={1.0}
              max={5.0}
              step={0.1}
              value={managerRating}
              onChange={(e) => setManagerRating(Number(e.target.value))}
            />
          </div>

          <button
            className="primary-button"
            style={{ width: '100%', marginTop: 10, padding: 12, justifyContent: 'center' }}
            disabled={isSimulating}
            onClick={handleRunSimulation}
          >
            {isSimulating ? 'Recalculating ML Prediction...' : 'Execute What-If Model Simulation'}
          </button>
        </section>

        {/* Right Column: Real-time Model Simulation Results */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!simResult ? (
            <div
              className="panel"
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Sliders size={36} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
              <h4>Model Ready for Intervention Testing</h4>
              <p style={{ color: 'var(--text-soft)', fontSize: 13, marginTop: 6, maxWidth: 320 }}>
                Adjust the intervention levers on the left and click <strong>Execute What-If Model Simulation</strong> to calculate the updated risk vector.
              </p>
            </div>
          ) : (
            <>
              {/* Before vs After Risk Comparison Card */}
              <div
                className="panel"
                style={{
                  background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.1), var(--bg-panel))',
                  border: '1px solid rgba(32, 201, 151, 0.3)',
                  padding: 24,
                }}
              >
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                  Recalculated Simulation Result
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>
                  Simulated Outcome: {simResult.employeeName}
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 1fr',
                    alignItems: 'center',
                    gap: 16,
                    marginTop: 20,
                    padding: '16px 20px',
                    background: 'var(--bg-card)',
                    borderRadius: 12,
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Baseline Risk</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#f87171' }}>
                      {simResult.original_risk}%
                    </div>
                    <span className="risk-badge critical">{simResult.original_tier}</span>
                  </div>

                  <ArrowRight size={24} style={{ color: 'var(--primary)' }} />

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Simulated Risk</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#34d399' }}>
                      {simResult.simulated_risk}%
                    </div>
                    <span className="risk-badge low">{simResult.simulated_tier}</span>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: 'rgba(32, 201, 151, 0.1)',
                    borderRadius: 10,
                  }}
                >
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-soft)' }}>Net Risk Reduction:</span>
                    <strong style={{ fontSize: 16, color: 'var(--primary)', display: 'block' }}>
                      -{simResult.risk_reduction_points} percentage points
                    </strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-soft)' }}>Exposure Saved:</span>
                    <strong style={{ fontSize: 16, color: 'var(--text)', display: 'block' }}>
                      ${simResult.estimated_retention_roi.replacement_cost_avoided.toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Updated Contributing Factors */}
              <div className="panel" style={{ padding: 18 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
                  Updated Factor Attributions Post-Intervention
                </h4>
                <div className="factor-list">
                  {simResult.simulated_contributing_factors.slice(0, 4).map((f, idx) => (
                    <div
                      key={idx}
                      className={`factor-item ${f.is_risk_driver ? 'risk-driver' : 'protective'}`}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{f.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-soft)' }}>
                          New Value: {f.value}
                        </div>
                      </div>
                      <span className={`factor-impact ${f.is_risk_driver ? 'positive' : 'negative'}`}>
                        {f.impact_display}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
