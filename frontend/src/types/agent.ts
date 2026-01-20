export type AgentState = 'idle' | 'analyzing' | 'responding' | 'criticizing' | 'finished';

export interface Agent {
  id: string;
  name: string;
  role: string;
  state: AgentState;
  lastAction?: string;
}

export interface ActionLogEntry {
  id: string;
  timestamp: string;
  agentName: string;
  action: string;
  details?: string;
}
