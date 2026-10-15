import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Bell,
  Briefcase,
  ChevronRight,
  Download,
  FileText,
  GraduationCap,
  Layers,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import { getAdminUsers, getAdminSettings, getWorkforceAlerts } from '../api/workforceApi';

export function AppShell() {
  const { session, logout, switchWorkspaceUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const adminUsersQuery = useQuery({
    queryKey: ['adminUsers'],
    queryFn: getAdminUsers,
    enabled: !!session,
  });

  const adminSettingsQuery = useQuery({
    queryKey: ['adminSettings'],
    queryFn: getAdminSettings,
    enabled: !!session,
  });

  const alertsQuery = useQuery({
    queryKey: ['workforceAlerts'],
    queryFn: getWorkforceAlerts,
    enabled: !!session,
  });

  const userDirectory: Array<{ id: number; email: string; role: string }> = adminUsersQuery.data?.data ?? [
    { id: 1, email: session?.user.email ?? 'admin@enterprise.workforce', role: session?.user.role ?? 'ADMIN' },
    { id: 2, email: 'hr@enterprise.workforce', role: 'HR' },
    { id: 3, email: 'manager@enterprise.workforce', role: 'MANAGER' },
  ];

  const unreadAlertCount = alertsQuery.data?.unreadCount ?? 0;

  // Format breadcrumbs from pathname
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const to = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const label = segment
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return { to, label };
  });

  const navItems = [
    { to: '/dashboard', label: 'Executive Dashboard', icon: Activity },
    { to: '/employees', label: 'Employees', icon: Users },
    { to: '/risk-analysis', label: 'Risk Analysis (ML)', icon: AlertTriangle },
    { to: '/skill-mapping', label: 'Skill Mapping', icon: GraduationCap },
    { to: '/skill-gaps', label: 'Skill Gaps', icon: Layers },
    { to: '/recommendations', label: 'Recommendations', icon: UserCheck },
    { to: '/alerts', label: 'Workforce Alerts', icon: Bell, badge: unreadAlertCount },
    { to: '/analytics', label: 'Talent Intelligence', icon: TrendingUp },
    { to: '/reports', label: 'Reports & Export', icon: FileText },
    { to: '/what-if', label: 'What-If Simulation', icon: Zap },
  ];

  const adminNavItems = [
    { to: '/settings', label: 'System Settings', icon: Settings },
    { to: '/audit-log', label: 'Security & Audit Log', icon: ShieldCheck, roles: ['ADMIN', 'HR'] },
  ];

  return (
    <div className="app-shell">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 40,
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="brand-icon">
              <BarChart3 size={28} />
            </div>
            <div>
              <div className="brand-title">STRATA.AI</div>
              <div className="brand-subtitle">Workforce Intelligence</div>
            </div>
          </div>
          <button
            className="icon-button mobile-only"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="nav-section">
          <div className="nav-label">Core Operations</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      backgroundColor: 'var(--danger)',
                      color: '#fff',
                      fontSize: '11px',
                      padding: '2px 7px',
                      borderRadius: '10px',
                      fontWeight: 600,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <nav className="nav-section">
          <div className="nav-label">Administration</div>
          {adminNavItems.map((item) => {
            if (item.roles && session && !item.roles.includes(session.user.role)) {
              return null;
            }
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Session Profile & Role Switcher */}
        <div className="user-panel">
          <div className="avatar-ring">
            <div className="avatar">
              {session?.user.name ? session.user.name.slice(0, 2).toUpperCase() : 'US'}
            </div>
          </div>
          <div>
            <div className="user-name" title={session?.user.email}>
              {session?.user.email ?? 'admin@enterprise.workforce'}
            </div>
            <div className="user-role">{session?.user.role ?? 'ADMIN'} Workspace</div>
          </div>
        </div>

        <div className="workspace-switcher">
          <div className="nav-label small-label">Simulate Role Workspace</div>
          {userDirectory.map((u) => (
            <button
              key={u.id}
              className={`workspace-user ${session?.user.role === u.role ? 'active' : ''}`}
              onClick={() => switchWorkspaceUser(u)}
              title={`Switch session perspective to ${u.role}`}
            >
              <span className="workspace-dot"></span>
              <span>{u.role}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main App Content Viewport */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-only"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div>
              {/* Dynamic Breadcrumbs */}
              <div
                className="page-kicker"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
              >
                <span>STRATA.AI</span>
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={crumb.to}>
                    <ChevronRight size={12} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: idx === breadcrumbs.length - 1 ? 'var(--primary)' : 'inherit' }}>
                      {crumb.label}
                    </span>
                  </React.Fragment>
                ))}
              </div>
              <h1 className="page-title">
                {breadcrumbs[breadcrumbs.length - 1]?.label || 'Command Center'}
              </h1>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="search-box">
              <Search size={16} />
              <input
                aria-label="Global search"
                placeholder="Search workforce, skills, alerts..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/employees?search=${encodeURIComponent((e.target as HTMLInputElement).value)}`);
                  }
                }}
              />
            </div>

            <button
              className="icon-button"
              onClick={() => navigate('/alerts')}
              aria-label="View notifications"
              style={{ position: 'relative' }}
            >
              <Bell size={20} />
              {unreadAlertCount > 0 && <span className="badge-dot"></span>}
            </button>

            <button className="primary-button" onClick={() => navigate('/reports')}>
              <Download size={16} /> Export
            </button>

            <button className="logout-button" onClick={logout} title="Sign out of workspace">
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </header>

        {/* Operational Context Sub-bar */}
        <section className="workspace-bar">
          <div className="workspace-title">
            <span className="workspace-badge">Workspace</span>
            <span className="workspace-name">{session?.user.role ?? 'ADMIN'} Enterprise Command Center</span>
          </div>
          <div className="workspace-status">
            <span className="online-dot"></span>
            <span>{adminSettingsQuery.data?.audit ?? 'enabled'} audit telemetry</span>
            <span className="divider"></span>
            <span>{adminSettingsQuery.data?.model ?? 'attrition_v1.0.0'} ML pipeline</span>
          </div>
        </section>

        {/* View Component Outlet */}
        <Outlet />
      </main>
    </div>
  );
}
