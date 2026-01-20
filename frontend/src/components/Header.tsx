import React from 'react';
import { Shield, Bell, Settings } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-card-border bg-card/50 backdrop-blur-md sticky top-0 z-10 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Shield className="w-8 h-8 text-primary" />
        <h1 className="text-xl font-bold tracking-tight">CyberSentinel</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-white/5 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
        </button>
        <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-xs font-bold text-primary">
          AD
        </div>
      </div>
    </header>
  );
};

export default Header;
