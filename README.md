# Nobateno Panels

This is the isolated Nx workspace for the two Nobateno panels. The original
`frontend/customer` and `frontend/provider` projects are deliberately left
untouched.

| Project | Framework | Local address |
| --- | --- | --- |
| `customer-panel` | Next.js App Router | `http://localhost:4211` |
| `provider-panel` | Vite + React Router | `http://localhost:4212` |

## Run locally

```powershell
corepack pnpm@11.6.0 exec nx run customer-panel:dev
corepack pnpm@11.6.0 exec nx run provider-panel:dev
```

Build or check both projects through Nx:

```powershell
corepack pnpm@11.6.0 exec nx run customer-panel:build
corepack pnpm@11.6.0 exec nx run provider-panel:build
corepack pnpm@11.6.0 exec nx run provider-panel:test
```

## Shared UI contract

`packages/ui-kit` provides the common Modern Indigo foundation and a direct
compatibility export for the provider's existing Button. The provider source
and its UI are not altered. The customer app uses that bridge where its visual
contract permits it; its five documented booking screens keep their exact
mobile-specific geometry instead of inheriting the provider's desktop styles.

## Customer preview configuration

The customer panel supports provider-controlled preview parameters while the
backend contract is being connected:

```text
?lang=en&theme=dark&primary=0F766E
```

They switch language/direction, color mode, and primary color without changing
the booking flow.

## Visual-source decision

For the five supplied 390x844 customer references, the SVG wireframe generator
is the visual authority. It specifies 16px/700 provider names and 16px/500
choice-card titles, which conflicts with the older typography note listing
14px/500. The customer implementation follows the rendered design source for
those screens; unprovided screens (authentication, result, reservations, and
settings) follow the product copy and behavior documents rather than being
described as pixel-perfect.
