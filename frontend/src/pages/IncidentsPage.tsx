import React from 'react';
import { AlertCircle, Clock, Shield, Search } from 'lucide-react';

interface Incident {
  id: string;
  title: string;
  status: 'Investigating' | 'Contained' | 'Resolved';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  timestamp: string;
  affectedSystems: string[];
}

const mockIncidents: Incident[] = [
  {
    id: 'INC-2024-001',
    title: 'Unauthorized Access Attempt',
    status: 'Investigating',
    severity: 'Critical',
    timestamp: '2024-01-20 04:30:00',
    affectedSystems: ['Auth-Service', 'User-DB'],
  },
  {
    id: 'INC-2024-002',
    title: 'DDoS Attack Detected',
    status: 'Contained',
    severity: 'High',
    timestamp: '2024-01-19 22:15:00',
    affectedSystems: ['Public-API-Gateway'],
  },
  {
    id: 'INC-2024-003',
    title: 'Potential SQL Injection',
    status: 'Resolved',
    severity: 'Medium',
    timestamp: '2024-01-19 18:45:00',
    affectedSystems: ['Internal-Admin-Portal'],
  },
  {
    id: 'INC-2024-004',
    title: 'Anomalous Data Export',
    status: 'Investigating',
    severity: 'High',
    timestamp: '2024-01-20 01:20:00',
    affectedSystems: ['Data-Warehouse'],
  },
];

const IncidentsPage: React.FC = () => {
  const getSeverityColor = (severity: Incident['severity']) => {
    switch (severity) {
      case 'Critical': return 'text-accent border-accent/30 bg-accent/5';
      case 'High': return 'text-orange-400 border-orange-400/30 bg-orange-400/5';
      case 'Medium': return 'text-primary border-primary/30 bg-primary/5';
      case 'Low': return 'text-muted border-muted/30 bg-muted/5';
    }
  };

  const getStatusColor = (status: Incident['status']) => {
    switch (status) {
      case 'Investigating': return 'text-primary border-primary/30 bg-primary/5';
      case 'Contained': return 'text-orange-400 border-orange-400/30 bg-orange-400/5';
      case 'Resolved': return 'text-secondary border-secondary/30 bg-secondary/5';
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Incident Board</h1>
          <p className="text-muted">Security Operations Center (SOC) active incidents</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input 
            type="text" 
            placeholder="Search incidents..." 
            className="input-field pl-10 w-full md:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockIncidents.map((incident) => (
          <div key={incident.id} className="card p-6 hover:bg-white/[0.02] transition-colors cursor-pointer group">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getSeverityColor(incident.severity)}`}>
                    {incident.severity}
                  </span>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{incident.title}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{incident.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[11px] bg-white/5 px-2 py-0.5 rounded">
                    {incident.id}
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    <span>{incident.affectedSystems.join(', ')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-muted uppercase font-bold tracking-wider mb-1">Status</span>
                  <span className={`px-3 py-1 rounded-md text-sm font-medium border ${getStatusColor(incident.status)}`}>
                    {incident.status}
                  </span>
                </div>
                <button className="btn-secondary px-6">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mockIncidents.length === 0 && (
        <div className="card p-12 text-center">
          <AlertCircle className="w-12 h-12 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium">No incidents found</h3>
          <p className="text-muted">Everything looks clear at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default IncidentsPage;
