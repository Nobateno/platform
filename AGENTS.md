# Nobateno panels workspace

This Nx workspace contains two independently deployed apps:

- `apps/customer` is the provider-owned, mobile-first Next.js customer booking panel.
- `apps/provider` is the existing Vite provider panel. Its UI source and UI kit must remain visually unchanged.

The canonical product and design source is the sibling [`../documents`](../documents) directory. Read `../documents/README.md` and the relevant panel-specific docs before changing behavior.

The shared `packages/ui-kit` package is a compatibility layer for common Material 3 tokens and the provider button primitive. It must not be used to force desktop provider geometry into the customer mobile design.
