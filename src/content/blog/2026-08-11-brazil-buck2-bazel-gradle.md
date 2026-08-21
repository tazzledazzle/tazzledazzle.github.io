---
title: "Brazil, Buck2, Bazel, and Gradle: Four Build Systems, Three Philosophies"
pubDate: "8/11/26"
tags: [build-systems, bazel, gradle, buck2, brazil, devops, monorepo]
tier: "featured"
permalink: "/2026/08/11/brazil-buck2-bazel-gradle/"
hide_frontmatter: false
---

# Brazil, Buck2, Bazel, and Gradle: Four Build Systems, Three Philosophies

Build systems age poorly in public comparisons because the comparison degenerates into a feature matrix. This post starts instead with what each tool optimizes for — what the engineers who built it believed was the central problem — and traces the practical consequences. The four tools cluster into three philosophies: convention-driven builds (Gradle), hermetic correctness (Bazel and Buck2), and platform-integrated builds (Brazil). Understanding that structure makes the trade-offs legible.

---

## Gradle: Convention Over Configuration

Gradle grew out of the Java ecosystem's frustration with Maven's verbosity. Maven required explicit XML configuration for every step; Gradle replaced that with a Groovy DSL (and later Kotlin) where reasonable defaults handled the common case. Add a plugin, call a few functions, get a working build.

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "2.0.0"
    application
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web:3.3.0")
    testImplementation(kotlin("test"))
}

application {
    mainClass.set("com.example.AppKt")
}
```

This is Gradle's strength and its limit. The plugin ecosystem is vast — Android's build tooling runs on Gradle, Spring Boot's build tooling runs on Gradle, nearly every JVM project runs on Gradle. The incremental build and build cache features reduce rebuild time significantly. But Gradle's incremental model is advisory: it tracks task inputs and outputs, but trusts that tasks declare their inputs honestly. A task that reads an undeclared file or executes a network call contaminates the cache silently.

Gradle does not enforce hermeticity. The build runs in the JVM on your machine, against the dependencies that resolve from your configured repositories. Two developers running the same `./gradlew build` on different machines can get different outputs if their JVM versions differ or if a dependency resolves to a different version. Gradle Enterprise's remote build cache mitigates this but does not eliminate the root cause.

**Use Gradle when:** your project lives in the JVM ecosystem, your team knows the toolchain, and you will enforce build reproducibility across machines through CI policy rather than through the build system itself.

---

## Bazel: Hermetic Builds as the Central Invariant

Bazel is Google's open-source build system, derived from internal tooling (Blaze) built for running a monorepo at Google scale. Its central invariant is hermeticity: a build target's output is a deterministic function of its declared inputs and nothing else. No environment variables, no filesystem state outside declared dependencies, no network access during build steps.

```python
# BUILD file
py_binary(
    name = "server",
    srcs = ["server.py"],
    deps = [
        "//lib/auth:auth_lib",
        requirement("flask"),
    ],
)

py_test(
    name = "server_test",
    srcs = ["server_test.py"],
    deps = [":server"],
)
```

The BUILD file is Starlark — a deterministic, sandboxed subset of Python. Every target declares its sources and dependencies explicitly. Bazel executes each action in a sandbox with only the declared inputs visible. If an action reads a file you did not declare, the build fails.

This strictness pays off at scale. Because every action's output is a deterministic function of its inputs, Bazel can cache aggressively — locally and remotely. A developer who checks out a commit and runs `bazel build //...` gets a cache hit on every target a CI system already built, pulling outputs from the remote cache rather than rebuilding. On a large monorepo, this collapses a multi-hour build to minutes.

The cost is upfront investment in correct BUILD files. Bazel does not auto-discover dependencies; you declare them. For languages with implicit import mechanisms (Python, TypeScript), this means writing BUILD files by hand or using a gazelle-like generator. The `rules_*` ecosystem (rules_go, rules_python, rules_nodejs) provides language-specific rule sets, but integrating a new tool requires either a community ruleset or writing one.

**Use Bazel when:** you run a monorepo with multiple languages, remote caching across your team matters, and you can absorb the initial cost of correct BUILD file authoring.

---

## Buck2: Bazel's Philosophy, Rewritten in Rust

Buck2 is Meta's second-generation build system, released as open source in 2023. It shares Bazel's core philosophy — hermetic, action-based, remotely cacheable — but makes different choices at every layer.

The build language is still Starlark, so BUILD files from Bazel projects are largely legible in Buck2. The execution model differs in one important way: Buck2 evaluates rules lazily and computes the full action graph before executing any action. This makes incremental builds faster because Buck2 determines which actions need to re-run without conservative over-approximation.

