import React, { useState } from 'react';
import Dashboard from '../components/Dashboard';
import IngestLogModal from '../components/IngestLogModal';
import NewTenantModal from '../components/NewTenantModal';
import { useIncidentData } from '../hooks/useIncidentData';

const DashboardPage: React.FC = () => {
  const { incidents, loading, refresh } = useIncidentData();
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [isNewTenantModalOpen, setIsNewTenantModalOpen] = useState(false);

  return (
    <div className="container mx-auto px-6 py-8">
      <Dashboard 
        incidents={incidents} 
        loading={loading} 
        onIngestClick={() => setIsIngestModalOpen(true)}
        onNewTenantClick={() => setIsNewTenantModalOpen(true)}
      />
      
      <IngestLogModal 
        isOpen={isIngestModalOpen}
        onClose={() => setIsIngestModalOpen(false)}
      />

      <NewTenantModal
        isOpen={isNewTenantModalOpen}
        onClose={() => setIsNewTenantModalOpen(false)}
        onSuccess={() => {
          // In a real app we might show a toast and refresh data
          console.log('Tenant created successfully');
        }}
      />
    </div>
  );
};

export default DashboardPage;
