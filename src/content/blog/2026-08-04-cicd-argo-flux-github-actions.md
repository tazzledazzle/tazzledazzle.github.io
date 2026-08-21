---
title: "CI/CD with Argo CD, Flux, and GitHub Actions: What Each Tool Actually Controls"
pubDate: "8/4/26"
tags: [ci-cd, gitops, argocd, flux, github-actions, kubernetes, devops]
tier: "featured"
permalink: "/2026/08/04/cicd-argo-flux-github-actions/"
hide_frontmatter: false
---

# CI/CD with Argo CD, Flux, and GitHub Actions: What Each Tool Actually Controls

Teams adopting Kubernetes land on one of two confusions: they try to use GitHub Actions to deploy directly to their cluster — a push model that creates credential exposure they will regret — or they adopt Argo CD and Flux as if the two tools compete and they must choose one. Neither framing is right. These three tools occupy different layers of the delivery pipeline. Understanding where each tool's responsibility ends makes the whole system composable.

---

## The Layered Model

GitHub Actions is a CI system. Its job is to respond to events in your source repository: run tests, build artifacts, publish container images, and update configuration. It does not manage cluster state. It should never hold long-lived cluster credentials.

Argo CD and Flux are GitOps controllers that run inside your cluster. Their job is to watch a git repository and reconcile the cluster's actual state with the desired state declared there. They pull changes rather than receive them. The cluster's own controller applies changes; nothing external writes to it.

The seam between these layers sits at the container registry and the config repository:

```
Source repo → GitHub Actions (CI) → Registry + Config repo
                                              ↓
                                   Argo CD / Flux (CD) → Cluster
```

GitHub Actions produces artifacts and commits image tag updates. The GitOps controller notices the config change and applies it. The two systems never share credentials.

---

## GitHub Actions: CI, Not CD

In a GitOps pipeline, a GitHub Actions workflow does three things: tests the code, builds and pushes the image, and updates the deployment manifest with the new image tag.

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      id-token: write   # OIDC for AWS ECR
      contents: write   # commit image tag update to config repo

    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/github-ci
          aws-region: us-east-1

      - name: Build and push image
        run: |
          IMAGE_TAG=$(git rev-parse --short HEAD)
          docker build -t 123456789012.dkr.ecr.us-east-1.amazonaws.com/myapp:$IMAGE_TAG .
          aws ecr get-login-password | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com
          docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/myapp:$IMAGE_TAG
          echo "IMAGE_TAG=$IMAGE_TAG" >> $GITHUB_ENV

      - name: Update config repo
        uses: actions/checkout@v4
        with:
          repository: myorg/k8s-config
          token: ${{ secrets.CONFIG_REPO_TOKEN }}
          path: config

      - name: Bump image tag
        run: |
          cd config
          sed -i "s|image: .*myapp:.*|image: 123456789012.dkr.ecr.us-east-1.amazonaws.com/myapp:$IMAGE_TAG|" apps/myapp/deployment.yaml
          git config user.email "ci@myorg.com"
          git config user.name "CI Bot"
          git add apps/myapp/deployment.yaml
          git commit -m "chore: bump myapp to $IMAGE_TAG"
          git push
```

The workflow never runs `kubectl`. It never authenticates to the cluster. Its write access stops at the config repository.

---

## Argo CD: Application-Centric GitOps

Argo CD models your deployments as `Application` resources. Each `Application` points to a path in a git repository and a target namespace in the cluster. Argo CD's controller runs a reconciliation loop: compare the git state to the live state, compute a diff, and apply it.

```yaml
# argocd/apps/myapp.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: myapp
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/k8s-config
    targetRevision: main
    path: apps/myapp
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true       # delete resources removed from git
      selfHeal: true    # revert manual kubectl changes
    syncOptions:
      - CreateNamespace=true
```

`selfHeal: true` gives GitOps its audit strength. When someone runs a manual `kubectl set image` in production, Argo CD detects the drift and reverts it within the next sync cycle (default: three minutes). The git commit history becomes the authoritative record of every production state.

For deploying the same application across multiple environments, `ApplicationSet` replaces hand-managing one `Application` per environment:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: myapp
  namespace: argocd
spec:
  generators:
    - list:
        elements:
          - env: staging
            namespace: staging
          - env: production
            namespace: production
  template:
    metadata:
      name: "myapp-{{env}}"
    spec:
      source:
        repoURL: https://github.com/myorg/k8s-config
        path: "apps/myapp/overlays/{{env}}"
        targetRevision: main
      destination:
        server: https://kubernetes.default.svc
        namespace: "{{namespace}}"
      syncPolicy:
        automated:
          prune: true
          selfHeal: true
```

