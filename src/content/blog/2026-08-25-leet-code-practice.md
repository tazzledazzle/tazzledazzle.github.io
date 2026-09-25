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

## Self-Generating Sequence

### Magical Strings

```python
def magical_string(n: int) -> int:
    if n == 0:
        return 0
    if n <= 3:
        return 1

    s = [1, 2, 2]
    i = 2

    while len(s) < n:
        next_val = 3 - s[-1]
        run_length = s[i]
        s.extend([next_val] * run_length)
        i += 1

    return s[:n].count(1)
```


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

Given a string `s`, you can convert `s` to a palindrome by adding characters in front of it.
Return the shortest palindrome you can find by performing this transformation.

```python
def shortest_palindrome(s: str) -> str:
    # base check
    if not s:
        return s

    combined = s + "#" + s[::-1]
    n = len(combined)
    fail = [0] * n

    for i in range(1, n):
        j = fail[i - 1]
        while j > 0 and combined[i] != combined[j]:
            j = fail[j - 1]
        if combined[i] == combined[j]:
            j += 1
        fail[i] = j

    longest_pal_prefix = fail[-1]
    return s[longest_pal_prefix:][::-1] + s    
```

### Longest Happy Prefix

A string is called a `happy prefix` if it is a `non-empty` prefix which is also a suffix (excluding itself).

Given a string `s`, return the `longest happy prefix` of `s`. Return empty string `""` if no prefix exists


```python
def longest_prefix(s: str) -> str:
    n = len(s)
    fail = [0] * n
    
    # apply KMP
    for i in range(1, n):
        j = fail[i - 1]
        while j > 0 and s[i] != s[j]:
            j = fail[j - 1]
        if s[i] == s[j]:
            j += 1
        fail[i] = j

    return s[:fail[-1]]

```


### Sum of Scores of Built Strings

Building a string `s` of `n` length, one character at a time, prepending eacvh new character to the front of the string. 
The strings are labeled from `1` to `n`, where the string length `i` is labeled `s_i`.

Given the final string `s`, return the sum of the score of every `s_i`.

```python
def sum_scores(s: str) -> int:
    n = len(s)
    z = [0] * n
    z[0] = n
    left, right = 0, 0

    # Z-function
    for i in range(1, n):
        if i < right:
            z[i] = min(right - i, z[i - left])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] > right:
            left, right = i, i + z[i]

    return sum(z)
```

## Recursion

### Merge Two Sorted Lists

```python
# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def merge_two_lists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
    if not list1: return list2
    if not list2: return list1


    if list1.val < list2.val:
        list1.next = self.mergeTwoLists(list1.next, list2)
        return list1
    else:
        list2.next = self.mergeTwoLists(list1, list2.next)
        return list2
        

```