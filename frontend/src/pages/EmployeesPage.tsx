import React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { EmployeeIntelligence } from '../components/EmployeeIntelligence';

export function EmployeesPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const initialEmployeeId = id || searchParams.get('id') || undefined;

  function handleNavigateWhatIf(employeeId: string) {
    navigate(`/what-if?employeeId=${employeeId}`);
  }

  return (
    <EmployeeIntelligence
      initialEmployeeId={initialEmployeeId}
      onNavigateWhatIf={handleNavigateWhatIf}
    />
  );
}