For ordered rollouts across dependent services, sync waves control sequencing. Annotate resources with `argocd.argoproj.io/sync-wave: "N"` to force Argo CD to wait for wave N to be healthy before starting wave N+1. Database migrations run in wave 0, the application in wave 1, the smoke test job in wave 2.

---

## Flux: Composable GitOps Primitives

Flux takes a different design approach: instead of a single `Application` resource, it composes several CRDs, each managing one concern.

- `GitRepository` — watches a git repo and fetches its contents on a schedule
- `Kustomization` — applies a path from a `GitRepository` to the cluster
- `HelmRepository` — watches a Helm chart repository
- `HelmRelease` — installs and upgrades a Helm chart

```yaml
# flux/sources/k8s-config.yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: k8s-config
  namespace: flux-system
spec:
  interval: 1m
  url: https://github.com/myorg/k8s-config
  ref:
    branch: main
---
# flux/kustomizations/myapp.yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: myapp
  namespace: flux-system
spec:
  interval: 5m
  sourceRef:
    kind: GitRepository
    name: k8s-config
  path: ./apps/myapp
  prune: true
  healthChecks:
    - apiVersion: apps/v1
      kind: Deployment
      name: myapp
      namespace: production
```

Flux's image automation controller handles image tag updates natively, eliminating the `sed` step from the GitHub Actions workflow. Annotate the image field in your manifest and let Flux scan the registry:

```yaml
# In deployment.yaml — Flux image automation marker
image: 123456789012.dkr.ecr.us-east-1.amazonaws.com/myapp:main-abc1234 # {"$imagepolicy": "flux-system:myapp"}
```

```yaml
# flux/image-policies/myapp.yaml
apiVersion: image.toolkit.fluxcd.io/v1beta2
kind: ImagePolicy
metadata:
  name: myapp
  namespace: flux-system
spec:
  imageRepositoryRef:
    name: myapp
  policy:
    semver:
      range: ">=0.0.0-0"  # or filter by prefix: main-
```

When GitHub Actions pushes a new image, Flux's image reflector scans the registry, the image automation controller commits the updated tag back to git, and the Kustomization controller applies it to the cluster — all without GitHub Actions touching the cluster.

---

## Argo CD vs Flux: How to Choose

Both tools implement the same GitOps contract. The differences are operational and ergonomic.

**Choose Argo CD if:**
- You want a first-class UI for visualizing application sync status and resource graphs
- Your team manages many applications across many clusters and needs `ApplicationSet` templating
- You want a single pane of glass for deployment status with role-based access control for non-engineer stakeholders

**Choose Flux if:**
- You prefer a fully declarative, CRD-only model with no UI dependency
- You want native image automation without a separate CI step to update manifests
- You need GitOps controllers that bootstrap themselves from git (`flux bootstrap` handles its own installation declaratively)
- Your team values composability: mixing `HelmRelease` for off-the-shelf charts and `Kustomization` for in-house manifests in the same reconciliation graph

The two tools are also composable: some teams run Flux for infrastructure-level components (ingress controllers, cert-manager, monitoring) and Argo CD for application deployments. The boundary maps cleanly onto Flux's CRD model.

---

## The Full Pipeline

The pipeline for a production deployment proceeds as follows:

1. Developer merges a PR to `main` in the source repo
2. GitHub Actions runs tests, builds the image, and pushes it to ECR
3. GitHub Actions commits an updated image tag to the config repo (or Flux image automation does it)
4. Argo CD or Flux detects the config change within its polling interval (30 seconds to 3 minutes)
5. The controller applies the diff — rolling update, sync wave ordering, or Helm upgrade depending on configuration
6. Health checks confirm the rollout; the controller marks the sync complete

End-to-end deploy time depends on two variables you control: CI pipeline speed and GitOps polling interval. A thirty-second polling interval with a three-minute CI pipeline produces a three-and-a-half-minute deploy — without GitHub Actions ever touching your cluster.
