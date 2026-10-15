import React from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, ArrowLeft, Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        padding: '24px',
      }}
    >
      <div
        className="panel"
        style={{
          maxWidth: '480px',
          width: '100%',
          textAlign: 'center',
          padding: '48px 24px',
        }}
      >
        <AlertOctagon size={54} style={{ color: 'var(--warning)', margin: '0 auto 16px' }} />
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>404 — Route Not Found</h1>
        <p style={{ color: 'var(--text-soft)', fontSize: '14px', lineHeight: 1.6, marginBottom: '28px' }}>
          The requested STRATA.AI endpoint does not exist or has been relocated within the workforce workspace directory.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <Link to="/dashboard" className="primary-button" style={{ textDecoration: 'none' }}>
            <Home size={16} /> Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
