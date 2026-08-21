---
title: "The Infrastructure Decisions You Cannot Take Back"
pubDate: "8/14/26"
tags: [infrastructure, architecture, aws, terraform, platform-engineering]
tier: "featured"
permalink: "/2026/08/14/infrastructure-decisions-you-cannot-take-back/"
hide_frontmatter: false
---

# The Infrastructure Decisions You Cannot Take Back

Most infrastructure mistakes are recoverable. You chose the wrong instance type — resize it. You picked the wrong logging library — swap it. You underprovisioned your cache — add nodes. The operational cost is real, but the path forward is clear.

A small class of decisions does not work this way. These are the choices where the downstream blast radius is so large, and the migration cost so high, that the decision becomes permanent once your system is live. Treat them with the same rigor you would apply to a schema change on a table with two billion rows.

---

## Account Structure: One Account or Many

In AWS, your account boundary is a hard security boundary. IAM policies, SCPs, and resource policies all operate within an account. Cross-account access requires explicit trust relationships. Account structure is therefore your highest-leverage architectural decision — and your most permanent.

A single-account organization is easy to start with and slow to escape. When security auditors demand production isolation from staging, you discover that re-homing resources across accounts is not a rename — it requires re-provisioning nearly everything: IAM roles, VPCs, S3 bucket ARNs, KMS keys, CloudWatch log groups. A compromised secret also spans your entire infrastructure, because no account boundary limits lateral movement.

A multi-account structure with AWS Organizations separates concerns at the platform level rather than the policy level:

```
Root
├── Security (audit logs, GuardDuty, Security Hub)
├── Shared Services (CI/CD runners, artifact storage, DNS)
├── Production
│   ├── prod-platform
│   └── prod-data
└── Non-Production
    ├── staging
    └── dev
```

Start here, even if you launch with one application. Adding accounts later is cheap; consolidating them afterward takes months.

The rule: put production in its own account, put your security tooling in a separate account that production cannot write to, and use SCPs to enforce your invariants at the organization level where individual teams cannot override them.

---

## VPC CIDR Sizing: The Address Space You Will Wish You Had More Of

AWS assigns a VPC CIDR block at creation. You can add secondary CIDRs later, but the primary range is fixed. More critically, the RFC 1918 space you assign each VPC determines what you can peer with or connect to via Transit Gateway — overlapping CIDRs cannot join.

The common mistake: starting with `/24` (256 addresses) or `/20` (4,096 addresses) because it seems sufficient for current load. Three years later, the network team carves `/28` subnets out of secondary CIDRs by hand, DNS resolution routes through overlapping address space via complex NATing, and the VPC peering mesh has grown too tangled to reason about.

Allocate generously from the start:

| Tier | Recommended CIDR | Usable IPs | Why |
|------|-----------------|------------|-----|
| Production VPC | `/16` | 65,536 | Room for multi-AZ subnets, service mesh sidecars, future services |
| Non-prod VPC | `/18` | 16,384 | Proportionally smaller; still room to grow |
| Per-AZ subnet | `/20` | 4,096 | Allows 16 subnets per VPC, one per AZ per tier |

Write a CIDR planning document before provisioning anything. Assign blocks from a master range (e.g., `10.0.0.0/8`) so every VPC's range is non-overlapping from day one. When you add Transit Gateway later, every attachment will route cleanly.

---

## IAM Architecture: Roles, Not Users

Long-lived IAM users with access keys are a security liability. Keys get committed to git, copied into CI environment variables, stored in `.aws/credentials` on laptops, and emailed in onboarding docs. When they leak, you cannot know when someone copied them or who holds them now.

The architecture that eliminates this problem: no human IAM users, no long-lived keys.

**For human access**: use IAM Identity Center (SSO) with short-lived credentials vended per session. Each developer assumes a role in the target account and receives credentials expiring in one to eight hours. Both the role's permissions and the credential lifetime bound the blast radius of a compromised session.

**For machine access**: use IAM roles with instance profiles (EC2), IRSA (EKS), or OIDC federation (GitHub Actions, CircleCI). The workload receives credentials from the platform — rotated automatically, scoped to exactly the permissions it needs.

```yaml
# GitHub Actions: OIDC federation, no stored keys
- uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456789012:role/github-deploy
    aws-region: us-east-1
```

The rule to encode in your SCPs: `DenyCreateAccessKey` on all accounts except a break-glass emergency account that requires MFA and triggers audit alerts on every use.

---

## Terraform State Layout: One Workspace or Many

Terraform state is the source of truth for what exists. When a `terraform apply` fails partway through, the state file records what succeeded. When two engineers run `apply` simultaneously, the state lock determines who wins. These properties make state layout an architectural decision whose operational consequences compound over time.

A single monolithic state file fails this way: every change triggers a `terraform plan` that touches every resource in your infrastructure. A developer updating a Lambda environment variable forces a plan that reads every RDS instance, every security group, every IAM role. The plan is slow. A typo's blast radius is your entire account. State locking serializes all infrastructure changes behind a single mutex.

The pattern that scales: one state file per logical boundary.

```
terraform/
├── account-bootstrap/        # IAM Identity Center, SCPs, account-level config
│   └── main.tf               # apply rarely, carefully
├── networking/               # VPCs, Transit Gateway, Route53 zones
│   └── main.tf               # apply when topology changes
├── platform/                 # EKS cluster, RDS, ElastiCache
│   └── main.tf               # apply per environment
└── services/
    ├── checkout-service/     # per-service infra: queues, roles, buckets
    └── payment-service/
```

State files pass outputs to each other via `terraform_remote_state` or SSM Parameter Store. Each layer reads what the layer below exported; it manages nothing it did not create.

The rule: if two resources will never change at the same time for the same reason, they belong in different state files.

---

## The Compounding Cost of Getting These Wrong

These four decisions — account structure, network topology, IAM architecture, and state layout — interact. A monolithic account makes it hard to scope state files by environment. An undersized CIDR turns Transit Gateway routing into an ongoing puzzle. Long-lived IAM keys bypass the role-per-workload model your state layout assumes.

Get one wrong and you work around it. Get two wrong and the workarounds interfere with each other. Get three wrong and you have a platform your team avoids touching because the consequences of a mistake are unclear and large.

The investment is small. A well-designed account structure takes a day to set up. A CIDR plan takes an afternoon. IAM architecture decisions fit in a one-page document. Terraform state layout emerges naturally from your service decomposition if you think about it before writing the first module. The decisions are not technically difficult. The only way to get them wrong is to skip them.
