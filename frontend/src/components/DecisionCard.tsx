import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { AgentDecision } from '../types/incident';
import { clsx } from 'clsx';

interface DecisionCardProps {
  decision: AgentDecision;
}

const DecisionCard: React.FC<DecisionCardProps> = ({ decision }) => {
  const [expanded, setExpanded] = useState(false);

  const getAgentColor = (type: string) => {
    switch (type) {
      case 'Hypothesis': return 'text-blue-400 border-blue-400/30 bg-blue-400/5';
      case 'Response': return 'text-green-400 border-green-400/30 bg-green-400/5';
      case 'Critic': return 'text-red-400 border-red-400/30 bg-red-400/5';
      default: return 'text-muted border-card-border bg-white/5';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Hypothesis': return <Info className="w-4 h-4" />;
      case 'Response': return <CheckCircle2 className="w-4 h-4" />;
      case 'Critic': return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="card overflow-hidden transition-all duration-200">
      <div 
        className="p-4 cursor-pointer flex items-start justify-between gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold uppercase border flex items-center gap-1", getAgentColor(decision.agentType))}>
              {getIcon(decision.agentType)}
              {decision.agentType}
            </span>
            <span className="text-xs text-muted">
              {new Date(decision.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <h3 className="font-medium text-sm leading-snug">
            {decision.reasoning.split('\n')[0]}
          </h3>
          
          <div className="mt-3 flex items-center gap-4">
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div 
                className={clsx("h-full rounded-full", 
                  decision.confidence > 0.8 ? 'bg-secondary' : 
                  decision.confidence > 0.5 ? 'bg-primary' : 'bg-accent'
                )}
                style={{ width: `${decision.confidence * 100}%` }}
              ></div>
            </div>
            <span className="text-xs font-mono text-muted">
              {(decision.confidence * 100).toFixed(0)}% Confidence
            </span>
          </div>
        </div>
        
        <button className="text-muted hover:text-foreground mt-1">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-card-border bg-white/[0.02]">
          <div className="space-y-3">
            <div>
              <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Detailed Reasoning</h4>
              <p className="text-sm text-foreground/80 whitespace-pre-wrap">{decision.reasoning}</p>
            </div>
            {decision.action && (
              <div className="p-2 rounded bg-primary/5 border border-primary/20">
                <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Proposed Action</h4>
                <p className="text-sm font-mono">{decision.action}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DecisionCard;
