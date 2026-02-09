import React, { useEffect, useMemo, useState } from 'react';
import { Shield, Bell, Settings, User, LogOut, Settings2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NewTenantModal from './NewTenantModal';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isNewTenantModalOpen, setIsNewTenantModalOpen] = useState(false);

  const notifications = useMemo(() => ([
    { id: 1, text: 'Critical incident detected: Brute force attack', time: '5m ago', unread: true },
    { id: 2, text: 'New threat identified: SQL Injection attempt', time: '15m ago', unread: true },
    { id: 3, text: 'System health check completed', time: '1h ago', unread: false },
  ]), []);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.profile-dropdown')) setIsProfileOpen(false);
      if (!target.closest('.notif-dropdown')) setIsNotifOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out');
      navigate('/login');
    } catch (e: any) {
      toast.error(e?.message || 'Logout failed');
    }
  };

  const initials = currentUser?.email?.slice(0, 2).toUpperCase() || 'AD';

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
          className="btn-primary py-1.5 px-3 flex items-center gap-2 text-sm cursor-pointer"
          onClick={() => setIsNewTenantModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">New Tenant</span>
        </button>

        <div className="h-6 w-[1px] bg-card-border mx-2"></div>

        {/* Notifications Bell */}
        <div className="relative notif-dropdown">
          <button
            onClick={() => setIsNotifOpen(v => !v)}
            className="p-2 hover:bg-white/5 rounded-full transition-colors relative cursor-pointer"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-accent text-[10px] flex items-center justify-center rounded-full border-2 border-card text-white font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-card border border-card-border rounded-lg shadow-xl z-20">
              <div className="p-3 border-b border-card-border font-semibold text-white">Notifications</div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`p-3 border-b border-card-border hover:bg-white/5 cursor-pointer ${n.unread ? 'bg-white/[0.02]' : ''}`}>
                    <div className="text-sm text-white">{n.text}</div>
                    <div className="text-xs text-muted mt-1">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings Button */}
        <button
          className="p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer"
          onClick={() => navigate('/settings')}
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative profile-dropdown">
          <button
            className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-xs font-bold text-primary hover:bg-primary/30 transition-colors cursor-pointer"
            onClick={() => setIsProfileOpen(v => !v)}
          >
            {initials}
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-card-border rounded-lg shadow-xl py-1 z-20">
              <div className="px-4 py-2 text-xs text-muted border-b border-card-border truncate">
                {currentUser?.email}
              </div>
              <button
                className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => { setIsProfileOpen(false); navigate('/profile'); }}
              >
                <User className="w-4 h-4 text-muted" />
                Profile
              </button>
              <button
                className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => { setIsProfileOpen(false); navigate('/settings'); }}
              >
                <Settings2 className="w-4 h-4 text-muted" />
                Account Settings
              </button>
              <div className="border-t border-card-border my-1"></div>
              <button
                className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-accent/10 text-accent transition-colors cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <NewTenantModal
        isOpen={isNewTenantModalOpen}
        onClose={() => setIsNewTenantModalOpen(false)}
        onSuccess={() => {
          toast.success('Tenant created successfully');
        }}
      />
    </header>
  );
};

export default Header;
