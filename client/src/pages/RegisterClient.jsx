import { useState } from 'react';
import api from '../utils/api';

export default function RegisterClient() {
  const [name, setName] = useState('');
  const [redirectUris, setRedirectUris] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const uris = redirectUris.split(',').map((u) => u.trim()).filter(Boolean);
      const data = await api('/api/clients/register', {
        method: 'POST',
        body: { name, redirectUris: uris },
      });
      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-glow/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-white text-black font-bold text-sm rounded-lg mb-3">R</div>
          <p className="text-muted text-sm">Rachit's Auth</p>
          <h1 className="text-2xl font-bold text-white mt-2">Register Application</h1>
          <p className="text-muted text-sm mt-1">Register a new OAuth 2.0 client</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm text-muted mb-1.5">App Name</label>
            <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="My Awesome App" className="w-full px-3.5 py-2.5 bg-primary border border-border rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-gray-500 transition-colors" />
          </div>
          <div>
            <label htmlFor="redirectUris" className="block text-sm text-muted mb-1.5">Redirect URIs</label>
            <input id="redirectUris" type="text" required value={redirectUris} onChange={(e) => setRedirectUris(e.target.value)} placeholder="http://localhost:8080/callback" className="w-full px-3.5 py-2.5 bg-primary border border-border rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-gray-500 transition-colors" />
            <p className="text-xs text-gray-600 mt-1.5">Comma-separated list of redirect URIs</p>
          </div>
          {error && <div className="px-3.5 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Registering…' : 'Register App'}
          </button>
        </form>

        {result && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <h3 className="text-emerald-400 font-medium mb-3 text-sm">Client Registered Successfully</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted text-xs">Client ID</span>
                <code className="block mt-1 text-white bg-primary px-3 py-2 rounded-lg break-all font-mono text-xs border border-border">{result.client_id}</code>
              </div>
              <div>
                <span className="text-muted text-xs">Client Secret</span>
                <code className="block mt-1 text-white bg-primary px-3 py-2 rounded-lg break-all font-mono text-xs border border-border">{result.client_secret}</code>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
