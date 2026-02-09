/* CRITICAL: EMERGENCY DEMO MODE */
/* Replace existing api.ts content with this to force success for the video */

import toast from 'react-hot-toast';

// Keep for reference, but bypass in demo mode
const API_BASE_URL = 'https://cybersentinel-backend.onrender.com/api';

// Demo-mode Incident (raw)
const DEMO_RAW_INCIDENT = {
  id: 'demo-inc-001',
  title: 'Critical: Suspicious Firewall Activity',
  severity: 'critical',
  status: 'open',
  summary: 'Multiple failed SSH login attempts detected from unauthorized IP 192.168.1.45.',
  created_at: new Date().toISOString(),
  analysis: {
    hypotheses: [
      'Brute force credential stuffing attack targeting SSH.',
      'Compromised internal host attempting lateral movement.'
    ],
    recommended_actions: [
      'Immediately block IP 192.168.1.45 at firewall.',
      'Rotate SSH keys for affected host.',
      'Isolate host 10.0.0.5 from network.'
    ],
    confidence: 'High (92%)',
    reasoning: 'Pattern matches known brute-force signatures: rapid succession of auth failures on port 22.'
  }
};

// UI-facing Incident shape for existing components
const DEMO_INCIDENT = {
  id: 'INC-2024-001',
  title: 'Unauthorized Access Attempt',
  status: 'investigating',
  severity: 'critical',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  hypotheses: [
    {
      id: 'h1',
      description: 'Brute force attack on admin panel',
      confidence: 0.85,
      status: 'active',
      evidence: ['Multiple failed login attempts from 192.168.1.50']
    }
  ],
  decisions: [
    {
      id: 'd1',
      agentType: 'Hypothesis',
      timestamp: new Date().toISOString(),
      confidence: 0.9,
      reasoning: 'Analyzing login patterns. Detected 500+ failed attempts from a single IP.',
      action: 'Flagging IP for further investigation'
    }
  ]
};

const DEMO_INCIDENTS_LIST = [
  DEMO_INCIDENT,
  {
    id: 'INC-2024-002',
    title: 'DDoS Attack Detected',
    status: 'active',
    severity: 'high',
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    updatedAt: new Date().toISOString(),
    hypotheses: [],
    decisions: []
  },
  {
    id: 'INC-2024-003',
    title: 'Potential SQL Injection',
    status: 'resolved',
    severity: 'medium',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
    hypotheses: [],
    decisions: []
  }
];

// Helper to simulate delay
const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export const api = {
  // Emergency demo: accept any payload and report success
  ingestLog: async (logData: any) => {
    console.log('DEMO MODE: Ingesting log...', logData);
    await delay(500);
    toast.success('Log ingested and analyzed successfully (Demo Mode)');
    return { success: true, data: DEMO_RAW_INCIDENT } as any;
  },

  // Compatibility with current UI (IngestLogModal)
  ingestRawLog: async (_payload: any) => {
    console.log('DEMO MODE: ingestRawLog');
    await delay(300);
    return { success: true } as any;
  },

  analyzeIncident: async (_data: any) => {
    console.log('DEMO MODE: analyzeIncident');
    await delay(600);
    return {
      incident_id: 'demo-inc-001',
      status: 'analyzed',
      hypotheses: [
        {
          hypothesis_text: 'Brute force credential stuffing attack targeting SSH.',
          confidence: 0.92,
          evidence: ['Rapid succession of failed auth attempts on port 22'],
          threat_type: 'Credential Attack'
        },
        {
          hypothesis_text: 'Compromised internal host attempting lateral movement.',
          confidence: 0.64,
          evidence: ['Anomalous connections to multiple internal hosts'],
          threat_type: 'Lateral Movement'
        }
      ],
      response_plan: {
        actions: [
          'Block IP 192.168.1.45 at firewall',
          'Rotate SSH keys for affected hosts',
          'Isolate host 10.0.0.5 from network'
        ],
        priority: 'high',
        estimated_impact: 'Reduced risk of account takeover and lateral spread',
        false_positive_risk: 0.08
      },
      critic_review: {
        approved: true,
        concerns: []
      }
    } as any;
  },

  // Incidents list for dashboard
  getIncidents: async () => {
    console.log('DEMO MODE: Fetching incidents...');
    await delay(200);
    return DEMO_INCIDENTS_LIST as any;
  },

  // Single incident fetch
  getIncident: async (_id: string) => {
    await delay(150);
    return DEMO_INCIDENT as any;
  },

  // Optional detail endpoints used by some views
  getIncidentTimeline: async (_incidentId: string) => {
    await delay(150);
    return DEMO_INCIDENT.decisions as any;
  },

  // Tenant endpoints used by NewTenantModal
  createTenant: async (data: any) => {
    console.log('DEMO MODE: createTenant', data);
    await delay(200);
    return { id: 'tenant-demo-001', name: data?.name ?? 'Demo Tenant', config: {} } as any;
  },

  getTenant: async (_tenantId: string) => {
    await delay(100);
    return { id: 'tenant-demo-001', name: 'Demo Tenant', config: {} } as any;
  },

  // Agent flows
  advanceAgent: async (_data: any) => {
    await delay(100);
    return { success: true } as any;
  },

  reviewAgent: async (_data: any) => {
    await delay(100);
    return { success: true } as any;
  },

  // Health check
  checkHealth: async () => {
    return { status: 'ok' } as any;
  }
};

/* End of Emergency Code */
