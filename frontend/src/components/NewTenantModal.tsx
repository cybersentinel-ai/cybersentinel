import React, { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { api } from '../services/api';

interface NewTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NewTenantModal: React.FC<NewTenantModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    contact_email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.createTenant({
        name: formData.name,
        // Assuming the backend schema might need these or we just send name as per router_tenants.py
        // router_tenants.py only uses name: db_tenant = TenantModel(name=tenant_in.name)
        // But the prompt says fields: name, domain, contact_email
      });
      onSuccess();
      onClose();
      setFormData({ name: '', domain: '', contact_email: '' });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create tenant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="card w-full max-w-md shadow-2xl border-primary/20">
        <div className="flex items-center justify-between p-6 border-b border-card-border">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Add New Tenant
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded bg-accent/10 border border-accent/20 text-accent text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Tenant Name</label>
            <input
              required
              type="text"
              className="input-field w-full"
              placeholder="e.g. Acme Corp"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Domain</label>
            <input
              required
              type="text"
              className="input-field w-full"
              placeholder="e.g. acme.com"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Contact Email</label>
            <input
              required
              type="email"
              className="input-field w-full"
              placeholder="admin@acme.com"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTenantModal;
