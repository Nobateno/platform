# Provider staff-account creation

The owner creates a staff member from the Team page. New staff creation is an
atomic cross-domain workflow: it creates the operational staff profile, provider
membership, and sign-in account together.

Required owner inputs are:

- full name;
- Iranian mobile number selected under the fixed `+98` region; the input accepts
  10 digits beginning with `9` or 11 digits with the leading `0`, then sends the
  canonical `09…` form;
- owner-defined initial password of at least eight characters.

The frontend sends:

| Endpoint | Request | Success response |
| --- | --- | --- |
| `POST /api/provider/staff-accounts` | `{ fullName, phone, password }` | `{ staff: { id, fullName, phone } }` |

The endpoint returns `409` when the phone cannot be used for another provider
account. Role, provider scope, plan limits, and final password policy remain
server-authoritative. The command must either create both profile and account or
create neither.

The password exists only in the form and request body. It is cleared after a
successful response, is never added to the staff roster, browser persistence,
logs, analytics, error payloads, or the response. The server must hash it using
the platform password policy and must never store or return the plaintext value.

The local development build may create a non-persistent demonstration row when
the endpoint is unavailable. Production does not use this fallback.
