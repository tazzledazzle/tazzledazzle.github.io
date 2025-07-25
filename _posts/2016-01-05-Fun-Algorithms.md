---
layout: page
title:  "Algorithms That Interest Me"
date:   2016-01-05 08:35:25 -0800
categories: algorithms computer_science
---
<!-- Numerical:   
* Euclid's algorithms   
* Gaussian elimination   
* Fourier-Motzkin elimination   
* Fast Fourier Transform      
Data structures:   
* Binary trees   
* Hash tables   
* Binary decision diagrams   
* Disjoint sets   
* Trie   
* Priority queue      
Sorting & searching arrays:   
* Bubblesort   
* Quicksort   
* Heapsort -- mostly useful because building a heap is a really handy way of making a priority queue   
* Binary search      
Tree search:   
* Breadth first search   
* Depth first search      
Graphs:   
* Dijkstra's algorithm   
* Prim's algorithm   
* Ford-Fulkerson   
* A*      
Automata and parsing:   
* Finite automata   
* Thompson's construction for creating a nondeterministic finite automaton from a regular expression   
* The powerset construction for determinising a finite automaton   
* Pushdown automata and context-free languages   
* Recursive descent parsing for LL(k) languages LR parsing for LR(k) languages      
Numerical optimization:   
* Simplex   
* Hill climbing algorithms   
* Newton's method      
Combinatorial optimization:   
* The Hungarian algorithm for solving the assignment problem   
* Boolean satisfiability -- an NP-complete problem    
* DPLL -- used to solve SAT   
* QBF -- a PSPACE complete problem      
Graphics:   
* Rasterisation   
* Ray tracing      
Compilers:   
* Hindley-Milner type inference   
* Register colouring      
Machine learning:   
* Back propagation for neural networks   
* Expectation maximization algorithm   
* Naive Bayes   
* Support vector machines   
* Random forests      
Cryptography:   
* Diffie-Hellman key exchange   
* DES   
* Block cipher modes of operation -- most important is CBC imho    
* RSA)      
Miscellaneous:   
* Graham scan for finding convex hulls   
* Quine-McCluskey algorithm for logic minimization

   
 -->   
   
### Numerical:   
* <b>Euclid's algorithms   </b>   
   
The algorithm is based on the following two observations:

If b|a then gcd(a, b) = b.
This is indeed so because no number (b, in particular) may have a divisor greater than the number itself (I am talking here of non-negative integers.)
   
If a = bt + r, for integers t and r, then gcd(a, b) = gcd(b, r).   

<p>Indeed, every common divisor of a and b also divides r. Thus gcd(a, b) divides r. But, of course, gcd(a, b)|b. Therefore, gcd(a, b) is a common divisor of b and r and hence gcd(a, b) ≤ gcd(b, r). The reverse is also true because every divisor of b and r also divides a.   </p>

```java
// recursive
public int gcd(int a, int b) {
	if (b == 0){
		return a;
	}
	else{
		return gcd(b, a % b);
	}
}

// iterative
public int gcd(int a, int b) {
	while (b != 0) {
		int temp = q;
		q = p % q;
		p = temp;
	}
	return p;
}
```


* Gaussian elimination   

Gaussian elimination is one of the oldest and most widely used algorithms for solving linear systems of equations. 
The algorithm was explicitly described by Liu Hui in 263 while presenting solutions to the famous Chinese text Jiuzhang suanshu (The Nine Chapters on the Mathematical Art), but was probably discovered much earlier. 
The name Gaussian elimination arose after Gauss used it to predict the location of celestial objects using his newly discovered method of least squares. 
Apply row operations to transform original system of equations into an upper triangular system. Then use back-substitution.
One common pivot strategy is to select the row that has the largest (in absolute value) pivot element, and do this interchange before each pivot, regardless of whether we encounter a potential zero pivot.
It is widely used because, in addition to fixing the zero pivot problem, it dramatiaclly improves the numerical stability of the algorithm.

