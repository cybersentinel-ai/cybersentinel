import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import DashboardPage from './pages/DashboardPage';
import IncidentsPage from './pages/IncidentsPage';
import ThreatsPage from './pages/ThreatsPage';
import SystemHealthPage from './pages/SystemHealthPage';
import IncidentDetailPage from './pages/IncidentDetailPage';
import AdminPage from './pages/AdminPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import RequiresOnboarding from './components/RequiresOnboarding';

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute>
        <Onboarding />
      </ProtectedRoute>
    ),
  },
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
        element: (
          <ProtectedRoute>
            <RequiresOnboarding>
              <DashboardPage />
            </RequiresOnboarding>
          </ProtectedRoute>
        ),
      },
      {
        path: 'incidents',
        element: (
          <ProtectedRoute>
            <RequiresOnboarding>
              <IncidentsPage />
            </RequiresOnboarding>
          </ProtectedRoute>
        ),
      },
      {
        path: 'incidents/:id',
        element: (
          <ProtectedRoute>
            <RequiresOnboarding>
              <IncidentDetailPage />
            </RequiresOnboarding>
          </ProtectedRoute>
        ),
      },
      {
        path: 'threats',
        element: (
          <ProtectedRoute>
            <RequiresOnboarding>
              <ThreatsPage />
            </RequiresOnboarding>
          </ProtectedRoute>
        ),
      },
      {
        path: 'system-health',
        element: (
          <ProtectedRoute>
            <RequiresOnboarding>
              <SystemHealthPage />
            </RequiresOnboarding>
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute>
            <RequiresOnboarding>
              <AdminPage />
            </RequiresOnboarding>
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <RequiresOnboarding>
              <Settings />
            </RequiresOnboarding>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <RequiresOnboarding>
              <Profile />
            </RequiresOnboarding>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
