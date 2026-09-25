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
from collections import deque

def oranges_rotting(grid: list[list[int]]) -> int:
    # base
    if not grid:
        return -1

    # m, n
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0

    # add all rotten and count fresh
    for row in range(rows):
        for col in range(cols):
            if grid[row][col] == 2:
                queue.append((row, col, 0))  # (row, col, min)
            elif grid[row][col] == 1:
                fresh_count += 1

    min_elapsed, directions = 0, [(-1, 0), (1, 0), (0, -1), (0, 1)]

    # bfs
    while queue:
        # take top tuple
        row, col, min_elapsed = queue.popleft()

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2  # rotten
                fresh_count -= 1
                queue.append((nr, nc, min_elapsed + 1))
    return min_elapsed if fresh_count == 0 else -1

```


## Validating Credit Card Numbers

```python
import re

# read num test cases
for _ in range(int(input().strip())):
    card_number = input().strip()

    # regex for cc - start with 4, 5, or 6 and 16 digit block
    cc_pattern = r"^[456](?:\d{15}|\d{3}(?:-\d{4}){3})$"


    # check struct
    if re.match(cc_pattern, card_number):
        # remove hypens
        clean_num = card_number.replace("-", "")

        # repeat check
        if re.search(r"(\d)\1{3,}", clean_num):
            print("Invalid")
        else:
            print("Value")
    else:
        print("Invalid")

```


## Top K frequent
- IDEA: count, then bucket by frequency (index = count), scan from high to low. (Alternative: heapq.nlargest(k, counts, key=counts.get), O(n log k).)
- EDGE: k == number of distinct values; all values equal.
- COST: O(n) time, O(n) space.

```python
from collections import Counter

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    counts = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]
    for value, c in counts.items():
        buckets[c].append(value)
    out = []
    for c in range(len(buckets) - 1, 0, -1):
        for value in buckets[c]:
            out.append(value)
            if len(out) == k:
                return out
    return out

```


## Three sum
- IDEA: sort; fix i; two pointers lo/hi on the rest; skip duplicates at all three positions.
- EDGE: fewer than 3 numbers, all zeros, all positive (break early).
- COST: O(n^2) time.

```python
def three_sum(nums: list[int]) -> list[int]:
    nums = sorted(nums)
    out = []
    for i in range(len(nums) - 2):
        if nums[i] > 0:
            break
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        low, high = i + 1, len(nums) - 1
        while low < high:
            s = nums[i] + nums[low] + nums[high]
            if s < 0:
                low += 1
            elif s > 0:
                high -= 1
            else:
                out.append([nums[i], nums[low], nums[high]])
                low += 1
                high -= 1
                while low < high and nums[low] == nums[low - 1]:
                    low += 1
                while low < high and nums[high] == nums[high + 1]:
                    high -= 1
    return out

```

## The longest valid bracket
Given a string consisting only of `(` And `)`, find the length of the longest valid parentheses substring.

Using stack record index, encounter ( Push into the stack and encounter ) To pop the stack, subtract the top index from the current index to get the current effective length.

```python
def longest_valid_parentheses(s: str) -> int:
    stack = [-1]
    answer = 0
    for i, ch in enumerate(s):
        if ch == '(':
            stack.append(i)
        else:
            stack.pop()
        
        if not stack:
            stack.append(i)
        else:
            answer = max(answer, i - stack[-1])
    
    return answer

```


## Combined delivery time intervals
Given a list of delivery time intervals `(start, end)`, merge all overlapping intervals.

```python
def merge_intervals(intervals: list[list[int]]) -> list[int]:
    # sort by start
    intervals.sort(key=lambda x: x[0])
    merged = []
    for interval in intervals:
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            merged[-1][1] = max(merged[-1][1], interval[1])
    return merged

```

## Beverage Bundle pricing
Given a set of order records, the format is `["date", "item"]`. Rules: Buy popcorn and soda at the same time on the same day, try to pair them up for a bundle price of $9; buy soda alone for $2.5, and buy popcorn alone for $8. Calculate total price.

```python
from collections import defaultdict

def calculate_total(orders):
    daily = defaultdict(lambda: defaultdict(int))
    for date, item in orders:
        daily[date][item] += 1
    total = 0.0
    for date, items in daily.items():
        popcorn_count = items.get("popcorn", 0)
        soda_count = items.get("soda", 0)
        bundles = min(popcorn_count, soda_count)
        total += bundles * 9 
        total += (popcorn_count - bundles) * 8
        total += (soda_count - bundles) * 2.5

    return total
```

## Sort object array by two attributes


## Average order revenue by region
Given two tables, find the average order revenue for each region in 2024, returning only regions that are above the overall average.

```sql
WITH region_avg AS (SELECT c.region, AVG(o.revenue) AS avg_rev 
FROM orders o JOIN customers c ON o.customer_id = c.customer_id 
    WHERE EXTRACT(YEAR FROM o.order_date) = 2024 GROUP BY c.region)
SELECT region, avg_rev FROM region_avg 
    WHERE avg_rev > (SELECT AVG(avg_rev) FROM region_avg);
```

## Average monthly ratings of each product

Given `Reviews(review_id, user_id, submit_date, product_id, stars)` Table, calculating the average monthly rating for each product.


```sql
SELECT product_id, 
    EXTRACT(MONTH FROM submit_date) AS month,
    AVG(stars) AS avg_stars 
 FROM reviews GROUP BY product_id, 
     EXTRACT(MONTH FROM submit_date)
 ORDER BY month, product_id

```