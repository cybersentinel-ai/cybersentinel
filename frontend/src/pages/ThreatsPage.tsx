import React from 'react';
import { ShieldAlert, Zap, Globe, Target } from 'lucide-react';

interface Threat {
  id: string;
  type: string;
  indicator: string;
  riskScore: number;
  actor: string;
  lastSeen: string;
}

const mockThreats: Threat[] = [
  {
    id: 'THR-001',
    type: 'Malware C2',
    indicator: '185.123.45.67',
    riskScore: 92,
    actor: 'Lazarus Group',
    lastSeen: '2024-01-20 03:15:00',
  },
  {
    id: 'THR-002',
    type: 'Phishing Domain',
    indicator: 'secure-login-verify.com',
    riskScore: 78,
    actor: 'Unknown',
    lastSeen: '2024-01-20 02:45:00',
  },
  {
    id: 'THR-003',
    type: 'Exfiltration Tool',
    indicator: 'rclone-modified.exe',
    riskScore: 85,
    actor: 'APT28',
    lastSeen: '2024-01-19 23:30:00',
  },
  {
    id: 'THR-004',
    type: 'Exploit Attempt',
    indicator: 'CVE-2023-23397',
    riskScore: 95,
    actor: 'Fancy Bear',
    lastSeen: '2024-01-20 05:00:00',
  },
];

const ThreatsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Threat Intelligence</h1>
        <p className="text-muted">Global threat feed and indicators of compromise (IOCs)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold">1,284</p>
            <p className="text-xs text-muted uppercase font-bold tracking-wider">Active Threats</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">87</p>
            <p className="text-xs text-muted uppercase font-bold tracking-wider">New Indicators</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
            <Globe className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <p className="text-2xl font-bold">14</p>
            <p className="text-xs text-muted uppercase font-bold tracking-wider">Regions Affected</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-orange-400/10 flex items-center justify-center">
            <Target className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-muted uppercase font-bold tracking-wider">Known Actors</p>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-card-border bg-white/[0.02]">
          <h2 className="font-semibold">Intelligence Feed</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-wider text-muted border-b border-card-border">
                <th className="px-6 py-3">Indicator</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Actor</th>
                <th className="px-6 py-3">Risk Score</th>
                <th className="px-6 py-3">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {mockThreats.map((threat) => (
                <tr key={threat.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-mono text-sm text-primary">{threat.indicator}</p>
                    <p className="text-[10px] text-muted font-mono uppercase tracking-tighter">{threat.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{threat.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">{threat.actor}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            threat.riskScore > 90 ? 'bg-accent' :
                            threat.riskScore > 75 ? 'bg-orange-400' : 'bg-primary'
                          }`}
                          style={{ width: `${threat.riskScore}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold ${
                        threat.riskScore > 90 ? 'text-accent' :
                        threat.riskScore > 75 ? 'text-orange-400' : 'text-primary'
                      }`}>
                        {threat.riskScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted">
                    {threat.lastSeen}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ThreatsPage;
