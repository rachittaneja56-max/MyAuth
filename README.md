# MyAuth (Rachit's Auth) — OIDC Identity Provider

Hosted IdP: [https://auth.rachittaneja.in](https://auth.rachittaneja.in)

This service is an OpenID Connect provider using **authorization code** with **PKCE (S256)**, **RS256** JWTs, and a **global logout** endpoint. Discovery metadata is published at `/.well-known/openid-configuration`.

---

## Step 1 — Register an OAuth client

You need a **client_id** and **client_secret** before your application can complete the flow.

### Option A: Dashboard (recommended)

1. Open [https://auth.rachittaneja.in](https://auth.rachittaneja.in) and create an account (sign up), then sign in.
2. Go to **Register app**.
3. Enter an application name and one or more **redirect URIs** (comma-separated). Each URI must be the exact HTTPS (or local dev) callback URL your app will use when handling the authorization response.
4. Submit the form. The response includes **`client_id`** and **`client_secret`**. Store the secret immediately; it is only shown once.

### Option B: API (session cookie)

After signing in through the hosted UI, an authenticated browser session can call:

- `POST https://auth.rachittaneja.in/api/clients/register` with JSON body `{ "name": "My App", "redirectUris": ["https://yourapp.com/callback"] }` and cookies enabled.

Successful JSON responses from non-OIDC JSON APIs use this shape:

```json
{ "success": true, "message": "optional", "data": { } }
```

Errors use:

```json
{ "success": false, "error": "human readable message", "message": "same or extra detail", "data": { "code": "MACHINE_CODE" } }
```

The **token** and **discovery** endpoints return OIDC/OAuth-shaped JSON instead (see below).

---

## Step 2 — Build the authorization (login) URL

Send the user’s browser to the **authorization endpoint** with query parameters (GET). All values must be URL-encoded.

**Endpoint:** `https://auth.rachittaneja.in/api/auth/authorize`

**Required query parameters**

| Parameter | Value |
|-----------|--------|
| `client_id` | Your registered client id |
| `redirect_uri` | One of the URIs you registered (must match exactly) |
| `response_type` | `code` |
| `code_challenge` | Base64url-encoded SHA-256 hash of your `code_verifier` (PKCE) |
| `code_challenge_method` | `S256` |

**Optional**

| Parameter | Purpose |
|-----------|---------|
| `state` | Opaque CSRF token; returned unchanged on redirect |
| `scope` | Space-separated scopes (e.g. `openid profile email`) |

### PKCE: `code_verifier` and `code_challenge`

1. Generate a high-entropy random `code_verifier` (43–128 characters from unreserved characters; a 32-byte random value Base64url-encoded is typical).
2. Store `code_verifier` in `sessionStorage` (or your backend session) for the token exchange.
3. Compute `code_challenge` as **BASE64URL(SHA256(code_verifier))** (no padding).

**Example structure (JavaScript)**

```javascript
const AUTH = 'https://auth.rachittaneja.in/api/auth/authorize';
const clientId = 'YOUR_CLIENT_ID';
const redirectUri = 'https://yourapp.com/callback';

async function sha256base64url(verifier) {
  const data = new TextEncoder().encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(hash);
  let s = btoa(String.fromCharCode(...bytes));
  return s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

const codeVerifier = crypto.randomUUID() + crypto.randomUUID();
sessionStorage.setItem('pkce_verifier', codeVerifier);
const codeChallenge = await sha256base64url(codeVerifier);
const state = crypto.randomUUID();
sessionStorage.setItem('oauth_state', state);

const url = new URL(AUTH);
url.searchParams.set('client_id', clientId);
url.searchParams.set('redirect_uri', redirectUri);
url.searchParams.set('response_type', 'code');
url.searchParams.set('code_challenge', codeChallenge);
url.searchParams.set('code_challenge_method', 'S256');
url.searchParams.set('state', state);

window.location.href = url.toString();
```

After the user signs in and consents, the browser is redirected to:

`https://yourapp.com/callback?code=AUTHORIZATION_CODE&state=THE_SAME_STATE`

---

## Step 3 — Handle the callback and exchange the code for tokens

Run this on your **callback page** (or, preferably, on your **backend** so the client secret never ships to browsers). The token endpoint must receive **JSON** (`Content-Type: application/json`).

**Endpoint:** `POST https://auth.rachittaneja.in/api/auth/token`

**Body (authorization_code)**

```json
{
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "grant_type": "authorization_code",
  "code": "CODE_FROM_QUERY_STRING",
  "redirect_uri": "https://yourapp.com/callback",
  "code_verifier": "THE_SAME_VERIFIER_USED_FOR_code_challenge"
}
```

**Successful response (OAuth 2.0 / OIDC)**

```json
{
  "access_token": "...",
  "token_type": "Bearer",
  "expires_in": 900,
  "refresh_token": "...",
  "id_token": "..."
}
```

**Error response (same endpoint)** uses OAuth 2.0 fields, for example:

```json
{ "error": "invalid_grant", "error_description": "..." }
```

### Copy-pasteable browser callback example (JavaScript)

Use a **backend** proxy in production so `client_secret` is not exposed. This snippet is for clarity and local development only:

```javascript
(async function handleCallback() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');

  if (state !== sessionStorage.getItem('oauth_state')) {
    document.body.textContent = 'Invalid state (possible CSRF).';
    return;
  }

  const verifier = sessionStorage.getItem('pkce_verifier');
  if (!code || !verifier) {
    document.body.textContent = 'Missing code or PKCE verifier.';
    return;
  }

  const tokenRes = await fetch('https://auth.rachittaneja.in/api/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: 'YOUR_CLIENT_ID',
      client_secret: 'YOUR_CLIENT_SECRET',
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'https://yourapp.com/callback',
      code_verifier: verifier,
    }),
  });

  const body = await tokenRes.json();
  if (!tokenRes.ok) {
    document.body.textContent =
      body.error_description || body.error || 'Token exchange failed';
    return;
  }

  sessionStorage.removeItem('pkce_verifier');
  sessionStorage.removeItem('oauth_state');

  console.log('access_token', body.access_token);
  console.log('id_token', body.id_token);
  console.log('refresh_token', body.refresh_token);
})();
```

**Refresh grant**

```http
POST https://auth.rachittaneja.in/api/auth/token
Content-Type: application/json

{
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "grant_type": "refresh_token",
  "refresh_token": "YOUR_REFRESH_TOKEN"
}
```

**UserInfo (Bearer access token)**

`GET https://auth.rachittaneja.in/api/auth/userinfo` with header `Authorization: Bearer ACCESS_TOKEN` returns claims JSON (`sub`, `email`, `name`).

---

## Step 4 — Global logout

To end the user’s **session at the IdP** (so they must sign in again on the next authorization request) and then return the user to your site:

1. Clear tokens and local state in your application.
2. Redirect the browser to the **end session** URL with query parameters.

**Endpoint:** `https://auth.rachittaneja.in/api/auth/logout`

| Parameter | Required | Description |
|-----------|----------|-------------|
| `client_id` | Yes (if using post-logout redirect) | Your client id |
| `post_logout_redirect_uri` | Optional | Must exactly match a **registered redirect URI** for that client |

**Example**

```javascript
function globalLogout() {
  localStorage.clear();
  sessionStorage.clear();

  const url = new URL('https://auth.rachittaneja.in/api/auth/logout');
  url.searchParams.set('client_id', 'YOUR_CLIENT_ID');
  url.searchParams.set('post_logout_redirect_uri', 'https://yourapp.com/goodbye');

  window.location.href = url.toString();
}
```

If `post_logout_redirect_uri` is omitted or does not match a registered URI for the given `client_id`, the user is redirected to the IdP’s default UI origin instead.

---

## Discovery and JWKS

- OpenID Provider metadata: `GET https://auth.rachittaneja.in/.well-known/openid-configuration`
- JWKS: `GET https://auth.rachittaneja.in/.well-known/jwks.json`

Validate `id_token` and `access_token` signatures using the JWKS `kid` and RS256.

---

## Rate limiting

Brute-force protection applies to `POST /api/auth/login`, `POST /api/auth/signup`, and `POST /api/auth/token`. Excessive requests return **HTTP 429**. JSON APIs return the standard `{ "success": false, "error": "...", "message": "..." }` envelope; the token endpoint returns `{ "error": "invalid_request", "error_description": "..." }` for throttling.

---

## Security headers

The server sends enhanced HTTP headers (via **Helmet**). Keep your `redirect_uri` list tight and never expose `client_secret` in public clients; use a confidential server for token exchange in production.
