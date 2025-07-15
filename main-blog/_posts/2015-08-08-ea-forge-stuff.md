---
title: "The Forge"
layout: "post"
---

header file with a class definition for each object
Ask yourself these questions:
* How do I interact with this object?
* What variables are used for data storage? access modifiers?
* Getter and setter methods?

```cpp
#ifndef LEGACYPLAYER_H
#define LEGACYPLAYER_H

class LegacyPlayer {
    public:
        LegacyPlayer();
        ~LegacyPlayer();
        
        void createPlayer();
        void updateAttributes(Attribute attribute);
        void setTeam(Team team);
        void trackProgress();
        void exportToPros();

};

#endif

```

```cpp
#ifndef DYNASTYMODE_H
#define DYNASTYMODE_H

class DynastyMode {
    public:
        DynastyMode();
        ~DynastyMode();
        
        void integratePlayer(LegacyPlayer player);
        void progressSeason();
        void generateEvents();

};

#endif

```

```cpp
#ifndef TEAM_H
#define TEAM_H
class Team {
    public:
        Team();
        ~Team();
        
        void addPlayer(LegacyPlayer player);
        void removePlayer(LegacyPlayer player);
        void updateRoster();

};

#endif
    
```

```cpp
#ifndef ACHIEVEMENT_H
#define ACHIEVEMENT_H

class Achievement {
    public:
        Achievement();
        ~Achievement();
        
        void unlock();
        void notifyPlayer();

};
#endif

```

```cpp
#ifndef PLAYERGOAL_H
#define PLAYERGOAL_H
class PlayerGoal {
    public:
        PlayerGoal();
        ~PlayerGoal();
        
        void updateProgress();
        void complete();
        void checkDeadline();

};
#endif

```

```cpp
#ifndef GROWTHPATH_H
#define GROWTHPATH_H

class GrowthPath {
    public:
        GrowthPath();
        ~GrowthPath();
        
        void updatePath();
        void calculateGrowth();
        void getProjectedStats();

};
#endif

```

```cpp
#ifndef POSITION_H
#define POSITION_H

class Postiion {
    public:
        Position();
        ~Position();
        
        void getRequiredAttributes();
        void validateAttributes();

};
#endif

```

```cpp
#ifndef ATTRIBUTE_H
#define ATTRIBUTE_H

class Attribute {
    public:
        Attribute();
        ~Attribute();
        
        void getAttribute();
        void setAttribute();

};
#endif

```

```cpp
#ifndef GOALTYPE_H
#define GOALTYPE_H

class GoalType {
    public:
        GoalType();
        ~GoalType();
        
        void getGoalType();
        void setGoalType();

};
#endif

```

```cpp
#ifndef ACHIEVEMENTTYPE_H
#define ACHIEVEMENTTYPE_H

class AchievementType {
    public:
        AchievementType();
        ~AchievementType();
        
        void getAchievementType();
        void setAchievementType();

};

#endif

```

----

```cpp
#ifndef LEGACYPLAYER_H
#define LEGACYPLAYER_H

class LegacyPlayer {
    public:
        LegacyPlayer();
        ~LegacyPlayer();
        
        void createPlayer();
        void updateAttributes(Attribute attribute);
        void setTeam(Team team);
        void trackProgress();
        void exportToPros();

};

#endif

#ifndef DYNASTYMODE_H
#define DYNASTYMODE_H

class DynastyMode {
    public:
        DynastyMode();
        ~DynastyMode();
        
        void integratePlayer(LegacyPlayer player);
        void progressSeason();
        void generateEvents();

};

#endif

#ifndef TEAM_H
#define TEAM_H
class Team {
    public:
        Team();
        ~Team();
        
        void addPlayer(LegacyPlayer player);
        void removePlayer(LegacyPlayer player);
        void updateRoster();

};

#endif
    
#ifndef ACHIEVEMENT_H
#define ACHIEVEMENT_H

class Achievement {
    public:
        Achievement();
        ~Achievement();
        
        void unlock();
        void notifyPlayer();

};
#endif

#ifndef PLAYERGOAL_H
#define PLAYERGOAL_H
class PlayerGoal {
    public:
        PlayerGoal();
        ~PlayerGoal();
        
        void updateProgress();
        void complete();
        void checkDeadline();

};
#endif

#ifndef GROWTHPATH_H
#define GROWTHPATH_H

class GrowthPath {
    public:
        GrowthPath();
        ~GrowthPath();
        
        void updatePath();
        void calculateGrowth();
        void getProjectedStats();

};
#endif

#ifndef POSITION_H
#define POSITION_H

class Postiion {
    public:
        Position();
        ~Position();
        
        void getRequiredAttributes();
        void validateAttributes();

};
#endif


#ifndef ATTRIBUTE_H
#define ATTRIBUTE_H

class Attribute {
    public:
        Attribute();
        ~Attribute();
        
        void getAttribute();
        void setAttribute();

};
#endif

#ifndef GOALTYPE_H
#define GOALTYPE_H

class GoalType {
    public:
        GoalType();
        ~GoalType();
        
        void getGoalType();
        void setGoalType();

};
#endif

#ifndef ACHIEVEMENTTYPE_H
#define ACHIEVEMENTTYPE_H

class AchievementType {
    public:
        AchievementType();
        ~AchievementType();
        
        void getAchievementType();
        void setAchievementType();

};

#endif

```