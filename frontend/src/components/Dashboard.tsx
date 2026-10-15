import { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Bell,
  Briefcase,
  CheckCircle,
  ChevronRight,
  Download,
  FileText,
  GraduationCap,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users
} from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { getWorkforceSummary, getEmployees, getSkillGaps, getAttritionPrediction, getAdminUsers, getAdminSettings } from '../api/workforceApi';
import type { TokenResponse } from '../api/workforceApi';

const attritionTrend = [
  { month: 'Jan', attrition: 12, target: 10 },
  { month: 'Feb', attrition: 11, target: 9 },
  { month: 'Mar', attrition: 9, target: 8 },
  { month: 'Apr', attrition: 14, target: 9 },
  { month: 'May', attrition: 10, target: 8 },
  { month: 'Jun', attrition: 8, target: 7 },
  { month: 'Jul', attrition: 7, target: 7 },
  { month: 'Aug', attrition: 6, target: 6 }
];

const departmentData = [
  { name: 'Engineering', value: 372, fill: '#2dd4bf' },
  { name: 'Sales', value: 186, fill: '#818cf8' },
  { name: 'HR', value: 42, fill: '#fbbf24' },
  { name: 'Finance', value: 120, fill: '#60a5fa' },
  { name: 'Support', value: 210, fill: '#a78bfa' }
];

const activities = [
  { type: 'AI Risk model', actor: 'Attrition intelligence', detail: 'Updated critical-risk population for Q3', time: '2 min ago' },
  { type: 'Skill gap analysis', actor: 'Engineering', detail: 'Cloud skills are trending below enterprise target', time: '12 min ago' },
  { type: 'Career path', actor: 'Leadership pipeline', detail: '12 employees matched for promotion readiness', time: '31 min ago' }
];

interface DashboardProps {
  session?: TokenResponse;
  onLogout: () => void;
}

