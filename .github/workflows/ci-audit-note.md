# npm audit gate

Both workflows run this step immediately after `npm ci`:

```yaml
- name: npm audit (high+)
  run: npm audit --audit-level=high
```

- PR: `.github/workflows/ci.yml` (`quality` job)
- Main deploy: `.github/workflows/deploy-pages.yml` (`build` job)
