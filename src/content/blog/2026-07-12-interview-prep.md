---
title: "Interview Prep"
pubDate: "7/29/26"
tags: []
tier: "standard"
permalink: "/2026/07/12/interview-prep/"
hide_frontmatter: false
---

# Interview Prep in 2026
## Rounds
### Coding Screen
- Data Structures & Algorithms
- medium leetcode difficulty
- Array/Hash Table/Binary Search/Sorting/String topics at a 4-Easy/14-Medium/2-Hard split.
- Hash Map / Hash Set (with frequency counting)
  - turns two operations into one by recording what's seen
  - two-sum variants
  - anagram grouping
  - longest substring without repeating characters

```go

func lengthOfLongestSubstring_(s string) int {
if len(s) == 0 {
  return 0
}
var freq [256]int
result, left, right := 0, 0,-1
for left < len(s) {
  if right+1 < len(s) && freq[s[right+1]-'a'] == 0 {
    freq[s[right+1]-'a']++
    right++
  } else {
    freq[s[left]-'a']--
    left++
  }
  result = max(result, right-left+1)
}
return result
}
func max(a int, b int) int {
if a > b {
  return a
}
return b
}    

```
  - subarray sum equals K
- ```python 
  def subarray_sum_equals_k(nums, k):
    prefix_sum = 0   
    count = {0: 1}
    total = 0
    for n in nums:
      prefix_sum += n
      total += count.get(prefix_sum - k, 0)
      count[prefix_sum] = count.get(prefix_sum, 0) + 1
  return   total
  ```
  - Heap / Prioity Queue
    - keep min or max accessible in O(log n) insert/remove, when you don't care about sort
- As seen in:
  - k-th largest element
  - merge k sorted lists
  - top-k frequent elements
  - meeting rooms II (min-heap of end times)
  - Dijkstra's shortest path
  ```go
  type Item interface {

      }
  // Heap - binary heap with support for min heap operations
  type Heap struct {
  
  }
  ```
- Two Pointers / Sliding Window
  - instead of nested loops, walk one or two pointers across the array/string 
  - expand or shink a window to avoid rescanning
  - As seen in:
    - logest substring without repeats
    - minimum window substring
    - container with most water
    - 3Sum
  - Tell:
    - anything on a sorted array or contiguous subarray/substring
    -
- Union-Find
  - structure to answer "are these two things connected?"
  - "merge two groups" in near-O(1) amortized time
  - uses path compression and union by rank
  - As seen in:
    - number of connected components
    - redundant connection
    - accounts merge
    - Kruskal's MST
  - Tell
    - "groups" or "friend circles" or cycle detection

```java
int[] parent, rank;
int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);
    return parent[x];
}
void union(int left, int right) {
    int rankLeft = find(left), rankRight = find(right);
    if (rankLeft == rankRight) return;
    if (rank[rankLeft] < rank[rankRight]) { int temp = rankLeft; rankLeft = rankRight; rankRight = temp; }
    parent[rankRight] = rankLeft;
    if (rank[rankLeft] == rank[rankRight]) rank[rankLeft]++;
}
```



```go
type Element struct {
    parent *Element
	Data interface{}
}

func MakeSet(Data interface{}) *Element {
	s := &Element{}
	s.parent = s
	s.Data = Data
	return s
}

func Find(e *Element) {
    for e.parent != e {
        e = e.parent
    }
    return e
}

// Recursive
func Find(e *Element) *Element {
	if e.parent == e {
		return e
    } else {
		return Find(e.parent)
    }
}

```
- Trie (Prefix Tree)
  - tree where path from root spells a prefix
  - As seen in:
    - word search II
    - implement autocomplete
    - longest common prefix
    - design add-and-search-word data structure
  - Tell:
    - anything involving a dictionary of words + prefix
    - wildcard queries
```go
// Trie node
type Trie struct {
	letter rune
	children []*Trie
	meta map[string]interface{}
	isLeaf  bool
}

func (trie *Trie) hasChild(a rune)(bool, *Trie) {
	for _, child := range trie.children {
		if child.letter == a {
			return true, child
        }
    }
}

func (trie *Trie) addChild(a rune) *Trie {
	newChild := NewTrie()
	newChild.letter = a
	trie.children = append(trie.children, newChild)
	return newChild
}

// add words to a trie
func (trie *Trie) Add(word string) *Trie {
	letters, node, i := []rune(word), trie, 0
	n := len(letters)
	
	for i < n {
		if exists, value := node.hasChild(letters[i]); exists {
			node = value
        } else {
            node = node.addChild(letters[i])
		}
		i++
		if i == n {
            node.isLeaf = true
		}
	}
	return node
}

func (trie *Trie) FindNode(word string) *Trie {
	letters, node, i := []rune(word), trie, 0
	n := len(letters)
	for i < n {
	    if exists, value := node.hasChild(letters[i]); exists {
            node = value
		} else {
		    return nil	
		}
	}
}
```
- Monotonic Stack
- Binary Search (on answer space, not just sorted arrays)
- Backtracking (with pruning)
- Graph traversal with state (BFS/DFS + memoization or topological sort)
- Dynamic Programming (1D and 2D, tabulation + memoization)
### System Design
- standard for general SWE
### Debugging
- standard for general SWE
- small, codebase
### AI Assisted Project in 60-min
- I'd bet this is like the take home assessments 
- project size
- topic
- language
- implementation checklist
### Interview Corpus (What I should know)
- e2e code lifecycle
- CI/CD frameworks
- redefining pipelines
- auto-triage agents
- build and scale
- gRPC/Protocol Buffers
- Progressive Delivery patterns
  - shipping software changes gradually and reversibly
  - control exposure on "deploy" from "release" independently by decoupling them
  - Family of Techniques
    - ship code once, then control who experiences it, using signal deciding to widen or narrow exposure
    - Patterns
      - feature flags
      - Canary releases
      - Blue/Green
      - Dark launches / shadow traffic
      - Ring-based / staged rollout
  - Kubernetes-native
  - Argo Rollouts
  - Flagger + LaunchDarkly/Unleash
- GitOps tooling Exposure
- LLM-agent-adjacent infra concerns
- Terraform Cloud
- CI/CD (Buildkite/Argo/Spinnaker-class, integrated with Bazel's graph)
- 



Content goes here.