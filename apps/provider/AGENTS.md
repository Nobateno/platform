# Repository Guidance for AI Agents

These instructions apply to every AI agent working in this repository.

## Commit Message Convention

Use [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).

```text
<type>[optional scope][!]: <description>

[optional body]

[optional footer(s)]
```

Allowed types:

- `feat`: add or extend user-facing behavior.
- `fix`: correct faulty behavior.
- `docs`: change documentation only.
- `refactor`: restructure code without changing behavior.
- `perf`: improve performance.
- `test`: add or update tests.
- `build`: change build tooling or dependencies.
- `ci`: change continuous-integration configuration.
- `chore`: perform repository maintenance.
- `style`: change formatting without changing behavior.
- `revert`: revert an earlier commit.

Message rules:

- Use a lowercase type and a short lowercase scope, such as `ui`, `theme`,
  `storybook`, `deps`, or `workflow`.
- Write the description in imperative present tense, without a trailing period.
- Keep the subject line at 72 characters or fewer.
- Keep each commit focused on one logical change.
- Add a body when the reason, behavior, or tradeoff is not obvious.
- Reference work items with Git trailers such as `Refs: #123`.
- Mark breaking changes with `!` and add a
  `BREAKING CHANGE: <description>` footer when more explanation is useful.

Examples:

```text
feat(theme): add persistent dark mode
fix(card): restore dark-mode surface colors
feat(storybook): document shared UI components
docs(workflow): define commit and Gitflow conventions
feat(api)!: replace legacy theme settings
```

## Gitflow Branching

Follow the
[Gitflow branching model](https://nvie.com/posts/a-successful-git-branching-model/)
with `master` as this repository's production branch.

### Long-lived branches

- `master` contains production-ready release history only.
- `develop` integrates completed work for the next release.
- Do not commit feature work directly to `master` or `develop`.

### Supporting branches

- `feature/<kebab-case>` branches start from `develop` and merge back into
  `develop`.
- `release/<semver>` branches start from `develop`. Limit them to versioning,
  release documentation, tests, and release fixes. Merge them into both
  `master` and `develop`, then tag `master` as `vX.Y.Z`.
- `hotfix/<semver>-<kebab-case>` branches start from `master` for urgent
  production fixes. Merge them into both `master` and `develop`, then tag the
  patched release.

Branch rules:

- Use lowercase kebab-case names, optionally beginning with an issue number,
  for example `feature/123-dark-mode`.
- Keep supporting branches short-lived and synchronized with their base branch.
- Prefer reviewed pull requests and non-fast-forward merges when completing
  release and hotfix branches.
- Delete supporting branches after they are merged.
- Do not push, merge, tag, or rewrite shared history unless the user explicitly
  requests it.

## Commit Preparation

- Review the complete staged diff before committing.
- Do not stage unrelated or user-owned changes.
- Run checks appropriate to the changed area and report existing failures
  separately from regressions.

## Engineering Sources of Truth

Before changing product behavior or structure, read:

1. [`../../../documents/README.md`](../../../documents/README.md), the shared
   documentation index;
2. the relevant product and role documents linked from that index;
3. [`../../../documents/architecture/provider-panel-frontend.md`](../../../documents/architecture/provider-panel-frontend.md);
4. [`CONTRIBUTING.md`](CONTRIBUTING.md) and
   [`docs/engineering-playbook.md`](docs/engineering-playbook.md).

If code, local guidance, and shared documentation disagree, expose the
disagreement instead of inventing an undocumented third behavior.

## Required Delivery Workflow

### Plan

- Inspect the worktree and surrounding implementation before editing.
- Define user-visible acceptance criteria, affected domain boundaries, risks,
  and the verification commands.
- Keep changes focused. Ask before expanding into unrelated product,
  dependency, data, or infrastructure decisions.

### Code

- Follow the documented DDD-lite dependency direction:
  `app -> domains -> shared`; `shared` never imports a domain, and domains do
  not import another domain's internals.
- Put provider business behavior in its owning domain. Put cross-domain
  composition in `app` and genuinely generic primitives in `shared`.
- Use Material 3 tokens and shared components. Preserve keyboard behavior,
  responsive layout, light/dark themes, and RTL/LTR behavior.
- Extract repeatable UI or behavior into a component with a stable contract.
  Expose intentional variation such as content, state, actions, placement, and
  timing through typed props instead of duplicating markup or hard-coding
  domain copy inside reusable components.
- Keep user-facing copy in i18n resources and update every supported locale.
- For digit-constrained values such as phone numbers, national IDs, and OTPs,
  normalize localized digits and enforce the format-specific digit limit both
  at the input boundary and in reusable validation. Do not rely on HTML
  `maxLength` alone; keep region- or document-specific rules in scalable
  configuration rather than scattering regexes across forms.
- Treat existing files and uncommitted changes as user-owned. Avoid broad
  cleanup unless it is part of the request.

### Test and Review

- Add or update the smallest useful unit, component, integration, end-to-end,
  and accessibility coverage for the changed risk.
- Review behavior and data safety before style: domain correctness, security,
  privacy, error states, accessibility, localization, performance, then
  maintainability.
- Run the applicable commands documented in `CONTRIBUTING.md`. Never claim a
  check passed unless it was run; identify pre-existing failures separately.
- For UI changes, inspect representative desktop/mobile, light/dark, Persian
  RTL, and one LTR locale. Automated accessibility checks do not replace
  keyboard and focus review.
- Do not send secrets, credentials, authentication data, customer PII, form
  values, or raw production payloads to logs, Sentry, prompts, fixtures, or
  screenshots.

### AI Agent Handoff

Every handoff must state:

- the outcome and important decisions;
- files changed;
- checks run and their results;
- remaining risks, skipped checks, and blockers;
- whether any changes are unrelated or were already present.

AI-authored work follows the same review and approval rules as human-authored
work. Agents must not commit, push, merge, tag, deploy, or change external
services unless the user explicitly requests that action.
