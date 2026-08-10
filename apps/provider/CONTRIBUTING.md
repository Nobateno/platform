# Contributing to the Nobateno Provider Panel

This project is a React/Vite provider application organized as DDD-lite
feature modules. Start with the shared
[Nobateno documentation index](../../documents/README.md), then read the
[provider frontend architecture](../../documents/architecture/provider-panel-frontend.md)
and the [engineering playbook](docs/engineering-playbook.md).

## Local setup

Use the Node version in `.nvmrc` and the pnpm version declared in
`package.json`.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Never commit local `.env` files or real customer/provider data. Only
`VITE_`-prefixed values are available to browser code, so they must never hold
secrets.

## Plan a change

Before editing:

1. identify the owning provider domain and relevant shared documentation;
2. write testable acceptance criteria, including loading, empty, error, and
   permission states when applicable;
3. note localization, RTL/LTR, accessibility, performance, security, and
   observability impact;
4. choose the smallest verification set that covers the risk.

Keep business behavior inside its domain. `app` composes domains and providers;
`shared` contains only reusable infrastructure and UI. Do not import from
another domain's internal folders.

## Branch and commit workflow

Create `feature/<kebab-case>` from `develop`. Release and hotfix branches follow
the Gitflow rules in `AGENTS.md`. Do not commit feature work directly to
`develop` or `master`.

Use focused [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/),
for example:

```text
fix(i18n): synchronize slider labels after locale change
test(a11y): cover keyboard language selection
ci(quality): run browser checks on pull requests
```

Do not stage unrelated files. Review the complete staged diff before creating a
commit.

## Verification commands

Run checks proportionate to the change; CI runs the full required set.

| Command | Purpose |
| --- | --- |
| `pnpm lint` | Static code-quality rules |
| `pnpm typecheck` | TypeScript correctness |
| `pnpm test` | Unit/component/integration tests in watch mode |
| `pnpm test:run` | Unit/component/integration tests once |
| `pnpm test:coverage` | Coverage report and thresholds |
| `pnpm test:e2e` | Playwright critical user journeys |
| `pnpm test:a11y` | Dedicated automated accessibility journeys |
| `pnpm build` | Production application build |
| `pnpm test:perf` | Deterministic post-build bundle-budget check |
| `pnpm build-storybook` | Design-system documentation build |

Playwright uses the installed stable Chrome channel locally and on GitHub's
hosted runners, avoiding a second browser download.

For a UI change, also test a narrow and wide viewport, keyboard-only use,
light/dark themes, Persian RTL, and at least one LTR language. Add or update a
Storybook story when shared component behavior changes.

## Pull requests

Open pull requests into `develop` from a supporting branch. Keep one logical
change per PR and complete the repository pull-request template. Include:

- the problem and resulting behavior;
- domain/architecture decisions;
- screenshots or recordings for visible changes;
- exact commands run and results;
- accessibility, performance, localization, security, and Sentry impact;
- known limitations or follow-up work.

Reviewers prioritize correctness, tenant/data safety, accessibility, and
regressions over formatting preferences. Resolve required feedback before
merge; do not hide a known failure behind a checklist.
