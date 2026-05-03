import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const openIdRouter = (req, res) => {
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

  res.json({
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/api/auth/authorize`,
    token_endpoint: `${baseUrl}/api/auth/token`,
    userinfo_endpoint: `${baseUrl}/api/auth/userinfo`,
    end_session_endpoint: `${baseUrl}/api/auth/logout`,
    jwks_uri: `${baseUrl}/.well-known/jwks.json`,
    response_types_supported: ["code"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"],
    scopes_supported: ["openid", "profile", "email"],
    token_endpoint_auth_methods_supported: ["client_secret_post", "client_secret_basic"],
    claims_supported: ["sub", "iss", "auth_time", "name", "email"]
  });
}

export const jwksRouter = (req, res) => {
  try {
    let publicKeyPem, metadata;

    if (process.env.PUBLIC_KEY_BASE64) {
      publicKeyPem = Buffer.from(process.env.PUBLIC_KEY_BASE64, 'base64').toString('utf8');
    } else {
      publicKeyPem = fs.readFileSync(path.resolve(__dirname, '../../certs', 'public.pem'), 'utf8');
    }

    if (process.env.KEY_METADATA_BASE64) {
      metadata = JSON.parse(Buffer.from(process.env.KEY_METADATA_BASE64, 'base64').toString('utf8'));
    } else {
      metadata = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../certs', 'key-metadata.json'), 'utf8'));
    }

    const publicKeyObj = crypto.createPublicKey(publicKeyPem);
    const jwk = publicKeyObj.export({ format: 'jwk' });

    res.json({
      keys: [{
        ...jwk,
        kid: metadata.kid, 
        use: 'sig',        
        alg: 'RS256',      
      }]
    });
  } catch (error) {
    console.error("[OIDC JWKS] Failed to load public keys:", error.message, error.stack);
    res.status(500).json({ error: 'Failed to load public keys. Ensure keys are generated.' });
  }
}