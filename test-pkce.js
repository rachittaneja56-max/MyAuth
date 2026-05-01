import crypto from 'crypto';
import readline from 'readline';

// --- CONFIGURATION ---
// Replace these with the actual values you get after registering an app at https://auth.rachittaneja.in/register-app
const CLIENT_ID = 'YOUR_CLIENT_ID_HERE'; 
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET_HERE';
const REDIRECT_URI = 'http://localhost:8080/callback'; // Make sure you registered this URI!
const AUTH_SERVER_URL = 'https://auth.rachittaneja.in';
// ---------------------

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function base64URLEncode(buffer) {
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

console.log('--- PKCE CLIENT TESTER ---');
if (CLIENT_ID === 'YOUR_CLIENT_ID_HERE') {
  console.log('\n❌ ERROR: Please edit test-pkce.js and enter your CLIENT_ID and CLIENT_SECRET first!');
  process.exit(1);
}

// 1. Generate Verifier & Challenge
const codeVerifier = base64URLEncode(crypto.randomBytes(32));
const codeChallenge = base64URLEncode(crypto.createHash('sha256').update(codeVerifier).digest());

console.log('\n✅ 1. Generated PKCE values:');
console.log('Verifier:', codeVerifier);
console.log('Challenge:', codeChallenge);

// 2. Generate Authorization URL
const authUrl = `${AUTH_SERVER_URL}/api/auth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&code_challenge=${codeChallenge}&code_challenge_method=S256`;

console.log('\n✅ 2. Please open this URL in your browser to log in and consent:');
console.log('\n', authUrl, '\n');

console.log('After logging in, you will be redirected to something like:');
console.log('http://localhost:8080/callback?code=AUTH_CODE_HERE');

// 3. Wait for the user to paste the code
rl.question('\n❓ Paste the "code" from the URL here: ', async (code) => {
  if (!code) {
    console.log('No code provided. Exiting.');
    process.exit(1);
  }

  console.log('\n✅ 3. Exchanging code for tokens...');
  
  try {
    const response = await fetch(`${AUTH_SERVER_URL}/api/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code.trim(),
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.log('\n❌ Token Exchange Failed:');
      console.dir(data, { depth: null });
    } else {
      console.log('\n🎉 SUCCESS! Received Tokens:');
      console.dir(data, { depth: null });
    }
  } catch (error) {
    console.error('\n❌ Error making request:', error.message);
  }

  rl.close();
});
