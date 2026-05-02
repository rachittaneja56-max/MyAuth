import { z } from 'zod';

export const authorizeQuerySchema = z.object({
  client_id: z.string({ required_error: "client_id is required" }),
  redirect_uri: z.string().url("redirect_uri must be a valid URL"),
  response_type: z.literal('code', { required_error: "response_type must be 'code'" }),
  state: z.string().optional(),
  code_challenge: z.string({ required_error: "code_challenge is required" })
                   .min(43, "code_challenge length is invalid"),
  code_challenge_method: z.enum(['S256', 'plain']).default('S256'),
  scope: z.string().optional(),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
  client_id: z.string().optional(),
  redirect_uri: z.string().optional(),
  response_type: z.string().optional(),
  code_challenge: z.string().optional(),
  code_challenge_method: z.string().optional(),
  state: z.string().optional(),
});

export const consentSchema = z.object({
  client_id: z.string({ required_error: "client_id is required" }),
  redirect_uri: z.string().url("redirect_uri must be a valid URL"),
  response_type: z.literal('code'),
  code_challenge: z.string({ required_error: "code_challenge is required" }),
  code_challenge_method: z.string().default('S256'),
  state: z.string().optional(),
  consent_given: z.boolean({ required_error: "consent_given must be true or false" }) 
});

export const tokenSchema = z.object({
  client_id: z.string({ required_error: "client_id is required" }),
  client_secret: z.string({ required_error: "client_secret is required" }), 
  grant_type: z.enum(['authorization_code', 'refresh_token']),
  code: z.string().optional(),
  redirect_uri: z.string().url().optional(),
  code_verifier: z.string().optional(),
  refresh_token: z.string().optional()
});