import React, { useState } from 'react';
import { Shield, Bell, Settings, User, LogOut, Settings2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NewTenantModal from './NewTenantModal';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNewTenantModalOpen, setIsNewTenantModalOpen] = useState(false);

  return (
    <header className="h-16 border-b border-card-border bg-card/50 backdrop-blur-md sticky top-0 z-10 px-6 flex items-center justify-between">
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => navigate('/dashboard')}
      >
        <Shield className="w-8 h-8 text-primary" />
        <h1 className="text-xl font-bold tracking-tight text-white">CyberSentinel</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          className="btn-primary py-1.5 px-3 flex items-center gap-2 text-sm"
          onClick={() => setIsNewTenantModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">New Tenant</span>
        </button>

        <div className="h-6 w-[1px] bg-card-border mx-2"></div>

        <button className="p-2 hover:bg-white/5 rounded-full transition-colors relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border-2 border-card"></span>
        </button>
        <button 
          className="p-2 hover:bg-white/5 rounded-full transition-colors"
          onClick={() => navigate('/admin')}
        >
          <Settings className="w-5 h-5" />
        </button>
        
        <div className="relative">
          <button 
            className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-xs font-bold text-primary hover:bg-primary/30 transition-colors cursor-pointer"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            AD
          </button>

          {isProfileOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsProfileOpen(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-card border border-card-border rounded-lg shadow-xl py-1 z-20 animate-in fade-in zoom-in-95 duration-100">
                <button className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-white/5 transition-colors">
                  <User className="w-4 h-4 text-muted" />
                  Profile
                </button>
                <button className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-white/5 transition-colors">
                  <Settings2 className="w-4 h-4 text-muted" />
                  Account Settings
                </button>
                <div className="border-t border-card-border my-1"></div>
                <button className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-accent/10 text-accent transition-colors">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <NewTenantModal
        isOpen={isNewTenantModalOpen}
        onClose={() => setIsNewTenantModalOpen(false)}
        onSuccess={() => {
          console.log('Tenant created successfully');
        }}
      />
    </header>
  );
};

export default Header;
