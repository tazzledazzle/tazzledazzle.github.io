---
title: "Documenting evaluating kotlinx-datetime"
layout: "post"
---



# kotlinx-datetime evaluation


## Common Usages

### Getting the current date and time

```kotlin
    val clock = Clock.System
    val now: LocalDateTime = clock.now()

```


### Convert to LocalDateTime and time components

```kotlin
    val currentMoment: Instant = Clock.System.now()
    val datetimeInUtc: LocalDateTime = currentMoment.toLocalDateTime(TimeZone.UTC)
    val datetimeInSystemZone: LocalDateTime = currentMoment.toLocalDateTime(TimeZone.currentSystemDefault())
```


### LocalDateTime instance

```kotlin
    val localDateTime = LocalDateTime(2025, 1, 16, 12, 0, 0, 0)
```

# Kotlin DateTime and Numbers Cheatsheet

## DateTime Operations

### Importing Required Libraries
```kotlin
//import java.time.*
//import java.time.format.DateTimeFormatter
//import kotlin.time.*
```

### Creating Dates
```kotlin
// Current date and time
val now = LocalDateTime.now()
val today = LocalDate.now()
val currentTime = LocalTime.now()
val range = today.rangeTo(today.plusDays(7))
range.forEach { println(it)
    LocalDate.of(it.year, it.month, it.dayOfMonth)
}


// Specific date
val specificDate = LocalDate.of(2024, 1, 17)
val specificDateTime = LocalDateTime.of(2024, 1, 17, 14, 30)

// Parsing strings
val parsedDate = LocalDate.parse("2024-01-17")
val customFormat = DateTimeFormatter.ofPattern("dd/MM/yyyy")
val customParsedDate = LocalDate.parse("17/01/2024", customFormat)
```

### Date Manipulation
```kotlin
// Adding/subtracting time
val tomorrow = today.plusDays(1)
val lastWeek = today.minusWeeks(1)
val nextMonth = today.plusMonths(1)

// Getting components
val year = today.year
val month = today.monthValue
val dayOfMonth = today.dayOfMonth
val dayOfWeek = today.dayOfWeek

// Date ranges and iterations
val dateRange = today.rangeTo(today.plusDays(7))
for (date in dateRange) {
    println(date)
}

// Using sequences for date operations
dateRange.asSequence()
    .filter { it.dayOfWeek != DayOfWeek.SATURDAY }
    .forEach { println(it) }
```

## Number Operations

### Floating Point Types
```kotlin
// Declarations
val d: Double = 3.14 // 64-bit
val f: Float = 3.14f // 32-bit
val bd = java.math.BigDecimal("3.14") // Arbitrary precision

// Basic arithmetic
val sum = 1.5 + 2.7
val difference = 5.0 - 2.3
val product = 2.5 * 3.0
val quotient = 10.0 / 3.0
val remainder = 10.0 % 3.0

// Math functions
val rounded = 3.14159.roundToInt()
val ceiling = ceil(3.14)
val floor = floor(3.14)
val absolute = abs(-3.14)
val power = 2.0.pow(3.0)
val squareRoot = sqrt(16.0)
```

### Number Collections and Conversions

```kotlin
// Arrays
val doubleArray = doubleArrayOf(1.0, 2.0, 3.0)
val floatArray = floatArrayOf(1.0f, 2.0f, 3.0f)

// Lists
val numberList = mutableListOf<Double>()
numberList.add(3.14)
val immutableList = listOf(1.1, 2.2, 3.3)

// Maps
val numberMap = mutableMapOf<String, Double>()
numberMap["pi"] = 3.14
numberMap["e"] = 2.718

// Type conversion
val intToDouble = 42.toDouble()
val doubleToInt = 3.14.toInt()
val stringToDouble = "3.14".toDouble()
val doubleToString = 3.14.toString()

// Nullable numbers
val nullableDouble: Double? = null
val safeValue = nullableDouble ?: 0.0
```

### Functional Operations with Numbers

```kotlin
// List operations
val numbers = listOf(1.1, 2.2, 3.3, 4.4, 5.5)

val doubled = numbers.map { it * 2 }
val filtered = numbers.filter { it > 3.0 }
val sum = numbers.sum()
val average = numbers.average()

// Reduce and fold operations
val product = numbers.reduce { acc, value -> acc * value }
val customSum = numbers.fold(0.0) { acc, value -> acc + value }

// Sequence operations for better performance with large datasets
val sequence = generateSequence(1.0) { it + 1.0 }
    .take(5)
    .map { it * 2 }
    .filter { it > 5 }
    .toList()
```

### Formatting and Output

```kotlin
// Print formatting
println("%.2f".format(3.14159)) // Prints: 3.14
println("Value: ${"%.3f".format(3.14159)}") // Prints: Value: 3.142

// String templates with expressions
val value = 3.14159
println("Rounded to 2 decimals: ${String.format("%.2f", value)}")

// Using DecimalFormat for custom formatting
val formatter = java.text.DecimalFormat("#,##0.00")
println(formatter.format(1234.5678)) // Prints: 1,234.57
```

### Common Pitfalls and Best Practices

1. Float/Double Comparison
```kotlin
// Don't use direct equality
// Bad:
val a = 0.1 + 0.2
val b = 0.3
println(a == b) // Might be false!

// Good:
const val EPSILON = 1E-10
println(abs(a - b) < EPSILON)
```

2. BigDecimal for Financial Calculations
```kotlin
// Use BigDecimal for precise calculations
val amount = BigDecimal("100.50")
val taxRate = BigDecimal("0.21")
val tax = amount.multiply(taxRate)
val total = amount.add(tax)
```

3. Null Safety with Numbers
```kotlin
// Safe calls with nullable numbers
val nullableValue: Double? = null
val result = nullableValue?.times(2)
val defaultValue = nullableValue ?: 0.0
```