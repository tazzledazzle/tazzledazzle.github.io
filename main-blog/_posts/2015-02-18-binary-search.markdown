
---
layout: post
title:  "Searching and Sorting - Binary Search"
date:   2015-02-18 13:19:42 -0800
categories: blogging posts algorithms binary-search
---

explanation of linear search

linear search == O(n) time complexity

The idea behind binary search is that if the array is sorted already then we can minimize the number of comparisons we need to do. We can ignore half of the elements just after once comparison.

Pseudo:
linearSearch(array, searchValue)

from 0 < length of array
     if ( array[i] == searchValue)
          return i
return -1; // not found

Pseudo:

1. compare x with middle element
2. if x matches with middle, we return the mid index
3. else if x is greater than the mid element, then x can only lie in right half subarray after the mid element. we recurse the right half.
4. else, x is smaller, so we recurse the left half

Recursive:

{% highlight java%}
binarySearch(array, low, high, searchValue)

if  high greater or equal to 1
     mid = low + (high - low)/2
     
     if array[mid] == searchValue
          return mid

     if array[mid] > searchValue
          return binarySearch(array, low, mid-1, searchValue)
     return binarySearch(array, mid+1, high, searchValue)

otherwise return -1; //not found
{% endhighlight %}

Iterative:

{% highlight java%}
binarySearch(array, low, high, searchValue)

while (low <= high)
     mid = low + (high - low)/2
     
     if (array[mid] == searchValue)
          return mid
     if (array[mid] < searchValue)
          low = mid + 1
     else
          high = mid - 1

otherwise return -1;   //not found
{% endhighlight %}