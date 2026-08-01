---
title: "Three Kubernetes Deploy Scenarios That Will Test You in Production"
pubDate: "7/31/26"
tags: [ kubernetes, devops, gitops, incident-response, fintech ]
tier: "featured"
description: "Rolling back a partial deploy across 40 replicas, handling a mid-deploy NotReady node, and choosing between push-based CI and GitOps for regulated environments."
---

# Three Kubernetes Deploy Scenarios That Will Test You in Production

Most Kubernetes tutorials stop right before the interesting part. They show you `kubectl apply` working cleanly, pods
coming up green, traffic flowing through. What they skip — the partial rollout at 3 a.m., the node that goes NotReady
while your ReplicaSet is still converging, the architecture question your security team will ask before they sign off on
your CI pipeline — is where the real decisions live. This post covers three scenarios that expose how well your deploy
tooling, your runbooks, and your architecture hold up under pressure.

---

## Scenario 1: Rolling Back a Bad Deploy Across 40 Replicas in 3 Regions

Your deploy already touched 15 of 40 replicas before someone noticed the error rate climbing. You have a partial
rollout: some pods run the new image, some run the old one, and users hit both versions unpredictably. Here is exactly
what you do.

### Understand your blast radius before you touch anything

Run `kubectl rollout status deployment/<name> --namespace=<ns>` in each region. You need a precise count: how many pods
serve the new version, and how many serve the old. Do not guess. The `kubectl get pods -o wide` output gives you node
placement; check whether the faulty pods cluster on specific nodes or spread evenly. If they cluster, your problem may
be infrastructure, not the image.

Check your rollout history with `kubectl rollout history deployment/<name>`. Confirm that revision N-1 is the version
you intend to restore. If you deployed twice today, N-1 may not be what you think it is. Verify the image tag in the
history before you act.

### Execute the rollback

```bash
# Roll back to the previous revision in all three regions
kubectl rollout undo deployment/<name> --namespace=<ns> --context=us-east-1
kubectl rollout undo deployment/<name> --namespace=<ns> --context=eu-west-1
kubectl rollout undo deployment/<name> --namespace=<ns> --context=ap-southeast-1
```

If you need to target a specific revision rather than the previous one:

```bash
kubectl rollout undo deployment/<name> --to-revision=42 --namespace=<ns>
```

Watch the rollback converge in each region:

```bash
kubectl rollout status deployment/<name> --namespace=<ns> --timeout=5m
```

Do not move on until every region reports `successfully rolled out`. A rollback that completes in two regions and stalls
in the third leaves you with a split-brain production state.

### Communicate while it is in progress

The moment you confirm a rollback is necessary, open an incident channel and post your first update. Do not wait until
you have answers. Write something like:

> **15:42 UTC** — We are executing a rollback for `checkout-service` across all three regions. New image (v2.4.1)
> introduced elevated 500 rates on `/api/orders`. Estimated rollback completion: 10–15 minutes. Rollout status: us-east-1
> complete, eu-west-1 in progress, ap-southeast-1 pending.

Post a status update every five minutes until convergence. Engineers watching the channel need to know whether the
situation is improving or stuck. After completion, post the final summary with the duration, affected request volume,
and a link to the tracking issue for the postmortem.

### Validate before you close the incident

After `rollout status` confirms completion in all three regions, check your error rate dashboards directly — do not
trust the rollout status alone. If your deployment uses `PodDisruptionBudgets`, verify they were not violated during the
rollback by checking events: `kubectl get events --sort-by=.lastTimestamp`. An unhealthy PDB can mask a rollback that
completed structurally but left your availability budget exhausted.

---

## Scenario 2: A Node Goes `NotReady` Mid-Deploy

Your rolling deploy is 60% complete when one node flips to `NotReady`. Kubernetes continues scheduling new pods — but
where? And what happens to the pods already on the affected node? The answer depends on settings you configured before
the incident, not decisions you make during it.

### What Kubernetes does by default

When a node transitions to `NotReady`, the node lifecycle controller waits `node.kubernetes.io/not-ready:NoExecute`
tolerationSeconds (default: 300 seconds) before evicting pods. For those five minutes, the pods on the node report
`Unknown` status. They are not terminated; they are unreachable. New pods that the rolling deploy needs to schedule
avoid the `NotReady` node because the scheduler marks it unschedulable.

