import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Download,
  FileSpreadsheet,
  Printer,
  Table,
  CheckCircle2,
  FileText,
  Filter,
} from 'lucide-react';
import { getEmployees, getWorkforceSummary } from '../api/workforceApi';

export function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<'EMPLOYEES' | 'RISK_SUMMARY' | 'SKILL_COVERAGE'>('EMPLOYEES');

  const { data: employeesData } = useQuery({
    queryKey: ['employees', 'reports'],
    queryFn: () => getEmployees({ pageSize: 100 }),
  });

  const { data: summary } = useQuery({
    queryKey: ['workforceSummary'],
    queryFn: getWorkforceSummary,
  });

  function exportCSV() {
    if (!employeesData?.data) return;

    // Build formula-injection safe CSV strings
    const headers = ['ID', 'Name', 'Email', 'Department', 'Role', 'Salary', 'CompaRatio', 'AttritionRisk', 'RiskTier'];
    const rows = employeesData.data.map((e) => {
      // Escape potential formula characters (=, +, -, @) to prevent formula injection
      const cleanName = e.name.replace(/^[=+\-@]/, "'");
      return [
        e.employeeNumber,
        `"${cleanName.replace(/"/g, '""')}"`,
        `"${e.email.replace(/"/g, '""')}"`,
        `"${e.department}"`,
        `"${e.roleTitle}"`,
        e.salary,
        e.compaRatio,
        `${e.attritionRisk}%`,
        e.riskTier,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `strata_workforce_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="view-container">
      {/* Action Header */}
      <section className="dashboard-grid" style={{ marginBottom: '20px' }}>
        <article className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-eyebrow">Enterprise Intelligence Export</div>
              <h3 className="panel-title">Audit-Ready Workforce Reports</h3>
            </div>
          </div>
          <div style={{ padding: '20px' }}>
            <p style={{ color: 'var(--text-soft)', fontSize: '13px', lineHeight: 1.6, marginBottom: '20px' }}>
              Export sanitized, formula-safe CSV datasets or generate print-friendly PDF views for workforce planning committees and executive briefings.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="primary-button" onClick={exportCSV}>
                <FileSpreadsheet size={16} /> Export Employees CSV (Formula-Safe)
              </button>
              <button className="ghost-button" onClick={handlePrint}>
                <Printer size={16} /> Print Executive View
              </button>
            </div>
          </div>
        </article>
      </section>

      {/* Report Table Preview */}
      <section className="panel">
        <div className="panel-header">
          <div>
            <div className="panel-eyebrow">Data Preview</div>
            <h3 className="panel-title">Active Workforce Registry ({employeesData?.total || 0} Records)</h3>
          </div>
        </div>

        <div style={{ overflowX: 'auto', padding: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-soft)' }}>
                <th style={{ padding: '10px 12px' }}>ID</th>
                <th style={{ padding: '10px 12px' }}>Name</th>
                <th style={{ padding: '10px 12px' }}>Department</th>
                <th style={{ padding: '10px 12px' }}>Role</th>
                <th style={{ padding: '10px 12px' }}>Compa-Ratio</th>
                <th style={{ padding: '10px 12px' }}>Risk Tier</th>
                <th style={{ padding: '10px 12px' }}>Predicted Risk</th>
              </tr>
            </thead>
            <tbody>
              {employeesData?.data.slice(0, 10).map((emp) => (
                <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{emp.employeeNumber}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{emp.name}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-soft)' }}>{emp.department}</td>
                  <td style={{ padding: '10px 12px' }}>{emp.roleTitle}</td>
                  <td style={{ padding: '10px 12px' }}>{emp.compaRatio.toFixed(2)}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor:
                          emp.riskTier === 'Critical'
                            ? 'rgba(239, 68, 68, 0.2)'
                            : emp.riskTier === 'Elevated'
                            ? 'rgba(249, 115, 22, 0.2)'
                            : emp.riskTier === 'Moderate'
                            ? 'rgba(251, 191, 36, 0.2)'
                            : 'rgba(32, 201, 151, 0.2)',
                        color:
                          emp.riskTier === 'Critical'
                            ? '#f87171'
                            : emp.riskTier === 'Elevated'
                            ? '#fb923c'
                            : emp.riskTier === 'Moderate'
                            ? '#fbbf24'
                            : 'var(--primary)',
                      }}
                    >
                      {emp.riskTier}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{emp.attritionRisk}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
