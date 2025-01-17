---
title: "Kotlin Cheatsheet"
date: 2024-11-08 11:58:21 -0800
layout: "page"
---


# Basic Syntax
## Variable Declaration
```kotlin
val readOnly = 42        // Immutable variable
var mutable = 42         // Mutable variable
```

## Data Types
```kotlin
val number: Int = 42
val decimal: Double = 3.14
val text: String = "Hello, Kotlin!"
val character: Char = 'K'
val flag: Boolean = true
```
---
# Control Flow
## `If` Expression
```kotlin
val max = if (a > b) a else b
```

## `When` Expression (Switch)
```kotlin
when (value) {
  0 -> println("Zero")
  1, 2 -> println("One or Two")
  in 3..10 -> println("Between 3 and 10")
  else -> println("Out of range")
}
```

## `For` Loop
```kotlin
for (i in 1..5) { /* ... */ }
for (item in collection) { /* ... */ }
```

## `While` Loop
```kotlin
while (condition) { /* ... */ }
do { /* ... */ } while (condition)
```
---
# Functions
## Function Declaration
```kotlin
fun add(a: Int, b: Int): Int {
    return a + b
}

// Single-expression function
fun multiply(a: Int, b: Int) = a * b
```

## Default Arguments
```kotlin
fun greet(name: String = "Guest") {
    println("Hello, $name!")
}
```

## Named Arguments
```kotlin
greet(name = "Alice")
```

## Higher-Order Functions
```kotlin
fun operate(a: Int, b: Int, operation: (Int, Int) -> Int): Int {
    return operation(a, b)
}

val sum = operate(3, 4) { x, y -> x + y }

```
---
# Lambdas and Anonymous Functions

## Lambda Expression
```kotlin
val square = { x: Int -> x * x }
val result = square(5) // 25
```

## The` it` Keyword
```kotlin
val numbers = listOf(1, 2, 3)
val doubled = numbers.map { it * 2 }
```
---
# Collections
## Creating Collections
```kotlin
val list = listOf(1, 2, 3)                // Immutable List
val mutableList = mutableListOf(1, 2, 3)  // Mutable List

val set = setOf(1, 2, 3)                  // Immutable Set
val mutableSet = mutableSetOf(1, 2, 3)    // Mutable Set

val map = mapOf("a" to 1, "b" to 2)       // Immutable Map
val mutableMap = mutableMapOf("a" to 1, "b" to 2) // Mutable Map
```

## Common Collection Operations
## `map`
```kotlin
val squares = numbers.map { it * it }
```

## `filter`
```kotlin
val evenNumbers = numbers.filter { it % 2 == 0 }
```

## `reduce`
```kotlin
val sum = numbers.reduce { acc, num -> acc + num }
```

## `fold`
```kotlin
val product = numbers.fold(1) { acc, num -> acc * num }
```

## `any` / `all` /` none`
```kotlin
val hasNegative = numbers.any { it < 0 }
val allPositive = numbers.all { it > 0 }
val noneZero = numbers.none { it == 0 }
```

## `find` / `firstOrNull`
```kotlin
val firstEven = numbers.find { it % 2 == 0 }
```

## `groupBy`
```kotlin
val grouped = words.groupBy { it.first() }
```

## `partition`
```kotlin
val (even, odd) = numbers.partition { it % 2 == 0 }

```
## `flatMap`
```kotlin
val flatList = listOfLists.flatMap { it }
```

## `sorted` / `sortedBy` / `sortedDescending`
```kotlin
val sortedNumbers = numbers.sorted()
val sortedByLength = words.sortedBy { it.length }
```
---
# String Operations
## String Templates
```kotlin
val name = "Kotlin"
println("Hello, $name!")
```

## `Substring`
```kotlin
val substring = text.substring(0, 5)
```

## `Split`
```kotlin
val parts = csv.split(",")
```

## `Join`
```kotlin
val joined = list.joinToString(separator = ",")
```

## Regular Expressions
```kotlin
val regex = "\\d+".toRegex()
val numbers = regex.findAll(text).map { it.value.toInt() }.toList()
```
---
# Null Safety
## Nullable Types
```kotlin
var nullableString: String? = null
```

## Safe Call Operator `?.`
```kotlin
val length = nullableString?.length
```

## Elvis Operator `?:`
```kotlin
val length = nullableString?.length ?: 0
```

## Not-null Assertion `!!`
```kotlin
val length = nullableString!!.length // Throws if null
```
---
# Ranges and Progressions
## Ranges
```kotlin
val range = 1..10          // Inclusive range
val exclusiveRange = 1 until 10  // Excludes 10
```

## `DownTo` and `Step`
```kotlin
for (i in 10 downTo 1 step 2) { /* ... */ }
```
---
# Extension Functions
## Defining an Extension Function
```kotlin
fun String.isPalindrome(): Boolean {
    return this == this.reversed()
}

val isPalin = "madam".isPalindrome()
```
---
# Scope Functions
## `let`
```kotlin
val length = nullableString?.let { it.length }
```

## `apply`
```kotlin
val person = Person().apply {
    name = "John"
    age = 30
}
```

## `also`
```kotlin
val numbers = mutableListOf(1, 2, 3).also {
    it.add(4)
}
```

## `run`
```kotlin
val result = nullableString?.run {
    length
}
```

## `with`
```kotlin
val fullName = with(person) {
    "$firstName $lastName"
}
```
---
# Sequences
## Creating Sequences
```kotlin
val sequence = sequenceOf(1, 2, 3)
val generatedSequence = generateSequence(1) { it + 1 }
```

## Sequence Operations
```kotlin
val firstTen = generatedSequence.take(10).toList()

```
---
# Miscellaneous
## Destructuring Declarations
```kotlin
val (name, age) = person
```

## Infix Functions
```kotlin
infix fun Int.add(other: Int): Int = this + other
val sum = 2 add 3
```

## Tail Recursive Functions
```kotlin
tailrec fun factorial(n: Int, acc: Int = 1): Int {
    return if (n <= 1) acc else factorial(n - 1, acc * n)
}
```

## Operator Overloading
```kotlin
data class Point(val x: Int, val y: Int) {
    operator fun plus(other: Point) = Point(x + other.x, y + other.y)
}
```

# Common Algorithms
## Sorting
```kotlin
val sortedList = unsortedList.sorted()
val sortedByProperty = list.sortedBy { it.property }

```
## Binary Search
```kotlin
val index = sortedList.binarySearch(target)
```

## Finding Max/Min
```kotlin
val max = numbers.maxOrNull()
val min = numbers.minOrNull()
```

## Distinct Elements
```kotlin
val uniqueItems = list.distinct()

```
---
# Exception Handling

## Try-Catch-Finally
```kotlin
try {
    // Risky operation
} catch (e: Exception) {
    // Handle exception
} finally {
    // Cleanup code
}
```
---
# Tips for Coding Interviews in Kotlin:
* `Immutability`: Prefer val over var to promote immutability.
* `Null Safety`: Leverage Kotlin’s null safety features to avoid NullPointerException.
* `Standard Library`: Familiarize yourself with collection operations (map, filter, reduce).
* `Idiomatic Kotlin`: Use extension functions, lambdas, and higher-order functions to write concise code.
* `Readability`: Write clear and readable code; use meaningful names and avoid overly complex expressions.
* `Edge Cases`: Always consider and handle edge cases, such as empty inputs or large datasets.
* `Practice Problems`: Solve algorithm and data structure problems in Kotlin to get comfortable with its features.
