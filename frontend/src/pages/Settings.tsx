import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Settings: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Account Settings</h1>
      <div className="bg-gray-800 rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
          <input
            type="email"
            value={currentUser?.email || ''}
            disabled
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">User ID</label>
          <input
            type="text"
            value={currentUser?.uid || ''}
            disabled
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400"
          />
        </div>
        <div className="pt-4 border-t border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
          <p className="text-gray-400">Additional settings coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
