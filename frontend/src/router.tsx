import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import DashboardPage from './pages/DashboardPage';
import IncidentsPage from './pages/IncidentsPage';
import ThreatsPage from './pages/ThreatsPage';
import SystemHealthPage from './pages/SystemHealthPage';
import IncidentDetailPage from './pages/IncidentDetailPage';
import AdminPage from './pages/AdminPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'incidents',
        element: <IncidentsPage />,
      },
      {
        path: 'incidents/:id',
        element: <IncidentDetailPage />,
      },
      {
        path: 'threats',
        element: <ThreatsPage />,
      },
      {
        path: 'system-health',
        element: <SystemHealthPage />,
      },
      {
        path: 'admin',
        element: <AdminPage />,
      },
    ],
  },
]);