{% highlight java %}
public double[] gaussianElimination(double[][] A, double [] b) {
	int N = b.length;

	for (int p = 0; p < N; p++) {
		//find pivot row
		int max = p;
		for (int i = p + 1; i < N; i++) {
			if (Math.abs(A[i][p]) > Math.abs(A[max][p])) {
				max = i;
			}
		}

		//swap
		double[] temp = A[p];
		A[p] = A[max];
		A[max] = temp;
		
		double t = b[p];
		b[p] = b[max];
		b[max] = t;

		// singular or nearly singular
		if (Math.abs(A[p][p]) <= le-10) {
			throw new RuntimeException("Matrix is singular or nearly signular");
		}

		// pivot within A and b
		for (int i = p + 1; i < N; i++) {
			double alpha = A[i][p] / A[p][p];
			b[i] -= alpha * b[p];
			for (int j = p; j < N; j++) {
				A[i][j] -= alpha * A[p][j];
			}
		}
	}

	// back substitution
	double[] x = new double[N];
	for (int i = N - 1; i >= 0; i--) {
		double sum = 0.0;
		for (int j = i + 1; j < N; j++) {
			sum += A[i][j] * x[j];
		}
		x[i] = (b[i] - sum) / A[i][i];
	}
	return x;
}

{% endhighlight %}
* Fourier-Motzkin elimination   
{% highlight java %}{% endhighlight %}
* Fast Fourier Transform   
{% highlight java %}{% endhighlight %}
   
### Data structures:   
* Binary trees   
{% highlight java %}{% endhighlight %}
* Hash tables   
{% highlight java %}{% endhighlight %}
* Binary decision diagrams   
{% highlight java %}{% endhighlight %}
* Disjoint sets   
{% highlight java %}{% endhighlight %}
* Trie   
{% highlight java %}{% endhighlight %}
* Priority queue   
{% highlight java %}{% endhighlight %}
   
### Sorting & searching arrays:   
* Bubblesort   
{% highlight java %}{% endhighlight %}
* Quicksort   
{% highlight java %}{% endhighlight %}
* Heapsort -- mostly useful because building a heap is a really handy way of making a priority queue   
{% highlight java %}{% endhighlight %}
* Binary search   
{% highlight java %}{% endhighlight %}
   
### Tree search:   
* Breadth first search   
{% highlight java %}{% endhighlight %}
* Depth first search   
{% highlight java %}{% endhighlight %}
   
### Graphs:   
* Dijkstra's algorithm   
{% highlight java %}{% endhighlight %}
* Prim's algorithm   
{% highlight java %}{% endhighlight %}
* Ford-Fulkerson   
{% highlight java %}{% endhighlight %}
* A*   
{% highlight java %}{% endhighlight %}   

### Automata and parsing:   
* Finite automata   
{% highlight java %}{% endhighlight %}

* Thompson's construction for creating a nondeterministic finite automaton from a regular expression   
{% highlight java %}{% endhighlight %}
* The powerset construction for determinising a finite automaton   
{% highlight java %}{% endhighlight %}
* Pushdown automata and context-free languages   
{% highlight java %}{% endhighlight %}
* Recursive descent parsing for LL(k) languages LR parsing for LR(k) languages   
{% highlight java %}{% endhighlight %}
   
### Numerical optimization:   
* Simplex   
{% highlight java %}{% endhighlight %}
* Hill climbing algorithms   
{% highlight java %}{% endhighlight %}
* Newton's method   
{% highlight java %}{% endhighlight %}
   
### Combinatorial optimization:   
* The Hungarian algorithm for solving the assignment problem   
{% highlight java %}{% endhighlight %}
* Boolean satisfiability -- an NP-complete problem   
{% highlight java %}{% endhighlight %}   
* DPLL -- used to solve SAT   
{% highlight java %}{% endhighlight %}
* QBF -- a PSPACE complete problem   
{% highlight java %}{% endhighlight %}
   
### Graphics:   
* Rasterisation   
{% highlight java %}{% endhighlight %}
* Ray tracing   
{% highlight java %}{% endhighlight %}
   
### Compilers:   
* Hindley-Milner type inference   
{% highlight java %}{% endhighlight %}
* Register colouring   
{% highlight java %}{% endhighlight %}
   
### Machine learning:   
* Back propagation for neural networks   
{% highlight java %}{% endhighlight %}
* Expectation maximization algorithm   
{% highlight java %}{% endhighlight %}
* Naive Bayes   
{% highlight java %}{% endhighlight %}
* Support vector machines   
{% highlight java %}{% endhighlight %}
* Random forests   
{% highlight java %}{% endhighlight %}
   
### Cryptography:   
* Diffie-Hellman key exchange   
{% highlight java %}{% endhighlight %}
* DES   
{% highlight java %}{% endhighlight %}
* Block cipher modes of operation -- most important is CBC imho    
{% highlight java %}{% endhighlight %}
* RSA)   
{% highlight java %}{% endhighlight %}
   
### Miscellaneous:   
* Graham scan for finding convex hulls   
{% highlight java %}{% endhighlight %}
* Quine-McCluskey algorithm for logic minimization   
{% highlight java %}{% endhighlight %}   
   
   