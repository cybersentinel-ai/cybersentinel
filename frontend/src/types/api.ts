export interface Tenant {
  id: string;
  name: string;
  config: Record<string, any>;
}

export interface CreateTenantRequest {
  name: string;
  config?: Record<string, any>;
}

export interface IngestLogRequest {
  source: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface AnalyzeIncidentRequest {
  tenant_id: string;
  events: {
    timestamp: string;
    log_message: string;
    source: string;
    severity: string;
  }[];
}

export interface HypothesisData {
  hypothesis_text: string;
  confidence: number;
  evidence: string[];
  threat_type: string;
}

export interface ResponsePlanData {
  actions: string[];
  priority: string;
  estimated_impact: string;
  false_positive_risk: number;
}

export interface CriticReviewData {
  approved: boolean;
  concerns: string[];
  revised_actions?: string[];
}

export interface AnalyzeIncidentResponse {
  incident_id: string;
  status: string;
  hypotheses: HypothesisData[];
  response_plan: ResponsePlanData;
  critic_review: CriticReviewData;
}

export interface AdvanceAgentRequest {
  incidentId: string;
  agentId: string;
}

export interface ReviewAgentRequest {
  incidentId: string;
  agentId: string;
  approved: boolean;
  feedback?: string;
}
