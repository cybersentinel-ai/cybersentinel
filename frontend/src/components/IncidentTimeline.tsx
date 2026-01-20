import React from 'react';
import { AgentDecision } from '../types/incident';
import DecisionCard from './DecisionCard';

interface IncidentTimelineProps {
  decisions: AgentDecision[];
}

const IncidentTimeline: React.FC<IncidentTimelineProps> = ({ decisions }) => {
  if (!decisions || decisions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted">
        <p>No agent decisions recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="relative pl-8 space-y-6">
      {/* Vertical line */}
      <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-card-border"></div>
      
      {decisions.map((decision, index) => (
        <div key={decision.id} className="relative">
          {/* Timeline Dot */}
          <div className={`absolute -left-[30px] top-4 w-4 h-4 rounded-full border-2 border-background z-10 ${
            decision.agentType === 'Hypothesis' ? 'bg-blue-500' :
            decision.agentType === 'Response' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          
          <DecisionCard decision={decision} />
        </div>
      ))}
    </div>
  );
};

export default IncidentTimeline;
