import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const certsDir = path.resolve(process.cwd(), 'certs');
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir);
}

const generateKeys = () => {
  console.log('Generating new RSA Key Pair...');
  const kid = `key-${Date.now()}`;

  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  
  fs.writeFileSync(path.join(certsDir, 'private.pem'), privateKey);
  fs.writeFileSync(path.join(certsDir, 'public.pem'), publicKey);
  fs.writeFileSync(path.join(certsDir, 'key-metadata.json'), JSON.stringify({ kid }));

  console.log(`Success! Keys generated with kid: ${kid}`);
};

generateKeys();