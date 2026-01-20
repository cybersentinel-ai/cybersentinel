import { useState, useEffect, useCallback } from 'react';
import { WebSocketManager } from '../services/websocket';
import { Incident } from '../types/incident';

const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

export const useIncidentWebSocket = (tenantId: string) => {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMessage = useCallback((data: any) => {
    if (data.type === 'INCIDENT_UPDATE') {
      setIncident(data.payload);
    }
  }, []);

  const handleConnect = useCallback(() => {
    setIsConnected(true);
    setError(null);
  }, []);

  const handleDisconnect = useCallback(() => {
    setIsConnected(false);
  }, []);

  useEffect(() => {
    if (!tenantId) return;

    const wsManager = new WebSocketManager(
      `${WS_BASE_URL}/ws/incidents/${tenantId}`,
      handleMessage,
      handleConnect,
      handleDisconnect
    );

    wsManager.connect();

    return () => {
      wsManager.disconnect();
    };
  }, [tenantId, handleMessage, handleConnect, handleDisconnect]);

  return { incident, isConnected, error };
};
