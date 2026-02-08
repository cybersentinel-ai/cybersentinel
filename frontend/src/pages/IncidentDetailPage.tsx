import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Share2, MoreVertical, ShieldAlert, Zap, Search, ShieldCheck } from 'lucide-react';
import { useIncidentData } from '../hooks/useIncidentData';
import { useIncidentWebSocket } from '../hooks/useIncidentWebSocket';
import IncidentTimeline from '../components/IncidentTimeline';
import HypothesisPanel from '../components/HypothesisPanel';
import ActionLog from '../components/ActionLog';
import DecisionCard from '../components/DecisionCard';

const IncidentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { incident: initialIncident, loading, error } = useIncidentData(id);
  
  // In a real app, tenantId would come from context or auth
  const { incident: liveIncident, isConnected } = useIncidentWebSocket('default-tenant');

  const incident = liveIncident || initialIncident;

  if (loading) return <div className="p-8 text-center">Loading incident details...</div>;
  if (error || !incident) return <div className="p-8 text-center text-accent">Error loading incident.</div>;

  const responsePlans = incident.decisions.filter(d => d.agentType === 'Response');
  const criticReviews = incident.decisions.filter(d => d.agentType === 'Critic');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Page Header */}
      <div className="px-6 py-4 border-b border-card-border bg-card/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/incidents" className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                incident.severity === 'critical' ? 'bg-accent text-white' : 
                incident.severity === 'high' ? 'bg-orange-500 text-white' :
                'bg-primary/20 text-primary'
              }`}>
                {incident.severity}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                incident.status === 'resolved' ? 'border-secondary/30 text-secondary' : 'border-primary/30 text-primary'
              }`}>
                {incident.status}
              </span>
              <span className="text-xs text-muted font-mono">{incident.id}</span>
              {isConnected && (
                <span className="flex items-center gap-1.5 ml-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                  <span className="text-[10px] text-secondary font-bold uppercase">Live</span>
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold">{incident.title}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
          <button className="btn-primary ml-2">Resolve Incident</button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="space-y-8">
              <section>
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Search className="w-5 h-5 text-primary" />
                  AI Analysis & Hypotheses
                </h2>
                <HypothesisPanel hypotheses={incident.hypotheses} />
              </section>

              <section>
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-secondary" />
                  Response Plans
                </h2>
                <div className="space-y-4">
                  {responsePlans.length > 0 ? (
                    responsePlans.map(plan => (
                      <DecisionCard key={plan.id} decision={plan} />
                    ))
                  ) : (
                    <p className="text-muted text-sm italic">No response plans generated yet.</p>
                  )}
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                  Critic Reviews
                </h2>
                <div className="space-y-4">
                  {criticReviews.length > 0 ? (
                    criticReviews.map(review => (
                      <DecisionCard key={review.id} decision={review} />
                    ))
                  ) : (
                    <p className="text-muted text-sm italic">No critic reviews recorded yet.</p>
                  )}
                </div>
              </section>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-primary" />
                Reasoning Timeline
              </h2>
              <IncidentTimeline decisions={incident.decisions} />
            </div>
          </div>
        </div>

        {/* Sidebar Log Area */}
        <div className="w-96 border-l border-card-border bg-card/10 flex flex-col overflow-hidden">
          <ActionLog 
            logs={incident.decisions.map(d => ({
              id: d.id,
              timestamp: d.timestamp,
              agentName: d.agentType + ' Agent',
              action: d.action || 'Analyzing situation',
              details: d.reasoning.substring(0, 100) + '...'
            }))} 
          />
        </div>
      </div>
    </div>
  );
};

export default IncidentDetailPage;
