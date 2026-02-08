import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Activity, Clock, Plus, Database } from 'lucide-react';
import { Incident } from '../types/incident';

interface DashboardProps {
  incidents: Incident[];
  loading: boolean;
  onIngestClick: () => void;
  onNewTenantClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ incidents, loading, onIngestClick, onNewTenantClick }) => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Active Incidents', value: incidents.filter(i => i.status !== 'resolved').length, icon: AlertCircle, color: 'text-accent' },
    { label: 'Resolved (24h)', value: incidents.filter(i => i.status === 'resolved').length, icon: CheckCircle2, color: 'text-secondary' },
    { label: 'System Health', value: '98.2%', icon: Activity, color: 'text-primary' },
    { label: 'Avg Triage Time', value: '14m', icon: Clock, color: 'text-muted-foreground' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Security Overview</h1>
          <p className="text-muted">Real-time monitoring and autonomous reasoning</p>
        </div>
        <div className="flex gap-3">
          <button 
            className="btn-secondary flex items-center gap-2"
            onClick={onIngestClick}
          >
            <Database className="w-4 h-4" />
            Ingest Log
          </button>
          <button 
            className="btn-primary flex items-center gap-2"
            onClick={onNewTenantClick}
          >
            <Plus className="w-4 h-4" />
            New Tenant
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-xs font-medium text-muted-foreground">+2.5%</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-card-border flex items-center justify-between bg-white/[0.02]">
          <h2 className="font-semibold">Recent Incidents</h2>
          <button 
            className="text-xs text-primary hover:underline"
            onClick={() => navigate('/incidents')}
          >
            View all
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-wider text-muted border-b border-card-border">
                <th className="px-6 py-3">Incident</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Severity</th>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted">Loading incidents...</td>
                </tr>
              ) : incidents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted">No active incidents found.</td>
                </tr>
              ) : (
                incidents.map((incident) => (
                  <tr 
                    key={incident.id} 
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                    onClick={() => navigate(`/incidents/${incident.id}`)}
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-sm">{incident.title}</p>
                      <p className="text-xs text-muted font-mono">{incident.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        incident.status === 'resolved' ? 'border-secondary/30 text-secondary bg-secondary/5' :
                        incident.status === 'active' ? 'border-accent/30 text-accent bg-accent/5' :
                        'border-primary/30 text-primary bg-primary/5'
                      }`}>
                        {incident.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium ${
                        incident.severity === 'critical' ? 'text-accent' :
                        incident.severity === 'high' ? 'text-orange-400' :
                        incident.severity === 'medium' ? 'text-primary' : 'text-muted'
                      }`}>
                        {incident.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted">
                      {new Date(incident.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-muted hover:text-foreground">
                        <Plus className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
