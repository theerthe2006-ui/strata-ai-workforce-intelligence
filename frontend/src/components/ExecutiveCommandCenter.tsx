import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Briefcase,
  CheckCircle,
  FileText,
  GraduationCap,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { WorkforceSummaryResponse } from '../api/workforceApi';

interface ExecutiveCommandCenterProps {
  summary: WorkforceSummaryResponse | undefined;
  isLoading: boolean;
  onNavigate: (tab: string, employeeId?: string) => void;
}

export function ExecutiveCommandCenter({
  summary,
  isLoading,
  onNavigate,
}: ExecutiveCommandCenterProps) {
  if (isLoading || !summary) {
    return (
      <div className="view-container">
        <div className="panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Activity size={32} className="spinning-icon" style={{ margin: '0 auto 16px', color: 'var(--primary)' }} />
          <h3>Synchronizing Enterprise Workforce Telemetry...</h3>
          <p style={{ color: 'var(--text-soft)', marginTop: 8 }}>Computing real-time risk scores and skill matrices</p>
        </div>
      </div>
    );
  }

  const kpis = [
    {
      label: 'Total Workforce',
      value: new Intl.NumberFormat().format(summary.totalEmployees),
      subtext: 'Active Enterprise Headcount',
      delta: '+12.4%',
      trend: 'up',
      icon: Users,
      action: () => onNavigate('employees'),
    },
    {
      label: 'Average Attrition Risk',
      value: `${summary.averageAttritionRisk}%`,
      subtext: `${summary.highRiskEmployees} High / ${summary.criticalRiskEmployees} Critical`,
      delta: '-2.8%',
      trend: 'down',
      icon: AlertTriangle,
      alert: summary.criticalRiskEmployees > 0,
      action: () => onNavigate('employees'),
    },
    {
      label: 'Workforce Skill Coverage',
      value: `${summary.skillCoverage}%`,
      subtext: 'Project Requirements Met',
      delta: '+6.5%',
      trend: 'up',
      icon: GraduationCap,
      action: () => onNavigate('skills'),
    },
    {
      label: 'Retention Opportunity Value',
      value: `$${(summary.retentionOpportunityValue / 1000).toFixed(0)}k`,
      subtext: 'Replacement Exposure Saved',
      delta: 'High ROI',
      trend: 'up',
      icon: ShieldCheck,
      action: () => onNavigate('whatif'),
    },
  ];

  return (
    <div className="view-container">
      {/* KPI Cards Grid */}
      <section className="kpi-grid">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <article
              key={idx}
              className="kpi-card"
              onClick={kpi.action}
              style={{ cursor: 'pointer' }}
            >
              <div className="kpi-header">
                <div>
                  <div className="kpi-label">{kpi.label}</div>
                  <div className="kpi-value">{kpi.value}</div>
                </div>
                <div
                  className="kpi-icon"
                  style={{
                    backgroundColor: kpi.alert ? 'rgba(239, 68, 68, 0.15)' : undefined,
                    color: kpi.alert ? '#f87171' : undefined,
                  }}
                >
                  <Icon size={24} />
                </div>
              </div>
              <div className="kpi-footer">
                <span className={`trend ${kpi.trend === 'up' ? 'positive' : 'negative'}`}>
                  {kpi.trend === 'up' ? <ArrowUpRight size={16} /> : <TrendingDown size={16} />}
                  {kpi.delta}
                </span>
                <span className="kpi-subtle">{kpi.subtext}</span>
              </div>
            </article>
          );
        })}
      </section>

      {/* Featured Innovation Hero Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(14, 165, 233, 0.08))',
          border: '1px solid rgba(32, 201, 151, 0.25)',
          borderRadius: 14,
          padding: '18px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: 'var(--primary)',
              color: '#071318',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Zap size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 700 }}>
              Live Demo: Critical Attrition Exposure on Cloud Platform Engineer
            </h4>
            <p style={{ fontSize: 13, color: 'var(--text-soft)', marginTop: 2 }}>
              Marcus Vance (EMP-104) flagged at <strong>95.9% Critical Risk</strong>. Stagnated compensation and overtime burnout detected.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="ghost-button"
            onClick={() => onNavigate('employees', 'EMP-104')}
          >
            Inspect AI Explanation
          </button>
          <button
            className="primary-button"
            onClick={() => onNavigate('whatif', 'EMP-104')}
          >
            Launch What-If Simulation
          </button>
        </div>
      </section>

      {/* Primary Charts Layout */}
      <section className="analytics-layout">
        {/* Attrition Risk 6M Trend */}
        <article className="panel panel-large">
          <div className="panel-header">
            <div>
              <div className="panel-eyebrow">Predictive Trajectory</div>
              <h2 className="panel-title">Attrition Risk Trend vs. Enterprise Benchmark</h2>
            </div>
            <div className="segmented">
              <button className="active">6M Active</button>
              <button onClick={() => onNavigate('twin')}>Digital Twin</button>
            </div>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={summary.attritionTrend} margin={{ left: 0, right: 18, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="attritionFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#20c997" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#20c997" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} stroke="#94a3b8" />
                <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111b2a',
                    border: '1px solid #233b48',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="attritionRisk"
                  name="Workforce Risk"
                  stroke="#20c997"
                  strokeWidth={3}
                  fill="url(#attritionFill)"
                />
                <Line
                  type="monotone"
                  dataKey="industryBenchmark"
                  name="Industry Benchmark"
                  stroke="#818cf8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        {/* Workforce Risk Distribution Donut */}
        <article className="panel">
          <div className="panel-header compact">
            <div>
              <div className="panel-eyebrow">Risk Classification</div>
              <h2 className="panel-title">Workforce Risk Distribution</h2>
            </div>
            <button className="icon-button" onClick={() => onNavigate('employees')}>
              <Users size={16} />
            </button>
          </div>
          <div className="chart-area small">
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie
                  data={summary.riskDistribution}
                  dataKey="count"
                  nameKey="tier"
                  innerRadius={50}
                  outerRadius={88}
                  paddingAngle={3}
                >
                  {summary.riskDistribution.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111b2a',
                    border: '1px solid #233b48',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="legend-list">
              {summary.riskDistribution.map((item, idx) => (
                <div className="legend-row" key={idx}>
                  <span className="legend-swatch" style={{ backgroundColor: item.color }}></span>
                  <span>{item.tier}</span>
                  <strong>
                    {item.count} ({item.percent}%)
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      {/* Secondary Layout: Department Risk Comparison & Prescriptive Actions */}
      <section className="analytics-layout bottom-layout">
        <article className="panel">
          <div className="panel-header compact">
            <div>
              <div className="panel-eyebrow">Department Exposure</div>
              <h2 className="panel-title">Average Attrition Risk by Business Unit</h2>
            </div>
            <button className="ghost-button" onClick={() => onNavigate('employees')}>
              View Directory
            </button>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={270}>
              <BarChart data={summary.departmentRisks} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                <XAxis dataKey="department" axisLine={false} tickLine={false} stroke="#94a3b8" />
                <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111b2a',
                    border: '1px solid #233b48',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="avgRisk" name="Avg Risk (%)" radius={[8, 8, 0, 0]} fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        {/* Actionable Strategic Initiatives */}
        <article className="panel">
          <div className="panel-header compact">
            <div>
              <div className="panel-eyebrow">Strategic Priority</div>
              <h2 className="panel-title">Prescriptive Retention Initiatives</h2>
            </div>
            <button className="icon-button" onClick={() => onNavigate('alerts')}>
              <CheckCircle size={16} />
            </button>
          </div>
          <div className="recommendations">
            <div className="recommendation-row">
              <div className="recommendation-icon" style={{ color: '#f87171' }}>
                <AlertTriangle size={22} />
              </div>
              <div className="recommendation-content">
                <div className="recommendation-title">Engineering Out-of-Cycle Compensation Calibration</div>
                <div className="recommendation-meta">
                  <span>Marcus Vance + 4 Senior Engineers</span>
                  <span>Target: Reduce 18% compa-ratio gap</span>
                </div>
              </div>
              <span className="priority priority-high">Critical</span>
            </div>

            <div className="recommendation-row">
              <div className="recommendation-icon" style={{ color: '#38bdf8' }}>
                <Briefcase size={22} />
              </div>
              <div className="recommendation-content">
                <div className="recommendation-title">Generative AI & MLOps Cross-Skilling Cohort</div>
                <div className="recommendation-meta">
                  <span>18 internal engineers eligible</span>
                  <span>Avoids 12 external senior hires</span>
                </div>
              </div>
              <span className="priority priority-medium">High</span>
            </div>

            <div className="recommendation-row">
              <div className="recommendation-icon" style={{ color: '#a78bfa' }}>
                <CheckCircle size={22} />
              </div>
              <div className="recommendation-content">
                <div className="recommendation-title">Succession Activation: Cloud Infrastructure Lead</div>
                <div className="recommendation-meta">
                  <span>Successor: Sophia Patel (82% Ready)</span>
                  <span>12-week mentoring pathway</span>
                </div>
              </div>
              <span className="priority priority-medium">High</span>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