Your deploy may stall. If your `maxUnavailable` budget is exhausted because the `Unknown` pods on the failed node count
against it, the controller stops creating new pods until those pods either terminate or the node recovers. With the
default 300-second eviction delay, your deploy hangs for up to five minutes waiting for the scheduler to get clarity.

### What you see in the cluster

```bash
kubectl get nodes
# NAME           STATUS     ROLES    AGE
# node-abc123    NotReady   <none>   4d

kubectl describe node node-abc123
# Events:
#   Warning  NodeNotReady  ...  kubelet stopped posting node status

kubectl get pods --field-selector=spec.nodeName=node-abc123
# The pods here show status Unknown
```

The Unknown pods block your rollout. Check with:

```bash
kubectl rollout status deployment/<name>
# Waiting for deployment "<name>" rollout to finish: 2 out of 5 new replicas have been updated...
```

### Design your tooling to survive this scenario

The default behavior is recoverable but slow. Three settings determine how fast you recover.

**Set a short `tolerationSeconds` on `not-ready` taints.** The default 300-second grace period exists for transient
network blips, not for your deployment pipeline. For stateless services, 60 seconds is more appropriate:

```yaml
spec:
  template:
    spec:
      tolerations:
        - key: "node.kubernetes.io/not-ready"
          operator: "Exists"
          effect: "NoExecute"
          tolerationSeconds: 60
```

**Set `maxUnavailable` deliberately.** If you set `maxUnavailable: 0`, a single `NotReady` node that absorbs your
replica count stalls the deploy indefinitely because no pod can be considered unavailable. A value of
`maxUnavailable: 1` or a percentage like `25%` gives the controller room to continue even when pods on the failed node
are unreachable.

**Use a `PodDisruptionBudget` and define `minAvailable` in absolute terms, not percentages.** A percentage-based
`minAvailable` of 75% on a cluster mid-replacement means your budget changes as the rollout progresses. Fix it:
`minAvailable: 3` on a 4-replica service is unambiguous.

**Add a node failure probe to your deploy pipeline.** Before each rollout wave, check node health:

```bash
NOTREADY_COUNT=$(kubectl get nodes --no-headers | grep -c NotReady)
if [ "$NOTREADY_COUNT" -gt 0 ]; then
  echo "ERROR: $NOTREADY_COUNT nodes NotReady. Aborting deploy." >&2
  exit 1
fi
```

This check costs one API call and blocks deploys into a degraded cluster before any replicas change. A rolling deploy
that starts on a six-node cluster with one node already unhealthy starts with 17% of its scheduling capacity gone;
discover that before the first pod restarts, not after.

**Design for the node never recovering.** Assume the `NotReady` node is gone permanently. Your deploy must eventually
complete without it. If your replica count equals your node count, a single node failure makes a `maxUnavailable: 0`
deploy impossible. Run more replicas than nodes, or accept `maxUnavailable >= 1`.

---

## Scenario 3: Push-Based Pipeline vs. Pull-Based GitOps — Which Do You Choose for Regulated Fintech?

This is the architectural question your security team asks at the design review, and the tradeoffs are real. Both models
work; neither is universally correct. The right answer depends on your threat model, your audit requirements, and how
much operational complexity your team can sustain.

### Push-based: CI applies changes directly

In a push model, your CI system (GitHub Actions, Jenkins, Tekton) builds the artifact, then authenticates directly to
the cluster and applies the manifest. A typical job looks like this:

```yaml
- name: Deploy
  run: |
    aws eks update-kubeconfig --name prod-cluster
    kubectl set image deployment/api api=$IMAGE_TAG
```

The cluster trusts the CI system as the source of truth. The CI system holds credentials with write access to the
cluster.

**Advantages.** The deployment path is a single, linear pipeline. You can inspect exactly what ran, in what order, from
the CI logs. Rollbacks are a command in the same pipeline. Deployments complete synchronously within the pipeline run,
so your deployment duration appears directly in your CI dashboard. Feedback is immediate: the job either succeeds or
fails.

