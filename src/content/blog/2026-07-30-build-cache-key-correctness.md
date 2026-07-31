---
title: "Getting Build Cache Keys Right: Why Cache Invalidation is (mostly) a Hashing Problem"
pubDate: "7/31/26"
tags: []
tier: 
permalink: ""
hide_formatter: false
---

# Getting Build Cache Keys Right: Why Cache Invalidation Is (Mostly) a Hashing Problem

"There are only two hard things in computer science: cache invalidation and naming things." It's a joke that build engineers hear constantly and mostly agree with, despite the punchline underselling it. In a Bazel-style build system, cache invalidation isn't some separate mechanism bolted onto the cache. If you design the cache key correctly, invalidation stops being a problem you solve with logic and becomes a property that falls out of hashing, for free. Get the key wrong, and no amount of clever invalidation logic saves you — you'll either serve stale artifacts silently, or throw away a working cache and rebuild the world on every change.

I've spent a lot of my career in this exact territory: dependency-management and build-observability tooling for multi-language monorepos, where a single incorrect cache key doesn't just slow one engineer down — it propagates through every downstream target that depends on it. This post walks through how to build a correct cache key generator for a Bazel-style target graph, and — more importantly — the specific ways this goes wrong in production and what each failure actually costs you.

## What a cache key has to represent

A build cache is fundamentally a lookup table: cache_key -> build_output. The entire correctness guarantee of the system rests on one invariant: two different inputs must never produce the same key, and the same logical inputs must always produce the same key, regardless of when or where the build runs.

## "Inputs," precisely, means everything that can affect the output:

The content of the target's own source files.
The transitive closure of every dependency's inputs — not just direct dependencies, but everything they depend on, recursively.


