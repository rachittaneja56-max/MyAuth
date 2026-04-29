Hey! I’m building my own custom OpenID Connect (OIDC) Identity Provider from scratch. I wanted to know how they actually work under the hood.

This document is basically my notes on how I designed the database and why each piece is needed for the auth flow to be secure.

## My Tech Stack
  1. Backend: Node.js + Express.js
  2. Database: PostgreSQL (Hosted on Neon.tech)
  3. ORM: Prisma 

### 1. A Quick Note on Prisma v7
If you are looking at my code, you might notice my schema.prisma file doesn't have the DATABASE_URL in it anymore. Prisma v7 changed this for security reasons!

Now:

    1. The url is loaded safely from prisma.config.ts.

    2. In index.js, I use the @prisma/adapter-pg to actually connect to Neon.

### 2. Database Schema

1. User Table 

    1.  This is for user who comes to a service  to create an account and log in.

    2.  id: I used UUIDs (random strings) instead of numbers (1, 2, 3...) so people can't guess how many users I have.

    3.  email & passwordHash: Pretty standard. Never saving plain text passwords, using bcrypt to hash them!

2. Client Table 
    1.  This was confusing at first! In OIDC, a "Client" isn't a person, it's the Application (like my blog or a new frontend project) that wants to use Rachits Auth for logging in.

    2.  clientId & clientSecretHash: Every app gets its own username and password to talk to my server securely.

    3.  redirectUris: SECURITY FEATURE! My server will only send the login code to these specific URLs. If a someone tries to redirect the login code to random site, my server will block it.

3. Session Table (Browser Memory)
    1.  I don't want users typing their password every single time they open my app.

    2.  When they log in, I create a session here and drop an HTTP-only cookie in their browser. Next time they come back, I check this table and log them in automatically (Single Sign-On!).

4. AuthCode Table
    1.  When a user logs in, I don't send the final tokens directly to the browser (that's unsafe). Instead, I generate a short-lived "Code" (like a temporary ticket) and send it via the URL.

    2.  codeChallenge: PKCE SECURITY! This stops other apps on a user's phone from stealing the code from the URL and using it. The app has to prove it knows the original secret to exchange this code.

    3.  expiresAt: These codes expire in a few minutes so the window for getting hacked is tiny.

5. Consent Table (The "Allow Access" Screen)
    1.  Have you ever seen that screen that says "App XYZ wants to access your profile"?

    2.  When a user clicks "Allow", I save it in this table. That way, I don't have to annoy them with that same screen every time they log in to the same app.

6. RefreshToken Table 
    1.  Access tokens expire super fast (like 15 minutes) for security.

    2.  Apps use these long-lasting Refresh Tokens to quietly get a new access token in the background without bothering the user.

    3.  isRevoked: I added this so I can build a "Log out from all devices" button 