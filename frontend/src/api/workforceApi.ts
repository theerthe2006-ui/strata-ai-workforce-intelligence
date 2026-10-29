import axios from 'axios';

const authStorageKey = 'enterprise-workforce-auth-session';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem(authStorageKey);
    if (raw) {
      const session = JSON.parse(raw);
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    }
  } catch {
    // Ignore parse error
  }
  return config;
});

// Auto-clear stale/invalid sessions on 401 to ensure the UI cleanly transitions
// to an unauthenticated/login state, without retrying protected requests unauthenticated.
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && localStorage.getItem(authStorageKey)) {
      localStorage.removeItem(authStorageKey);
      window.dispatchEvent(new StorageEvent('storage', { key: authStorageKey }));
    }
    return Promise.reject(error);
  }
);

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserSession {
  id: number;
  name: string;
  email: string;
  role: string;
  workspace: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  workspace: string;
  user: UserSession;
}

export interface DepartmentRisk {
  department: string;
  employeeCount: number;
  avgRisk: number;
  highRiskCount: number;
  fill: string;
}

export interface RiskTierBucket {
  tier: string;
  count: number;
  percent: number;
  color: string;
}

export interface AttritionTrendPoint {
  month: string;
  attritionRisk: number;
  industryBenchmark: number;
  retentionActions: number;
}

export interface WorkforceSummaryResponse {
  totalEmployees: number;
  highRiskEmployees: number;
  criticalRiskEmployees: number;
  averageAttritionRisk: number;
  retentionOpportunityValue: number;
  skillCoverage: number;
  internalMobilityMatches: number;
  activeProjects: number;
  openAlertsCount: number;
  departmentRisks: DepartmentRisk[];
  riskDistribution: RiskTierBucket[];
  attritionTrend: AttritionTrendPoint[];
}

export interface EmployeeListItem {
  id: number;
  employeeNumber: string;
  name: string;
  email: string;
  department: string;
  roleTitle: string;
  level: string;
  salary: number;
  compaRatio: number;
  tenureYears: number;
  performanceScore: number;
  engagementScore: number;
  attritionRisk: number;
  riskTier: string;
  status: string;
}

export interface EmployeeListResponse {
  data: EmployeeListItem[];
  page: number;
  pageSize: number;
  total: number;
}

export interface ContributingFactor {
  feature: string;
  label: string;
  value: number;
  baseline: number;
  impact_points: number;
  is_risk_driver: boolean;
  action: string;
  impact_display: string;
}

export interface EmployeeSkillItem {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  proficiencyLabel: string;
  confidence: number;
  lastUsed: string;
}

export interface RetentionRecommendationItem {
  id: number;
  type: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  estimatedRiskReduction: number;
}

export interface InternalRoleMatch {
  projectName: string;
  projectCode: string;
  department: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  estimatedRiskReduction?: number;
}

export interface EmployeeDetailResponse {
  id: number;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  department: string;
  roleTitle: string;
  level: string;
  salary: number;
  salaryGrowthRate: number;
  compaRatio: number;
  tenureYears: number;
  experienceYears: number;
  age: number;
  hireDate: string;
  performanceScore: number;
  satisfactionScore: number;
  engagementScore: number;
  monthlyHours: number;
  overtimeHours: number;
  projectCount: number;
  promotionsCount: number;
  yearsSinceLastPromotion: number;
  managerRating: number;
  managerName: string;
  attritionRisk: number;
  riskTier: string;
  confidenceScore: number;
  contributingFactors: ContributingFactor[];
  skills: EmployeeSkillItem[];
  recommendations: RetentionRecommendationItem[];
  internalRoleMatches: InternalRoleMatch[];
  historicalRiskTrend: Array<{ quarter: string; risk: number }>;
}

export interface SkillGapItem {
  skill: string;
  requiredHeadcount: number;
  availableHeadcount: number;
  deficit: number;
  gapPercent: number;
  gapTier: string;
  requiredProficiency: string;
  affectedProjects: string[];
  recommendedAction: string;
  potentialCandidates: Array<{
    employeeId: number;
    name: string;
    currentProficiency: string;
    department: string;
  }>;
}

export interface SkillGapResponse {
  totalGapsIdentified: number;
  criticalGapsCount: number;
  gaps: SkillGapItem[];
}

export interface FutureSkillForecastItem {
  id: number;
  skill: string;
  category: string;
  currentCoverage: number;
  projected1YrDemand: number;
  projected3YrDemand: number;
  growthRate: number;
  gapTier: string;
  strategicRationale: string;
}

export interface FutureSkillForecastResponse {
  forecasts: FutureSkillForecastItem[];
  methodology: string;
}

export interface WhatIfSimulationRequest {
  employee_id: string | number;
  satisfaction_score?: number;
  engagement_score?: number;
  monthly_hours?: number;
  overtime_hours?: number;
  compa_ratio?: number;
  years_since_last_promotion?: number;
  manager_rating?: number;
  salary_growth_rate?: number;
}

