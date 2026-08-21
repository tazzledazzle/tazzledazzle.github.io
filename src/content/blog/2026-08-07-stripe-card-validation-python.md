---
title: "Stripe Card Validation: A Four-Part HackerRank Take-Home in Python"
pubDate: "8/7/26"
tags: [python, algorithms, luhn, stripe, interview, hackerrank]
tier: "featured"
permalink: "/2026/08/07/stripe-card-validation-python/"
hide_frontmatter: false
---

# Stripe Card Validation: A Four-Part HackerRank Take-Home in Python

Stripe's take-home assessment builds a card validation system across four escalating parts. Part 1 checks a Luhn checksum on Visa cards. Part 2 adds network routing across Visa, Mastercard, and Amex. Part 3 introduces wildcards — redacted digits requiring combinatorial search. Part 4 introduces corrupted cards where exactly one mutation occurred: a digit changed, or two adjacent digits swapped. Each part adds a new search dimension on top of the same Luhn foundation.

---

## The Foundation: Luhn Validation and Network Detection

The Luhn algorithm runs in every part. Starting from the rightmost digit, double every second digit. If the doubled value exceeds 9, subtract 9. Sum all digits. A card is valid when the sum is divisible by 10.

```python
def luhn_valid(card: str) -> bool:
    total = 0
    for i, ch in enumerate(reversed(card)):
        n = int(ch)
        if i % 2 == 1:
            n *= 2
            if n > 9:
                n -= 9
        total += n
    return total % 10 == 0
```

Network detection maps prefix and length onto a network name:

```python
def detect_network(card: str) -> str | None:
    n = len(card)
    if n == 16 and card[0] == "4":
        return "VISA"
    if n == 16 and card[:2] in {"51", "52", "53", "54", "55"}:
        return "MASTERCARD"
    if n == 15 and card[:2] in {"34", "37"}:
        return "AMEX"
    return None
```

These two functions compose into the Part 2 validator:

```python
def validate(card: str) -> str:
    network = detect_network(card)
    if network is None:
        return "UNKNOWN_NETWORK"
    return network if luhn_valid(card) else "INVALID_CHECKSUM"
```

`UNKNOWN_NETWORK` takes priority over `INVALID_CHECKSUM` because a card matching no known length or prefix is structurally unrecognizable — checksum validation on it is meaningless.

---

## Part 3: Redacted Cards

A redacted card contains one to five `*` characters, each standing for a single unknown digit. The task requires a count of valid cards per network, sorted alphabetically.

The search space is at most 10^5 = 100,000 candidates. A linear Luhn check makes the worst case 1.6 million operations — fast enough for brute force.

```python
from itertools import product
from collections import defaultdict

def solve_redacted(card: str) -> dict[str, int]:
    star_positions = [i for i, ch in enumerate(card) if ch == "*"]
    counts: dict[str, int] = defaultdict(int)

    for digits in product("0123456789", repeat=len(star_positions)):
        candidate = list(card)
        for pos, digit in zip(star_positions, digits):
            candidate[pos] = digit
        s = "".join(candidate)
        network = detect_network(s)
        if network and luhn_valid(s):
            counts[network] += 1

    return dict(counts)
```

`itertools.product` generates the Cartesian product of digit choices across all wildcard positions. Each combination fills the wildcard slots into a copy of the card string; the candidate then runs through the standard network and Luhn checks.

The output sorts by network name:

```python
for network in sorted(counts):
    print(f"{network},{counts[network]}")
```

One edge case: a wildcard in position 0 can produce candidates with different network prefixes. The same redacted card may yield both `VISA` and `MASTERCARD` results when the first digit ranges across valid prefixes. The `defaultdict` handles this naturally.

---

## Part 4: Corrupted Cards

A corrupted card ends with `?`, indicating exactly one of two mutations: a single digit changed anywhere in the number, or two adjacent digits swapped. The task requires all valid original cards in ascending order, formatted as `card,NETWORK`.

The search space is small: 16 positions × 10 digit choices = 160 candidates for single-digit changes, plus 15 adjacent pairs for swaps. After deduplication, at most 175 candidates require checking.

```python
def solve_corrupted(card: str) -> list[str]:
    base = card.rstrip("?")
    candidates: set[str] = set()

    # Mutation 1: replace each digit with 0–9
    for i in range(len(base)):
        for d in "0123456789":
            candidate = base[:i] + d + base[i+1:]
            candidates.add(candidate)

    # Mutation 2: swap each pair of adjacent digits
    for i in range(len(base) - 1):
        swapped = list(base)
        swapped[i], swapped[i+1] = swapped[i+1], swapped[i]
        candidates.add("".join(swapped))

    results = []
    for candidate in candidates:
        network = detect_network(candidate)
        if network and luhn_valid(candidate):
            results.append(f"{candidate},{network}")

    results.sort(key=lambda s: int(s.split(",")[0]))
    return results
```

Two subtleties matter here. First, the single-digit replacement loop already includes the original card — replacing digit `i` with digit `i` produces the base string. This is correct: the original card is a valid candidate when the corruption left that digit unchanged. Second, sorting by numeric value rather than lexicographic string order is essential when cards share a prefix. `"4342..."` sorts before `"4344..."` by both criteria, but a card beginning with `"5..."` would sort incorrectly before `"49..."` under lexicographic order.

---

## What Makes the Luhn Algorithm Tractable for Search

The Luhn algorithm is linear, and each digit contributes independently to the total after the doubling step. For Part 3, this means no approach significantly outperforms brute force — the wildcard digits interact only through the final sum, not through multiplicative structure that would allow early pruning.

For Part 4, the same linearity lets you compute the Luhn delta of a single-digit change analytically rather than rerunning the full algorithm. For a digit at position `i` counting from the right, changing from `d_old` to `d_new` shifts the sum by `weight(i, d_new) - weight(i, d_old)`, where `weight` applies the doubling rule. A candidate is valid when the original sum plus the delta equals 0 mod 10. At 160 candidates, the optimization is unnecessary for correctness — but the insight carries into larger search problems where the Luhn check runs inside a tight loop.

---

## The Entry Point

```python
def validate_card(part: str, card: str) -> str | list[str]:
    if part in ("1", "2"):
        return validate(card)
    if part == "3":
        counts = solve_redacted(card)
        if not counts:
            return ""
        return "\n".join(f"{n},{c}" for n, c in sorted(counts.items()))
    if part == "4":
        results = solve_corrupted(card)
        return "\n".join(results)
    raise ValueError(f"Unknown part: {part!r}")
```

The four parts share `luhn_valid` and `detect_network` and diverge only at search strategy: direct validation for Parts 1–2, Cartesian product enumeration for Part 3, and mutation enumeration for Part 4. Each part tests the same core logic under a wider input set.
