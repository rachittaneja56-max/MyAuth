import { useEffect } from 'react';

export default function Logout({ setIsAuthenticated }) {
  useEffect(() => {
    if (setIsAuthenticated) {
      setIsAuthenticated(false);
    }
    window.location.href = '/api/auth/logout';
  }, [setIsAuthenticated]);

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-2 border-border border-t-white rounded-full animate-spin mb-4" />
        <p className="text-muted text-sm">Signing out...</p>
      </div>
    </div>
  );
}
