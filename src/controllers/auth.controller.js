import { prisma } from '../config/db.js';
import { BadRequestError, UnauthorizedError } from '../utils/errors.js';
import bcrypt from 'bcrypt';

export const authorizeClient = async (req, res) => {
    const { client_id, redirect_uri } = req.query;

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

    throw new BadRequestError('Active session flow pending implementation', 'NOT_IMPLEMENTED');
}; 


export const signupUser = async (req, res) => {
    const { email, password, name } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new BadRequestError('User with this email already exists', 'USER_EXISTS');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
            email,
            passwordHash,
            name,
        },
        select: { id: true, email: true, name: true }
    });

    res.status(201).json({
        success: true,
        message: 'User created successfully. Please log in.',
        data: newUser
    });
};


export const loginUser = async (req, res) => {
    const { email, password, client_id, redirect_uri, response_type, code_challenge, code_challenge_method, state } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

  
    const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await prisma.session.create({
        data: {
            userId: user.id,
            expiresAt: sessionExpiry,
        }
    });

    res.cookie('sessionId', session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',  // to allow single sign on(allows cookie to travel with top level browser redirects)
        expires: sessionExpiry
    });

    if (!client_id) {
        return res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            redirectUrl: '/dashboard'
        });
    }

    const consentUrl = new URL(`${req.protocol}://${req.get('host')}/consent`);
    const params = { client_id, redirect_uri, response_type, code_challenge, code_challenge_method };
    if (state) params.state = state;
    consentUrl.search = new URLSearchParams(params).toString();
    
    return res.status(200).json({
        success: true,
        message: 'Login successful, redirecting to consent...',
        redirectUrl: consentUrl.toString()
    });
};