# Provider phone-first authentication

The provider panel uses one phone-first entry point for sign-in and registration.

## User flow

1. Select a phone region, then constrain, normalize, and validate the mobile
   number with that region's shared rule. The current release fixes the region
   to Iran (`+98`): it accepts 10 digits beginning with `9`, or the same 11
   digits with the leading `0`, and stores the canonical `09…` form.
2. Ask the server whether the phone belongs to an existing provider account.
3. Existing providers enter their password and may open OTP password recovery.
4. New providers receive an OTP, verify the phone, and complete account onboarding with their name, business name, and password.
5. A newly authenticated owner continues to the protected first-publish onboarding checklist.

Password recovery verifies the existing account phone by OTP before accepting a new password.

## Provisional API contract

These endpoints are the frontend adapter contract until the provider backend publishes a shared contract:

| Endpoint | Request | Success response |
| --- | --- | --- |
| `POST /api/provider/auth/phone-lookup` | `{ phone }` | `{ exists: boolean }` |
| `POST /api/provider/auth/otp/request` | `{ phone, purpose }` | Any `2xx` response |
| `POST /api/provider/auth/otp/verify` | `{ phone, code, purpose }` | `{ verificationToken }` |
| `POST /api/provider/session` | `{ phone, password }` | Sanitized `PanelUser` and secure session cookie |
| `POST /api/provider/accounts` | `{ phone, password, verificationToken, fullName, businessName }` | Sanitized owner `PanelUser` and secure session cookie |
| `POST /api/provider/password-reset` | `{ phone, password, verificationToken }` | Any `2xx` response |

`purpose` is either `registration` or `password-reset`. Verification tokens are kept only in component memory and must be short-lived, single-use, and bound to the phone and purpose.

## Security requirements

- The server remains authoritative for account existence, OTP validity, registration, authentication, and authorization.
- Apply rate limits and abuse monitoring to lookup, OTP request, OTP verification, login, registration, and reset endpoints.
- Keep lookup response timing and copy as uniform as the product flow allows to reduce account-enumeration signals.
- Never return passwords, OTP values, session tokens, or raw authentication payloads to browser logs or telemetry.
- Production sessions use secure, HTTP-only, same-site cookies; credentials and verification tokens are never persisted in local or session storage.

Development mode includes deterministic test credentials in the UI because no provider backend is connected. Those fallbacks are excluded from production builds.
