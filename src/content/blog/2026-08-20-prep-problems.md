---
title: "Prep Problems"
pubDate: "8/20/26"
tags: [tech-interviews, code]
tier: "standard"
permalink: "/2026/08/20/prep-problems/"
hide_frontmatter: false
---


# Prep Problems

Some leet problems that I've solved to prep for August's interviews. All of these have a Python solution but there's not much preventing me from
solving it in any language I've worked in (kotlin, java, c/c++, go, ruby, etc.)

## Decode Strings

```python
def decode_strings(s: str) -> str:
    stack = []
    curr_str, curr_num = "", 0

    # iterate through string
    for char in s:
        if char.isdigit():
            curr_num = curr_num * 10 + int(char)
        elif char == "[":
            # push prev state pre bracket
            stack.append((curr_str, curr_num))
            curr_str = ""
            curr_num = 0
        elif char == "]":
            # push chars onto stack
            prev_str, num = stack.pop()
            curr_str = prev_str + (curr_str * num )
        else:
            # regular chars
            curr_str += char

    return curr_str

```

## Vertical Order Traversal of a Binary Tree

```python


```


## Maximum Value at a Given Index in a Bounded Array

```python


```


## Rotting Oranges

```python


```


## Apples and Oranges

```python


```


## Number Line Jumps

```python


```


## Between Two Sets


```python


```
