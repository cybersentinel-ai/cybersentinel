import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>
      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <p className="text-gray-400">{currentUser?.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">User ID</label>
          <p className="text-gray-400 font-mono text-sm">{currentUser?.uid}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Account Created</label>
          <p className="text-gray-400">
            {currentUser?.metadata?.creationTime
              ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
              : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
