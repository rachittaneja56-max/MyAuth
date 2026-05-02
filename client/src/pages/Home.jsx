import { Link } from 'react-router-dom';

const CodeBlock = ({ children }) => (
  <pre className="bg-black/60 border border-border rounded-xl p-4 overflow-x-auto text-[13px] text-gray-300 font-mono leading-relaxed whitespace-pre">
    {children}
  </pre>
);

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
              <h2 className="text-lg font-semibold text-white mb-3">Test the Flow (Demo App)</h2>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted mb-5">
                <li><Link to="/signup" className="text-glow hover:underline">Create an account</Link> or <Link to="/login" className="text-glow hover:underline">Sign in</Link>.</li>
                <li>Go to <Link to="/register-app" className="text-glow hover:underline">Register App</Link> and create a client.</li>
                <li>Copy your new <code className="text-white bg-white/10 px-1.5 py-0.5 rounded text-xs">client_id</code> and <code className="text-white bg-white/10 px-1.5 py-0.5 rounded text-xs">client_secret</code>.</li>
                <li>Open the Demo App, enter the ID and Secret, and click Login!</li>
              </ol>
              <div className="flex gap-3">
                <a href="https://authdemo.rachittaneja.in" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white text-black font-medium text-sm rounded-lg hover:bg-gray-200 transition-colors">
                  Open Demo App ↗
                </a>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">What it supports</h2>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-glow rounded-full" />Authorization Code Flow with PKCE</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-glow rounded-full" />ID tokens, access tokens, and refresh tokens (RS256)</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-glow rounded-full" />OIDC discovery (/.well-known/openid-configuration)</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-glow rounded-full" />Consent-based access control</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-glow rounded-full" />Client registration & management</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 bg-glow rounded-full" />Global logout with redirect</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-glow mb-3">Developer Guide</p>
            <h2 className="text-3xl font-bold text-white mb-3">How to Integrate</h2>
            <p className="text-muted text-sm max-w-xl">
              Add "Sign in with Rachit's Auth" to your app in 4 steps. Your app only handles redirects and token exchange — we host the entire login, signup, and consent UI for you.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">1</div>
              <div>
                <h3 className="text-lg font-semibold text-white">Register Your Application</h3>
                <p className="text-muted text-sm mt-1">
                  Go to <Link to="/register-app" className="text-glow hover:underline">/register-app</Link> and create a new OAuth client. You will receive a <code className="text-white bg-white/10 px-1.5 py-0.5 rounded text-xs">client_id</code> and <code className="text-white bg-white/10 px-1.5 py-0.5 rounded text-xs">client_secret</code>. Save the secret — it is shown only once.
                </p>
                <p className="text-muted text-sm mt-2">
                  Set your <strong className="text-white">Redirect URI</strong> to the exact URL where your app will handle the callback (e.g. <code className="text-white bg-white/10 px-1.5 py-0.5 rounded text-xs">https://yourapp.com/callback</code>).
                </p>
              </div>
            </div>
          </div>
          <div className="mb-10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">2</div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-white">Redirect User to Login</h3>
                <p className="text-muted text-sm mt-1 mb-4">
                  Generate a PKCE <code className="text-white bg-white/10 px-1.5 py-0.5 rounded text-xs">code_verifier</code> and its SHA-256 hash (<code className="text-white bg-white/10 px-1.5 py-0.5 rounded text-xs">code_challenge</code>), then redirect the user to our authorization endpoint. <strong className="text-white">We handle the entire login UI</strong> — your app just redirects.
                </p>
                <CodeBlock>{`// 1. Generate PKCE code_verifier & code_challenge
function generateVerifier(length = 43) {
  const arr = new Uint32Array(Math.ceil(length / 2));
  crypto.getRandomValues(arr);
  return Array.from(arr, d => ('0' + d.toString(16)).substr(-2))
    .join('').substr(0, length);
}

async function generateChallenge(verifier) {
  const digest = await crypto.subtle.digest(
    'SHA-256', new TextEncoder().encode(verifier)
  );
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
}

// 2. Start the login flow
async function loginWithRachitsAuth() {
  const verifier = generateVerifier();
  sessionStorage.setItem('pkce_verifier', verifier);

  const challenge = await generateChallenge(verifier);

  const url = new URL('https://auth.rachittaneja.in/api/auth/authorize');
  url.searchParams.set('client_id',             YOUR_CLIENT_ID);
  url.searchParams.set('redirect_uri',          YOUR_REDIRECT_URI);
  url.searchParams.set('response_type',         'code');
  url.searchParams.set('code_challenge',        challenge);
  url.searchParams.set('code_challenge_method', 'S256');

  window.location.href = url.toString();
}`}</CodeBlock>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">3</div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-white">Handle Callback &amp; Exchange Tokens</h3>
                <p className="text-muted text-sm mt-1 mb-4">
                  After the user logs in and grants consent on our UI, we redirect them back to your <code className="text-white bg-white/10 px-1.5 py-0.5 rounded text-xs">redirect_uri</code> with a <code className="text-white bg-white/10 px-1.5 py-0.5 rounded text-xs">?code=...</code> parameter. Exchange it for tokens:
                </p>
                <CodeBlock>{`// On your redirect_uri page (e.g. /callback)
const params = new URLSearchParams(window.location.search);
const code   = params.get('code');

if (code) {
  const verifier = sessionStorage.getItem('pkce_verifier');

  const res = await fetch('https://auth.rachittaneja.in/api/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id:     YOUR_CLIENT_ID,
      client_secret: YOUR_CLIENT_SECRET,
      grant_type:    'authorization_code',
      code:          code,
      redirect_uri:  YOUR_REDIRECT_URI,
      code_verifier: verifier,
    }),
  });

  const tokens = await res.json();
  // tokens.access_token  — Bearer token (RS256, 15 min)
  // tokens.id_token      — OIDC identity token (RS256, 1 hr)
  // tokens.refresh_token — long-lived refresh token (30 days)

  // Decode the ID token to get user info
  const payload = JSON.parse(atob(tokens.id_token.split('.')[1]));
  console.log(payload.name, payload.email);
}`}</CodeBlock>
              </div>
            </div>
          </div>
          <div className="mb-10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">4</div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-white">Global Logout</h3>
                <p className="text-muted text-sm mt-1 mb-4">
                  To sign the user out globally (destroying their session on the auth server), redirect them to our logout endpoint. We will clear the session and send them back to your app.
                </p>
                <CodeBlock>{`function logout() {
  // Clear your app's local state
  localStorage.clear();
  sessionStorage.clear();

  // Redirect to Rachit's Auth global logout
  const url = new URL('https://auth.rachittaneja.in/api/auth/logout');
  url.searchParams.set('client_id',                YOUR_CLIENT_ID);
  url.searchParams.set('post_logout_redirect_uri', YOUR_POST_LOGOUT_URI);

  window.location.href = url.toString();
}`}</CodeBlock>
                <p className="text-muted text-xs mt-3">
                  <strong className="text-white">Note:</strong> The <code className="text-white bg-white/10 px-1.5 py-0.5 rounded text-xs">post_logout_redirect_uri</code> must match one of the Redirect URIs you registered for your client.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">Endpoints Reference</h2>
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-6 py-3 text-muted font-medium">Method</th>
                    <th className="px-6 py-3 text-muted font-medium">Endpoint</th>
                    <th className="px-6 py-3 text-muted font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-6 py-3"><span className="text-emerald-400 font-mono text-xs">GET</span></td>
                    <td className="px-6 py-3 font-mono text-xs text-white">/api/auth/authorize</td>
                    <td className="px-6 py-3 text-muted">Start the authorization flow</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3"><span className="text-amber-400 font-mono text-xs">POST</span></td>
                    <td className="px-6 py-3 font-mono text-xs text-white">/api/auth/token</td>
                    <td className="px-6 py-3 text-muted">Exchange code for tokens (PKCE)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3"><span className="text-emerald-400 font-mono text-xs">GET</span></td>
                    <td className="px-6 py-3 font-mono text-xs text-white">/api/auth/logout</td>
                    <td className="px-6 py-3 text-muted">Global logout with redirect</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3"><span className="text-emerald-400 font-mono text-xs">GET</span></td>
                    <td className="px-6 py-3 font-mono text-xs text-white">/.well-known/openid-configuration</td>
                    <td className="px-6 py-3 text-muted">OIDC discovery document</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3"><span className="text-emerald-400 font-mono text-xs">GET</span></td>
                    <td className="px-6 py-3 font-mono text-xs text-white">/.well-known/jwks.json</td>
                    <td className="px-6 py-3 text-muted">Public signing keys (JWKS)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
