# GitHub Actions CI/CD Review Checklist

## Pre-merge checklist (workflow changes)

- [ ] Workflow triggers are intentional (`pull_request`, `push`, `workflow_dispatch`) with path filters where useful.
- [ ] `permissions` are explicitly declared and least-privilege.
- [ ] Third-party actions are pinned to a commit SHA where security matters.
- [ ] CI quality gates are ordered (lint -> tests -> build -> security checks).
- [ ] Caching strategy is deterministic and keyed by lockfiles.
- [ ] Concurrency cancelation is configured for PR/branch workflows.
- [ ] Build artifacts are preserved and passed to downstream jobs.
- [ ] No secrets are echoed, exposed in outputs, or written in plaintext logs.
- [ ] Required checks map to branch protection rules.

## Pre-release checklist (deploy changes)

- [ ] Deployment runs through protected GitHub Environment.
- [ ] Production environment has required reviewers enabled.
- [ ] Cloud authentication uses OIDC where supported.
- [ ] Artifact/image promoted to production is identical to tested artifact.
- [ ] Rollback procedure is documented and executable.
- [ ] Health check and alerting signal are defined.
- [ ] Release notes include commit SHA / tag / artifact digest.
