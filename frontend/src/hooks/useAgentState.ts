import { useState } from 'react';
import { Agent, AgentState } from '../types/agent';

export const useAgentState = () => {
  const [agents, setAgents] = useState<Agent[]>([
    { id: '1', name: 'Analyzer Agent', role: 'Hypothesis Generator', state: 'idle' },
    { id: '2', name: 'Responder Agent', role: 'Response Planner', state: 'idle' },
    { id: '3', name: 'Critic Agent', role: 'Decision Validator', state: 'idle' },
  ]);

  const updateAgentState = (agentId: string, state: AgentState, lastAction?: string) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId ? { ...agent, state, lastAction } : agent
      )
    );
  };

  return { agents, updateAgentState };
};
