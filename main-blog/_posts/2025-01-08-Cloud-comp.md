---
title: "Cloud Computing Notes"
layout: "post"
date: 2025-01-08 11:58:21 -0800
---


Table 1-1. Availability percentages represented in nines

| Availability percentage | Downtime per year | Downtime per month | Downtime per week |
|:-----------------------:|:-----------------:|:------------------:|:-----------------:|
|      90% (1 nine)       |     36.5 days     |      72 hours      |    16.8 hours     | 
|     99% (2 nines).      |     3.65 days     |     7.2 hours      |    1.68 hours     |
|     99.5% (2 nines)     |     1.83 days     |     3.60 hours     |   50.4 minutes    |
|     99.9% (3 nines)     |    8.76 hours     |    43.8 minutes    |   10.1 minutes    |
|    99.99% (4 nines)     |   52.56 minutes   |    4.32 minutes    |   1.01 minutes    |
|    99.999% (5 nines)    |   5.26 minutes    |    25.9 seconds    |   6.05 seconds    |
|   99.9999% (6 nines)    |   31.5 seconds    |    2.59 seconds    |   0.605 seconds   |
|   99.99999% (7 nines)   |   3.15 seconds    |   0.259 seconds    |  0.0605 seconds   |



### Avaialbility in parallel versus in sequence
Availablility of two compoenents in parallel is calculated as follows:
```math
Availability of two components in sequence = Availability of component 1 * Availability of component 2
```


### Ensuring availability

* Keep Redundant Systems: 
  * Redundant systems are copies of the primary system that can take over if the primary system fails.
  * Redundant systems can be active-active or active-passive.
  * Active-active systems are both running and serving traffic.
  * Active-passive systems are running but not serving traffic.
* Fault Tolerance, Resistance to Unexpected Failures:
  * error-handling mechanisms
  * redundant hardware
  * self-healing systems
* Load Balancing, Keeping availability High:
  * Load balancing is the process of distributing incoming network traffic across multiple servers.
  * Load balancers can be hardware or software-based.
  * Load balancers can be used to distribute traffic across multiple servers, ensuring that no single server is overwhelmed.
* Monitoring and Alerting:
  * Monitoring and alerting systems can help detect issues before they become critical.
  * Monitoring systems can track key performance indicators (KPIs) and alert administrators when thresholds are exceeded.



### Availability Patterns
#### Failover Patterns
* Active-active failover
* Active-passive failover
* Master-slave failover
* Leader-follower failover
* Hot standby failover
* Cold standby failover
#### Replication Patterns
* Multileader replication
* Single-Leader replication
* Leaderless replication
* Master-slave replication

### https://code-maze.com/http-series-part-1/
learn how HTTP communicates to write better applications.

* HTTP Definition
* Resources
* How to exchange Messages between a web client and a web server
* message examples
* MIME types
* Request Methodds
* Headers
* Status Codes


HTTP Def
HyperText Transfer Protocol
* in charge of delegation of the internet's media files between client and server
* HTTP is an application layer protocol


Layers
* Application Layer: HTTP
* Transport Layer: TCP
* Network Layer: IP
* Data Link Layer: Ethernet Driver
* Hardware Layer: Ethernet Card