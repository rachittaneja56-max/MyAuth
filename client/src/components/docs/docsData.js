const BASE = 'https://auth.rachittaneja.in';

export const endpoints = {
  discovery: [
    {
      method: 'GET',
      path: '/.well-known/openid-configuration',
      description: 'Returns the OIDC Discovery document. This is the starting point for any OIDC client library — it tells your app where every other endpoint lives, what algorithms are supported, and what scopes are available. Every compliant OIDC client will fetch this URL first before doing anything else.',
      auth: 'None',
      params: [],
      responseExample: `{
  "issuer": "${BASE}",
  "authorization_endpoint": "${BASE}/api/auth/authorize",
  "token_endpoint": "${BASE}/api/auth/token",
  "userinfo_endpoint": "${BASE}/api/auth/userinfo",
  "end_session_endpoint": "${BASE}/api/auth/logout",
  "jwks_uri": "${BASE}/.well-known/jwks.json",
  "response_types_supported": ["code"],
  "subject_types_supported": ["public"],
  "id_token_signing_alg_values_supported": ["RS256"],
  "scopes_supported": ["openid", "profile", "email"],
  "token_endpoint_auth_methods_supported": ["client_secret_post", "client_secret_basic"],
  "claims_supported": ["sub", "iss", "auth_time", "name", "email"]
}`,
      curlExample: `curl ${BASE}/.well-known/openid-configuration`,
      notes: 'Cache this response — it rarely changes. Most OIDC client libraries auto-discover all endpoints from this single URL.',
    },
    {
      method: 'GET',
      path: '/.well-known/jwks.json',
      description: 'Returns the JSON Web Key Set (JWKS) containing the public RSA keys used to sign all ID tokens and access tokens. Your app uses these keys to verify token signatures without needing the private key. This is how zero-trust token verification works.',
      auth: 'None',
      params: [],
      responseExample: `{
  "keys": [
    {
      "kty": "RSA",
      "n": "0vx7agoebGc...base64url-encoded-modulus",
      "e": "AQAB",
      "kid": "key-1714800000000",
      "use": "sig",
      "alg": "RS256"
    }
  ]
}`,
      curlExample: `curl ${BASE}/.well-known/jwks.json`,
      notes: 'The "kid" (Key ID) in the JWKS matches the "kid" in the JWT header, so your app knows which key to use for verification. Keys may rotate — always fetch the JWKS dynamically.',
    },
  ],

  auth: [
    {
      method: 'GET',
      path: '/api/auth/authorize',
      description: 'The OAuth 2.0 / OIDC Authorization Endpoint. This is where you redirect the user to begin the login flow. DO NOT call this from JavaScript — redirect the entire browser window. The server will redirect the user to login (if not authenticated), then to consent (if not previously granted), then back to your redirect_uri with an authorization code.',
      auth: 'None (browser redirect)',
      params: [
        { name: 'client_id', type: 'string', required: true, desc: 'Your application\'s Client ID, obtained from registering at /register-app. This is a 32-character hex string.' },
        { name: 'redirect_uri', type: 'string (URL)', required: true, desc: 'The EXACT URL where the user will be sent back after login. Must match one of the Redirect URIs you registered — character for character, including trailing slashes.' },
        { name: 'response_type', type: 'string', required: true, desc: 'Must be "code". This tells the server you want an authorization code (the only supported flow).' },
        { name: 'code_challenge', type: 'string', required: true, desc: 'The PKCE code challenge. This is the Base64URL-encoded SHA-256 hash of your code_verifier. Minimum 43 characters.' },
        { name: 'code_challenge_method', type: 'string', required: false, desc: 'Must be "S256". Defaults to S256. This tells the server which hash algorithm you used for the code_challenge.' },
        { name: 'state', type: 'string', required: false, desc: 'An opaque value to prevent CSRF attacks. Generate a random string, store it in sessionStorage, and verify it matches when the user returns. Highly recommended.' },
        { name: 'scope', type: 'string', required: false, desc: 'Space-separated scopes. Supported: "openid", "profile", "email". Example: "openid profile email".' },
      ],
      responseExample: `// Success: HTTP 302 redirect to your redirect_uri
Location: https://yourapp.com/callback?code=abc123def456&state=your_state_value

// Error: HTTP 302 redirect with error
Location: https://yourapp.com/callback?error=access_denied&state=your_state_value`,
      curlExample: `# This is a browser redirect, not an API call. Build the URL and redirect:
${BASE}/api/auth/authorize?\\
  client_id=YOUR_CLIENT_ID&\\
  redirect_uri=https://yourapp.com/callback&\\
  response_type=code&\\
  code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM&\\
  code_challenge_method=S256&\\
  state=random_csrf_token`,
      notes: 'The authorization code in the callback is single-use and expires in 5 minutes. Exchange it immediately at the /token endpoint.',
    },
    {
      method: 'POST',
      path: '/api/auth/token',
      description: 'The Token Endpoint. Exchange an authorization code for tokens (authorization_code grant), or get a new access token using a refresh token (refresh_token grant). This is a server-to-server call — your backend should call this, not your frontend JavaScript (to protect your client_secret). CORS is open on this endpoint so the demo app can work from the browser.',
      auth: 'client_id + client_secret in request body',
      params: [
        { name: 'client_id', type: 'string', required: true, desc: 'Your Client ID.' },
        { name: 'client_secret', type: 'string', required: true, desc: 'Your Client Secret. This is the 64-character hex string shown only once during registration. Keep it secret — never expose it in frontend code.' },
        { name: 'grant_type', type: 'string', required: true, desc: '"authorization_code" to exchange a code for tokens, or "refresh_token" to get a new access token.' },
        { name: 'code', type: 'string', required: true, desc: '(authorization_code only) The authorization code from the callback URL.' },
        { name: 'redirect_uri', type: 'string', required: true, desc: '(authorization_code only) Must match the redirect_uri used in the authorize request — exactly.' },
        { name: 'code_verifier', type: 'string', required: true, desc: '(authorization_code only) The original PKCE code_verifier that was used to generate the code_challenge. The server hashes this and compares it to the stored challenge.' },
        { name: 'refresh_token', type: 'string', required: true, desc: '(refresh_token only) The refresh token from a previous token exchange.' },
      ],
      responseExample: `// authorization_code grant response:
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",   // Bearer token, 15 min
  "token_type": "Bearer",
  "expires_in": 900,                              // seconds
  "refresh_token": "a1b2c3d4e5f6...hex...",       // 30 days
  "id_token": "eyJhbGciOiJSUzI1NiIs..."          // OIDC identity, 1 hr
}

// refresh_token grant response:
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 900
}`,
      curlExample: `curl -X POST ${BASE}/api/auth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET",
    "grant_type": "authorization_code",
    "code": "THE_AUTH_CODE_FROM_CALLBACK",
    "redirect_uri": "https://yourapp.com/callback",
    "code_verifier": "THE_ORIGINAL_VERIFIER_STRING"
  }'`,
      notes: 'The authorization code is deleted after a single use. If token exchange fails, the user must re-authorize. The access token is a signed JWT — you can decode it to get the user\'s sub (user ID).',
    },
    {
      method: 'GET',
      path: '/api/auth/userinfo',
      description: 'The OIDC UserInfo Endpoint. Returns claims about the authenticated user. Send the access_token as a Bearer token in the Authorization header. This is the standard way to get user profile information after login.',
      auth: 'Bearer access_token',
      params: [],
      responseExample: `{
  "sub": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "email": "user@example.com",
  "name": "John Doe"
}`,
      curlExample: `curl ${BASE}/api/auth/userinfo \\
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIs..."`,
      notes: 'The "sub" claim is the user\'s unique ID and will never change. Use it as the primary key in your database. The access token expires in 15 minutes — if you get a 401, refresh it.',
    },
    {
      method: 'GET',
      path: '/api/auth/logout',
      description: 'The End Session Endpoint. Destroys the user\'s session on the auth server and redirects them to your app. This is RP-Initiated Logout — your app tells the auth server to log the user out globally.',
      auth: 'Session cookie (automatic)',
      params: [
        { name: 'client_id', type: 'string', required: false, desc: 'Your Client ID. Required if you want to redirect back to your app after logout.' },
        { name: 'post_logout_redirect_uri', type: 'string', required: false, desc: 'Where to send the user after logout. Must be one of your registered Redirect URIs. If not provided, redirects to the auth server homepage.' },
      ],
      responseExample: `// HTTP 302 redirect to post_logout_redirect_uri or auth server homepage`,
      curlExample: `# Browser redirect — build the URL:
${BASE}/api/auth/logout?\\
  client_id=YOUR_CLIENT_ID&\\
  post_logout_redirect_uri=https://yourapp.com`,
      notes: 'This only destroys the session on the auth server. You must also clear your own app\'s session/tokens (localStorage, cookies, etc.) before redirecting.',
    },
    {
      method: 'POST',
      path: '/api/auth/signup',
      description: 'Create a new user account on the auth server. After signup, the user must log in separately. This endpoint is used by the auth server\'s own signup page.',
      auth: 'None',
      params: [
        { name: 'email', type: 'string', required: true, desc: 'User\'s email address. Must be unique across all accounts.' },
        { name: 'password', type: 'string', required: true, desc: 'User\'s password. Minimum 6 characters. Stored as a bcrypt hash (never in plain text).' },
        { name: 'name', type: 'string', required: false, desc: 'User\'s display name. Will appear in ID tokens and UserInfo responses.' },
      ],
      responseExample: `{
  "success": true,
  "message": "User created successfully. Please log in.",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "email": "user@example.com",
    "name": "John Doe"
  }
}`,
      curlExample: `curl -X POST ${BASE}/api/auth/signup \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","password":"secure123","name":"John Doe"}'`,
      notes: 'As a third-party developer, you do NOT need to call this endpoint. Users create accounts through the auth server UI during the login flow.',
    },
    {
      method: 'POST',
      path: '/api/auth/login',
      description: 'Authenticate a user with email and password. Creates a session cookie. If OAuth parameters are included, handles the authorization flow inline (skipping the separate /authorize redirect).',
      auth: 'None',
      params: [
        { name: 'email', type: 'string', required: true, desc: 'User\'s email address.' },
        { name: 'password', type: 'string', required: true, desc: 'User\'s password.' },
        { name: 'client_id', type: 'string', required: false, desc: 'If present, triggers OAuth flow after login.' },
        { name: 'redirect_uri', type: 'string', required: false, desc: 'OAuth redirect URI (required if client_id is present).' },
        { name: 'response_type', type: 'string', required: false, desc: '"code" (required if client_id is present).' },
        { name: 'code_challenge', type: 'string', required: false, desc: 'PKCE challenge (required if client_id is present).' },
        { name: 'code_challenge_method', type: 'string', required: false, desc: '"S256" (required if client_id is present).' },
        { name: 'state', type: 'string', required: false, desc: 'CSRF state parameter.' },
      ],
      responseExample: `// Direct login (no OAuth params):
{
  "success": true,
  "message": "Logged in successfully",
  "redirectUrl": "/"
}

// OAuth login with prior consent:
{
  "success": true,
  "message": "Login successful, redirecting to app...",
  "redirectUrl": "https://yourapp.com/callback?code=abc123&state=xyz"
}`,
      curlExample: `curl -X POST ${BASE}/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","password":"secure123"}'`,
      notes: 'As a third-party developer, you do NOT call this. The auth server\'s login page calls it internally. Your app just redirects to /api/auth/authorize.',
    },
    {
      method: 'POST',
      path: '/api/auth/consent',
      description: 'Submit or deny consent for a third-party app to access the user\'s account. Called by the auth server\'s consent page when the user clicks "Allow" or "Deny".',
      auth: 'Session cookie (must be logged in)',
      params: [
        { name: 'client_id', type: 'string', required: true, desc: 'The requesting app\'s Client ID.' },
        { name: 'redirect_uri', type: 'string', required: true, desc: 'The app\'s redirect URI.' },
        { name: 'response_type', type: 'string', required: true, desc: '"code".' },
        { name: 'code_challenge', type: 'string', required: true, desc: 'PKCE challenge.' },
        { name: 'code_challenge_method', type: 'string', required: false, desc: '"S256".' },
        { name: 'state', type: 'string', required: false, desc: 'CSRF state.' },
        { name: 'consent_given', type: 'boolean', required: true, desc: 'true to allow, false to deny access.' },
      ],
      responseExample: `// Consent granted:
{
  "success": true,
  "message": "Consent granted. Redirecting to client...",
  "redirectUrl": "https://yourapp.com/callback?code=abc123&state=xyz"
}

// Consent denied:
{
  "success": true,
  "message": "User denied access.",
  "redirectUrl": "https://yourapp.com/callback?error=access_denied&state=xyz"
}`,
      curlExample: null,
      notes: 'Consent is remembered per user per client. After the first approval, subsequent logins skip the consent screen automatically.',
    },
    {
      method: 'GET',
      path: '/api/auth/me',
      description: 'Returns the currently logged-in user\'s profile based on the session cookie. Used internally by the auth server\'s frontend to check if a user is authenticated.',
      auth: 'Session cookie',
      params: [],
      responseExample: `{
  "success": true,
  "user": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "email": "user@example.com",
    "name": "John Doe"
  }
}`,
      curlExample: `curl ${BASE}/api/auth/me -b "sessionId=YOUR_SESSION_ID"`,
      notes: 'This is a session-based endpoint for the auth server\'s own UI. Third-party apps should use /api/auth/userinfo with a Bearer token instead.',
    },
  ],

  clients: [
    {
      method: 'POST',
      path: '/api/clients/register',
      description: 'Register a new OAuth 2.0 client application. You must be logged into the auth server to register apps. The client_secret is returned ONLY in this response — save it immediately. It\'s stored as a bcrypt hash and cannot be recovered.',
      auth: 'Session cookie (must be logged in)',
      params: [
        { name: 'name', type: 'string', required: true, desc: 'A human-readable name for your app. Minimum 2 characters. This is shown to users on the consent screen.' },
        { name: 'redirectUris', type: 'string[]', required: true, desc: 'Array of allowed redirect URIs. At least one required. Each must be a valid URL. Example: ["https://yourapp.com/callback"]' },
      ],
      responseExample: `{
  "success": true,
  "message": "Client Application registered successfully!",
  "data": {
    "client_id": "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
    "client_secret": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    "redirect_uris": ["https://yourapp.com/callback"]
  }
}`,
      curlExample: `curl -X POST ${BASE}/api/clients/register \\
  -H "Content-Type: application/json" \\
  -b "sessionId=YOUR_SESSION_ID" \\
  -d '{"name":"My App","redirectUris":["https://yourapp.com/callback"]}'`,
      notes: '⚠️ SAVE YOUR CLIENT SECRET NOW. It is shown exactly once and cannot be recovered. If you lose it, you must register a new client.',
    },
    {
      method: 'GET',
      path: '/api/clients',
      description: 'List all OAuth clients registered by the currently logged-in user. Returns client IDs and redirect URIs (never the secret).',
      auth: 'Session cookie (must be logged in)',
      params: [],
      responseExample: `{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "clientId": "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
      "name": "My App",
      "redirectUris": ["https://yourapp.com/callback"],
      "createdAt": "2026-05-01T12:00:00.000Z"
    }
  ]
}`,
      curlExample: `curl ${BASE}/api/clients -b "sessionId=YOUR_SESSION_ID"`,
      notes: 'The client_secret is never returned here — it\'s only shown once during registration.',
    },
  ],
};

