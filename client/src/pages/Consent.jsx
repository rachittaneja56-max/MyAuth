import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { ApiError, errorAlertClass } from '../utils/api';

export default function Consent() {
  const [searchParams] = useSearchParams();
  const [surfaceError, setSurfaceError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConsent = async (consentGiven) => {
    setSurfaceError(null);
    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams.entries());
      const data = await api('/api/auth/consent', {
        method: 'POST',
        body: { ...params, consent_given: consentGiven },
      });
      const url = data.data?.redirectUrl ?? data.redirectUrl;
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setSurfaceError(err instanceof ApiError ? err : new ApiError(msg));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-glow/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-white text-black font-bold text-sm rounded-lg mb-3">R</div>
          <p className="text-muted text-sm">Rachit's Auth</p>
          <h1 className="text-2xl font-bold text-white mt-2">Authorization Request</h1>
          <p className="text-muted text-sm mt-2">An application is requesting access to your account.</p>
        </div>

        {surfaceError && (
          <div className={`mb-6 ${errorAlertClass(surfaceError)}`}>
            {surfaceError.message}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={() => handleConsent(false)} disabled={loading} className="flex-1 py-2.5 bg-transparent border border-border text-white text-sm font-medium rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Deny
          </button>
          <button onClick={() => handleConsent(true)} disabled={loading} className="flex-1 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Redirecting…' : 'Allow'}
          </button>
        </div>
      </div>
    </div>
  );
}
