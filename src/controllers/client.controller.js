import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { prisma } from '../config/db.js';
import { BadRequestError } from '../utils/errors.js';

export const getClients = async (req, res) => {
  const clients = await prisma.client.findMany({
    where: { userId: req.user.id },
    select: {
      id: true,
      clientId: true,
      name: true,
      redirectUris: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    success: true,
    data: clients
  });
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
      userId: req.user.id
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