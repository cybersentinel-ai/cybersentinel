import React from 'react';
import { Users, Shield, Globe, Key } from 'lucide-react';

const AdminPage: React.FC = () => {
  const settings = [
    { title: 'Tenant Management', icon: Globe, desc: 'Configure multi-tenant isolation and routing.' },
    { title: 'Agent Configuration', icon: Shield, desc: 'Tweak agent reasoning parameters and thresholds.' },
    { title: 'Access Control', icon: Key, desc: 'Manage user roles and API keys.' },
    { title: 'User Directory', icon: Users, desc: 'View and manage system users.' },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">Administration</h1>
      <p className="text-muted mb-8">System-wide settings and management</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settings.map((s) => (
          <div key={s.title} className="card p-6 hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <s.icon className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold">{s.title}</h2>
            </div>
            <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
