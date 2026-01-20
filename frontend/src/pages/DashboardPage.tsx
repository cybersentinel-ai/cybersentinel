import React from 'react';
import Dashboard from '../components/Dashboard';
import { useIncidentData } from '../hooks/useIncidentData';

const DashboardPage: React.FC = () => {
  const { incidents, loading } = useIncidentData();

  return (
    <div className="container mx-auto px-6 py-8">
      <Dashboard incidents={incidents} loading={loading} />
    </div>
  );
};

export default DashboardPage;
