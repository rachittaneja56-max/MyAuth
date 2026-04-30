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