import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Briefcase,
  CheckCircle,
  Cpu,
  DollarSign,
  GraduationCap,
  Layers,
  Play,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import {
  simulateDigitalTwin,
  type DigitalTwinScenarioRequest,
  type DigitalTwinScenarioResponse,
} from '../api/workforceApi';

export function WorkforceDigitalTwin() {
  const [activeScenario, setActiveScenario] = useState<'ATTRITION_SHOCK' | 'UPSKILLING_WAVE' | 'TECH_SHIFT'>('ATTRITION_SHOCK');

  // Scenario parameters
  const [departingCount, setDepartingCount] = useState(5);
  const [traineesCount, setTraineesCount] = useState(30);
  const [demandSurgePct, setDemandSurgePct] = useState(40);

  const [simulationResult, setSimulationResult] = useState<DigitalTwinScenarioResponse | null>(null);

  const mutation = useMutation({
    mutationFn: (req: DigitalTwinScenarioRequest) => simulateDigitalTwin(req),
    onSuccess: (data) => {
      setSimulationResult(data);
    },
  });

  function handleExecuteSimulation() {
    let params: Record<string, any> = {};
    if (activeScenario === 'ATTRITION_SHOCK') {
      params = { departing_count: departingCount };
    } else if (activeScenario === 'UPSKILLING_WAVE') {
      params = { trainees_count: traineesCount, target_skills: ['Generative AI', 'MLOps', 'Cloud Security'] };
    } else {
      params = { demand_surge_pct: demandSurgePct };
    }

    mutation.mutate({
      scenario_type: activeScenario,
      parameters: params,
    });
  }

  return (
    <div className="view-container">
      {/* Signature Feature Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, rgba(32, 201, 151, 0.18), rgba(2, 132, 199, 0.14))',
          border: '1px solid rgba(32, 201, 151, 0.35)',
          borderRadius: 16,
          padding: '24px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                background: 'var(--primary)',
                color: '#071318',
                borderRadius: 8,
                padding: '4px 8px',
                fontSize: 11,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Signature Innovation
            </span>
            <span style={{ fontSize: 13, color: 'var(--cyan)', fontWeight: 600 }}>Decision-Support Engine</span>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginTop: 8 }}>
            Workforce Digital Twin & Organizational Simulator
          </h2>
          <p style={{ color: 'var(--text-soft)', fontSize: 14, marginTop: 6, lineHeight: 1.5 }}>
            A virtual replica of enterprise talent dynamics. Simulate shockwaves from talent flight, quantify ROI of internal upskilling waves, and forecast readiness under technology demand surges.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="primary-button"
            style={{ padding: '12px 24px', fontSize: 14 }}
            disabled={mutation.isPending}
            onClick={handleExecuteSimulation}
          >
            <Play size={16} />
            {mutation.isPending ? 'Simulating Dynamic Twin...' : 'Run Simulation'}
          </button>
        </div>
      </section>

      {/* Scenario Selection Deck */}
      <section className="scenario-grid">
        {/* Scenario 1: Attrition Shock */}
        <div
          className={`scenario-card ${activeScenario === 'ATTRITION_SHOCK' ? 'active' : ''}`}
          onClick={() => {
            setActiveScenario('ATTRITION_SHOCK');
            setSimulationResult(null);
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#f87171', fontWeight: 700, textTransform: 'uppercase' }}>
              Risk Stress Test
            </span>
            <ShieldAlert size={18} style={{ color: '#f87171' }} />
          </div>
          <h4 style={{ fontSize: 16, fontWeight: 700 }}>Scenario A: Critical Attrition Shock</h4>
          <p style={{ fontSize: 12, color: 'var(--text-soft)', lineHeight: 1.4 }}>
            Models the compounding impact if top senior engineers resign concurrently. Quantifies project delays and exposure.
          </p>
          {activeScenario === 'ATTRITION_SHOCK' && (
            <div style={{ marginTop: 8, paddingTop: 12, borderTop: '1px solid var(--border-soft)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span>Departing Engineers:</span>
                <strong>{departingCount} employees</strong>
              </div>
              <input
                type="range"
                className="slider-input"
                min={1}
                max={10}
                value={departingCount}
                onChange={(e) => setDepartingCount(Number(e.target.value))}
              />
            </div>
          )}
        </div>

        {/* Scenario 2: Upskilling Wave */}
        <div
          className={`scenario-card ${activeScenario === 'UPSKILLING_WAVE' ? 'active' : ''}`}
          onClick={() => {
            setActiveScenario('UPSKILLING_WAVE');
            setSimulationResult(null);
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
              Internal Mobility
            </span>
            <GraduationCap size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <h4 style={{ fontSize: 16, fontWeight: 700 }}>Scenario B: Targeted Upskilling Wave</h4>
          <p style={{ fontSize: 12, color: 'var(--text-soft)', lineHeight: 1.4 }}>
            Simulates a 12-week internal academy in AI, MLOps & Cloud Security. Measures hiring avoidance and cost savings.
          </p>
          {activeScenario === 'UPSKILLING_WAVE' && (
            <div style={{ marginTop: 8, paddingTop: 12, borderTop: '1px solid var(--border-soft)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span>Participating Trainees:</span>
                <strong>{traineesCount} engineers</strong>
              </div>
              <input
                type="range"
                className="slider-input"
                min={10}
                max={50}
                step={5}
                value={traineesCount}
                onChange={(e) => setTraineesCount(Number(e.target.value))}
              />
            </div>
          )}
        </div>

        {/* Scenario 3: Technology Demand Surge */}
        <div
          className={`scenario-card ${activeScenario === 'TECH_SHIFT' ? 'active' : ''}`}
          onClick={() => {
            setActiveScenario('TECH_SHIFT');
            setSimulationResult(null);
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
              Future Forecasting
            </span>
            <Zap size={18} style={{ color: '#38bdf8' }} />
          </div>
          <h4 style={{ fontSize: 16, fontWeight: 700 }}>Scenario C: AI Transformation Surge</h4>
          <p style={{ fontSize: 12, color: 'var(--text-soft)', lineHeight: 1.4 }}>
            Simulates acceleration in Generative AI product requirements. Balances internal upskilling vs external hiring.
          </p>
          {activeScenario === 'TECH_SHIFT' && (
            <div style={{ marginTop: 8, paddingTop: 12, borderTop: '1px solid var(--border-soft)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span>Skill Demand Surge:</span>
                <strong>+{demandSurgePct}% YoY</strong>
              </div>
              <input
                type="range"
                className="slider-input"
                min={15}
                max={60}
                step={5}
                value={demandSurgePct}
                onChange={(e) => setDemandSurgePct(Number(e.target.value))}
              />
            </div>
          )}
        </div>
      </section>

      {/* Simulation Results Display */}
      {simulationResult ? (
        <section
          className="panel"
          style={{
            background: 'linear-gradient(180deg, rgba(17, 27, 42, 0.9), var(--bg-panel))',
            border: '1px solid var(--border)',
            padding: 28,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                Simulated Digital Twin Output
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>{simulationResult.scenarioName}</h3>
            </div>
            <span className="workspace-badge" style={{ backgroundColor: 'rgba(32, 201, 151, 0.15)', color: 'var(--primary)' }}>
              Live Monte Carlo Model Complete
            </span>
          </div>

          {/* Conditional Result Grids per Scenario */}
          {activeScenario === 'ATTRITION_SHOCK' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                <div className="panel" style={{ padding: 16 }}>
                  <span className="kpi-label">Financial Replacement Cost</span>
                  <strong style={{ fontSize: 22, color: '#f87171' }}>
                    ${simulationResult.projectedFinancialExposure?.toLocaleString()}
                  </strong>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>
                    Recruitment, sign-on & onboarding overhead
                  </span>
                </div>

                <div className="panel" style={{ padding: 16 }}>
                  <span className="kpi-label">Productive Capacity Lost</span>
                  <strong style={{ fontSize: 22, color: '#fb923c' }}>
                    {simulationResult.lostProductiveCapacityHours} hrs/mo
                  </strong>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>
                    Engineering sprint bandwidth deficit
                  </span>
                </div>

                <div className="panel" style={{ padding: 16 }}>
                  <span className="kpi-label">Skill Coverage Impact</span>
                  <strong style={{ fontSize: 22, color: '#f87171' }}>
                    {simulationResult.skillCoverageImpact}%
                  </strong>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>
                    Immediate drop in architecture coverage
                  </span>
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '16px 20px', borderRadius: 12 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#f87171', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={16} />
                  Compromised Strategic Projects
                </h4>
                <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
                  {simulationResult.compromisedProjects?.map((prj: string, idx: number) => (
                    <span key={idx} className="workspace-badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>
                      {prj} (Estimated delay: 8-12 weeks)
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-soft)', marginTop: 12 }}>
                  <strong>Contingency Roadmap: </strong>
                  {simulationResult.recommendedContingencyPlan}
                </p>
              </div>
            </>
          )}

          {activeScenario === 'UPSKILLING_WAVE' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                <div className="panel" style={{ padding: 16 }}>
                  <span className="kpi-label">Skill Coverage Gain</span>
                  <strong style={{ fontSize: 22, color: '#34d399' }}>
                    {simulationResult.workforceCoverageGain}
                  </strong>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>
                    Across AI, MLOps, & Cloud Security
                  </span>
                </div>

                <div className="panel" style={{ padding: 16 }}>
                  <span className="kpi-label">External Hires Avoided</span>
                  <strong style={{ fontSize: 22, color: 'var(--cyan)' }}>
                    {simulationResult.hiringAvoidanceCount} Roles
                  </strong>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>
                    Filled through internal mobility
                  </span>
                </div>

                <div className="panel" style={{ padding: 16 }}>
                  <span className="kpi-label">Recruiting Cost Savings</span>
                  <strong style={{ fontSize: 22, color: '#34d399' }}>
                    ${simulationResult.estimatedCostSavings?.toLocaleString()}
                  </strong>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>
                    Agency fees and placement cost saved
                  </span>
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '16px 20px', borderRadius: 12 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle size={16} />
                  Enterprise ROI & Strategic Verdict
                </h4>
                <p style={{ fontSize: 13, color: 'var(--text-soft)', marginTop: 8, lineHeight: 1.5 }}>
                  {simulationResult.strategicImpact}
                </p>
              </div>
            </>
          )}

          {activeScenario === 'TECH_SHIFT' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                <div className="panel" style={{ padding: 16 }}>
                  <span className="kpi-label">Net Skill Deficit</span>
                  <strong style={{ fontSize: 22, color: '#fb923c' }}>
                    {simulationResult.projectedSkillDeficit} Specialists
                  </strong>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>
                    Emerging architectural shortfall
                  </span>
                </div>

                <div className="panel" style={{ padding: 16 }}>
                  <span className="kpi-label">Internal Upgradable Pool</span>
                  <strong style={{ fontSize: 22, color: 'var(--primary)' }}>
                    {simulationResult.internalReallocationCapacity} Candidates
                  </strong>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>
                    Can transition with 8-week bootcamp
                  </span>
                </div>

                <div className="panel" style={{ padding: 16 }}>
                  <span className="kpi-label">Mandatory External Hires</span>
                  <strong style={{ fontSize: 22, color: 'var(--text)' }}>
                    {simulationResult.unavoidableExternalHires} Specialized Hires
                  </strong>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>
                    Principal staff not available internally
                  </span>
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '16px 20px', borderRadius: 12 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={16} />
                  Strategic Workforce Allocation Plan
                </h4>
                <p style={{ fontSize: 13, color: 'var(--text-soft)', marginTop: 8, lineHeight: 1.5 }}>
                  {simulationResult.strategicImpact}
                </p>
              </div>
            </>
          )}
        </section>
      ) : (
        <section
          className="panel"
          style={{
            textAlign: 'center',
            padding: '50px 20px',
            background: 'var(--bg-panel)',
            border: '1px dashed var(--border)',
          }}
        >
          <Cpu size={36} style={{ color: 'var(--primary)', marginBottom: 14 }} />
          <h4>Digital Twin Parameter Matrix Configured</h4>
          <p style={{ color: 'var(--text-soft)', fontSize: 13, marginTop: 4 }}>
            Click <strong>Run Simulation</strong> in the header banner to execute live simulation.
          </p>
        </section>
      )}
    </div>
  );
}
