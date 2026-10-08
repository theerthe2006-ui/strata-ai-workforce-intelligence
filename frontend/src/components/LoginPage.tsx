import { FormEvent, useState } from 'react';
import { Activity, Lock, Mail } from 'lucide-react';
import type { LoginRequest } from '../api/workforceApi';

interface LoginPageProps {
  onLogin: (credentials: LoginRequest) => Promise<void>;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('admin@enterprise.workforce');
  const [password, setPassword] = useState('password');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    setIsSubmitting(true);

    try {
      await onLogin({ email, password });
    } catch (caughtError) {
      const message = caughtError instanceof Error
        ? caughtError.message
        : 'Unable to sign in to the workforce workspace.';

      setError(message);
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
            <div className="brand-kicker">Workforce Intelligence</div>
            <h1>Enterprise HR Analytics</h1>
          </div>
        </div>

        <div className="login-copy">
          <div className="eyebrow">Command Center</div>
          <h2>People, Skills, Risk, and Workforce Intelligence</h2>
          <p>
            Monitor retention, model attrition exposure, measure department capacity,
            and prioritize skill development across the enterprise.
          </p>
          <div className="login-metrics">
            <div>
              <span className="metric-number">1,284</span>
              <span className="metric-label">Employees</span>
            </div>
            <div>
              <span className="metric-number">89%</span>
              <span className="metric-label">Coverage</span>
            </div>
            <div>
              <span className="metric-number">6.8%</span>
              <span className="metric-label">Risk</span>
            </div>
          </div>
        </div>
      </aside>

      <section className="login-panel login-panel-right">
        <div className="login-card">
          <div className="login-header">
            <div>
              <div className="eyebrow">Workforce AI</div>
              <h2>Welcome back</h2>
            </div>
            <span className="security-chip">
              <Lock size={14} />
              Secure Access
            </span>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="email">
              Work email
            </label>
            <div className="input-with-icon">
              <Mail size={15} />
              <input
                id="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </div>

            <label className="field-label" htmlFor="password">
              Password
            </label>
            <div className="input-with-icon">
              <Lock size={15} />
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </div>

            <div className="login-options">
              <label className="remember-row">
                <input type="checkbox" />
                <span>Keep me signed in</span>
              </label>
              <a href="#">Forgot password?</a>
            </div>

            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="login-button" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in to workspace'}
            </button>
          </form>

          <div className="login-footer">
            <span>Demo workspace</span>
            <span className="dot-separator"></span>
            <span>Enterprise SSO-ready</span>
          </div>
        </div>
      </section>
    </div>
  );
}
