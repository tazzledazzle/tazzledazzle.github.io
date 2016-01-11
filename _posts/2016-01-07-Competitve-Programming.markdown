---
layout: post
title:  "Competitive Programming Practice"
date:   2015-11-06 13:19:42 -0800
categories: algorithms data_structures
---
UVa 00467 - Synching Signals 


* array of numbers
* jolly or not jolly flag
* if all numbers between 1 ... (n-1) contained between abs(n - n + 1) for all n in array
* boolean array of size n - 1
* ouput jolly or not jolly depending on boolean array set all true

{% highlight java %}
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
{% endhighlight %}


