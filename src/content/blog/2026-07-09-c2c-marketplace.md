---
title: "Project Shadow: C2C Marketplace Mock"
pubDate: "2026-07-09"
tags: []
tier: "featured"
permalink: "/2026/07/09/c2c-marketplace/"
hide_frontmatter: false

---

# Project Shadow: C2C Marketplace Mock

I'll be walking you through a mock project I created. I wanted to create a local test environment
that mimicked one of the products I've worked on professionally. 

----
## What is it?
Simulated product surface
A runnable, simplified simulation of a mid-scale mobile-first C2C marketplace. Listing,
 Search, Messaging, and Payments services backed by Postgres, Redis, OpenSearch, and Kafka 
(via Redpanda), deployable to a local kind cluster.
Features:
- **TruYou** - Phone number verification + government ID + selfie liveness check via third-party, resulting in badge on public profile
- **In-app messaging** - keeps phone numbers private between buyer and seller.
- **Community MeetUp Spots** - designated safe locations for local exchange. 
- **Nationwide Shipping** - prepaid label generation by weight tier.
- **2-Day Buyer Protection** - escrow-style hold payment, released after post-delivery window, chargable back if the buyer disputes.

## Troubles?
PostgreSQL