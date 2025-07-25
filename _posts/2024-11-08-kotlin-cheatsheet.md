---
title: "Kotlin Cheatsheet"
date: 2024-11-08 11:58:21 -0800
layout: page
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

### Lambda Syntax
```kotlin
// Basic lambda syntax
val sum = { x: Int, y: Int -> x + y }
val sayHello = { name: String -> println("Hello $name") }

// Lambda with receiver
val isEven: Int.() -> Boolean = { this % 2 == 0 }

// Lambda with implicit parameter 'it'
val square: (Int) -> Int = { it * it }

// Multi-line lambda
val processNumber = { x: Int ->
    val doubled = x * 2
    doubled + 1
}
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

## Collection Operations

### Transform Operations
```kotlin
// Map transformations
val numbers = listOf(1, 2, 3, 4)
val doubled = numbers.map { it * 2 }
val indexed = numbers.mapIndexed { index, value -> "[$index]: $value" }
val notNull = numbers.mapNotNull { if (it > 2) it else null }

// Flatten operations
val nested = listOf(listOf(1, 2), listOf(3, 4))
val flat = nested.flatten()
val flatMapped = numbers.flatMap { listOf(it, it * 2) }
```

### Filter Operations
```kotlin
// Basic filtering
val filtered = numbers.filter { it > 2 }
val negativeFiltered = numbers.filterNot { it > 2 }
val indexedFilter = numbers.filterIndexed { index, value -> index % 2 == 0 }

// Partitioning
val (evens, odds) = numbers.partition { it % 2 == 0 }
```

### Grouping Operations
```kotlin
// Basic grouping
val grouped = numbers.groupBy { it % 2 }
val groupedWithTransform = numbers.groupBy(
    keySelector = { it % 2 },
    valueTransform = { "Value: $it" }
)
```

### Aggregation Operations
```kotlin
// Reduction operations
val sum = numbers.reduce { acc, next -> acc + next }
val sumRight = numbers.reduceRight { next, acc -> next + acc }
val sumOrNull = emptyList<Int>().reduceOrNull { acc, next -> acc + next }

// Fold operations
val customSum = numbers.fold(0) { acc, next -> acc + next }
val customSumRight = numbers.foldRight(0) { next, acc -> next + acc }

// Aggregate operations
val count = numbers.count { it % 2 == 0 }
val maxBy = numbers.maxByOrNull { -it }
val sumBy = numbers.sumOf { it * 2 }
```

## Sequence Operations

### Creating Sequences
```kotlin
// Different ways to create sequences
val simpleSequence = sequenceOf(1, 2, 3, 4, 5)
val fromCollection = listOf(1, 2, 3).asSequence()
val generated = generateSequence(1) { it + 1 }
val fibonacci = generateSequence(Pair(0, 1)) { Pair(it.second, it.first + it.second) }
    .map { it.first }
```

### Sequence Operations
```kotlin
// Efficient chain of operations
val result = numbers.asSequence()
    .map { it * 2 }
    .filter { it > 5 }
    .take(2)
    .toList()

// Windowed operations
val windowed = numbers.asSequence()
    .windowed(size = 2, step = 1)
    .toList()

// Chunked operations
val chunked = numbers.asSequence()
    .chunked(2) { it.sum() }
    .toList()
```
```kotlin

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

```kotlin
// let - useful for nullable objects
nullable?.let { value ->
    // use value
}

// with - object configuration
with(object) {
    property = value
    method()
}

// run - object configuration and computation
object.run {
    property = value
    method()
    computeSomething()
}

// apply - object configuration returning the object
object.apply {
    property = value
    method()
}

// also - additional effects
object.also { obj ->
    // do something with obj
    logger.info("Object processed: $obj")
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

### Higher-Order Functions
```kotlin
// Function that takes a function as parameter
fun operateOnNumber(x: Int, operation: (Int) -> Int): Int {
    return operation(x)
}

// Function that returns a function
fun createMultiplier(factor: Int): (Int) -> Int {
    return { number -> number * factor }
}
```

## Type-Safe Builders (DSL)
```kotlin
// Example of type-safe builder pattern
class HTML {
    fun head(init: Head.() -> Unit) = Head().apply(init)
    fun body(init: Body.() -> Unit) = Body().apply(init)
}

class Head {
    fun title(init: () -> String) = Title(init())
}

class Body {
    fun div(init: Div.() -> Unit) = Div().apply(init)
}

// Usage
html {
    head {
        title { "Title" }
    }
    body {
        div {
            +"Content"
        }
    }
}
```
---
## Best Practices & Tips

1. Use sequences for large collections when you need multiple operations
2. Prefer immutable collections (`listOf`, `setOf`, `mapOf`) over mutable ones
3. Use scope functions appropriately based on context:
    - `let` for nullable objects
    - `with` for operating on non-null objects
    - `run` for object configuration and computing return value
    - `apply` for object configuration
    - `also` for side effects
4. Use extension functions to enhance existing classes
5. Leverage infix functions for more readable DSLs
6. Use typealias for complex function types


# Tips for Coding Interviews in Kotlin:
* `Immutability`: Prefer val over var to promote immutability.
* `Null Safety`: Leverage Kotlin’s null safety features to avoid NullPointerException.
* `Standard Library`: Familiarize yourself with collection operations (map, filter, reduce).
* `Idiomatic Kotlin`: Use extension functions, lambdas, and higher-order functions to write concise code.
* `Readability`: Write clear and readable code; use meaningful names and avoid overly complex expressions.
* `Edge Cases`: Always consider and handle edge cases, such as empty inputs or large datasets.
* `Practice Problems`: Solve algorithm and data structure problems in Kotlin to get comfortable with its features.
