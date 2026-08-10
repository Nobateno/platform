# Provider panel implementation map

Last reviewed: 2026-07-31

This map records how the provider frontend translates the shared product
documents into code without resolving decisions that the documents explicitly
defer. The source of truth remains the shared documentation, especially the
[documentation index](../../../documents/README.md),
[product requirements](../../../documents/product/prd.md),
[provider sitemap](../../../documents/product/provider-panel-sitemap.md),
[roles and permissions](../../../documents/product/roles-and-permissions.md),
[plan strategy](../../../documents/pricing/plan-strategy.md),
[provider frontend architecture](../../../documents/architecture/provider-panel-frontend.md),
and [open questions](../../../documents/open-questions.md).

## Implementation rules

- Provider-facing modules follow `app -> domains -> shared`; a domain does not
  import another domain's internals.
- The API remains authoritative for provider scope, roles, permissions, plan
  entitlements, publish readiness, availability, conflicts, prices, and token
  spending. Hiding or disabling a control is not authorization.
- Onboarding and first publish are a cross-domain journey, not a new owner of
  business data. Its local page is a checklist/presentation boundary only.
- Growth is post-MVP and plan-gated. Branches are future and the MVP stays
  single-branch, while data and route contracts should remain branch-ready.
- Final Persian navigation labels and final route names are deferred in the
  sitemap. Labels and new slugs below are implementation candidates, not product
  commitments.
- Visual compatibility is intentional: provider pages retain the repository's
  original Hook shell, stacked boxes, dashed summary cards, table toolbars,
  form rows, spacing, and responsive behavior. Only product terminology,
  content, routes, data, and behavior are adapted to the provider domains.

## Legacy routes retained

The architecture requires behavior-preserving migration. These URLs remain
valid compatibility entry points even if canonical provider terminology is
introduced later.

| Retained URL | Current page | Documented provider domain | Compatibility rule |
| --- | --- | --- | --- |
| `/` | Overview | Overview | Keep as the provider home route. |
| `/transaction-list` | Reservations | Reservations | Keep list filters and query state when a future alias is added. |
| `/transaction-detail` | Reservation detail | Reservations | Keep the booking identifier/query state when a future detail route is added. |
| `/users` | Customers | Customers | Do not reinterpret provider customers as platform users. |
| `/add-user` | Add customer | Customers | Preserve as a customer-create compatibility route. |
| `/product-list` | Services | Services | Preserve as the service-list compatibility route. |
| `/add-product` | Add service | Services | Preserve as the service-create compatibility route. |
| `/categories` | Categories | Services | Preserve as a service-category compatibility route. |
| `/invoice` | Plan & billing | Plan & billing | Preserve until a final billing route is approved. |
| `/settings` | Business settings | Business settings | Preserve until a final business-settings route is approved. |

No legacy URL is removed by the new domain modules. If a later change adds a
canonical URL, implement an explicit redirect or route alias that preserves the
query string and hash; do not rely on the catch-all redirect to `/`.

## New route and label candidates

These candidates align with the current frontend navigation vocabulary. They
must be treated as provisional until the deferred sitemap decisions are closed.

| Module/public entry point | Candidate URL | Candidate English label | Navigation status and caveat |
| --- | --- | --- | --- |
| `AvailabilityPage` | `/availability` | Availability | Primary-versus-Reservations placement is unresolved. |
| `TeamPage` | `/team` | Team | Collapse or hide for a solo provider when there is no team task. |
| `PublicPresencePage` | `/booking-page` | Booking page | Domain remains Public presence; final English/Persian label is unresolved. |
| `CommunicationsPage` | `/communications` | Communications | Transactional messages only; Growth owns campaigns. |
| `VoiceBookingPage` | `/voice-booking` | Voice booking / تلفن گویا | Primary-versus-nested placement and integration depth are unresolved. |
| `ReportsPage` | `/reports` | Reports | Basic report availability is canonical; richer report entitlements remain server-driven. |
| `OnboardingPage` | `/onboarding` | Getting started | Workflow route only; it should not become a primary data domain or permanent main-navigation item. |

The domain public indexes expose pages and i18n descriptors. The application
composition root is responsible for lazy route registration, namespace
registration, navigation filtering, authentication, and authorization. New
domain code must not bypass those boundaries.

## Canonical role visibility

The table below restates the provider sitemap's role model for route and
navigation composition. Platform roles belong to the admin panel and are not
provider navigation personas.

| Area | Owner | Receptionist | Staff |
| --- | --- | --- | --- |
| Overview | Full business | Operational summary | Own/assigned summary |
| Reservations | Full | Full operational access | Own/assigned and permission-limited |
| Availability | Full | Configurable | Own schedule where allowed |
| Customers | Full | Operational | Limited assigned-customer context |
| Services | Full | Optional | Read-only where needed |
| Team | Full | Hidden by default | Own profile/schedule only |
| Public presence | Full | Optional | Hidden |
| Communications | Full | Optional operational access | Own alerts only |
| Voice booking | Full | Optional | Hidden |
| Reports | Full | Optional | Hidden by default |
| Plan & billing | Full | Hidden | Hidden |
| Business settings | Full | Permission-limited | Personal security/preferences only |
| Onboarding/first publish | Full | Provisional; explicit permission required | Hidden |

Route guards must distinguish a staff service profile from an identity account
and provider membership. Creating a new staff member now requires a mobile
number and owner-defined initial password, and the server must atomically create
the profile, provider membership, and active staff account. The Team domain
owns operational profiles and assignments; Business settings still owns role,
permission, and security policy after creation. Passwords never enter roster
state or browser persistence.

## Product decisions intentionally left provisional

Do not encode any of the following as fixed UI promises or client-only rules:

- exact staff/account limits per plan;
- exact Basic, Growth, Brand Pro, and Studio Scale prices, annual discounts,
  token pack sizes, or token prices;
- the detailed boundary between Basic reports and richer operational,
  customer, team, or branch reports;
- exact public-page branding controls by plan;
- the amount of تلفن گویا that is a working MVP integration versus an
  integration boundary;
- whether booking approval is the default for every provider;
- the MVP depth of multi-service and multi-staff sequencing;
- branch availability or limits before the future single-account/multi-branch
  product is approved;
- final route slugs, final Persian navigation labels, and the navigation
  placement of Availability, Voice booking, and Plan & billing.

The current UI can explain an unavailable backend connection, display clearly
marked demonstration data, or show an entitlement-pending state. It must not
invent prices, quotas, customer records, successful phone calls, scannable QR
codes, message delivery, or server-approved publication.

## First-publish contract

The local onboarding checklist reflects the documented self-service publish
journey: public business profile, at least one active service, valid
availability, booking policy, and a reviewed public preview. Team setup is
optional for a solo provider. The actual publish command must revalidate these
conditions on the server and return actionable field/domain errors; the client
checklist alone is never sufficient evidence that publication succeeded.
