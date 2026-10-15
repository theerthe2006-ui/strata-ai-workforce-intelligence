import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { session, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-soft)' }}>
          <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--primary)' }}>STRATA.AI</div>
          <div style={{ marginTop: '8px', fontSize: '14px' }}>Authenticating workforce session...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && session && !allowedRoles.includes(session.user.role)) {
    return (
      <div className="view-container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div className="panel" style={{ maxWidth: '520px', margin: '0 auto', padding: '40px' }}>
          <h2 style={{ color: 'var(--danger)', marginBottom: '12px' }}>Access Restricted</h2>
          <p style={{ color: 'var(--text-soft)', marginBottom: '24px' }}>
            Your current role (<strong>{session.user.role}</strong>) does not have authorization to view this enterprise module.
            Required roles: {allowedRoles.join(', ')}.
          </p>
          <a href="/dashboard" className="primary-button" style={{ display: 'inline-block', textDecoration: 'none' }}>
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
