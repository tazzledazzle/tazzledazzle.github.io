---
title: "Competitive Programming Practice"
pubDate: "2015-11-06"
tags: ["algorithms","data_structures"]
tier: "featured"
permalink: "/2016/01/07/competitive-programming-practice/"
hide_frontmatter: false
---
## UVa 00467 - Synching Signals
* array of numbers
* jolly or not jolly flag
* if all numbers between 1 ... (n-1) contained between abs(n - n + 1) for all n in array
* boolean array of size n - 1
* output jolly or not jolly depending on boolean array set all true

```java
 public static void main(String [] args) {
   Scanner in = new Scanner(System.in);
  
   while(in.hasNext()) {
   	String [] strArr = in.nextLine().split(" ");
   	int max = Integer.parseInt(strArr[0]);
   	for (int i = 1; i < strArr.length; i++) {
   		if (Integer.parseInt(strArr[i]) > max) {
   			max = Integer.parseInt(strArr[i]);
   		}
   	}
   	boolean [] flagArr = new boolean[max - 1];
   	boolean jolly = true;
   	Arrays.fill(flagArr, false);
   	for (int i = 1; i < strArr.length; i++) {
   		int a = Integer.parseInt(strArr[i]),
   			b = Integer.parseInt(strArr[i - 1]);
   		int diff = Math.abs(a - b);
   		
   		if (diff <= flagArr.length){
   			flagArr[diff - 1 ] = true;
   		}
   		else {
   			jolly = false;
   		}
   	}
   	for (boolean test: flagArr) {
   		if (test == false) {
   			jolly = false;
   		}
   	}
   	if (jolly) 
   		System.out.println("jolly");
   	else
   		System.out.println("not jolly");
   }
 }
```




## UVa 11340 - Newspaper

* print out how much money it will cost to print a newspaper depending on significant case words

* input format
	* \# of tests
  * \# of characters
  * char .cents pairs at # of characters
  * \# of lines of input for article
  * lines of article following

```java
public static String evaluateCost(String article, HashMap<Character, Double> prices) {
	char [] arr = article.toCharArray();
	Double price = 0.0;
	for(int i = 0; i < arr.length; i++) {
		Double found = prices.get(arr[i]);
		
		if (found != null){
		//	System.out.println("Found " + String.valueOf(found));
			price += found;	// optimize
		}
	}
	return String.valueOf(price)+"$";	
}

public static void main(String [] args) {
	Scanner in = new Scanner(System.in);
	int n = Integer.parseInt(in.next());	// test cases
	int k = Integer.parseInt(in.next());	// paid lines
	HashMap<Character, Double> prices = new HashMap<>();
	for (int i = 0; i < k; i++) {
		// need a container to store the characters
		Character ch = in.next().charAt(0);
		Double cost = Double.parseDouble(in.next()) * 0.01;
	
		prices.put(ch, cost);

	}

	int v = Integer.parseInt(in.next());	// input lines
	String article = "";
	for (int i = 0; i < v; i++) {
		article += in.nextLine();
	}

	System.out.println(evaluateCost(article, prices));
}
```



 ## UVa 10855 - Rotated squares 

Given a large square of N×N uppercase letters and a smaller square of n×n uppercase letters, count how many times the small square appears in the large square across all four rotations.

### Input
The input is a series of problems, each on successive lines. The first line gives N and n (with 0 < n ≤ N) as two space-separated integers. The next N lines contain the large square, followed by n lines for the small square. Characters appear without spaces. A case where N = 0 and n = 0 signals the end of input.

### Output
Print one line per problem containing four integers: the appearance count for the small square at 0°, 90° (clockwise), 180°, and 270° rotations, respectively.

### Sample Input
```
4 2
ABBA
ABBB
BAAA
BABB
AB
BB
6 2
ABCDCD
BCDCBD
BACDDC
DCBDCA
DCBABD
ABCDBA
BC
CD
0 0
```
### Sample Output
```
0 1 0 0
1 0 1 0
```
Pseudocode
```
// while input != null
// read in dimension
// populate first array with read values
// populate second array with read values
// for i to 4 
	// pass through array
	// if match increment count
// print out counts
```


```java
public static void main(String [] args) {
	Scanner in = new Scanner(System.in);
	while (in.hasNext()) {
		int bigN = Integer.parseInt(in.next()), smallN = Integer.parseInt(in.next());

		char [][] bigArr = new char[bigN][bigN];
		char [][] smallArr = new char[smallN][smallN];

		for(int i = 0; i < bigN; i++) {
			String [] line = in.nextLine().toCharArray();
			if (line.length == bigN)  {
                //todo
			}
		}
	}
}
```