export const errorCodes = [
  { code: 'INVALID_CLIENT', status: 401, meaning: 'The client_id does not exist, or the client_secret is wrong.', fix: 'Double-check your client_id and client_secret. Make sure you copied the full 64-character secret during registration.' },
  { code: 'INVALID_REDIRECT_URI', status: 400, meaning: 'The redirect_uri in your request does not match any URI registered for this client.', fix: 'Go to /register-app, check your client\'s registered URIs, and make sure they match EXACTLY — including protocol (http vs https), port, path, and trailing slashes.' },
  { code: 'INVALID_GRANT', status: 400, meaning: 'The authorization code is invalid, expired, already used, or PKCE verification failed.', fix: 'Authorization codes expire in 5 minutes and are single-use. Re-start the login flow. Also verify your code_verifier matches the code_challenge you sent.' },
  { code: 'INVALID_CREDENTIALS', status: 401, meaning: 'Wrong email or password during login.', fix: 'Check the email and password. Passwords are case-sensitive.' },
  { code: 'INVALID_TOKEN', status: 401, meaning: 'The access token in the Authorization header is missing, malformed, expired, or signed with an unknown key.', fix: 'Check that you\'re sending "Bearer <token>" in the Authorization header. If the token is expired, use the refresh_token grant to get a new one.' },
  { code: 'USER_EXISTS', status: 400, meaning: 'A user with this email already exists.', fix: 'Use a different email, or log in with the existing account.' },
  { code: 'UNAUTHORIZED', status: 401, meaning: 'No session cookie found, or the session has expired.', fix: 'The user needs to log in again. This typically means the session cookie was cleared or expired (24-hour lifetime).' },
  { code: 'UNSUPPORTED_GRANT_TYPE', status: 400, meaning: 'The grant_type is not "authorization_code" or "refresh_token".', fix: 'Only "authorization_code" and "refresh_token" grant types are supported.' },
  { code: 'BAD_REQUEST', status: 400, meaning: 'A required parameter is missing or malformed.', fix: 'Check the error message for details about which parameter is invalid. Common issues: missing fields, invalid URLs, passwords too short.' },
];

export const tokenReference = [
  {
    name: 'ID Token',
    field: 'id_token',
    algorithm: 'RS256 (RSA + SHA-256)',
    lifetime: '1 hour',
    purpose: 'Proves WHO the user is. Contains identity claims (name, email, sub). This is the core OIDC artifact — it\'s a signed proof of authentication. Decode it (it\'s a JWT) to get the user\'s profile.',
    claims: 'sub, email, name, iss, aud, exp, iat',
  },
  {
    name: 'Access Token',
    field: 'access_token',
    algorithm: 'RS256 (RSA + SHA-256)',
    lifetime: '15 minutes',
    purpose: 'Proves the user authorized your app to act on their behalf. Send it as a Bearer token to access protected resources (like the /userinfo endpoint). Short-lived for security.',
    claims: 'sub, iss, aud, exp, iat',
  },
  {
    name: 'Refresh Token',
    field: 'refresh_token',
    algorithm: 'Opaque (random hex string)',
    lifetime: '30 days',
    purpose: 'Used to get a new access_token without making the user log in again. Store it securely on your server — never expose it to the browser. If compromised, it can be revoked.',
    claims: 'N/A (opaque, not a JWT)',
  },
];
