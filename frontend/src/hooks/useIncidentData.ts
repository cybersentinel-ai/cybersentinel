import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Incident } from '../types/incident';

export const useIncidentData = (incidentId?: string) => {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIncident = async (id: string) => {
    setLoading(true);
    try {
      const data = await api.getIncident(id);
      setIncident(data);
    } catch (err) {
      setError('Failed to fetch incident');
    } finally {
      setLoading(false);
    }
  };

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const data = await api.getIncidents();
      setIncidents(data);
    } catch (err) {
      setError('Failed to fetch incidents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (incidentId) {
      fetchIncident(incidentId);
    } else {
      fetchIncidents();
    }
  }, [incidentId]);

  return { incident, incidents, loading, error, refresh: incidentId ? () => fetchIncident(incidentId) : fetchIncidents };
};
