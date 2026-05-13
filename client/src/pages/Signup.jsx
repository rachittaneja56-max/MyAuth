import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api, { ApiError, errorAlertClass } from '../utils/api';

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [surfaceError, setSurfaceError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSurfaceError(null);
    setLoading(true);
    try {
      await api('/api/auth/signup', {
        method: 'POST',
        body: { name, email, password },
      });
      navigate('/login' + location.search);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Sign up failed';
      setSurfaceError(err instanceof ApiError ? err : new ApiError(msg));
    } finally {
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
          <h1 className="text-2xl font-bold text-white mt-2">Create account</h1>
          <p className="text-muted text-sm mt-1">Sign up to continue with Rachit's Auth</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm text-muted mb-1.5">Full name</label>
            <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className="w-full px-3.5 py-2.5 bg-primary border border-border rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-gray-500 transition-colors" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-muted mb-1.5">Email address</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-3.5 py-2.5 bg-primary border border-border rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-gray-500 transition-colors" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-muted mb-1.5">Password</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-3.5 py-2.5 bg-primary border border-border rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-gray-500 transition-colors" />
          </div>
          {surfaceError && (
            <div className={errorAlertClass(surfaceError)}>
              {surfaceError.message}
            </div>
          )}
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted uppercase">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <p className="text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to={`/login${location.search}`} className="text-white underline underline-offset-2 hover:no-underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
