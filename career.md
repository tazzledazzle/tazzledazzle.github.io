---
layout: page
title: Career
permalink: /career/
---

# Career

Senior platform and reliability engineer focused on release automation, build systems, and making CI/CD measurable before production fails.

> **Note:** The live Astro site renders this timeline from [`src/data/career.yml`](src/data/career.yml). Keep that file in sync when editing career history.

## Professional Experience

### Senior Site Reliability Engineer, FDE Data Platform
**Invisible Technologies** · Jan 2025 – Present

- Designed a platform-wide maturity audit across 28 microservices using GitHub Actions and DORA-style scoring, surfacing 14 critical reliability and release gaps.
- Built a Temporal-orchestrated observability platform in Kotlin with OpenTelemetry, Prometheus, and Grafana, instrumenting 100% of critical AI workflow paths for distributed tracing.
- Delivered a configurable AI pipeline scaffold in Kotlin with 6 plug-and-play components, taking end-to-end ownership across 3 concurrent infrastructure initiatives.

### Senior Software Engineer, Platform & Infrastructure
**Tableau Software (Salesforce)** · Jan 2021 – Jul 2024

- Reduced release lead time by 79% by redesigning CI/CD pipelines in TeamCity and GitLab CI with automated branching, deployment gates, and telemetry-gated canary rollouts.
- Automated macOS code-signing and notarization end-to-end, eliminating ~720 hours of annual manual effort (360× improvement) via custom Python and Kotlin tooling.
- Led migration of the legacy CMake/Ninja desktop build to Bazel for Apple Silicon, improving production defect detection by 25% with ASAN, TSAN, and UBSAN in CI.
- Mentored 4+ engineers on CI/CD and release engineering; ran monthly onboarding sessions for 20+ new hires on internal pipeline architecture.

### Software Engineer, Server Build & Platform Infrastructure
**Tableau Software (Salesforce)** · Apr 2017 – Jan 2021

- Built release branching automation in Kotlin/Gradle integrated with the GitLab API, reducing release engineering cycle time by 35% and eliminating manual multi-environment coordination errors.
- Transitioned developer tooling to a multi-project Bazel environment, reducing incremental build times by up to 75% across a monolith serving hundreds of engineers.
- Shipped custom Gradle plugins and Artifactory integration used by 200+ engineers; served as primary SME for Kotlin/Gradle build-system incident response.

## Education

### University of Washington Bothell
**Bachelor of Science in Computer Science & Software Engineering**

## Technical focus

- **Platform & release:** CI/CD (GitHub Actions, TeamCity, GitLab CI), canary / progressive delivery, DORA metrics
- **Build systems:** Bazel, Gradle/Kotlin, CMake → Bazel migrations, remote cache patterns
- **Observability:** OpenTelemetry, Prometheus, Grafana, Temporal-orchestrated tracing
- **Languages:** Kotlin, Python, TypeScript/JavaScript, Java, Swift (macOS tooling)
- **Runtime & ops:** Kubernetes, Docker, macOS signing & notarization, Artifactory

## What I'm looking for

Roles where platform reliability, release automation, and developer experience are first-class — not afterthoughts. Happy to dig into build graphs, canary gates, or maturity audits with hiring teams.

---

Connect on [LinkedIn](https://linkedin.com/in/terenceschumacher) or [email](mailto:terenceschumacher@gmail.com).
