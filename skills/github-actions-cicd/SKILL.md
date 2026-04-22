---
name: github-actions-cicd
description: Design, review, and improve GitHub Actions CI/CD pipelines with secure, reliable, and cost-aware defaults. Use when creating or updating workflow YAML files, setting up continuous integration checks (build/test/lint/security), implementing continuous delivery or deployment, hardening permissions and secret handling, or troubleshooting flaky and slow GitHub Actions pipelines.
---

# GitHub Actions CI/CD

## Quick workflow

1. Clarify delivery model: CI only, CD (artifact release), or CD with deployment.
2. Identify stack and canonical commands (install, lint, test, build, package).
3. Create CI workflow with deterministic triggers, cache, concurrency, and artifacts.
4. Add quality and security gates (SAST, dependency scan, secret scan, required checks).
5. Create deploy workflow with environments, protections, and rollback path.
6. Verify least-privilege permissions and cloud identity model (prefer OIDC).
7. Optimize run time and maintainability before finalizing.

Read [references/ci-cd-best-practices.md](references/ci-cd-best-practices.md) for implementation standards and reusable snippets.
Read [references/review-checklist.md](references/review-checklist.md) for pre-merge and pre-release validation.

## Implementation rules

- Pin third-party actions to immutable SHAs for security-sensitive workflows.
- Set explicit `permissions:` at workflow/job scope; default to read-only and elevate only where needed.
- Use `concurrency` to cancel superseded runs on the same branch or PR.
- Use path filters to avoid unnecessary runs for unrelated file changes.
- Prefer reusable workflows (`workflow_call`) or composite actions to reduce duplication.
- Isolate build and deploy into separate jobs with `needs` and artifact transfer.
- Keep build-once/deploy-many semantics for release and deployment jobs.
- Store secrets in environments or repository/org secrets; never print them or pass via plaintext outputs.
- Use OIDC federation for cloud auth when available; avoid long-lived cloud credentials.
- Gate production deployments with GitHub Environments, required reviewers, and wait timers where needed.
- Keep rollback steps documented in deployment jobs and ensure prior artifact/image versions are accessible.

## Deliverables to produce

When asked to create or revise CI/CD, produce:

1. Workflow file(s) in `.github/workflows/`.
2. Short rationale per workflow (trigger, gates, security model, and release/deploy model).
3. Required repository settings checklist (branch protection, required checks, environment rules, secrets).
4. Verification plan with exact commands and expected pass criteria.
5. Operational notes (monitoring signal, rollback command, owner/on-call).

## Troubleshooting playbook

- **Flaky tests**: isolate random/data-coupled tests, enable retries only for known transient cases, and upload diagnostics.
- **Slow pipelines**: inspect cache key strategy, split jobs by dependency graph, and run heavy tasks only on relevant branches.
- **Permission denied**: audit `permissions:` and token scopes first; then verify environment protection and cloud role trust policy.
- **Deploy drift**: compare deployed artifact digest/version against build outputs and release metadata.
- **Supply-chain concern**: verify action pinning and provenance before approving workflow changes.

## Validation

- Run `python3 /opt/codex/skills/.system/skill-creator/scripts/quick_validate.py <skill-path>` when PyYAML is available.
- If PyYAML is unavailable in a restricted environment, run `python3 scripts/quick_validate_no_deps.py <skill-path>` from this skill directory as a fallback.

## Constraints

- Keep workflow YAML explicit and readable over heavily clever expressions.
- Avoid introducing external actions that are unmaintained or lack clear provenance.
- Avoid modifying unrelated workflows unless required for compatibility.
