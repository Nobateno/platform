# Provider Frontend Engineering Playbook

This playbook defines the working agreement for planning, implementation,
review, testing, performance, accessibility, security, observability, and AI
assistance in the Nobateno provider panel.

## 1. Decision order

Use these sources in order:

1. current user-approved requirements;
2. the shared [`documents/`](../../../documents/README.md) product and
   architecture contracts;
3. the
   [provider frontend architecture](../../../documents/architecture/provider-panel-frontend.md);
4. repository guidance in `AGENTS.md`;
5. existing implementation details.

Raise a contradiction explicitly. Do not silently create a third product rule.

## 2. Definition of ready

A change is ready to implement when it has:

- a clear provider problem and observable acceptance criteria;
- an owning domain and known dependency direction;
- relevant roles, plan limits, and API authority identified;
- loading, empty, error, retry, and destructive-action behavior considered;
- localization, accessibility, performance, security, and telemetry risks
  identified;
- a test plan appropriate to the risk.

Small fixes can capture this in a few lines. Larger or cross-domain work should
have a written plan with checkpoints.

## 3. Structure and coding

The dependency direction is:

```text
app (composition, providers, router, shell)
  -> domains (provider-facing capabilities)
    -> shared (generic UI, i18n, adapters, utilities)
```

- A domain exposes public entry points through its `index.ts`.
- A domain must not import another domain's internal files.
- Cross-domain orchestration belongs in `app` or an explicit application
  workflow.
- `shared` must not depend on `app` or `domains`.
- Keep server-authoritative rules such as permissions, availability, price,
  booking conflicts, and plan entitlements visibly provisional in the client.
- Zustand stores hold intentional client state; do not mirror derived values or
  server caches without a reason.
- Components consume Material 3 tokens and shared primitives. Avoid one-off
  visual constants when a semantic token exists.
- Repeatable UI or behavior belongs in a component with a stable, typed prop
  contract. Content, state, actions, placement, timing, and other intended
  variations must be customizable without copying the component markup.
- UI copy belongs in the owning i18n namespace. Persian is the default; all
  supported locales must have the key.
- Digit-constrained identifiers such as phone numbers, national IDs, and OTPs
  must normalize localized digits, constrain input to the configured digit
  count, and repeat the same rule in validation. HTML `maxLength` is only a UX
  aid. Keep country, region, or document rules in a shared typed registry so a
  new format does not require copied regexes or one-off input handlers.
- Remove dead code and dependencies only after proving they have no runtime,
  build, Storybook, test, or tooling consumer.

## 4. AI-assisted planning and coding

AI assistance is useful for exploration, bounded implementation, tests,
review, and documentation. It does not change ownership or review standards.

An AI agent must:

- inspect source, docs, configuration, and the dirty worktree before changing
  files;
- state material assumptions and confirm risky scope changes;
- use a short plan for multi-file or high-risk work and keep it current;
- preserve user-owned changes and avoid opportunistic refactors;
- validate generated copy, translations, selectors, APIs, and test assertions
  against repository evidence;
- never fabricate commands, results, citations, screenshots, or product facts;
- never place secrets or real personal data in prompts, logs, fixtures, or
  screenshots;
- hand off changed files, decisions, validation results, and remaining risks.

Parallel agents should own non-overlapping files or clearly bounded concerns.
The coordinating agent remains responsible for integration and final
verification.

## 5. Review order

Review the change in this order:

1. **Behavior:** acceptance criteria, edge cases, failure recovery, and
   backward compatibility.
2. **Domain boundaries:** correct ownership, public imports, API authority, and
   Zustand state shape.
3. **Security and privacy:** authentication/authorization assumptions, unsafe
   rendering, dependencies, secrets, PII, and telemetry.
4. **Accessibility and localization:** semantic structure, names, keyboard and
   focus behavior, RTL/LTR, translated copy, and locale-aware formatting.
5. **Performance:** render frequency, route/code splitting, network and asset
   cost, layout stability, and cleanup of subscriptions/listeners.
6. **Tests:** meaningful assertions at the lowest reliable layer, including
   negative paths.
7. **Maintainability:** clarity, duplication, dead code, documentation, and
   package necessity.

Review comments should identify impact and evidence. Mark blocking correctness
or safety issues separately from optional improvements.

## 6. Test strategy

Choose the lowest layer that proves the behavior, then add a broader regression
test only when integration risk warrants it.

