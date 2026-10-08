import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from './components/Dashboard';
import { LoginPage } from './components/LoginPage';
import { login, type LoginRequest, type TokenResponse } from './api/workforceApi';

const queryClient = new QueryClient();
const authStorageKey = 'enterprise-workforce-auth-session';

function App() {
  const [session, setSession] = useState<TokenResponse | null>(() => {
    try {
      const storedSession = localStorage.getItem(authStorageKey);
      return storedSession ? JSON.parse(storedSession) as TokenResponse : null;
    } catch {
      return null;
    }
  });

  async function handleLogin(credentials: LoginRequest) {
    const payload = await login(credentials);
    setSession(payload);
    localStorage.setItem(authStorageKey, JSON.stringify(payload));
  }

  function handleLogout() {
    setSession(null);
    localStorage.removeItem(authStorageKey);
  }

  return (
    <QueryClientProvider client={queryClient}>
      {session ? (
        <Dashboard session={session} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </QueryClientProvider>
  );
}

export default App;
