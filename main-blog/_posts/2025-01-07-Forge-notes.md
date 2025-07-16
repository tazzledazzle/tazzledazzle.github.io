---
title: "Forge notes"
layout: page
---



# Forge

```
LegacyPlayer: {
    createPlayer()
    updateAttribues()
    setTeam()
    trackProgress()
    exportToPros()
}

GrowthPath: {
    updatePath()
    calculateGrowth()
    getProjectedStats()
}

DynastyMode: {
    integratePlayer()
    progressSeason()
    generateEvents()
}

Position: {
    getRequiredAttributes()
    validateAttributes()
}

Team: {
    addPlayer()
    removePlayer()
    updateRoster()
}

Achievement: {
    unlock()
    notifyPlayer()
}

PlayerGoal: {
    updateProgress()
    complete()
    checkDeadline()
}
```


This class diagram represents the key components of the Legacy Player Builder system. The main relationships and responsibilities:

### LegacyPlayer (Core Class):
* Contains player's basic info, attributes, and relationships
* Manages growth, achievements, and goals
* Handles pro export functionality


### GrowthPath:
* Defines how player attributes develop over time
* Manages growth rates for different attributes
* Projects future stats based on current trajectory

### Team:
* Represents both college and pro teams
* Manages roster and player assignments
* Handles team-specific operations

### Achievement & PlayerGoal:
* Track player accomplishments and objectives
* Provide notification system for milestones
* Support different types of achievements/goals

### DynastyMode:
* Integrates legacy players into the existing game mode
* Manages season progression
* Coordinates teams and events

### Position:
* Defines position-specific attributes and requirements
* Validates player attributes against position requirements

## Relationships:
* A LegacyPlayer belongs to one Team
* Each LegacyPlayer has one GrowthPath
* Players can have multiple Achievements and Goals
* DynastyMode manages multiple Teams and LegacyPlayers