export interface WhatIfSimulationResponse {
  original_risk: number;
  original_tier: string;
  simulated_risk: number;
  simulated_tier: string;
  risk_reduction_points: number;
  percentage_reduction: number;
  simulated_contributing_factors: ContributingFactor[];
  estimated_retention_roi: {
    annual_salary: number;
    replacement_cost_avoided: number;
    retention_success_likelihood: string;
  };
  applied_interventions: string[];
  employeeName: string;
  employeeNumber: string;
}

export interface TalentMatchCandidate {
  employeeId: number;
  employeeNumber: string;
  name: string;
  currentRole: string;
  department: string;
  matchPercentage: number;
  attritionRisk: number;
  riskTier: string;
  matchedSkills: Array<{ skill: string; proficiency: number }>;
  missingSkills: string[];
  recommendedUpskilling: string[];
}

export interface TalentMatchResponse {
  requiredSkills: string[];
  totalCandidatesEvaluated: number;
  candidates: TalentMatchCandidate[];
}

export interface DigitalTwinScenarioRequest {
  scenario_type: 'ATTRITION_SHOCK' | 'UPSKILLING_WAVE' | 'TECH_SHIFT';
  parameters: Record<string, any>;
}

export interface DigitalTwinScenarioResponse {
  scenarioName: string;
  [key: string]: any;
}

export interface SuccessionPlanItem {
  id: number;
  roleTitle: string;
  department: string;
  currentHolder: string;
  successorName: string;
  readinessTier: string;
  readinessScore: number;
  missingSkills: string[];
}

export interface SuccessionResponse {
  successionPlans: SuccessionPlanItem[];
}

export interface WorkforceAlertItem {
  id: number;
  type: string;
  severity: string;
  title: string;
  description: string;
  entityId: string;
  isRead: boolean;
  createdAt: string;
}

export interface WorkforceAlertsResponse {
  alerts: WorkforceAlertItem[];
  unreadCount: number;
}

export interface ModelMetricsResponse {
  model_type: string;
  model_version: string;
  dataset_size: number;
  train_samples: number;
  test_samples: number;
  baseline_attrition_rate: number;
  roc_auc: number;
  precision: number;
  recall: number;
  f1_score: number;
  accuracy: number;
  cv_roc_auc_mean: number;
  cv_roc_auc_std: number;
  confusion_matrix: {
    true_negatives: number;
    false_positives: number;
    false_negatives: number;
    true_positives: number;
  };
  feature_importances: Array<{
    feature: string;
    label: string;
    importance: number;
  }>;
}

export interface ParsedResumeSkill {
  name: string;
  category: string;
  proficiency: number;
  proficiency_label: string;
  confidence: number;
}

export interface ParsedResumeResponse {
  status: string;
  message: string;
  profile: {
    filename: string;
    candidate_name: string;
    email: string | null;
    phone: string | null;
    estimated_experience_years: number;
    total_skills_detected: number;
    skills: ParsedResumeSkill[];
    categories: Array<{
      category: string;
      count: number;
      skills: ParsedResumeSkill[];
    }>;
    role_recommendations: Array<{
      role: string;
      match_confidence: number;
    }>;
    document_snippet: string;
    confidence_score: number;
  };
}

export interface VirtualUser {
  id: number;
  email: string;
  name: string;
  role: string;
  department: string | null;
}

// API Methods
export async function login(credentials: LoginRequest): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>('/api/v1/auth/login', credentials);
  return data;
}

export async function getVirtualUsers(): Promise<{ data: VirtualUser[] }> {
  const { data } = await apiClient.get<{ data: VirtualUser[] }>('/api/v1/auth/users');
  return data;
}

export async function getWorkforceSummary(): Promise<WorkforceSummaryResponse> {
  const { data } = await apiClient.get<WorkforceSummaryResponse>('/api/v1/workforce/summary');
  return data;
}

export async function getEmployees(params?: {
  search?: string;
  department?: string;
  risk_tier?: string;
  page?: number;
  pageSize?: number;
}): Promise<EmployeeListResponse> {
  const { data } = await apiClient.get<EmployeeListResponse>('/api/v1/workforce/employees', {
    params,
  });
  return data;
}

export async function getEmployeeDetail(id: string | number): Promise<EmployeeDetailResponse> {
  const { data } = await apiClient.get<EmployeeDetailResponse>(`/api/v1/workforce/employees/${id}`);
  return data;
}

export async function getSkillGaps(): Promise<SkillGapResponse> {
  const { data } = await apiClient.get<SkillGapResponse>('/api/v1/workforce/skills/gaps');
  return data;
}

export async function getFutureSkillForecasts(): Promise<FutureSkillForecastResponse> {
  const { data } = await apiClient.get<FutureSkillForecastResponse>('/api/v1/workforce/skills/forecast');
  return data;
}

export async function simulateWhatIf(payload: WhatIfSimulationRequest): Promise<WhatIfSimulationResponse> {
  const { data } = await apiClient.post<WhatIfSimulationResponse>('/api/v1/workforce/attrition/simulate', payload);
  return data;
}

