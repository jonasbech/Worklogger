import React, { useState } from 'react';
import { AlertTriangle, Mail } from 'lucide-react';

interface EmailVerificationProps {
  onSendVerification: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

export function EmailVerification({ onSendVerification, onRefresh }: EmailVerificationProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSendVerification = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await onSendVerification();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh verification status');
    }
  };

  return (
    <div className="bg-yellow-500 bg-opacity-10 rounded-lg p-4 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2">
        <div className="text-yellow-500 font-medium">Email verification required</div>
        <p className="text-sm text-yellow-500/80">
          Please verify your email address to access all features. Check your inbox for the verification link.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSendVerification}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-yellow-500 text-black rounded hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mail className="w-4 h-4" />
            {loading ? 'Sending...' : 'Resend verification email'}
          </button>
          <button
            onClick={handleRefresh}
            className="text-sm text-yellow-500/80 hover:text-yellow-500 transition-colors"
          >
            I've verified my email
          </button>
        </div>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-500">Verification email sent! Please check your inbox.</p>
        )}
      </div>
    </div>
  );
}