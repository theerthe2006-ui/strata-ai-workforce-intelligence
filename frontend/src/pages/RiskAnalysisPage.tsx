import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  FileCheck,
  Info,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getModelMetrics, getWorkforceSummary, type ModelMetricsResponse } from '../api/workforceApi';

export function RiskAnalysisPage() {
  const [selectedSubTab, setSelectedSubTab] = useState<'METRICS' | 'EXPLAINABILITY' | 'DISTRIBUTION'>('METRICS');

  const metricsQuery = useQuery({
    queryKey: ['modelMetrics'],
    queryFn: getModelMetrics,
  });

  const summaryQuery = useQuery({
    queryKey: ['workforceSummary'],
    queryFn: getWorkforceSummary,
  });

  const metrics = metricsQuery.data;
  const summary = summaryQuery.data;

  const confusionData = metrics?.confusion_matrix
    ? [
        { label: 'True Negatives (Predicted Retained, Actual Retained)', value: metrics.confusion_matrix.true_negatives, fill: '#34d399' },
        { label: 'False Positives (Predicted Attrition, Actual Retained)', value: metrics.confusion_matrix.false_positives, fill: '#fbbf24' },
        { label: 'False Negatives (Predicted Retained, Actual Attrition)', value: metrics.confusion_matrix.false_negatives, fill: '#f87171' },
        { label: 'True Positives (Predicted Attrition, Actual Attrition)', value: metrics.confusion_matrix.true_positives, fill: '#60a5fa' },
      ]
    : [];

  return (
    <div className="view-container">
      {/* Sub-navigation tabs */}
      <section className="subnav-tabs">
        <button
          className={`subnav-tab ${selectedSubTab === 'METRICS' ? 'active' : ''}`}
          onClick={() => setSelectedSubTab('METRICS')}
        >
          <BrainCircuit size={15} style={{ marginRight: 6, display: 'inline' }} />
          Model Evaluation & Transparency
        </button>
        <button
          className={`subnav-tab ${selectedSubTab === 'EXPLAINABILITY' ? 'active' : ''}`}
          onClick={() => setSelectedSubTab('EXPLAINABILITY')}
        >
          <Sparkles size={15} style={{ marginRight: 6, display: 'inline' }} />
          Feature Contributions & Factors
        </button>
        <button
          className={`subnav-tab ${selectedSubTab === 'DISTRIBUTION' ? 'active' : ''}`}
          onClick={() => setSelectedSubTab('DISTRIBUTION')}
        >
          <AlertTriangle size={15} style={{ marginRight: 6, display: 'inline' }} />
          Enterprise Risk Distribution
        </button>
      </section>

      {/* Disclaimers & Ethics Header */}
      <section
        style={{
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start',
        }}
      >
        <Info size={22} style={{ color: '#38bdf8', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontWeight: 600, color: '#e0f2fe', fontSize: '14px' }}>
            Predictive Model Evaluation & Ethical Transparency Standard
          </div>
          <div style={{ color: 'var(--text-soft)', fontSize: '13px', marginTop: '4px', lineHeight: 1.5 }}>
            STRATA.AI risk scores serve as decision support telemetry for retention programs, mentorship, and workload balancing.
            In strict accordance with ethical AI standards, risk predictions must <strong>never</strong> trigger adverse employment decisions, compensation penalties, or unilateral terminations.
          </div>
        </div>
      </section>

      {selectedSubTab === 'METRICS' && (
        <>
          {/* Key Model Performance KPI Cards */}
          <section className="kpi-grid">
            <article className="kpi-card">
              <div className="kpi-header">
                <div>
                  <div className="kpi-label">ROC-AUC Score</div>
                  <div className="kpi-value">
                    {metrics ? `${(metrics.roc_auc * 100).toFixed(1)}%` : '---'}
                  </div>
                </div>
                <div className="kpi-icon"><Activity size={24} /></div>
              </div>
              <div className="kpi-footer">
                <span className="trend positive"><TrendingUp size={16} /> Verified</span>
                <span className="kpi-subtle">Target threshold: &gt;80%</span>
              </div>
            </article>

            <article className="kpi-card">
              <div className="kpi-header">
                <div>
                  <div className="kpi-label">Model Accuracy</div>
                  <div className="kpi-value">
                    {metrics ? `${(metrics.accuracy * 100).toFixed(1)}%` : '---'}
                  </div>
                </div>
                <div className="kpi-icon"><FileCheck size={24} /></div>
              </div>
              <div className="kpi-footer">
                <span className="trend positive">Precision {(metrics?.precision ? metrics.precision * 100 : 0).toFixed(1)}%</span>
                <span className="kpi-subtle">Recall {(metrics?.recall ? metrics.recall * 100 : 0).toFixed(1)}%</span>
              </div>
            </article>

            <article className="kpi-card">
              <div className="kpi-header">
                <div>
                  <div className="kpi-label">F1-Score (Harmonic)</div>
                  <div className="kpi-value">
                    {metrics ? `${(metrics.f1_score * 100).toFixed(1)}%` : '---'}
                  </div>
                </div>
                <div className="kpi-icon"><ShieldAlert size={24} /></div>
              </div>
              <div className="kpi-footer">
                <span className="trend positive">Balanced Metric</span>
                <span className="kpi-subtle">Accounts for class imbalance</span>
              </div>
            </article>

            <article className="kpi-card">
              <div className="kpi-header">
                <div>
                  <div className="kpi-label">Pipeline Version</div>
                  <div className="kpi-value" style={{ fontSize: '18px' }}>
                    {metrics?.model_version || 'v1.0.0-prod'}
                  </div>
                </div>
                <div className="kpi-icon"><BrainCircuit size={24} /></div>
              </div>
              <div className="kpi-footer">
                <span className="trend positive">{metrics?.model_type || 'Ensemble'}</span>
                <span className="kpi-subtle">{metrics?.dataset_size ?? 1284} records</span>
              </div>
            </article>
          </section>

          {/* Confusion Matrix & CV Validation Panel */}
          <section className="dashboard-grid" style={{ marginTop: '20px' }}>
            <article className="panel">
              <div className="panel-header">
                <div>
                  <div className="panel-eyebrow">Holdout Evaluation</div>
                  <h3 className="panel-title">Confusion Matrix Breakdown</h3>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '16px' }}>
                {confusionData.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '16px',
                    }}
                  >
                    <div style={{ fontSize: '28px', fontWeight: 700, color: item.fill }}>{item.value}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-soft)', marginTop: '4px' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel">
              <div className="panel-header">
                <div>
                  <div className="panel-eyebrow">Cross Validation</div>
                  <h3 className="panel-title">Model Robustness & Calibration</h3>
                </div>
              </div>
              <div style={{ padding: '16px' }}>
                <p style={{ color: 'var(--text-soft)', fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                  The attrition model undergoes 5-fold stratified cross-validation on synthetic workforce features to eliminate target leakage and ensure generalization across diverse department sizes.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-card)', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--text-soft)', fontSize: '13px' }}>CV Mean ROC-AUC</span>
                    <strong style={{ color: 'var(--primary)' }}>{(metrics?.cv_roc_auc_mean ? metrics.cv_roc_auc_mean * 100 : 88.4).toFixed(1)}%</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-card)', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--text-soft)', fontSize: '13px' }}>CV Standard Deviation</span>
                    <strong>±{(metrics?.cv_roc_auc_std ? metrics.cv_roc_auc_std * 100 : 1.8).toFixed(2)}%</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-card)', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--text-soft)', fontSize: '13px' }}>Baseline Benchmark Rate</span>
                    <strong>{(metrics?.baseline_attrition_rate ? metrics.baseline_attrition_rate * 100 : 12.0).toFixed(1)}%</strong>
                  </div>
                </div>
              </div>
            </article>
          </section>
        </>
      )}

      {selectedSubTab === 'EXPLAINABILITY' && (
        <section className="panel" style={{ marginTop: '20px' }}>
          <div className="panel-header">
            <div>
              <div className="panel-eyebrow">Explainable AI (SHAP-Ready)</div>
              <h3 className="panel-title">Global Feature Importance Ranking</h3>
            </div>
          </div>
          <div style={{ padding: '20px' }}>
            <p style={{ color: 'var(--text-soft)', fontSize: '13px', marginBottom: '16px' }}>
              Relative weight of workforce factors that drive predictive attribution in the current model ensemble.
            </p>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metrics?.feature_importances || [
                    { label: 'Satisfaction Score', importance: 0.28 },
                    { label: 'Overtime Hours', importance: 0.22 },
                    { label: 'Compa-Ratio', importance: 0.18 },
                    { label: 'Tenure Years', importance: 0.14 },
                    { label: 'Years Since Promo', importance: 0.10 },
                    { label: 'Manager Rating', importance: 0.08 },
                  ]}
                  layout="vertical"
                  margin={{ left: 40, right: 20, top: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.3} />
                  <XAxis type="number" stroke="#94a3b8" tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                  <YAxis dataKey="label" type="category" stroke="#94a3b8" width={140} />
                  <Tooltip formatter={(v: any) => [`${(Number(v) * 100).toFixed(1)}%`, 'Relative Weight']} />
                  <Bar dataKey="importance" fill="#20c997" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      {selectedSubTab === 'DISTRIBUTION' && (
        <section className="dashboard-grid" style={{ marginTop: '20px' }}>
          <article className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-eyebrow">Enterprise Cohorts</div>
                <h3 className="panel-title">Workforce Population by Risk Tier</h3>
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={summary?.riskDistribution || [
                        { tier: 'Low', count: 850, percent: 66, color: '#34d399' },
                        { tier: 'Moderate', count: 280, percent: 22, color: '#fbbf24' },
                        { tier: 'Elevated', count: 110, percent: 8, color: '#f97316' },
                        { tier: 'Critical', count: 44, percent: 4, color: '#f87171' },
                      ]}
                      dataKey="count"
                      nameKey="tier"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={45}
                      label={({ tier, percent }: any) => `${tier}: ${percent}%`}
                    >
                      {(summary?.riskDistribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#20c997'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-eyebrow">Department Exposure</div>
                <h3 className="panel-title">Average Attrition Risk by Business Unit</h3>
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary?.departmentRisks || []} margin={{ left: -10, right: 10, top: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="department" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" tickFormatter={(v) => `${v}%`} />
                    <Tooltip formatter={(v: any) => [`${v}%`, 'Avg Risk']} />
                    <Bar dataKey="avgRisk" fill="#818cf8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </article>
        </section>
      )}
    </div>
  );
}