export async function matchTalent(payload: {
  required_skills: string[];
  department?: string;
  min_match_percent?: number;
}): Promise<TalentMatchResponse> {
  const { data } = await apiClient.post<TalentMatchResponse>('/api/v1/workforce/talent-match', payload);
  return data;
}

export interface RecommendationRecord {
  id: number;
  employeeId: number;
  employeeNumber: string;
  employeeName: string;
  department: string;
  type: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  estimatedRiskReduction: number;
  createdAt: string | null;
}

export async function getRecommendations(params?: {
  priority?: string;
  status_filter?: string;
}): Promise<{ data: RecommendationRecord[]; total: number }> {
  const { data } = await apiClient.get<{ data: RecommendationRecord[]; total: number }>(
    '/api/v1/recommendations',
    { params }
  );
  return data;
}

export async function updateRecommendationStatus(
  id: number,
  newStatus: string
): Promise<{ message: string }> {
  const { data } = await apiClient.patch<{ message: string }>(
    `/api/v1/recommendations/${id}/status`,
    null,
    { params: { new_status: newStatus } }
  );
  return data;
}

export interface RoleTransitionRecommendation {
  projectId: number;
  projectName: string;
  projectCode: string;
  department: string;
  targetRole: string;
  matchPercentage: number;
  matchedSkills: Array<{ skill: string; proficiency: number }>;
  missingSkills: string[];
  estimatedRiskReduction: number;
  simulatedPostTransitionRisk: number;
  priority: string;
  strategicRationale: string;
}

export interface EmployeeRoleTransitionsResponse {
  employeeId: number;
  employeeNumber: string;
  employeeName: string;
  currentRole: string;
  department: string;
  attritionRisk: number;
  riskTier: string;
  primaryRiskDrivers: string[];
  verifiedSkillsCount: number;
  recommendationsCount: number;
  roleRecommendations: RoleTransitionRecommendation[];
}

export async function getRoleTransitionRecommendations(
  employeeId: string | number
): Promise<EmployeeRoleTransitionsResponse> {
  const { data } = await apiClient.get<EmployeeRoleTransitionsResponse>(
    `/api/v1/recommendations/role-transitions/${employeeId}`
  );
  return data;
}

export async function applyRoleTransitionRecommendation(
  employeeId: string | number,
  payload: { project_code: string; title?: string; description?: string }
): Promise<{ message: string; id: number; status: string; estimatedRiskReduction: number }> {
  const { data } = await apiClient.post<{
    message: string;
    id: number;
    status: string;
    estimatedRiskReduction: number;
  }>(`/api/v1/recommendations/role-transitions/${employeeId}/apply`, payload);
  return data;
}

export async function simulateDigitalTwin(
  payload: DigitalTwinScenarioRequest
): Promise<DigitalTwinScenarioResponse> {
  const { data } = await apiClient.post<DigitalTwinScenarioResponse>(
    '/api/v1/workforce/digital-twin/simulate',
    payload
  );
  return data;
}

export async function getSuccessionPipeline(): Promise<SuccessionResponse> {
  const { data } = await apiClient.get<SuccessionResponse>('/api/v1/workforce/succession');
  return data;
}

export async function getWorkforceAlerts(): Promise<WorkforceAlertsResponse> {
  const { data } = await apiClient.get<WorkforceAlertsResponse>('/api/v1/workforce/alerts');
  return data;
}

export async function markAlertRead(alertId: number): Promise<{ success: boolean }> {
  const { data } = await apiClient.post<{ success: boolean }>(`/api/v1/workforce/alerts/${alertId}/read`);
  return data;
}

export async function getModelMetrics(): Promise<ModelMetricsResponse> {
  const { data } = await apiClient.get<ModelMetricsResponse>('/api/v1/workforce/model-metrics');
  return data;
}

export async function uploadResume(formData: FormData): Promise<ParsedResumeResponse> {
  const { data } = await apiClient.post<ParsedResumeResponse>('/api/v1/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
}

export async function getAttritionPrediction(): Promise<{ recommendations: string[] }> {
  return {
    recommendations: [
      'Upskill critical software engineering teams in Cloud & AI architecture',
      'Provide retention adjustments for employees under 0.85 compa-ratio',
      'Conduct manager check-ins for high overtime teams',
    ],
  };
}

export async function getAdminUsers(): Promise<{ data: Array<{ id: number; email: string; role: string }> }> {
  const { data } = await apiClient.get<{ data: Array<{ id: number; email: string; role: string }> }>('/api/v1/admin/users');
  return data;
}

export async function getAdminSettings(): Promise<{ theme: string; model: string; audit: string }> {
  const { data } = await apiClient.get<{ theme: string; model: string; audit: string }>('/api/v1/admin/settings');
  return data;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  status: 'SUCCESS' | 'WARNING' | 'ALERT';
}

export async function getAuditLogs(): Promise<{ data: AuditLogEntry[] }> {
  const { data } = await apiClient.get<{ data: AuditLogEntry[] }>('/api/v1/admin/audit-logs');
  return data;
}


