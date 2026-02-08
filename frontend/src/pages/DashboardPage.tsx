import React, { useState } from 'react';
import Dashboard from '../components/Dashboard';
import IngestLogModal from '../components/IngestLogModal';
import { useIncidentData } from '../hooks/useIncidentData';

const DashboardPage: React.FC = () => {
  const { incidents, loading } = useIncidentData();
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);

  return (
    <div className="container mx-auto px-6 py-8">
      <Dashboard 
        incidents={incidents} 
        loading={loading} 
        onIngestClick={() => setIsIngestModalOpen(true)}
      />
      
      <IngestLogModal 
        isOpen={isIngestModalOpen}
        onClose={() => setIsIngestModalOpen(false)}
      />
    </div>
  );
};

export default DashboardPage;
