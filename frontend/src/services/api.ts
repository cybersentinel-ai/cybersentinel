import axios from 'axios';
import { 
  Tenant, 
  CreateTenantRequest, 
  IngestLogRequest, 
  AnalyzeIncidentRequest, 
  AnalyzeIncidentResponse,
  AdvanceAgentRequest, 
  ReviewAgentRequest 
} from '../types/api';
import { Incident, AgentDecision } from '../types/incident';

const API_BASE_URL = 'https://cybersentinel-backend.onrender.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const api = {
  createTenant: (data: CreateTenantRequest) => 
    apiClient.post<Tenant>('/api/tenants', data).then(res => res.data),

  getTenant: (tenantId: string) => 
    apiClient.get<Tenant>(`/api/tenants/${tenantId}`).then(res => res.data),

  ingestLog: (tenantId: string, logData: IngestLogRequest) => 
    apiClient.post(`/api/tenants/${tenantId}/logs`, logData).then(res => res.data),

  ingestRawLog: (logData: any) =>
    apiClient.post('/api/logs/ingest', logData).then(res => res.data),

  analyzeIncident: (data: AnalyzeIncidentRequest) => 
    apiClient.post<AnalyzeIncidentResponse>('/api/incidents/analyze', data).then(res => res.data),

  getIncidentTimeline: (incidentId: string) => 
    apiClient.get<AgentDecision[]>(`/api/incidents/${incidentId}/timeline`).then(res => res.data),

  getIncident: (incidentId: string) =>
    apiClient.get<Incident>(`/api/incidents/${incidentId}`).then(res => res.data),
    
  getIncidents: () =>
    apiClient.get<Incident[]>('/api/incidents').then(res => res.data),

  advanceAgent: (data: AdvanceAgentRequest) => 
    apiClient.post('/api/agents/advance', data).then(res => res.data),

  reviewAgent: (data: ReviewAgentRequest) => 
    apiClient.post('/api/agents/review', data).then(res => res.data),
};