In a fully rigorous system: compiler/toolchain version, build flags, and relevant environment variables. (The exercise here scopes down to source and dependency hashes, so I'll implement that core and call out where production systems extend it.)

## Two naive approaches fail immediately and are worth naming, because they're what people reach for first:

### Path + timestamp caching (make's model): 

A target is stale if its output is older than any input file's mtime. This breaks the moment you git checkout a branch and every file's mtime resets, or two machines have clock skew, or a file is touched without its content changing. It's not a hashing problem at all — it's inferring correctness from a proxy (time) that has no causal relationship to content.

### Direct-dependency-only hashing:

Hash a target's own files plus its direct dependencies' hashes, but not their dependencies. This looks reasonable and is the single most common real-world bug. If C depends on B depends on A, and A changes, B's key correctly changes — but if you didn't recursively fold B's new key into C, and instead only used B's stale cached key, C never invalidates. This is a silent, cascading correctness bug, and it's exactly the failure mode content-addressable design exists to eliminate.

## Content-addressable design: the key is a Merkle hash

The fix is to make each target's cache key a function of its own content hash and the already-computed cache keys of its dependencies — recursively, all the way down. This is a Merkle tree: every node's hash transitively commits to the entire subgraph beneath it. Change anything, anywhere in the transitive closure, and the change propagates upward through every dependent hash automatically. There's no separate "invalidate dependents" step to forget, because dependents were never computed independently of their dependencies in the first place.

## Two details matter as much as the recursion itself:

Order independence for siblings. A target with dependencies {A, B} must hash identically regardless of whether the build graph enumerated them as [A, B] or [B, A]. Sort dependency keys before combining them. Skipping this turns cache hits into a coin flip based on filesystem iteration order — a bug that looks like random flakiness and is brutal to reproduce.
Unambiguous serialization. Don't just concatenate strings. "ab" + "c" and "a" + "bc" produce the same naive concatenation but must never produce the same key if they represent different inputs. Use explicit delimiters or length-prefixing so the input to the hash function is injective with respect to the logical structure it represents.

### Implementation

```kotlin

import java.security.MessageDigest

/**
 * A single build target in a Bazel-style dependency graph.
 *
 * sourceFileHashes: pre-computed content hashes of this target's own source
 *   files (e.g. SHA-256 of each file's bytes). Order here doesn't need to be
 *   pre-sorted by the caller — we normalize it below.
 */
data class BuildTarget(
    val label: String,
    val sourceFileHashes: List<String>,
    val dependencies: List<BuildTarget>
)

class CacheKeyGenerator {

    // Memoize per generator instance, scoped to a single build graph traversal.
    // Sharing this map across unrelated graphs would leak stale keys across builds.
    private val memo = mutableMapOf<String, String>()

    fun computeCacheKey(target: BuildTarget): String =
        memo.getOrPut(target.label) {
            val ownContentDigest = sha256(
                target.sourceFileHashes.sorted().joinToString(separator = "\u0000")
            )

            // Recurse first: a dependency's key already commits to *its*
            // entire transitive closure, so we never need to re-walk it here.
            val depKeys = target.dependencies
                .map { computeCacheKey(it) }
                .sorted() // sibling order must never affect the result

            val combinedInput = buildString {
                append("label\u0000").append(target.label).append('\u0000')
                append("content\u0000").append(ownContentDigest).append('\u0000')
                append("depCount\u0000").append(depKeys.size).append('\u0000')
                depKeys.forEach { append("dep\u0000").append(it).append('\u0000') }
            }

            sha256(combinedInput)
        }

    private fun sha256(input: String): String {
        val digest = MessageDigest.getInstance("SHA-256").digest(input.toByteArray(Charsets.UTF_8))
        return digest.joinToString(separator = "") { "%02x".format(it) }
    }
}
```
A focused test suite that actually proves the invariants, rather than just exercising happy-path output:

### Implementation 

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals

class CacheKeyGeneratorTest {

    private fun leaf(label: String, hashes: List<String>) =
        BuildTarget(label, hashes, emptyList())

    @Test
    fun `identical target graphs produce identical keys`() {
        val a1 = leaf("//lib:A", listOf("h1", "h2"))
        val a2 = leaf("//lib:A", listOf("h1", "h2"))
        val gen = CacheKeyGenerator()
        assertEquals(gen.computeCacheKey(a1), CacheKeyGenerator().computeCacheKey(a2))
    }

    @Test
    fun `changing a source file hash changes the key`() {
        val original = leaf("//lib:A", listOf("h1", "h2"))
        val modified = leaf("//lib:A", listOf("h1", "h2-changed"))
        val gen = CacheKeyGenerator()
        assertNotEquals(gen.computeCacheKey(original), CacheKeyGenerator().computeCacheKey(modified))
    }

    @Test
    fun `sibling dependency order does not affect the key`() {
        val a = leaf("//lib:A", listOf("h1"))
        val b = leaf("//lib:B", listOf("h2"))
        val cAB = BuildTarget("//app:C", listOf("h3"), listOf(a, b))
        val cBA = BuildTarget("//app:C", listOf("h3"), listOf(b, a))
        val gen = CacheKeyGenerator()
        assertEquals(gen.computeCacheKey(cAB), CacheKeyGenerator().computeCacheKey(cBA))
    }

    @Test
    fun `a change deep in the transitive graph propagates to the root`() {
        val a = leaf("//lib:A", listOf("h1"))
        val b = BuildTarget("//lib:B", listOf("h2"), listOf(a))
        val c = BuildTarget("//app:C", listOf("h3"), listOf(b))
        val rootKeyBefore = CacheKeyGenerator().computeCacheKey(c)

        val aChanged = leaf("//lib:A", listOf("h1-changed"))
        val bAfter = BuildTarget("//lib:B", listOf("h2"), listOf(aChanged))
        val cAfter = BuildTarget("//app:C", listOf("h3"), listOf(bAfter))
        val rootKeyAfter = CacheKeyGenerator().computeCacheKey(cAfter)

        assertNotEquals(rootKeyBefore, rootKeyAfter) // this is the test that catches the classic bug
    }

    @Test
    fun `distinct targets with identical content still get distinct keys`() {
        // Including the label means identity, not just content, is part of the key —
        // a deliberate design choice, discussed below.
        val x = leaf("//lib:X", listOf("h1"))
        val y = leaf("//lib:Y", listOf("h1"))
        val gen = CacheKeyGenerator()
        assertNotEquals(gen.computeCacheKey(x), CacheKeyGenerator().computeCacheKey(y))
    }
}
```
That fourth test — the deep-propagation case — is the one I'd actually run first when reviewing someone else's cache key implementation. It's the single test that fails against the direct-dependency-only bug described above, and from my experience it's the one people forget to write because of the shallow tests all passing first.

One design choice worth calling out explicitly: I fold the target's label into its own key, not just content. Pure content-addressable storage would let two targets with byte-identical inputs share a cache entry. That's tempting, but it conflates "same bytes" with "same build," and real build actions depend on more than declared source and dependency hashes — compiler flags, toolchain version, target-specific defines. Bazel's actual action cache keys on the full command line plus its input hashes, not source content in isolation. A cache key generator scoped to source-and-dependency hashes, as here, should be understood as the core of the mechanism, not the whole of it — anything that can change compiled output (flags, environment, toolchain) belongs in the key in a production system.

## Cache invalidation correctness: what actually breaks

Given a correct Merkle-style key, "invalidation" isn't a step you perform — a changed input produces a different key by construction, so the cache simply misses and rebuilds. The failure modes all come from places where that construction is subtly wrong:

### Under-invalidation (false cache hit)

The dangerous direction. This is the direct-dependency-only bug from earlier, and it's the worst failure mode a build system can have, because it's silent. The build reports success, tests pass against a cached binary, CI goes green — and the actual deployed artifact doesn't contain the change that was just merged. These bugs surface days later as "I fixed this already, why is it still broken in prod," and they erode trust in the build system itself, which is expensive to earn back even after the root cause is fixed.

### Non-deterministic inputs leaking into the key.

Absolute file paths, hostnames, environment variables that don't actually affect output, or map/set iteration order in whatever language computed the hash upstream — any of these make the same logical build produce different keys on different machines or different runs. This manifests as cache misses that look exactly like random flakiness: a build is "sometimes" slow, and nobody can reproduce it reliably, because the non-determinism is in the key computation, not the build itself.

### Over-invalidation (false cache miss)

The safe-looking failure, but not free: include something in the key that changes on every build — a timestamp, a random build ID — and every build becomes a cold build. Correctness holds, but you've paid for a distributed cache and gotten none of its benefit. This tends to get "fixed" by someone stripping fields out of the key under time pressure, which is exactly how the dangerous under-invalidation bug gets introduced later.

### Diamond dependencies without proper memoization scope

If D is depended on by both B and C, and both are depended on by A, a naive recursive implementation without memoization recomputes D's key twice — harmless for correctness but expensive at scale, and if the two computations aren't guaranteed identical (e.g., non-deterministic ordering bug above), you get two different keys for the same node within a single build, which is a correctness bug, not just a performance one.

In a real monorepo, I've watched under-invalidation manifest as exactly this: a shared internal library changed, a mid-tier target's cache key didn't fully absorb the change because of a gap in how transitive hashes were folded in, and a downstream service kept shipping a stale compiled dependency for several build cycles before anyone noticed the binary didn't match the source tree it was supposedly built from. The fix wasn't a smarter invalidation heuristic — it was exactly the test case above: assert that a change anywhere in the transitive graph changes the root key, and make that assertion part of the build system's own test suite, not just something you reason about informally.

## Closing thought

The instinct when a cache misbehaves is to add logic: another special case, another manual "bust the cache" button, another TTL. Almost every one of those is a patch over a cache key that isn't actually capturing everything the output depends on. Get the key right — content plus full transitive closure, deterministic serialization, order-independent combination — and invalidation isn't a feature you build. It's a consequence you get for free.

That reframing is worth carrying into how you review build-system changes generally, not just cache key code specifically. Whenever someone proposes adding a manual cache-busting mechanism, or a "force rebuild" flag that engineers are told to reach for when things seem stale, treat it as a symptom report, not a fix. It means some input that affects the output isn't flowing into the key — a new build flag, a generated file the key generator doesn't know about, an environment variable a toolchain silently reads. The manual override makes the symptom bearable; it doesn't make the key correct, and every engineer who has to remember to flip it by hand is a small, ongoing tax on the team's trust that "cached" actually means "correct."