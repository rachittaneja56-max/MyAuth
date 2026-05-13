import { Link } from 'react-router-dom';
import CodeBlock from '../components/docs/CodeBlock';
import EndpointCard from '../components/docs/EndpointCard';
import { endpoints, errorCodes, tokenReference } from '../components/docs/docsData';

export default function Home() {
  return (
    <div className="min-h-screen bg-primary text-white selection:bg-glow/30 selection:text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-glow/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 pt-32 pb-20">
        
        <div className="grid md:grid-cols-2 gap-12 items-start mb-24">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-1 bg-white/10 text-white text-[10px] uppercase tracking-widest font-bold rounded">v1.0.0</span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Systems Operational
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">Rachit's Auth</h1>
            <p className="text-muted text-base leading-relaxed mb-8 max-w-md">
              A fully operational OpenID Connect Identity Provider. Built to demonstrate secure authentication flows including PKCE, RS256 JWTs, dynamic consent, and OIDC discovery.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register-app" className="px-5 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors shadow-lg shadow-white/10">
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
            <div className="bg-surface border border-border rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-glow/10 rounded-bl-full blur-2xl transition-opacity group-hover:opacity-100 opacity-50" />
              <h2 className="text-lg font-semibold text-white mb-3 relative">Quick Start (Test the Flow)</h2>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted mb-6 relative">
                <li><Link to="/signup" className="text-glow hover:underline">Create an account</Link> or <Link to="/login" className="text-glow hover:underline">Sign in</Link>.</li>
                <li>Go to <Link to="/register-app" className="text-glow hover:underline">Register App</Link> and create a client.</li>
                <li>Copy your <code className="text-white bg-white/10 px-1.5 py-0.5 rounded text-xs">client_id</code> and <code className="text-white bg-white/10 px-1.5 py-0.5 rounded text-xs">client_secret</code>.</li>
                <li>Open the Demo App and enter your credentials.</li>
                <li>Click Login and watch the PKCE flow in action!</li>
              </ol>
              <div className="flex gap-3 relative">
                <a href="https://authdemo.rachittaneja.in" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-glow text-white font-medium text-sm rounded-lg hover:bg-glow/90 transition-colors shadow-lg shadow-glow/20 flex items-center gap-2">
                  Launch Demo App
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6">
              <h2 className="text-sm uppercase tracking-widest text-muted font-medium mb-4">Supported Features</h2>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-gray-300">
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> PKCE Flow</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> RS256 Tokens</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> OIDC Discovery</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Dynamic Consent</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Global Logout</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Refresh Tokens</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-24">
          <div className="mb-12 border-b border-border pb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Integration Guide</h2>
            <p className="text-muted text-lg max-w-3xl leading-relaxed">
              Integrate Rachit's Auth into your application using the industry-standard Authorization Code Flow with PKCE. We handle the entire UI for login, signup, and consent — your app just redirects users and exchanges tokens.
            </p>
          </div>

          <div className="space-y-16">
            
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="md:w-1/3 shrink-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm">1</div>
                  <h3 className="text-xl font-bold text-white">Register Client</h3>
                </div>
                <p className="text-muted text-sm leading-relaxed">
                  Every application needs a unique Client ID and Secret. Register your app and provide the EXACT Redirect URI where users should be sent after logging in.
                </p>
              </div>
              <div className="md:w-2/3">
                <div className="bg-surface border border-border p-5 rounded-xl">
                  <p className="text-sm text-gray-300 mb-3">Use the <Link to="/register-app" className="text-glow hover:underline">Dashboard</Link> or call the API directly:</p>
                  <CodeBlock language="bash">
{`curl -X POST https://auth.rachittaneja.in/api/clients/register \\
  -H "Content-Type: application/json" \\
  -b "sessionId=YOUR_SESSION_COOKIE" \\
  -d '{"name":"My App","redirectUris":["https://yourapp.com/callback"]}'`}
                  </CodeBlock>
                  <div className="mt-4 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-xs text-amber-400"><strong>Critical:</strong> The <code className="bg-black/30 px-1 rounded">client_secret</code> is shown ONLY ONCE in the response. Save it securely on your backend. Never expose it in browser code.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="md:w-1/3 shrink-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm">2</div>
                  <h3 className="text-xl font-bold text-white">Generate PKCE</h3>
                </div>
                <p className="text-muted text-sm leading-relaxed">
                  PKCE (Proof Key for Code Exchange) protects the authorization code from being intercepted. Generate a random string (verifier) and hash it (challenge).
                </p>
              </div>
              <div className="md:w-2/3">
                <CodeBlock language="javascript">
{`// 1. Generate a random code_verifier (store this in sessionStorage)
function generateVerifier(length = 43) {
  const arr = new Uint32Array(Math.ceil(length / 2));
  crypto.getRandomValues(arr);
  return Array.from(arr, d => ('0' + d.toString(16)).substr(-2))
    .join('').substr(0, length);
}

// 2. Generate the code_challenge (SHA-256 hash, Base64URL encoded)
async function generateChallenge(verifier) {
  const digest = await crypto.subtle.digest(
    'SHA-256', new TextEncoder().encode(verifier)
  );
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
}`}
                </CodeBlock>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="md:w-1/3 shrink-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm">3</div>
                  <h3 className="text-xl font-bold text-white">Redirect to Login</h3>
                </div>
                <p className="text-muted text-sm leading-relaxed">
                  Redirect the user's browser to the authorization endpoint. Include your client ID, redirect URI, requested scopes, and the PKCE challenge.
                </p>
              </div>
              <div className="md:w-2/3">
                <CodeBlock language="javascript">
{`async function loginWithRachitsAuth() {
  const verifier = generateVerifier();
  sessionStorage.setItem('pkce_verifier', verifier);
  
  const challenge = await generateChallenge(verifier);
  const csrfState = generateVerifier(16); // Random string for CSRF protection
  sessionStorage.setItem('oauth_state', csrfState);

  const url = new URL('https://auth.rachittaneja.in/api/auth/authorize');
  
  // Standard OIDC Parameters
  url.searchParams.set('client_id', YOUR_CLIENT_ID);
  url.searchParams.set('redirect_uri', 'https://yourapp.com/callback');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid profile email');
  url.searchParams.set('state', csrfState);
  
  // PKCE Parameters
  url.searchParams.set('code_challenge', challenge);
  url.searchParams.set('code_challenge_method', 'S256');

  // Redirect the full browser window
  window.location.href = url.toString();
}`}
                </CodeBlock>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="md:w-1/3 shrink-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm">4</div>
                  <h3 className="text-xl font-bold text-white">Exchange Tokens</h3>
                </div>
                <p className="text-muted text-sm leading-relaxed">
                  After login, the user is redirected back to your app with a <code className="bg-white/10 px-1 rounded">?code=...</code> parameter. Exchange this code (plus your secret and original verifier) for tokens.
                </p>
              </div>
              <div className="md:w-2/3">
                <CodeBlock language="javascript">
{`// On your redirect_uri page (e.g. https://yourapp.com/callback)
const params = new URLSearchParams(window.location.search);
const code = params.get('code');
const state = params.get('state');

// 1. Verify CSRF state
if (state !== sessionStorage.getItem('oauth_state')) {
  throw new Error("CSRF State mismatch!");
}

if (code) {
  // 2. Exchange code for tokens (Usually done on YOUR backend)
  const verifier = sessionStorage.getItem('pkce_verifier');

  const res = await fetch('https://auth.rachittaneja.in/api/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: YOUR_CLIENT_ID,
      client_secret: YOUR_CLIENT_SECRET, // KEEP THIS SECRET
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'https://yourapp.com/callback',
      code_verifier: verifier,
    }),
  });

  const tokens = await res.json();
  
  // tokens.access_token  -> Use to call APIs (Bearer token, 15 min)
  // tokens.id_token      -> Identity JWT (RS256, 1 hr)
  // tokens.refresh_token -> Use to get new access tokens (30 days)

  // 3. Decode the ID token to get the user's profile instantly
  const payload = JSON.parse(atob(tokens.id_token.split('.')[1]));
  console.log("Logged in as:", payload.name, payload.email);
}`}
                </CodeBlock>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="md:w-1/3 shrink-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm">5</div>
                  <h3 className="text-xl font-bold text-white">Global Logout</h3>
                </div>
                <p className="text-muted text-sm leading-relaxed">
                  To log the user out completely, destroy their local session in your app AND redirect them to our logout endpoint to destroy their auth session.
                </p>
              </div>
              <div className="md:w-2/3">
                <CodeBlock language="javascript">
{`function logout() {
  // 1. Clear your app's local state/tokens
  localStorage.clear();
  sessionStorage.clear();

  // 2. Redirect to Rachit's Auth global logout
  const url = new URL('https://auth.rachittaneja.in/api/auth/logout');
  
  url.searchParams.set('client_id', YOUR_CLIENT_ID);
  
  // Must be a registered redirect URI for your client!
  url.searchParams.set('post_logout_redirect_uri', 'https://yourapp.com/goodbye');

  window.location.href = url.toString();
}`}
                </CodeBlock>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-24">
          <div className="mb-8 border-b border-border pb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Endpoint Reference</h2>
            <p className="text-muted">Complete technical details for every API endpoint available on <code className="text-white">auth.rachittaneja.in</code>.</p>
          </div>

          <div className="space-y-12">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                OIDC Discovery
              </h3>
              <div className="space-y-3">
                {endpoints.discovery.map((ep, i) => <EndpointCard key={i} {...ep} />)}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                Authentication & Tokens
              </h3>
              <div className="space-y-3">
                {endpoints.auth.map((ep, i) => <EndpointCard key={i} {...ep} />)}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                Client Management
              </h3>
              <div className="space-y-3">
                {endpoints.clients.map((ep, i) => <EndpointCard key={i} {...ep} />)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-24">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Token Reference</h2>
            <div className="space-y-4">
              {tokenReference.map((token) => (
                <div key={token.name} className="bg-surface border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-white text-base">{token.name}</h3>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-white/10 rounded-full font-mono text-gray-300">{token.field}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div className="text-muted"><span className="text-gray-500 mr-1">Algorithm:</span>{token.algorithm}</div>
                    <div className="text-muted"><span className="text-gray-500 mr-1">Lifetime:</span>{token.lifetime}</div>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed mb-3">{token.purpose}</p>
                  <div className="text-xs bg-black/30 border border-border rounded px-3 py-2 font-mono text-glow">
                    <span className="text-gray-500">Claims:</span> {token.claims}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Error Codes</h2>
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              <div className="divide-y divide-border h-[500px] overflow-y-auto">
                {errorCodes.map((error) => (
                  <div key={error.code} className="p-5 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-red-400 font-mono text-xs font-bold bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                        {error.code}
                      </span>
                      <span className="text-muted text-xs font-mono">HTTP {error.status}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{error.meaning}</p>
                    <p className="text-xs text-muted"><strong className="text-emerald-400 font-medium">Fix:</strong> {error.fix}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8 lg:p-12 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Security Architecture</h2>
          
          <div className="prose prose-invert prose-sm max-w-none">
            <h3 className="text-white text-lg mt-0">Why PKCE? (Proof Key for Code Exchange)</h3>
            <p className="text-muted leading-relaxed">
              In traditional OAuth 2.0, an attacker who intercepts the authorization code could exchange it for tokens if they also possessed the <code className="text-white bg-white/10 px-1 rounded">client_secret</code>. For Single Page Apps (SPAs) or mobile apps, the secret cannot be stored securely. PKCE solves this by generating a unique dynamic secret (<code className="text-white bg-white/10 px-1 rounded">code_verifier</code>) for <strong>every single login request</strong>. The attacker cannot exchange the intercepted code because they don't know the random verifier you generated in Step 2.
            </p>

            <h3 className="text-white text-lg mt-8">RS256 vs HS256 Token Signing</h3>
            <p className="text-muted leading-relaxed">
              Rachit's Auth uses <strong>RS256</strong> (RSA Signature with SHA-256) for all ID and Access tokens. Unlike HS256 which uses a shared symmetric password, RS256 uses a public/private key pair. The auth server signs tokens with the private key (kept completely secret on our servers). Your app can independently verify these tokens using our public keys (fetched from the JWKS endpoint). This enables zero-trust, decentralized token verification.
            </p>

            <h3 className="text-white text-lg mt-8">Cookie Security & Sessions</h3>
            <p className="text-muted leading-relaxed mb-0">
              User sessions on <code className="text-white">auth.rachittaneja.in</code> are maintained via HTTP-Only, Secure, SameSite=None cookies. These cookies are inaccessible to JavaScript, preventing XSS attacks. The session ID corresponds to a server-side database record, allowing us to instantly invalidate sessions globally upon logout.
            </p>
          </div>
        </div>

        <footer className="text-center text-sm text-muted pt-8 border-t border-border">
          <p>Built with OpenID Connect Core 1.0 standards. © {new Date().getFullYear()} Rachit's Auth.</p>
        </footer>

      </div>
    </div>
  );
}
