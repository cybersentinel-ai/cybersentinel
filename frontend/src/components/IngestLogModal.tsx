import React, { useState } from 'react';
import { X, Loader2, AlertCircle, CheckCircle2, ShieldAlert, Brain, ClipboardList } from 'lucide-react';
import { api } from '../services/api';
import { AnalyzeIncidentResponse } from '../types/api';

interface IngestLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IngestLogModal: React.FC<IngestLogModalProps> = ({ isOpen, onClose }) => {
  const [logContent, setLogContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeIncidentResponse | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!logContent.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.analyzeIncident({
        tenant_id: "123e4567-e89b-12d3-a561-426614174000",
        events: [
          {
            timestamp: new Date().toISOString(),
            log_message: logContent,
            source: "user-input",
            severity: "high"
          }
        ]
      });
      setResult(response);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to analyze log');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAndClose = () => {
    setLogContent('');
    setResult(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-card-border w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl flex flex-col">
        <div className="p-6 border-b border-card-border flex items-center justify-between sticky top-0 bg-card z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Ingest & Analyze Log</h2>
              <p className="text-sm text-muted">Paste security events for autonomous reasoning</p>
            </div>
          </div>
          <button 
            onClick={resetAndClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-muted" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!result ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  Security Log Events
                </label>
                <textarea
                  value={logContent}
                  onChange={(e) => setLogContent(e.target.value)}
                  placeholder="Paste your logs here..."
                  className="w-full h-64 bg-background border border-card-border rounded-lg p-4 font-mono text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg flex items-center gap-3 text-accent">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading || !logContent.trim()}
                  className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
                      Analyze with AI
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Hypotheses Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Brain className="w-5 h-5" />
                  <h3 className="font-bold uppercase tracking-wider text-xs">AI Hypotheses</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.hypotheses.map((h, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-muted">Hypothesis {i + 1}</span>
                        <span className={`text-xs font-bold ${h.confidence > 0.7 ? 'text-secondary' : 'text-primary'}`}>
                          {Math.round(h.confidence * 100)}% Match
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{h.hypothesis_text}</p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Response Plan Section */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <ClipboardList className="w-5 h-5" />
                    <h3 className="font-bold uppercase tracking-wider text-xs">Response Plan</h3>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        result.response_plan.priority === 'high' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'
                      }`}>
                        {result.response_plan.priority} Priority
                      </span>
                    </div>
                    <ul className="space-y-3">
                      {result.response_plan.actions.map((action, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* Critic Review Section */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <ShieldAlert className="w-5 h-5" />
                    <h3 className="font-bold uppercase tracking-wider text-xs">Critic Review</h3>
                  </div>
                  <div className={`border rounded-lg p-5 space-y-4 ${
                    result.critic_review.approved 
                      ? 'bg-secondary/5 border-secondary/20' 
                      : 'bg-accent/5 border-accent/20'
                  }`}>
                    <div className="flex items-center gap-2">
                      {result.critic_review.approved ? (
                        <CheckCircle2 className="w-5 h-5 text-secondary" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-accent" />
                      )}
                      <span className={`font-bold text-sm ${
                        result.critic_review.approved ? 'text-secondary' : 'text-accent'
                      }`}>
                        {result.critic_review.approved ? 'Approved for Execution' : 'Refinement Required'}
                      </span>
                    </div>
                    {result.critic_review.concerns.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase text-muted">Concerns:</p>
                        <ul className="space-y-2">
                          {result.critic_review.concerns.map((concern, i) => (
                            <li key={i} className="text-sm text-muted-foreground italic">
                              "{concern}"
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={resetAndClose}
                  className="btn-secondary px-6"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngestLogModal;
