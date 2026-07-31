---
title: 2026-06-03-step-debugging
pubDate: 7/31/26
tags: []
tier: 
permalink:
hide_formatter: false
---

1. A Deployment’s rollout is stuck at 80% —
    - new pods aren’t becoming Ready.
    - Walk through your diagnostic steps (readiness probe config, resource requests/limits, PodDisruptionBudget
      interaction, image pull errors).

2. Explain what happens, step by step, when a node goes **`NotReady`** mid-deploy, and how you’d design your deployment
   tooling to behave safely in that scenario.

3. You need to roll back a bad deploy that already partially completed across 40 replicas in 3 regions.
    - Walk through exactly what you’d check and do, and how you’d communicate status while it’s in progress.

4. A **`terraform apply`** fails halfway through, creating some resources but not others. What do you check before
   re-running, and when would you use **`terraform state`** surgery instead of just re-applying?

5. Explain the tradeoffs between a **push-based** deploy pipeline (CI directly applies to the cluster) and a
   **pull-based GitOps** model (a controller reconciles cluster state to match a git repo). Which would you choose for a
   regulated fintech environment, and why?

6. Design an alerting rule that distinguishes “a deploy caused this” from “this was already degrading before the
   deploy” — what data do you need, and how do you avoid both false positives and false negatives?

### **E. Values / behavioral (graded against Ownership, Customer Obsession, Bias for Action, High Agency) (26–30)**

1. Tell me about a time you owned an ambiguous, unscoped problem end-to-end. What triggered it, what did you
   specifically do, and what was the measurable outcome?
2. Describe a time you shipped something imperfect on purpose because speed mattered more than completeness — how did
   you decide, and what was the follow-up plan?
3. Tell me about a production incident you were involved in that wasn’t your team’s direct fault, but you took ownership
   of anyway. What did you do?
4. Describe a time you disagreed with a technical direction a more senior engineer or your manager had chosen. How did
   you handle it, and what happened?
5. Tell me about a time you had to make a call with incomplete information because waiting for certainty would have cost
   too much time. What was your reasoning, and how did it turn out?