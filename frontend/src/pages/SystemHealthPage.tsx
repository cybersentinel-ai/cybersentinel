import React from 'react';
import { Activity, Server, Database, Cpu, HardDrive, CheckCircle2 } from 'lucide-react';

interface ComponentHealth {
  name: string;
  status: 'Healthy' | 'Warning' | 'Critical';
  uptime: string;
  latency: string;
}

const mockComponents: ComponentHealth[] = [
  { name: 'API Gateway', status: 'Healthy', uptime: '99.99%', latency: '24ms' },
  { name: 'Analysis Engine', status: 'Healthy', uptime: '99.95%', latency: '142ms' },
  { name: 'WebSocket Server', status: 'Healthy', uptime: '99.98%', latency: '12ms' },
  { name: 'Primary Database', status: 'Warning', uptime: '99.90%', latency: '450ms' },
  { name: 'Knowledge Graph', status: 'Healthy', uptime: '99.99%', latency: '8ms' },
];

const SystemHealthPage: React.FC = () => {
  const getStatusColor = (status: ComponentHealth['status']) => {
    switch (status) {
      case 'Healthy': return 'text-secondary';
      case 'Warning': return 'text-orange-400';
      case 'Critical': return 'text-accent';
    }
  };

  const metrics = [
    { label: 'CPU Usage', value: '42%', icon: Cpu, detail: '8 Cores active' },
    { label: 'Memory', value: '12.4 GB', icon: HardDrive, detail: 'Of 32 GB total' },
    { label: 'Network In', value: '1.2 GB/s', icon: Activity, detail: 'Normal traffic' },
    { label: 'Active Agents', value: '124', icon: Server, detail: 'All agents online' },
  ];

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">System Health</h1>
        <p className="text-muted">Real-time infrastructure monitoring and component status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <metric.icon className="w-5 h-5 text-primary" />
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            </div>
            <p className="text-2xl font-bold">{metric.value}</p>
            <p className="text-sm font-medium">{metric.label}</p>
            <p className="text-xs text-muted mt-1">{metric.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-card-border bg-white/[0.02] flex items-center justify-between">
              <h2 className="font-semibold">Component Status</h2>
              <span className="flex items-center gap-2 text-xs text-secondary font-medium">
                <CheckCircle2 className="w-3 h-3" />
                All Systems Operational
              </span>
            </div>
            <div className="divide-y divide-card-border">
              {mockComponents.map((component) => (
                <div key={component.name} className="p-4 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
                  <div className="flex items-center gap-3">
                    <Database className={`w-5 h-5 ${getStatusColor(component.status)}`} />
                    <div>
                      <p className="text-sm font-medium">{component.name}</p>
                      <p className="text-xs text-muted">Latency: {component.latency}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-bold uppercase ${getStatusColor(component.status)}`}>
                      {component.status}
                    </p>
                    <p className="text-xs text-muted">Uptime: {component.uptime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="font-semibold mb-4">Database Health</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted">Storage Usage</span>
                  <span>78%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400 rounded-full" style={{ width: '78%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted">Read Operations</span>
                  <span>1.2k / sec</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted">Write Operations</span>
                  <span>450 / sec</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '30%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-primary/5 border-primary/20">
            <h2 className="font-semibold mb-2">Maintenance</h2>
            <p className="text-sm text-muted mb-4">Next scheduled maintenance window is in 4 days.</p>
            <button className="w-full btn-secondary text-xs">View Schedule</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthPage;
