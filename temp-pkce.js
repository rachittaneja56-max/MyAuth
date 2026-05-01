import crypto from 'crypto';
const verifier = crypto.randomBytes(32).toString('base64url');
const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
console.log("Your Code Verifier :", verifier);
console.log("Your Code Challenge:", challenge);