```python
# BUCK file
python_binary(
    name = "server",
    main = "server.py",
    deps = [
        "//lib/auth:auth_lib",
    ],
)
```

Buck2 is written in Rust. Its Starlark interpreter is faster than Bazel's Java-based implementation, and the execution daemon persists state between builds to avoid cold-start overhead. On Meta's internal workloads, Buck2 delivered 40–50% build time improvements over Buck (the predecessor), though direct comparisons with Bazel depend heavily on workload characteristics.

The practical limitation is ecosystem maturity. Bazel has a decade of community rule development, a large `rules_*` library, and extensive documentation. Buck2's rules ecosystem is smaller, and integrating languages beyond C++, Python, and Rust — Meta's primary languages internally — requires more custom rule authoring. If your stack lives outside those languages, budget time for rules work.

**Use Buck2 when:** you are starting a new monorepo and want Bazel-like semantics with faster evaluation, your team has Rust expertise for writing custom rules, or you are already in Meta's ecosystem.

---

## Brazil: Build System as Platform

Brazil is Amazon's internal build system. It is not open source; the public interacts with it only indirectly through documentation about how Amazon structures its software development. This section describes it from the perspective of engineers who have worked in Amazon's internal environment.

Brazil's distinguishing characteristic is that it does not stand alone: it is one component of a platform that includes the Brazil CLI, Brazil Pipelines (CI/CD), Brazil Runtime Environment (RDE) for local service orchestration, and deep integration with Amazon's internal package management and service registry. A package in Brazil is not just a build artifact — it is a deployable unit with version semantics, an internal registry record, and a pipeline configuration.

```
# Brazil package config (Brazil.yml, conceptual)
name: MyService
version: 1.0
dependencies:
  - name: AmazonAuthLib
    version: ">=3.2.0"
  - name: AWSJavaSDK
    version: ">=2.20.0"
build:
  type: maven
  commands:
    - brazil-build
```

Brazil builds on top of existing language toolchains (Maven, Gradle, npm) rather than replacing them. The hermetic guarantee comes from a controlled dependency resolution system — packages declare version ranges, and Brazil resolves to a consistent lockfile stored in the package registry. Environment consistency comes from the platform, not from sandboxing individual build actions.

The trade-off is lock-in. Brazil packages assume Amazon's internal infrastructure: the package registry, the version resolution service, the pipeline runner. The local development experience through RDE couples tightly to Amazon's service mesh. Engineers moving into or out of Amazon's environment face a significant retooling period. Brazil's build rules are also less granular than Bazel's: build targets tend to be at the package level rather than the file level, so incremental builds are coarser-grained.

**Brazil applies when:** you are building at Amazon. Outside that context, the model it represents — build system as integrated platform with managed dependency resolution — is worth studying. The lessons about colocating package management, CI/CD, and runtime configuration have influenced open platform thinking at other companies.

---

## The Comparison That Matters

| | Gradle | Bazel | Buck2 | Brazil |
|---|---|---|---|---|
| **Philosophy** | Convention-driven | Hermetic correctness | Hermetic + fast evaluation | Platform-integrated |
| **Hermeticity** | Advisory (cache, not sandbox) | Strict sandbox | Strict sandbox | Platform-managed |
| **Build language** | Kotlin/Groovy DSL | Starlark | Starlark | Per-language (Maven, Gradle, npm) |
| **Remote caching** | Gradle Enterprise | Built-in | Built-in | Amazon-internal |
| **Ecosystem** | Vast (JVM/Android) | Large (rules_*) | Growing | Amazon-internal |
| **Incremental granularity** | Task-level | Action-level | Action-level (lazy) | Package-level |
| **Multi-language monorepo** | Limited | Excellent | Excellent | Limited |
| **Open source** | Yes | Yes | Yes | No |

The decision is not which tool is fastest. It is which model of correctness fits your team and your scale.

Gradle fits teams in the JVM ecosystem that want to move quickly with familiar tooling. The trade-off is accepting that build reproducibility is an operational concern — enforced through CI policy, pinned JVM versions, and dependency locking — rather than a structural guarantee.

Bazel and Buck2 fit teams running monorepos across multiple languages that need strong correctness guarantees and efficient remote caching. Both require BUILD file discipline and rule authoring investment. Bazel's larger ecosystem makes it the lower-risk choice today; Buck2's faster evaluation makes it worth evaluating for new monorepos where you are willing to author rules.

Brazil is not a choice most teams face. But its model — packaging, CI/CD, runtime, and build rules as a unified platform — is the direction platform engineering teams move toward at sufficient scale. The lesson from Brazil is that build correctness is easier to enforce when the build system owns the full lifecycle from source to deployment, not just the compilation step.
