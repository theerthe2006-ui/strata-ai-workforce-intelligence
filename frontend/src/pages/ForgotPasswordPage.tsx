import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  }

  return (
    <div className="login-screen">
      <aside className="login-panel login-panel-left">
        <div className="login-brand">
          <span className="brand-logo">
            <Activity size={34} />
          </span>
          <div>
            <div className="brand-kicker">STRATA.AI Enterprise</div>
            <h1>Workforce Intelligence</h1>
          </div>
        </div>

        <div className="login-copy">
          <div className="eyebrow">Identity & Access</div>
          <h2>Self-Service Credential Recovery</h2>
          <p>
            Secure access recovery for enterprise workforce analysts, HR teams,
            and organizational leaders.
          </p>
        </div>
      </aside>

      <section className="login-panel login-panel-right">
        <div className="login-card">
          <div className="login-header">
            <div>
              <div className="eyebrow">Authentication Assistance</div>
              <h2>Reset Password</h2>
            </div>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <CheckCircle2 size={48} style={{ color: 'var(--primary)', margin: '0 auto 16px' }} />
              <h3 style={{ marginBottom: '8px' }}>Recovery Instructions Generated</h3>
              <p style={{ color: 'var(--text-soft)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                If <strong>{email}</strong> corresponds to an active STRATA.AI directory account, a secure verification link has been recorded. In this educational demo environment, credential updates can also be simulated via the System Admin console.
              </p>
              <Link to="/login" className="primary-button" style={{ display: 'inline-block', textDecoration: 'none' }}>
                Return to Login
              </Link>
            </div>
          ) : (
            <form className="login-form" onSubmit={handleSubmit}>
              <div style={{ fontSize: '13px', color: 'var(--text-soft)', marginBottom: '16px', lineHeight: 1.5 }}>
                Enter the work email associated with your STRATA.AI workforce account to receive password reset guidance.
              </div>

              <label className="field-label" htmlFor="forgot-email">
                Work Email
              </label>
              <div className="input-with-icon">
                <Mail size={15} />
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@enterprise.workforce"
                  required
                />
              </div>

              <button type="submit" className="login-button" style={{ marginTop: '12px' }}>
                Send Reset Instructions
              </button>

              <div style={{ textAlign: 'center', marginTop: '18px' }}>
                <Link to="/login" style={{ color: 'var(--text-soft)', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                  <ArrowLeft size={14} /> Back to Sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
