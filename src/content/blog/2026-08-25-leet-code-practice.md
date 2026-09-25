---
title: "Leet Code Practice"
pubDate: "8/25/26"
tags: [tech-interviews, code]
tier: "standard"
permalink: "/2026/08/25/leet-code-practice/"
hide_frontmatter: false
---

# Why?


# Problems

## Longest Repeating Character Replacement

Given a string `s` and an integer `k`, return the length of the longest substring containing the same letter you can get
after performing a change to any character of the string at most `k` times. 

```python
from collections import Counter

def character_replacement(s: str, k: int) -> int:
    count = Counter()
    left, max_freq, best = 0, 0, 0

    for right, c in enumerate(s):
        count[c] += 1
        max_freq = max(max_freq, count[c])

        while (right - left + 1) - max_freq > k:
            count[s[left]] -= 1
            left += 1

        best = max(best, right - left + 1)

    return best

```