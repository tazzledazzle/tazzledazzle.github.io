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

## Sliding Window

### Contains Duplicates II

```python

def contains_nearby_duplicate(nums: list[int], k: int) -> bool:
    last_seen: dict[int, int] = {}
    for i, num in enumerate(nums):
        if num in last_seen and i - last_seen[num] <= k:
            return True
        last_seen[num] = i
    return False

```


### Number of Substrings containing all three characters

```python
def number_of_substrings(s: str) -> int:
    count = {'a': 0, 'b': 0, 'c': 0}
    left = 0
    total = 0

    for right, c in enumerate(s):
        count[c] += 1
        while count['a'] > 0 and count['b'] > 0 and count['c'] > 0:
            count[s[left]] -= 1
            left += 1
        total += left

    return total

```

### Longest Repeating Character Replacement

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

## Rolling Hash

### Shortest Palindrome