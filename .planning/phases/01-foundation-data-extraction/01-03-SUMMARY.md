---
phase: 01-foundation-data-extraction
plan: 03
subsystem: content
tags: [career, yaml, linkedin, hiring-data]

requires: ["01-01"]
provides:
  - "_data/career.yml with last 3 roles and quantified bullets (DATA-02)"
affects: ["01-04", "Phase 3 Hiring Pages"]

key-files:
  created: ["_data/career.yml"]
  modified: []

requirements-completed: [DATA-02]

duration: 5 min
completed: 2026-07-02
---

# Phase 01: 03 Summary

**LinkedIn-sourced career data in structured YAML — 3 roles, quantified bullets, UW degree only**

## Accomplishments

- Populated `_data/career.yml` from resume ([LinkedIn](https://www.linkedin.com/in/terenceschumacher/)) after human checkpoint
- Roles: Invisible Technologies (SRE), Tableau/Salesforce Senior SWE (2021–2024), Tableau/Salesforce SWE (2017–2021)
- Each role has 3–4 bullets with quantified metrics (79% lead time reduction, 360x notarization, 28 microservices audit, etc.)
- Education: University of Washington B.S. CS & Software Engineering — no coursework list

## Verification

- `bundle exec rake data:validate CHECK=career` passes
- `status: pending_linkedin` removed

## Source

- Resume: `TERENCE SCHUMACHER 4.16 (1).docx`
- LinkedIn profile confirmed current employer Invisible Technologies
