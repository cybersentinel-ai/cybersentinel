import React from 'react';
import { Hypothesis } from '../types/incident';
import { clsx } from 'clsx';
import { Target, Zap, Ban } from 'lucide-react';

interface HypothesisPanelProps {
  hypotheses: Hypothesis[];
}

const HypothesisPanel: React.FC<HypothesisPanelProps> = ({ hypotheses }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Target className="w-4 h-4" />;
      case 'refined': return <Zap className="w-4 h-4" />;
      case 'rejected': return <Ban className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-primary/10 text-primary border-primary/20';
      case 'refined': return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'rejected': return 'bg-accent/10 text-accent border-accent/20';
      default: return 'bg-muted/10 text-muted border-muted/20';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Hypothesis Analysis</h2>
        <span className="text-xs text-muted font-mono">{hypotheses.length} Total</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hypotheses.map((h) => (
          <div key={h.id} className="card p-4 flex flex-col h-full">
            <div className="flex items-start justify-between mb-3">
              <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold uppercase border flex items-center gap-1", getStatusColor(h.status))}>
                {getStatusIcon(h.status)}
                {h.status}
              </span>
              <span className="text-xs font-bold text-foreground">{(h.confidence * 100).toFixed(0)}%</span>
            </div>
            
            <p className="text-sm font-medium mb-4 flex-1">{h.description}</p>
            
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider">Supporting Evidence</h4>
              <ul className="space-y-1">
                {h.evidence.map((ev, i) => (
                  <li key={i} className="text-xs text-muted flex items-start gap-2">
                    <span className="mt-1 w-1 h-1 rounded-full bg-primary flex-shrink-0"></span>
                    {ev}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-4 pt-3 border-t border-card-border flex items-center justify-between">
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div 
                  className={clsx("h-full", h.status === 'rejected' ? 'bg-accent' : 'bg-primary')} 
                  style={{ width: `${h.confidence * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HypothesisPanel;
