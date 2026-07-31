---
title: "How Kruskal's Algorithm Works"
pubDate: "7/30/26"
tags: []
tier: "featured"
permalink: "/2026/07/30/kruskals-algorithm/"
hide_frontmatter: false
---

Kruskal's is a greedy minimum spanning tree algorithm: sort all edges by weight -> repeatedly add the cheapest
unconnected edge -> do unitl you have no more vertexes
```go
package main

// Kruskal's minimum spanning tree using Disjoint Set (Union-Find)
// This version uses the Go standard library ("sort") to sort edges. 

import (
	"fmt"
	"sort"
)

// Edge represents a weighted, undirected edge between two vertices
type Edge struct {
	U, V, Weight int
}
```


```go
// Disjoint Set (Union-Find) with path compression + union by rank
type DSU struct {
	parent []int
	rank   []int
}


// NewDSU creates a disjoint-set struct for n elements (0..n-1)
// where each ele starts as solo singleton set
func NewDSU(n int) *DSU {
	d := &DSU
}
```
Content goes here.