import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './styles/globals.css';
import { AuthProvider } from './contexts/AuthContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <OnboardingProvider>
        <Toaster position="top-right" />
        <RouterProvider router={router} />
      </OnboardingProvider>
    </AuthProvider>
  </React.StrictMode>
);
