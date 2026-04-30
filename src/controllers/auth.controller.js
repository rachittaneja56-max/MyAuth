import { prisma } from '../config/db.js';
import { BadRequestError, UnauthorizedError } from '../utils/errors.js';

export const authorizeClient = async (req, res) => {
  const { client_id,  redirect_uri,} = req.query;

  const client = await prisma.client.findUnique({
    where: { clientId: client_id },
    select: { redirectUris: true } 
  });

  if (!client) {
    throw new UnauthorizedError('Invalid client_id', 'INVALID_CLIENT');
  }

  if (!client.redirectUris.includes(redirect_uri)) {
    throw new BadRequestError('redirect_uri does not match any registered URIs for this client', 'INVALID_REDIRECT_URI');
  }

  const sessionId = req.cookies?.sessionId; 

  if (!sessionId) {
    const loginUrl = new URL(`${req.protocol}://${req.get('host')}/login`);
    loginUrl.search = new URLSearchParams(req.query).toString();  //to get queries from url itself
    return res.redirect(302, loginUrl.toString());
  }

  // --- ACTIVE SESSION LOGIC GOES HERE LATER ---
  // If session exists: Validate session -> Check Consents -> Generate AuthCode -> Redirect to Client
  throw new BadRequestError('Active session flow pending implementation', 'NOT_IMPLEMENTED');
};