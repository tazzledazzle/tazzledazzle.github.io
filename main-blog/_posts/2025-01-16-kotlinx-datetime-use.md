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

