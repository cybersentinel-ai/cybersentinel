import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Incident } from '../types/incident';

const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'INC-2024-001',
    title: 'Unauthorized Access Attempt',
    status: 'investigating',
    severity: 'critical',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
    hypotheses: [
      {
        id: 'h1',
        description: 'Brute force attack on admin panel',
        confidence: 0.85,
        status: 'active',
        evidence: ['Multiple failed login attempts from 192.168.1.50']
      },
      {
        id: 'h2',
        description: 'Compromised admin credentials',
        confidence: 0.4,
        status: 'refined',
        evidence: ['Successful login from unusual location']
      }
    ],
    decisions: [
      {
        id: 'd1',
        agentType: 'Hypothesis',
        timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        confidence: 0.9,
        reasoning: 'Analyzing login patterns from the last 2 hours. Detected 500+ failed attempts from a single IP address targeting the /admin endpoint.',
        action: 'Flagging IP for further investigation'
      },
      {
        id: 'd2',
        agentType: 'Response',
        timestamp: new Date(Date.now() - 3600000 * 1.2).toISOString(),
        confidence: 0.95,
        reasoning: 'Given the high confidence of a brute force attack, immediate containment is required to prevent account takeover.',
        action: 'Temporary block on IP 192.168.1.50 and enable mandatory MFA for all admin accounts'
      },
      {
        id: 'd3',
        agentType: 'Critic',
        timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
        confidence: 0.8,
        reasoning: 'The proposed response is appropriate for containment. However, we should also scan for any successful logins that might have occurred just before the block.',
        action: 'Review all successful logins from the target IP in the last 24 hours'
      }
    ]
  },
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

export const useIncidentData = (incidentId?: string) => {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIncident = async (id: string) => {
    setLoading(true);
    try {
      const data = await api.getIncident(id);
      setIncident(data);
    } catch (err) {
      // Fallback to mock if individual incident not found
      const mock = MOCK_INCIDENTS.find(i => i.id === id);
      if (mock) {
        setIncident(mock);
      } else {
        setError('Failed to fetch incident');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const data = await api.getIncidents();
      if (data && data.length > 0) {
        setIncidents(data);
      }
    } catch (err) {
      console.error('Failed to fetch incidents, using mock data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (incidentId) {
      fetchIncident(incidentId);
    } else {
      fetchIncidents();
    }
  }, [incidentId]);

  return { incident, incidents, loading, error, refresh: incidentId ? () => fetchIncident(incidentId) : fetchIncidents };
};
