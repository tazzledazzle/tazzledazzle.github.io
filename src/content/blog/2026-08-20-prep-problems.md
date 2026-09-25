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
import collections

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def vertical_traversal(root: Optional[TreeNode]) -> list[list[int]]
    # check empty root
    if not root:
        return []
    
    # dict to store cols as keys and list of (row, node_val) as value
    column_table = collections.defaultdict(list)
    # queue for BFS storing (node, row, col)
    queue = collections.deque([(root, 0, 0)])

    # bfs
    while queue:
        # popleft from queue
        node, row, col = queue.popleft()
        if node:
            # append to col in dict
            column_table[col].append((row, node.val))
            # left
            if node.left:
                queue.append((node.left, row + 1, col - 1))
            # right
            if node.right:
                queue.append((node.right, row + 1, col + 1))
    
    # return result
    result = []
    # sort left to right
    for col in sorted(column_table.keys()):
        # sort by row first, then by val if rows identical
        sorted_nodes = sorted(column_table[col], key=lambda x: (x[0], x[1]))
        # add values to result
        result.append([val for row, val in sorted_nodes])

    return result

```


## Maximum Value at a Given Index in a Bounded Array

```python
def max_value(n: int, index: int, max_sum: int) -> int:
    # helper func
    def get_sum(val: int, length: int) -> int:
        if val >= length:
            return (val + val - length + 1) * length // 2
        else:
            return (val + 1) * val // 2 + (length - val)

    # two pointers
    left, right = 1, max_sum
    result = 1

    # traverse from both ends
    while left <= right:
        mid = (left + right) // 2

        # calc sum if nums[idx] set to mid
        left_len, right_len = index + 1, n - index

        total = get_sum(mid, left_len) + get_sum(mid, right_len) - mid

        if total <= max_sum:
            result = mid
            left = mid + 1  # inc
        else:
            right = mid - 1  # dec

    return result

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
