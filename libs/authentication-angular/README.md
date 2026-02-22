# authentication-angular

Reusable Angular auth integration primitives for Sniply apps.

Includes:
- Auth API service
- Bearer token interceptor (401 refresh + retry once)
- APP_INITIALIZER bootstrap helper (me -> refresh -> me)
- Route guard for protected routes
