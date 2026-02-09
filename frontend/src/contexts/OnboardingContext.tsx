import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

interface OnboardingData {
  tenantName: string;
  domain: string;
  contactEmail: string;
  alertThreshold: 'low' | 'medium' | 'high' | 'critical';
}

interface OnboardingContextValue {
  currentStep: number;
  steps: { id: string; title: string }[];
  nextStep: () => void;
  previousStep: () => void;
  onboardingComplete: boolean;
  onboardingData: OnboardingData;
  updateOnboardingData: (field: keyof OnboardingData, value: string) => void;
  completeOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}

export const OnboardingProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    tenantName: '',
    domain: '',
    contactEmail: '',
    alertThreshold: 'medium',
  });

  const steps = [
    { id: 'welcome', title: 'Welcome to CyberSentinel' },
    { id: 'tenant-setup', title: 'Set Up Your Tenant' },
    { id: 'alert-config', title: 'Configure Alerts' },
    { id: 'complete', title: 'All Set!' },
  ];

  useEffect(() => {
    if (currentUser) {
      const completed = localStorage.getItem(`onboarding_${currentUser.uid}`);
      if (completed === 'true') setOnboardingComplete(true);
    }
  }, [currentUser]);

  const completeOnboarding = () => {
    setOnboardingComplete(true);
    if (currentUser) localStorage.setItem(`onboarding_${currentUser.uid}`, 'true');
  };

  const nextStep = () => {
    setCurrentStep((s) => {
      if (s < steps.length - 1) return s + 1;
      completeOnboarding();
      return s;
    });
  };

  const previousStep = () => setCurrentStep((s) => Math.max(0, s - 1));

  const updateOnboardingData = (field: keyof OnboardingData, value: string) => {
    setOnboardingData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        steps,
        nextStep,
        previousStep,
        onboardingComplete,
        onboardingData,
        updateOnboardingData,
        completeOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
