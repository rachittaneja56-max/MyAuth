import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { prisma } from '../config/db.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getClients = async (req, res) => {
  const clients = await prisma.client.findMany({
    where: { userId: req.user.id },
    select: {
      id: true,
      clientId: true,
      name: true,
      redirectUris: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return sendSuccess(res, 200, { data: clients });
};

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
      userId: req.user.id,
    },
    select: {
      clientId: true,
      redirectUris: true,
    },
  });

  return sendSuccess(res, 201, {
    message: 'Client Application registered successfully!',
    data: {
      client_id: newClient.clientId,
      client_secret: rawClientSecret,
      redirect_uris: newClient.redirectUris,
    },
  });
};
