import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, AlertCircle, ShieldAlert, Activity, Users } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: AlertCircle, label: 'Incidents', path: '/incidents' },
    { icon: ShieldAlert, label: 'Threats', path: '/threats' },
    { icon: Activity, label: 'System Health', path: '/system-health' },
    { icon: Users, label: 'Admin', path: '/admin' },
  ];

  return (
    <aside className="w-64 border-r border-card-border bg-card/30 flex flex-col">
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted hover:bg-white/5 hover:text-foreground'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-card-border">
        <div className="card p-3 bg-primary/5 border-primary/20">
          <p className="text-xs text-muted mb-2">Current Tenant</p>
          <p className="text-sm font-medium">Default Tenant</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
