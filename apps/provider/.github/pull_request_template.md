## Outcome

<!-- What provider/user problem does this solve, and what changes now? -->

## Scope and architecture

<!-- Name the owning domain and any dependency/API/role/plan decisions. -->

- Owning domain:
- Shared-doc or issue reference:
- Out of scope:

## Evidence

<!-- List exact commands and results. Add screenshots/recordings for UI work. -->

| Check | Result / evidence |
| --- | --- |
| Lint and types | |
| Unit/component/integration | |
| End-to-end | |
| Accessibility | |
| Performance budget | |
| Production and Storybook builds | |

## Quality review

- [ ] The change follows the documented DDD-lite dependency direction.
- [ ] Loading, empty, error, retry, permission, and destructive states are
      handled where relevant.
- [ ] New behavior has regression coverage at the lowest useful test layer.
- [ ] Shared UI changes include an updated Storybook story.
- [ ] User-facing copy is translated for every supported locale.
- [ ] Persian RTL and at least one LTR locale were checked.
- [ ] Keyboard, focus, names, contrast, zoom, and reduced motion were reviewed.
- [ ] Responsive light and dark UI was checked without layout regression.
- [ ] Bundle/render/network impact was measured or is not applicable.
- [ ] No secrets, credentials, tokens, PII, or raw user content reach code,
      logs, tests, screenshots, or Sentry.
- [ ] Sentry behavior is useful, recoverable, and data-minimized, or is not
      affected.
- [ ] Dependencies are necessary, production/dev scoped correctly, and
      lockfile changes are intentional.
- [ ] Documentation reflects changed behavior or contracts.
- [ ] Commits follow Conventional Commits and contain no unrelated files.

## Risks and follow-up

<!-- State known limitations, skipped checks, migrations, or monitoring needs. -->