export function Dashboard({ session, onLogout }: DashboardProps) {
  const workforceSummaryQuery = useQuery({
    queryKey: ['workforceSummary'],
    queryFn: getWorkforceSummary,
  });

  const employeesQuery = useQuery({
    queryKey: ['employees'],
    queryFn: () => getEmployees(),
  });

  const skillGapsQuery = useQuery({
    queryKey: ['skillGaps'],
    queryFn: getSkillGaps,
  });

  const predictionQuery = useQuery({
    queryKey: ['attritionPrediction'],
    queryFn: getAttritionPrediction,
  });

  const adminUsersQuery = useQuery({
    queryKey: ['adminUsers'],
    queryFn: getAdminUsers,
  });

  const adminSettingsQuery = useQuery({
    queryKey: ['adminSettings'],
    queryFn: getAdminSettings,
  });

  const workforceSummary = workforceSummaryQuery.data;
  const employees = employeesQuery.data;
  const skillGaps = skillGapsQuery.data;
  const prediction = predictionQuery.data;

  const apiQueries = [workforceSummaryQuery, employeesQuery, skillGapsQuery, predictionQuery, adminUsersQuery, adminSettingsQuery];
  const isLoading = apiQueries.some((query) => query.isLoading);
  const hasError = apiQueries.some((query) => query.isError);
  const firstError = apiQueries.find((query) => query.isError)?.error;
  const firstErrorMessage = firstError instanceof Error ? firstError.message : 'One or more workforce intelligence services are unavailable.';

  const userDirectory: Array<{ id: number; email: string; role: string }> = adminUsersQuery.data?.data ?? [
    { id: 1, email: session?.user.email ?? 'admin@enterprise.workforce', role: session?.user.role ?? 'ADMIN' },
    { id: 2, email: 'hr@enterprise.workforce', role: 'HR' },
    { id: 3, email: 'manager@enterprise.workforce', role: 'MANAGER' }
  ];

  const [selectedUserId, setSelectedUserId] = useState<number>(userDirectory[0].id);

  const selectedUser = useMemo(() => {
    return userDirectory.find((user: { id: number; email: string; role: string }) => user.id === selectedUserId) ?? userDirectory[0];
  }, [selectedUserId, userDirectory]);

  const kpiData = workforceSummary
    ? [
        { label: 'Total Employees', value: new Intl.NumberFormat().format(workforceSummary.totalEmployees), delta: '+12.4%', trend: 'up', icon: Users },
        { label: 'Attrition Risk', value: `${workforceSummary.averageAttritionRisk}%`, delta: '-2.1%', trend: 'down', icon: AlertTriangle },
        { label: 'Skill Coverage', value: `${workforceSummary.skillCoverage}%`, delta: '+6.7%', trend: 'up', icon: GraduationCap },
        { label: 'Retention Opportunity', value: `$${new Intl.NumberFormat().format(workforceSummary.retentionOpportunityValue)}`, delta: '+3.2%', trend: 'up', icon: ShieldCheck }
      ]
    : [
        { label: 'Total Employees', value: '1,284', delta: '+12.4%', trend: 'up', icon: Users },
        { label: 'Attrition Risk', value: '6.8%', delta: '-2.1%', trend: 'down', icon: AlertTriangle },
        { label: 'Skill Coverage', value: '89.2%', delta: '+6.7%', trend: 'up', icon: GraduationCap },
        { label: 'Retention Index', value: '94.1', delta: '+3.2%', trend: 'up', icon: ShieldCheck }
      ];

  const skillGapData = skillGaps?.gaps.map((gap) => ({ skill: gap.skill, gap: gap.gapPercent })) || [
    { skill: 'AI/ML', gap: 22 },
    { skill: 'Cloud', gap: 16 },
    { skill: 'Data', gap: 24 },
    { skill: 'Leadership', gap: 10 },
    { skill: 'Security', gap: 8 }
  ];

  const trainingRecommendations = prediction?.recommendations?.map((item: string, idx: number) => ({
    title: item,
    employees: (employees?.data?.length ?? 2) + idx,
    priority: idx === 0 ? 'High' : 'Medium',
    duration: idx === 0 ? '6 weeks' : '4 weeks'
  })) || [
    { title: 'AI & Automation Foundations', employees: 128, priority: 'High', duration: '6 weeks' },
    { title: 'Executive Communication', employees: 89, priority: 'Medium', duration: '4 weeks' },
    { title: 'Cloud Platform Modernization', employees: 154, priority: 'High', duration: '8 weeks' }
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <BarChart3 size={28} />
          </div>
          <div>
            <div className="brand-title">Workforce AI</div>
            <div className="brand-subtitle">Predictive Analytics</div>
          </div>
        </div>

        <nav className="nav-section">
          <div className="nav-label">Workspace</div>
          <a className="nav-link active" href="#">
            <Activity size={18} />
            <span>Executive Dashboard</span>
          </a>
          <a className="nav-link" href="#">
            <Users size={18} />
            <span>Employees</span>
          </a>
          <a className="nav-link" href="#">
            <Briefcase size={18} />
            <span>Workforce Planning</span>
          </a>
          <a className="nav-link" href="#">
            <GraduationCap size={18} />
            <span>Skills & Training</span>
          </a>
          <a className="nav-link" href="#">
            <AlertTriangle size={18} />
            <span>Attrition Intelligence</span>
          </a>
          <a className="nav-link" href="#">
            <FileText size={18} />
            <span>Reports</span>
          </a>
        </nav>

        <nav className="nav-section">
          <div className="nav-label">Administration</div>
          <a className="nav-link" href="#">
            <Settings size={18} />
            <span>Admin Console</span>
          </a>
          <a className="nav-link" href="#">
            <ShieldCheck size={18} />
            <span>Security & Audit</span>
          </a>
        </nav>

        <div className="user-panel">
          <div className="avatar-ring">
            <div className="avatar">AM</div>
          </div>
          <div>
            <div className="user-name">{selectedUser.email}</div>
            <div className="user-role">{selectedUser.role} Workspace</div>
          </div>
        </div>

        <div className="workspace-switcher">
          <div className="nav-label small-label">Virtual Users</div>
          {userDirectory.map((user) => (
            <button
              key={user.id}
              className={`workspace-user ${selectedUserId === user.id ? 'active' : ''}`}
              onClick={() => setSelectedUserId(user.id)}
            >
              <span className="workspace-dot"></span>
              <span>{user.role}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-only">
              <Menu size={20} />
            </button>
            <div>
              <div className="page-kicker">Enterprise Operations</div>
              <h1 className="page-title">Workforce Intelligence</h1>
            </div>
          </div>
          <div className="topbar-actions">
            <div className="search-box">
              <Search size={16} />
              <input aria-label="Search" placeholder="Search employees, reports" />
            </div>
            <button className="icon-button">
              <Bell size={20} />
              <span className="badge-dot"></span>
            </button>
            <button className="primary-button">
              <Download size={16} /> Export
            </button>
            <button className="logout-button" onClick={onLogout}>
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </header>

        <section className="workspace-bar">
          <div className="workspace-title">
            <span className="workspace-badge">Workspace</span>
            <span className="workspace-name">{selectedUser.role} Command Center</span>
          </div>
          <div className="workspace-status">
            <span className="online-dot"></span>
            <span>{adminSettingsQuery.data?.audit ?? 'enabled'} audit</span>
            <span className="divider"></span>
            <span>{adminSettingsQuery.data?.model ?? 'attrition_v1.0.0'}</span>
          </div>
        </section>

        {isLoading && (
          <section className="api-status banner loading-banner">
            <Activity size={16} />
            <span>Syncing workforce intelligence...</span>
          </section>
        )}

        {hasError && (
          <section className="api-status banner error-banner">
            <AlertTriangle size={16} />
            <span>{firstErrorMessage}</span>
          </section>
        )}

        <section className="kpi-grid">
          {kpiData.map((item, index) => {
            const Icon = item.icon;
            return (
              <article className="kpi-card" key={index}>
                <div className="kpi-header">
                  <div>
                    <div className="kpi-label">{item.label}</div>
                    <div className="kpi-value">{item.value}</div>
                  </div>
                  <div className="kpi-icon">
                    <Icon size={24} />
                  </div>
                </div>
                <div className="kpi-footer">
                  <span className={item.trend === 'up' ? 'trend positive' : 'trend negative'}>
                    {item.trend === 'up' ? <ArrowUpRight size={16} /> : <TrendingUp size={16} />}
                    {item.delta}
                  </span>
                  <span className="kpi-subtle">vs previous period</span>
                </div>
              </article>
            );
          })}
        </section>

        <section className="analytics-layout">
          <article className="panel panel-large">
            <div className="panel-header">
              <div>
                <div className="panel-eyebrow">Workforce Trend</div>
                <h2 className="panel-title">Attrition Risk Trend</h2>
              </div>
              <div className="segmented">
                <button className="active">6M</button>
                <button>12M</button>
                <button>YTD</button>
              </div>
            </div>
            <div className="chart-area">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={attritionTrend} margin={{ left: 0, right: 18, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="attritionFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="1" stopColor="#10b981" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.4} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} stroke="#94a3b8" />
                  <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" />
                  <Tooltip />
                  <Area type="monotone" dataKey="attrition" stroke="#34d399" strokeWidth={3} fill="url(#attritionFill)" />
                  <Line type="monotone" dataKey="target" stroke="#818cf8" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="panel">
            <div className="panel-header compact">
              <div>
                <div className="panel-eyebrow">Department Split</div>
                <h2 className="panel-title">Employee Distribution</h2>
              </div>
              <button className="icon-button"><Download size={16} /></button>
            </div>
            <div className="chart-area small">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={departmentData} dataKey="value" nameKey="name" innerRadius={44} outerRadius={88} paddingAngle={3}>
                    {departmentData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="legend-list">
                {departmentData.map((item) => (
                  <div className="legend-row" key={item.name}>
                    <span className="legend-swatch" style={{ backgroundColor: item.fill }}></span>
                    <span>{item.name}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </section>

        <section className="analytics-layout bottom-layout">
          <article className="panel">
            <div className="panel-header compact">
              <div>
                <div className="panel-eyebrow">Skill Intelligence</div>
                <h2 className="panel-title">Skill Gap Analysis</h2>
              </div>
              <button className="ghost-button">Generate Actions</button>
            </div>
            <div className="chart-area">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={skillGapData} margin={{ left: 0, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="skill" axisLine={false} tickLine={false} stroke="#94a3b8" />
                  <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="gap" radius={[8, 8, 0, 0]} fill="#a78bfa" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="panel">
            <div className="panel-header compact">
              <div>
                <div className="panel-eyebrow">Retention Recommendations</div>
                <h2 className="panel-title">Recommended Actions</h2>
              </div>
              <button className="icon-button"><ChevronRight size={16} /></button>
            </div>
            <div className="recommendations">
              {trainingRecommendations.map((rec, index) => (
                <div className="recommendation-row" key={index}>
                  <div className="recommendation-icon">
                    <CheckCircle size={22} />
                  </div>
                  <div className="recommendation-content">
                    <div className="recommendation-title">{rec.title}</div>
                    <div className="recommendation-meta">
                      <span>{rec.employees} employees</span>
                      <span>{rec.duration}</span>
                    </div>
                  </div>
                  <span className={`priority priority-${rec.priority.toLowerCase()}`}>{rec.priority}</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="lower-layout">
          <article className="panel panel-large">
            <div className="panel-header compact">
              <div>
                <div className="panel-eyebrow">AI Notifications</div>
                <h2 className="panel-title">Critical Workforce Intelligence</h2>
              </div>
              <button className="ghost-button">View All</button>
            </div>
            <div className="activity-list">
              {activities.map((activity, idx) => (
                <div className="activity-row" key={idx}>
                  <span className="activity-icon"><Activity size={15} /></span>
                  <div>
                    <div className="activity-title">{activity.type}</div>
                    <div className="activity-detail">{activity.actor} • {activity.detail}</div>
                  </div>
                  <span className="time-label">{activity.time}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panel-header compact">
              <div>
                <div className="panel-eyebrow">Executive Summary</div>
                <h2 className="panel-title">Business Insights</h2>
              </div>
              <button className="icon-button"><FileText size={16} /></button>
            </div>
            <div className="insights">
              <div className="insight-highlight">
                <span className="positive-text">+18.2%</span>
                <span>Leadership pipeline readiness</span>
              </div>
              <div className="insight-highlight warning">
                <span className="warning-text">3 critical teams</span>
                <span>need retention intervention</span>
              </div>
              <div className="insight-highlight">
                <span className="positive-text">8.7K</span>
                <span>training hours recommended</span>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
