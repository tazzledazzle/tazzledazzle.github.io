---
title: "Project Shadow: C2C Marketplace Mock"
pubDate: "2026-07-09"
tags: []
tier: "featured"
permalink: "/2026/07/09/c2c-marketplace/"
hide_frontmatter: false

---

# Project Shadow: C2C Marketplace Mock

I'll be walking you through a mock project I created. I wanted to build a local test environment that mimicked one of the products I've worked on professionally.

----
## What is it?

A runnable, simplified simulation of a mid-scale mobile-first C2C marketplace. Listing, Search, Messaging, and Payments services backed by Postgres, Redis, OpenSearch, and Kafka (via Redpanda), deployable to a local kind cluster.

Features:
- **TruYou** — Phone number verification + government ID + selfie liveness check via third-party, resulting in a badge on the public profile.
- **In-app messaging** — Keeps phone numbers private between buyer and seller.
- **Community MeetUp Spots** — Designated safe locations for local exchange.
- **Nationwide Shipping** — Prepaid label generation by weight tier.
- **2-Day Buyer Protection** — Escrow-style payment hold, released after the post-delivery window, chargeable back if the buyer disputes.

## Troubles?
PostgreSQL