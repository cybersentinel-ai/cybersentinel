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
  incidentId: string;
  parameters?: Record<string, any>;
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
