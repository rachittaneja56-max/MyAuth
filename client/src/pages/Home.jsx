import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-primary text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-glow/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 pt-32 pb-20">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted mb-4">OAuth 2.0 + OpenID Connect</p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">Rachit's Auth</h1>
            <p className="text-muted text-base leading-relaxed mb-8 max-w-md">
              A working OpenID Connect-first server. It implements the moving parts of OIDC — login, consent, authorization codes, ID tokens, access tokens, refresh tokens, sessions, and the redirects that hold the whole flow together.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register-app" className="px-5 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                Register app
              </Link>
              <Link to="/login" className="px-5 py-2.5 bg-transparent border border-border text-white text-sm font-medium rounded-lg hover:bg-white/5 transition-colors">
                Sign in
              </Link>
              <Link to="/signup" className="px-5 py-2.5 bg-transparent border border-border text-white text-sm font-medium rounded-lg hover:bg-white/5 transition-colors">
                Create account
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">Try it practically</h2>
              <p className="text-muted text-sm leading-relaxed mb-4">
                Use the Register App page to create a client, then run the full OIDC authorization code flow end-to-end with PKCE.
              </p>
              <div className="flex gap-3">
                <Link to="/register-app" className="px-4 py-2 bg-white/10 border border-border text-white text-sm rounded-lg hover:bg-white/15 transition-colors">
                  Try it live
                </Link>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white/10 border border-border text-white text-sm rounded-lg hover:bg-white/15 transition-colors">
                  GitHub
                </a>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">What it supports</h2>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-glow rounded-full" />Authorization Code Flow</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-glow rounded-full" />PKCE, state, and nonce</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-glow rounded-full" />ID tokens, access tokens, and refresh tokens</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-glow rounded-full" />OIDC discovery (/.well-known/openid-configuration)</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-glow rounded-full" />Consent-based access control</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-glow rounded-full" />Client registration</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-2xl font-bold text-white mb-6">How to Integrate (with PKCE)</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold mb-4">1</div>
              <h3 className="text-lg font-semibold text-white mb-2">Register App</h3>
              <p className="text-muted text-sm mb-4">
                Register your external client application. You will receive a <code className="text-white">client_id</code> and <code className="text-white">client_secret</code>.
              </p>
            </div>
            
            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold mb-4">2</div>
              <h3 className="text-lg font-semibold text-white mb-2">Request Authorization</h3>
              <p className="text-muted text-sm mb-4">
                Generate a random <code className="text-white">code_verifier</code> and its SHA-256 hash (<code className="text-white">code_challenge</code>). Redirect the user:
              </p>
              <pre className="bg-black/50 p-3 rounded-lg text-xs text-muted overflow-x-auto font-mono">
{`GET /api/auth/authorize?
client_id=...&
redirect_uri=...&
response_type=code&
code_challenge=...&
code_challenge_method=S256`}
              </pre>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold mb-4">3</div>
              <h3 className="text-lg font-semibold text-white mb-2">Exchange Tokens</h3>
              <p className="text-muted text-sm mb-4">
                Receive the auth code and exchange it for JWTs by sending the original unhashed verifier to prove your identity:
              </p>
              <pre className="bg-black/50 p-3 rounded-lg text-xs text-muted overflow-x-auto font-mono">
{`POST /api/auth/token
{
  "client_id": "...",
  "client_secret": "...",
  "grant_type": "authorization_code",
  "code": "...",
  "code_verifier": "..."
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
