export type AgentType = 'Hypothesis' | 'Response' | 'Critic';

export type HypothesisStatus = 'active' | 'refined' | 'rejected';

export interface Hypothesis {
  id: string;
  description: string;
  confidence: number;
  status: HypothesisStatus;
  evidence: string[];
}

export interface AgentDecision {
  id: string;
  agentType: AgentType;
  timestamp: string;
  confidence: number;
  reasoning: string;
  action?: string;
}

export interface Incident {
  id: string;
  title: string;
  status: 'active' | 'resolved' | 'investigating';
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
  hypotheses: Hypothesis[];
  decisions: AgentDecision[];
}
