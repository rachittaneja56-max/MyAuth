import { useEffect } from 'react';

export default function Logout() {
  useEffect(() => {
    // Redirect to the backend logout endpoint which handles clearing cookies/session
    window.location.href = '/api/auth/logout';
  }, []);

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-2 border-border border-t-white rounded-full animate-spin mb-4" />
        <p className="text-muted text-sm">Signing out...</p>
      </div>
    </div>
  );
}
