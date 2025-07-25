---
layout: post
title: Practice Problems - Two Sum
date: "2025-07-24 19:42:29"
---

## Practice Problems - Two Sum

### **Problem Statement:**

Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

**Pseudocode:**

```abap
function twoSum(nums, target):
    hashmap = {}
    for i from 0 to length(nums) - 1:
        complement = target - nums[i]
        if complement in hashmap:
            return [hashmap[complement], i]
        hashmap[nums[i]] = i
    return []
```

----

**Key Identifiers:**

- Array of integers
- Target sum
- Return indices of two numbers

**Key Details Interviewers Look For:**

- Understanding of hash maps for O(n) solution
- Handling edge cases (e.g., no solution)
- Time and space complexity analysis

### Implementations

#### **Kotlin**

```kotlin
    fun twoSum(nums: IntArray, target: Int): IntArray {
        val hashMap = MutableMap<Int, Int>()
        for ((i, num) in nums.withIndex()) {
            val complement = target - nums[i]
            if (hashMap.containsKey(compliment)) {
                return arrayOf(hashMap[compliment], i)
            }
            hashMap[nums[i]] = i
        }
        return arrayOf()
    }
```

#### **Go**

```go
    func twoSum(nums []int, target int) []int {
        var hm = make(map[int]int)
        for k, num := range nums {
            complement := target - nums[k]
            
            if val, ok := hm[complement]; ok {
                return []int{val, k}
            }
            hm[num] = k
        }
        return nil
    }
```
