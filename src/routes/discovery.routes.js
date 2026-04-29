import express from 'express';
const router = express.Router();

router.get('/openid-configuration', (req, res) => {
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

  res.json({
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/api/auth/authorize`,
    token_endpoint: `${baseUrl}/api/auth/token`,
    userinfo_endpoint: `${baseUrl}/api/auth/userinfo`,
    jwks_uri: `${baseUrl}/api/auth/jwks`,
    response_types_supported: ["code"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"],
    scopes_supported: ["openid", "profile", "email"],
    token_endpoint_auth_methods_supported: ["client_secret_post", "client_secret_basic"],
    claims_supported: ["sub", "iss", "auth_time", "name", "email"]
  });
});

export default router;