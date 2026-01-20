import axios from 'axios';
import { 
  Tenant, 
  CreateTenantRequest, 
  IngestLogRequest, 
  AnalyzeIncidentRequest, 
  AdvanceAgentRequest, 
  ReviewAgentRequest 
} from '../types/api';
import { Incident, AgentDecision } from '../types/incident';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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
    apiClient.post<Tenant>('/tenants', data).then(res => res.data),

  getTenant: (tenantId: string) => 
    apiClient.get<Tenant>(`/tenants/${tenantId}`).then(res => res.data),

  ingestLog: (tenantId: string, logData: IngestLogRequest) => 
    apiClient.post(`/tenants/${tenantId}/logs`, logData).then(res => res.data),

  analyzeIncident: (tenantId: string, data: AnalyzeIncidentRequest) => 
    apiClient.post(`/tenants/${tenantId}/analyze`, data).then(res => res.data),

  getIncidentTimeline: (incidentId: string) => 
    apiClient.get<AgentDecision[]>(`/incidents/${incidentId}/timeline`).then(res => res.data),

  getIncident: (incidentId: string) =>
    apiClient.get<Incident>(`/incidents/${incidentId}`).then(res => res.data),
    
  getIncidents: () =>
    apiClient.get<Incident[]>('/incidents').then(res => res.data),

  advanceAgent: (data: AdvanceAgentRequest) => 
    apiClient.post('/agents/advance', data).then(res => res.data),

  reviewAgent: (data: ReviewAgentRequest) => 
    apiClient.post('/agents/review', data).then(res => res.data),
};
