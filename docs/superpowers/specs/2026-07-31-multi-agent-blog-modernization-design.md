# Multi-Agent Portfolio Modernization — Design Spec

**Date:** 2026-07-31  
**Status:** Approved  
**Author:** Brainstorming session (Terence + Claude)

---

## Goal

Parallelize completion of all 9 open beads work items using three specialized agents (Designer, Principal SWE, Product Manager), each working in their domain while documenting their reasoning in persona-voice journals. A synthesis agent then writes a 5000-word technical blog post from those journals.

---

## Orchestration Strategy: Option C — Parallel with Mid-Point Sync

All three agents launch simultaneously. After completing their first assigned issue, they pause at a mid-point checkpoint to share cross-cutting observations (e.g., Designer surfaces a CSS concern the SWE should know about; PM surfaces a content gap that affects visual work). Then all three finish their remaining issues independently. The synthesis agent runs last.

### Why Option C over B

The issues are partitioned by domain but not fully isolated. The Zod migration (`bbm`) changes type signatures that feed the blog collection, which affects tag rendering (`29s`). The spike integration (`rxl`) touches the same CSS the hero fallback fix (`qth`) edits. A mid-point sync lets agents surface these overlaps before they become rework.

---

## Agent Assignments

| Agent | Persona | Issues | Journal Path |
|-------|---------|--------|-------------|
| **Designer** | Senior visual/UX designer; cares about progressive enhancement, animation quality, reading experience | `rxl` (spike effects), `qth` (hero gradient fallback), `ufu` (PostNav label) | `docs/agents/designer/journal.md` |
| **Principal SWE** | Staff engineer; cares about type safety, CI correctness, technical debt clarity | `bbm` (Zod v4), `f3s` (CI gate), `4to` (stale plan), `4zk` (pubDate bug) | `docs/agents/swe/journal.md` |
| **Product Manager** | Technical PM; cares about user-facing quality, discoverability, UAT closure | `29s` (missing tags), `b51` (Phase 5 UAT) | `docs/agents/pm/journal.md` |

---

## Journal Format

Each journal is written in **first-person persona voice** — internal reasoning, tradeoffs considered, aesthetic opinions, frustrations, decisions. Not a changelog. The Designer notices the grain texture feels overdone. The SWE wonders if the Zod migration warrants a minor semver bump. The PM is frustrated that 10 high-visibility posts have been invisible to the tag index.

Each journal includes:
- **Pre-sync section**: work on first issue, observations to share at sync
- **Mid-point sync notes**: what was heard from the other two agents, what changed
- **Post-sync section**: remaining issues, how sync influenced decisions

---

## Mid-Point Sync Protocol

After each agent completes their first issue:
1. Designer surfaces any CSS/component concerns for SWE
2. SWE surfaces any type or schema changes that affect content rendering
3. PM surfaces any content or UX gaps either agent should address

Sync is captured in each agent's journal under a `## Mid-Point Sync` heading. Agents do not wait for each other — the sync is written as "what I heard and what I changed."

---

## Issue Completion Requirements

Each closed issue must:
- Have the actual code/content fix applied in the repo
- Be closed via `bd close <id>` with a reason
- Have the work summarized in the agent's journal

---

## Blog Post (Phase 2)

**File:** `src/content/blog/2026-07-31-multi-agent-portfolio-modernization.md`  
**Target length:** ~5000 words  
**Tone:** Technical narrative — written as if three colleagues are reflecting on a sprint together  
**Structure:**
1. Introduction — what the site was, what needed fixing, why it mattered
2. Designer's perspective — visual decisions, progressive enhancement philosophy, what was cut and why
3. Principal SWE's perspective — Zod migration, CI hardening, the stale plan problem
4. PM's perspective — discoverability, UAT, what "done" means for a solo portfolio
5. Cross-cutting themes — where the three perspectives collided and how they resolved
6. Conclusion — what the site looks and works like now, what remains

The synthesis agent uses all three `journal.md` files as primary sources. It quotes them directly (as pull-quotes or inline), preserving persona voice. The post is written in third-person narrative with first-person quotes from each agent's journal.

**Frontmatter:**
```yaml
---
title: "Three Perspectives on Modernizing a Technical Blog: A Multi-Agent Sprint"
pubDate: 2026-07-31
description: "A Designer, a Principal SWE, and a Product Manager walk into a codebase. This is what they found, what they fixed, and where they disagreed."
tags: [astro, portfolio, engineering-process, ux, ci-cd]
draft: false
---
```

---

## Execution Sequence

```
[Parallel]
  Agent: Designer    → rxl (first), mid-point sync, then qth + ufu
  Agent: Principal SWE → bbm (first), mid-point sync, then f3s + 4to + 4zk
  Agent: PM          → 29s (first), mid-point sync, then b51

[After all 9 closed]
  Agent: Synthesis   → reads 3 journals + bd list --status=closed
                     → writes blog post to src/content/blog/
```

---

## Success Criteria

- All 9 beads issues closed with `bd close`
- Three `journal.md` files exist with persona-voice entries and mid-point sync sections
- Blog post exists at `src/content/blog/2026-07-31-multi-agent-portfolio-modernization.md`
- Blog post is ~5000 words, cites all three journals, covers all 9 issues
- `npm run build` passes after all changes
