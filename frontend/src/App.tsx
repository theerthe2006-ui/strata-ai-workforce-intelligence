import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './layout/AuthContext';
import { ProtectedRoute } from './layout/ProtectedRoute';
import { AppShell } from './layout/AppShell';

// Pages
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { RiskAnalysisPage } from './pages/RiskAnalysisPage';
import { SkillMappingPage } from './pages/SkillMappingPage';
import { SkillGapsPage } from './pages/SkillGapsPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { AlertsPage } from './pages/AlertsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReportsPage } from './pages/ReportsPage';
import { WhatIfPage } from './pages/WhatIfPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuditLogPage } from './pages/AuditLogPage';
import { NotFoundPage } from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function LoginRoute() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <LoginPage
      onLogin={async (credentials) => {
        await login(credentials);
        navigate('/dashboard');
      }}
    />
  );
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Protected Application Routes inside AppShell */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/employees/:id" element={<EmployeesPage />} />
          <Route path="/risk-analysis" element={<RiskAnalysisPage />} />
          <Route path="/skill-mapping" element={<SkillMappingPage />} />
          <Route path="/skill-gaps" element={<SkillGapsPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/what-if" element={<WhatIfPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Role-Restricted Route: Audit Log (ADMIN and HR only) */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'HR']} />}>
            <Route path="/audit-log" element={<AuditLogPage />} />
          </Route>
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