| Layer | Use it for | Expected examples |
| --- | --- | --- |
| Static | Invalid types, imports, hooks, unsafe patterns | ESLint and TypeScript |
| Unit | Pure rules, selectors, formatters, locale normalization | Store actions, date/number helpers |
| Component | Rendered behavior and accessible interaction | Forms, language selector, dialogs |
| Integration | Router/providers/domain collaboration | Locale + direction, error boundaries |
| End-to-end | Critical provider journeys in a real browser | Login, navigation, reservation actions |
| Accessibility | Automated axe plus keyboard/focus assertions | Dialog focus, labels, RTL navigation |
| Visual | Shared component states across themes/viewports | Storybook review or approved snapshots |
| Contract | Request/response compatibility when API adapters exist | Schema and error mapping |
| Performance | User-centric metrics and bundle regression | Representative mobile routes |
| Observability | Error capture without data leakage | Boundary recovery and Sentry filtering |

Rules:

- Tests must be deterministic and independent of order, timezone, network, and
  real services.
- Prefer role/label queries over CSS selectors in UI tests.
- Never weaken an assertion solely to make CI pass.
- A bug fix includes a regression test at the layer where the bug was
  observable.
- Coverage highlights untested risk; a percentage alone is not evidence of
  useful coverage.
- Automated accessibility tests complement, but do not replace, manual
  keyboard, focus, zoom, contrast, and screen-reader checks.

## 7. Accessibility standard

Target WCAG 2.2 AA and Material 3 interaction behavior.

- Use native semantics first and expose an accessible name for every control.
- All behavior must work with keyboard only; focus must be visible, logical,
  and restored after overlays close.
- Do not communicate state through color, position, or motion alone.
- Preserve at least 44 by 44 CSS-pixel pointer targets unless the control has
  equivalent spacing or an accepted exception.
- Support 200% zoom, narrow layouts, reduced motion, light/dark themes, Persian
  RTL, and LTR languages without lost content or meaning.
- Provide programmatic labels, instructions, errors, and live announcements
  where state changes are otherwise invisible.
- Automated checks must report no serious or critical accessibility violations
  on covered journeys.

## 8. Performance standard

Treat performance as product behavior, especially on mid-range mobile devices
and constrained networks.

- Target p75 LCP at or below 2.5 seconds, INP at or below 200 milliseconds, and
  CLS at or below 0.1 on representative production routes.
- Lazy-load route-level features and heavy editors/charts that are not needed
  for first interaction.
- Avoid avoidable state subscriptions, render loops, duplicate data, and
  unbounded DOM lists.
- Size and compress images appropriately; reserve dimensions to prevent layout
  shift.
- Compare production bundle output for dependency or route changes. Explain a
  meaningful touched-chunk increase and record follow-up when it cannot be
  avoided.
- Run `pnpm build && pnpm test:perf` to enforce the repository's deterministic
  post-build bundle budgets.
- Measure before and after claiming an optimization. Until an automated
  user-metric audit is added, attach reproducible local evidence to the PR.

## 9. Security and Sentry

The browser is an untrusted client. Server-side authorization and validation
remain authoritative.

- Never expose secrets through `VITE_` variables, source, logs, fixtures, or
  source maps.
- Avoid rendering untrusted HTML. When unavoidable, sanitize at a defined
  boundary and test malicious input.
- Do not log authentication tokens, passwords, OTPs, cookies, headers, form
  values, phone numbers, email addresses, or raw customer/provider payloads.
- Keep dependencies deliberate, locked, and reviewed for necessity and known
  risk.

Sentry runtime configuration:

| Variable | Purpose |
| --- | --- |
| `VITE_SENTRY_DSN` | Enables browser reporting; absent means fully disabled |
| `VITE_SENTRY_ENVIRONMENT` | Deployment environment |
| `VITE_SENTRY_RELEASE` | Release identifier |
| `VITE_SENTRY_TRACES_SAMPLE_RATE` | Trace sample rate from `0` to `1`; defaults to `0` |
| `VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE` | Session replay rate; defaults to `0` |
| `VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE` | Error replay rate; defaults to `0` |

Source-map upload is CI-only and requires all three secret variables:
`SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT`. They must be stored as
CI secrets and never use the `VITE_` prefix. Uploaded maps are hidden and local
`dist/**/*.map` files are removed after upload.

Sentry must keep default PII collection disabled. Replay masks text and inputs
and blocks media. Before enabling non-zero sampling, verify data minimization,
environment/release tags, issue ownership, alert routing, retention, and a
tested recovery path. An error report must be useful without containing user
content.

## 10. Definition of done and handoff

A change is done when:

- acceptance criteria and error states work;
- DDD-lite dependency rules still hold;
- affected locales, RTL/LTR, themes, and responsive layouts work;
- relevant tests and stories are updated;
- lint, types, tests, production build, Storybook, and browser checks pass or
  explicitly documented exceptions are approved;
- accessibility, performance, security, and Sentry effects are reviewed;
- documentation reflects new contracts or operational requirements;
- the handoff lists changed files, commands and results, known risks, and
  follow-ups.
