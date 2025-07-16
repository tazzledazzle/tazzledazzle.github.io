---
layout: page
title:  "Guide To Data Mining"
date:   2015-12-20 11:16:42 -0800
categories: machine_learning data data_science
---
* Manhattan Distance:
{% highlight python %}
def manhattan(user1, user2): # in python
    distance = 0
    for key in user1:
        if key in user2:
            distance += abs(user[key] - user2[key])
    return distance
{% endhighlight%}

* Euclidian Distance:

{% highlight python %}
def euclidian(user1, user2): # in python
    distance = 0
    for key in user1:
        if key in user2:
            distance += pow(pow(abs(user1[key] - user2[key]), 2), 1/2)
    return distance
{% endhighlight%}

* Find Nearest Neighbor:
{% highlight python %}
def findNearestNeighbor(username, users):
    distances = []
    for user in users:
        if user != username:
            distance = manhattan(users[user], user[username])
    distances.sort()
    return distances
{% endhighlight%}

* Minkowski Distance:
{% highlight python %}
def minkowski(user1, user2, r):
    distance = 0
    for key in user1:
        if key in user2:
            distance += pow(pow(abs(user1[key] - user2[key]), r), 1/r)
    return distance
{% endhighlight%}

* Pearson Correlation Coefficient:
{% highlight python %}
def pearson_correlation_coefficient(result1, result2):
    sum_x = 0
    sum_y = 0
    sum_xy = 0
    total = 0
    sum_sq_x = 0
    sum_sq_y = 0
    for key in result1:
        if key in result2:
            sum_x += result1[key]
            sum_y += result2[key]
            sum_xy += result1[key] * result2[key]
            total += 1
            sum_sq_x += result1[key] ** result1[key]
            sum_sq_y += result2[key] ** result2[key]
    numerator = sum_xy - (sum_x * sum_y / total)
    denominator = pow((sum_sq_x - (pow(sum_x, 2) / total), 1/2) * pow((sum_sq_y - (pow(sum_y, 2) / total), 1/2)
    if denominator == 0:
        return 0
    else:
        return numerator / denominator
{% endhighlight%}

* Cosine Similarity:    
This works great on zero/null values contained in a set
{% highlight python %}
def cosine_similarity(result1, result2):
    sum_sq_x = 0
    sum_sq_y = 0
    numerator = 0
    for key in result1:
        x = result1[key]
        y = result2[key]
        if x == Null:
            x = 0
        if y == Null:
            y = 0
        sum_sq_x += x ** x
        sum_sq_y += y ** y
        numerator += x * y
    if sum_sq_x == 0 or sum_sq_y == 0:
        return 0
    else:
        return numerator / (sum_sq_x * sum_sq_y)
{% endhighlight%}

* K-Nearest Neighbors:
{% highlight python %}
{% endhighlight%}


