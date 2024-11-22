import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { EmailVerification } from '../components/EmailVerification';

export function ProfileView() {
  const { user, updateProfile, updatePassword, sendVerificationEmail, refreshUser, error } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUpdateError(null);
    setSuccessMessage('');

    try {
      await updateProfile(displayName);
      setSuccessMessage('Profile updated successfully');
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setUpdateError('New passwords do not match');
      return;
    }

    setLoading(true);
    setUpdateError(null);
    setSuccessMessage('');

    try {
      await updatePassword(currentPassword, newPassword);
      setSuccessMessage('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full rounded-lg border border-[#2a2a2a] bg-[#242424] text-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4 py-3 transition-colors";

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
        <p className="text-gray-400 mt-2">Update your profile information</p>
      </div>

      {user && !user.emailVerified && (
        <EmailVerification
          onSendVerification={sendVerificationEmail}
          onRefresh={refreshUser}
        />
      )}

      {successMessage && (
        <div className="bg-green-500 bg-opacity-10 text-green-400 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {updateError && (
        <div className="bg-red-500 bg-opacity-10 text-red-400 px-4 py-3 rounded-lg">
          {updateError}
        </div>
      )}

      <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
        <h2 className="text-lg font-semibold text-white mb-6">Update Profile</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={inputClasses}
              required
              minLength={2}
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={user?.email || ''}
                className={`${inputClasses} bg-opacity-50`}
                disabled
              />
              {user?.emailVerified && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-green-500">
                  Verified
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
        <h2 className="text-lg font-semibold text-white mb-6">Change Password</h2>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClasses}
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClasses}
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClasses}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}