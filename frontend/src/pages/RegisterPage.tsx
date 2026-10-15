import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Lock, Mail, ArrowLeft, UserPlus, CheckCircle } from 'lucide-react';
import { useAuth } from '../layout/AuthContext';

export function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [role, setRole] = useState('HR');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // In this version, self-registration provisionally connects via existing auth
      // or logs in directly with demo credentials
      await login({ email: email || 'hr@enterprise.workforce', password: password || 'password' });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Self-registration request could not be processed.');
    } finally {
      setIsSubmitting(false);
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
          <div className="eyebrow">Enterprise Access</div>
          <h2>Join your organization's talent intelligence workspace</h2>
          <p>
            Self-register for authorized role-based access to skill-gap detection,
            workforce capacity modeling, and talent mobility pipelines.
          </p>
        </div>
      </aside>

      <section className="login-panel login-panel-right">
        <div className="login-card">
          <div className="login-header">
            <div>
              <div className="eyebrow">Account Provisioning</div>
              <h2>Request Workspace Access</h2>
            </div>
            <span className="security-chip">
              <UserPlus size={14} />
              Role Provisioning
            </span>
          </div>

          <form className="login-form" onSubmit={handleRegister}>
            <label className="field-label" htmlFor="reg-name">
              Full Name
            </label>
            <div className="input-with-icon">
              <input
                id="reg-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
              />
            </div>

            <label className="field-label" htmlFor="reg-email">
              Work Email
            </label>
            <div className="input-with-icon">
              <Mail size={15} />
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@enterprise.workforce"
                required
              />
            </div>

            <label className="field-label" htmlFor="reg-pwd">
              Password
            </label>
            <div className="input-with-icon">
              <Lock size={15} />
              <input
                id="reg-pwd"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="field-label" htmlFor="reg-dept">
                  Department
                </label>
                <select
                  id="reg-dept"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                  }}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Support">Support</option>
                </select>
              </div>

              <div>
                <label className="field-label" htmlFor="reg-role">
                  Requested Role
                </label>
                <select
                  id="reg-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                  }}
                >
                  <option value="HR">HR Analyst</option>
                  <option value="MANAGER">Department Manager</option>
                  <option value="ADMIN">System Administrator</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="login-button" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Submit Provisioning Request'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--text-soft)' }}>
              Already have an enterprise account?{' '}
              <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
