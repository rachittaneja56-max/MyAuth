import { z } from 'zod';

export const clientRegistrationSchema = z.object({
  name: z.string({ required_error: "App name is required" })
         .min(2, "App name must be at least 2 characters long"),
         
  redirectUris: z.array(
    z.string().url("Every redirect URI must be a valid URL")
  ).min(1, "At least one redirect URI is required"),
});

