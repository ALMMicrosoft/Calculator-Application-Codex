# CI/CD Best Practices for GitHub Actions

## 1) Workflow design

- Prefer separate workflows for PR CI, main-branch release, and deployment.
- Trigger minimally:
  - `pull_request` for validation.
  - `push` on default branch for integration/release.
  - `workflow_dispatch` for controlled manual operations.
- Use `paths` / `paths-ignore` to reduce unnecessary execution in monorepos.
- Add `concurrency`:

```yaml
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
```

## 2) Security baseline

- Set top-level permissions to least privilege:

```yaml
permissions:
  contents: read
```

- Elevate at job-level only when required (example: `contents: write` for release publishing).
- Pin third-party actions by commit SHA.
- Prefer OIDC (`id-token: write`) for cloud auth instead of static secrets.
- Protect environments (`production`) with reviewers and optional wait timer.
- Prevent secret exposure:
  - Never echo secret values.
  - Do not pass secrets through outputs.
  - Mask sensitive runtime values.

## 3) Quality gates

Typical gate order:

1. Lint/format
2. Unit tests
3. Integration tests (if applicable)
4. Build/package
5. Security checks (dependency + code scanning)

Use required status checks in branch protection so merges require green CI.

## 4) Performance and cost

- Cache package manager and build dependencies (`actions/cache` or setup action built-in cache).
- Create stable, specific cache keys with lockfiles.
- Fan out independent checks into parallel jobs; keep deploy path serialized.
- Upload test reports and logs as artifacts for failed jobs.

## 5) Release and deployment

- Build once, deploy many: reuse the same immutable artifact/image across environments.
- Assign release metadata (commit SHA, tag, artifact digest).
- Use explicit promotion strategy (`staging -> production`) rather than rebuilding per environment.
- Include health checks and rollback in deploy job notes or scripts.

## 6) Reusable patterns

### Reusable CI workflow skeleton

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup runtime
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --ci
      - run: npm run build
```

### Deployment guardrails snippet

```yaml
environment:
  name: production
permissions:
  contents: read
  id-token: write
```

Pair with environment protection rules in repository settings.

## 7) Review checklist

- Are triggers minimal and intentional?
- Are permissions least-privilege?
- Are actions pinned appropriately?
- Are required checks enforced via branch protection?
- Is deployment protected by environment rules?
- Can we trace deployed artifact back to a single build?
- Is rollback documented and practical?
