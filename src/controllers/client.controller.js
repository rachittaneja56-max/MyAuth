import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { prisma } from '../config/db.js';
import { BadRequestError } from '../utils/errors.js';

export const registerClient = async (req, res) => {

  const { name, redirectUris } = req.body;
  const clientId = crypto.randomBytes(16).toString('hex');
  const rawClientSecret = crypto.randomBytes(32).toString('hex');
  const saltRounds = 10;
  const clientSecretHash = await bcrypt.hash(rawClientSecret, saltRounds);
  const newClient = await prisma.client.create({
    data: {
      clientId,
      clientSecretHash,
      name,
      redirectUris,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Client Application registered successfully!',
    data: {
      client_id: newClient.clientId,
      client_secret: rawClientSecret,
      redirect_uris: newClient.redirectUris,
    }
  });

};