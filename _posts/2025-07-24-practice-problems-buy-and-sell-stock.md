---
layout: page
title: Practice Problems - Best Time to Buy and Sell Stock
date: "2025-07-24 19:44:54"
---

## Best Time to Buy and Sell Stock

### **Problem Statement:**

Given an array `prices` where `prices[i]` is the price of a given stock on day `i`, find the maximum profit you can achieve by making at most one transaction.

**Pseudocode:**

```pseudo
function maxProfit(prices):
    min_price = infinity
    max_profit = 0
    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit:
            max_profit = price - min_price
    return max_profit
```

**Key Details Interviewers Look For:**

- Single pass solution
- Tracking minimum price and maximum profit
- Edge case handling (e.g., empty array)

**Key Identifiers:**

- Array of stock prices
- Maximize profit
- Single transaction (buy and sell once)

----

### Implementations

#### Kotlin

```kotlin
    fun maxProfit(prices: IntArray): Int {
        var minPrice = Int.MAX_VALUE
        var maxProfit = 0
        for (price in prices) {
            val currProfit = price - minPrice
            if (price < minPrice) {
                minPrice = price
            }
            else if (currProfit > maxProfit) {
                maxProfit = currProfit
            }
        }
        return maxProfit
    }

```

#### Python

```python
from typing import List

def maxProfit(prices: List[int]) -> int:
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        curr_price = price - min_price
        if price < min_price:
            min_price = price
        elif curr_price > max_profit:
            max_profit = curr_price
    return max_profit

```