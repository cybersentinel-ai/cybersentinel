import React from 'react';
import { ActionLogEntry } from '../types/agent';

interface ActionLogProps {
  logs: ActionLogEntry[];
}

const ActionLog: React.FC<ActionLogProps> = ({ logs }) => {
  return (
    <div className="card h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-card-border bg-white/[0.02]">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted">Agent Action Feed</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-muted">Waiting for agent activity...</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-3">
              <span className="text-muted/50 flex-shrink-0">
                [{new Date(log.timestamp).toLocaleTimeString()}]
              </span>
              <div className="space-y-1">
                <span className="text-primary font-bold">{log.agentName}</span>
                <span className="mx-2 text-muted-foreground">→</span>
                <span className="text-foreground">{log.action}</span>
                {log.details && (
                  <p className="mt-1 text-muted-foreground/70 leading-relaxed italic">
                    {log.details}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActionLog;
