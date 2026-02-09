import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../contexts/OnboardingContext';
import { useAuth } from '../contexts/AuthContext';

const RequiresOnboarding: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { onboardingComplete } = useOnboarding();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && !onboardingComplete) {
      navigate('/onboarding');
    }
  }, [currentUser, onboardingComplete, navigate]);

  return onboardingComplete ? <>{children}</> : null;
};

export default RequiresOnboarding;
