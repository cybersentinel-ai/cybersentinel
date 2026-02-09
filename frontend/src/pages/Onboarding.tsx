import React from 'react';
import { useOnboarding } from '../contexts/OnboardingContext';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiArrowRight, FiArrowLeft } from 'react-icons/fi';

const Onboarding: React.FC = () => {
  const {
    currentStep,
    steps,
    nextStep,
    previousStep,
    onboardingData,
    updateOnboardingData,
  } = useOnboarding();
  const navigate = useNavigate();

  const handleFinish = () => {
    nextStep();
    navigate('/dashboard');
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">🛡️</div>
            <h2 className="text-3xl font-bold text-white">Welcome to CyberSentinel</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Your AI-powered Security Operations Center. Let's get you set up in just a few steps
              to start protecting your infrastructure.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-3xl mx-auto">
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="text-3xl mb-2">🤖</div>
                <h3 className="text-white font-semibold">AI Analysis</h3>
                <p className="text-gray-400 text-sm mt-2">Intelligent threat detection</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="text-white font-semibold">Real-time Monitoring</h3>
                <p className="text-gray-400 text-sm mt-2">24/7 security surveillance</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="text-white font-semibold">Advanced Analytics</h3>
                <p className="text-gray-400 text-sm mt-2">Comprehensive insights</p>
              </div>
            </div>
          </div>
        );

      case 'tenant-setup':
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Set Up Your Tenant</h2>
              <p className="text-gray-400">Configure your organization's security workspace</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tenant Name *</label>
                <input
                  type="text"
                  value={onboardingData.tenantName}
                  onChange={(e) => updateOnboardingData('tenantName', e.target.value)}
                  placeholder="e.g., Linfy Tech Solutions"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Domain *</label>
                <input
                  type="text"
                  value={onboardingData.domain}
                  onChange={(e) => updateOnboardingData('domain', e.target.value)}
                  placeholder="e.g., linfytech.xyz"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Contact Email *</label>
                <input
                  type="email"
                  value={onboardingData.contactEmail}
                  onChange={(e) => updateOnboardingData('contactEmail', e.target.value)}
                  placeholder="e.g., linfordle14@gmail.com"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 'alert-config':
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Configure Alert Thresholds</h2>
              <p className="text-gray-400">Set your preferred security alert sensitivity</p>
            </div>
            <div className="space-y-4">
              {(['low', 'medium', 'high', 'critical'] as const).map((level) => (
                <div
                  key={level}
                  onClick={() => updateOnboardingData('alertThreshold', level)}
                  className={`p-6 border-2 rounded-lg cursor-pointer transition ${
                    onboardingData.alertThreshold === level
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold capitalize">{level}</h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {level === 'low' && 'Alert on all potential threats'}
                        {level === 'medium' && 'Balanced approach (recommended)'}
                        {level === 'high' && 'Only significant threats'}
                        {level === 'critical' && 'Critical threats only'}
                      </p>
                    </div>
                    {onboardingData.alertThreshold === level && (
                      <FiCheckCircle className="text-blue-500" size={24} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-white">You're All Set!</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Your CyberSentinel workspace is ready. Start monitoring threats and protecting
              your infrastructure immediately.
            </p>
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl mx-auto text-left">
              <h3 className="text-white font-semibold mb-4">Your Configuration:</h3>
              <div className="space-y-2 text-gray-300">
                <p><strong>Tenant:</strong> {onboardingData.tenantName}</p>
                <p><strong>Domain:</strong> {onboardingData.domain}</p>
                <p><strong>Contact:</strong> {onboardingData.contactEmail}</p>
                <p><strong>Alert Level:</strong> <span className="capitalize">{onboardingData.alertThreshold}</span></p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-gray-800 h-2">
        <div
          className="bg-blue-500 h-2 transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="w-full max-w-4xl">{renderStepContent()}</div>
      </div>

      {/* Navigation */}
      <div className="p-8 border-t border-gray-800">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={previousStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <FiArrowLeft />
            <span>Previous</span>
          </button>

          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-blue-500 w-8'
                    : index < currentStep
                    ? 'bg-blue-500 w-2'
                    : 'bg-gray-600 w-2'
                }`}
              />
            ))}
          </div>

          <button
            onClick={currentStep === steps.length - 1 ? handleFinish : nextStep}
            disabled={
              currentStep === 1 &&
              (!onboardingData.tenantName || !onboardingData.domain || !onboardingData.contactEmail)
            }
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
            <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