**Disadvantages.** Your CI system holds cluster credentials with write access to production. Compromise the CI system
and you compromise the cluster. The blast radius of a supply chain attack on your CI tooling (a malicious GitHub Action,
a compromised build dependency) is the entire production environment. For fintech environments under SOC 2, PCI-DSS, or
SOX, auditors ask who has access to those credentials, where they are stored, and what prevents a developer from pushing
an unauthorized change by triggering a pipeline manually. The answers require careful credential management, RBAC
scoping, and audit logging of every pipeline run.

Drift is also a risk. If someone applies a manual `kubectl` change to the cluster outside the pipeline, the pipeline
does not know — and on the next deploy, it may overwrite the manual change without warning, or leave the cluster in a
partially inconsistent state.

### Pull-based (GitOps): a controller reconciles to git

In a GitOps model (Argo CD, Flux), a controller running inside the cluster continuously watches a git repository. When
the repository changes, the controller pulls the new state and applies it. The cluster drives itself to match git.
Nothing outside the cluster writes to the cluster.

```
Git repo (desired state) <── reconcile loop ──> Argo CD controller ──> cluster
```

**Advantages.** The CI system never touches the cluster. CI builds the image and pushes it to a registry; a separate
commit updates the image tag in the config repo; the controller applies the change. Each step is decoupled. Auditors get
a complete, immutable record of every change in git history, including who committed it and when — a stronger audit
trail than CI logs, which can be deleted or rotated. Credentials for the cluster stay inside the cluster; nothing
external holds them.

Drift detection is automatic. If someone applies a manual change to the cluster, the controller flags the deviation and
can auto-remediate it back to the git state or alert on it. For a regulated environment, this property is not just
convenient — it satisfies the "unauthorized changes detected automatically" control that your compliance framework
likely requires.

**Disadvantages.** Deployments are asynchronous. Your CI pipeline finishes when the git commit lands; the actual cluster
state converges later, when the controller runs. "Did my deploy succeed?" requires querying the controller, not the
pipeline. Teams accustomed to synchronous deploy feedback find this disorienting.

The config repo requires discipline. You need a clear separation between the application repo (where code lives) and the
config repo (where Kubernetes manifests live), or you need a structured update workflow where CI opens a PR against the
config repo. Either way, you add a step to the deploy path.

Debugging a failed rollout requires correlating between the pipeline run, the git commit history, and the controller's
sync logs — three different systems. When something goes wrong, the failure surface is wider.

### Which to choose for a regulated fintech environment

Choose GitOps.

The security argument is decisive. In fintech, the threat model includes insider threat, compromised developer machines,
and supply chain attacks. A push-based pipeline that holds production cluster credentials centralizes risk in the CI
system: compromise one service account, one GitHub Actions secret, or one employee's access token, and an attacker
writes to production. A pull-based model removes that attack surface. The cluster fetches from git; nothing pushes to
the cluster.

The audit argument is equally strong. Financial regulators expect you to demonstrate that every production change was
authorized, reviewed, and logged. Git commits with mandatory code review (branch protection, required approvals) provide
that chain of evidence natively. A CI pipeline that applies changes directly requires separate tooling to achieve the
same traceability.

The operational complexity of GitOps is real, but manageable. You will spend two or three sprints configuring Argo CD,
establishing your config repo structure, and updating your deploy feedback dashboards to query the controller rather
than the pipeline. That investment pays off when your next SOC 2 audit asks for evidence that unauthorized cluster
changes are detected and prevented — because your reconcile loop provides that evidence automatically.

For internal developer tooling or staging environments where the threat model is lighter and iteration speed dominates,
a push-based pipeline is faster to set up and easier to reason about. Use it there. For production, in a regulated
environment, the audit trail and credential isolation that GitOps provides are not nice-to-haves — they are controls
your compliance framework requires, and GitOps delivers them at the infrastructure level rather than through manual
process.

---

These three scenarios share a common thread: the decisions that determine your outcome happen before the incident, not
during it. The rollback completes cleanly if your rollout history is intact. The NotReady node stalls your deploy for
five minutes or five seconds depending on your `tolerationSeconds` setting. The security team approves your pipeline on
the first review or the fifth depending on which model you chose. Production resilience is not a property you achieve
under pressure — it is an investment you make before anything goes wrong.
