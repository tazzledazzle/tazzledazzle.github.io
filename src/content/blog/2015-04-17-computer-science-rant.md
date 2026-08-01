---
title: "Computer Science Rant"
pubDate: "2015-04-17"
tags: []
tier: "standard"
permalink: "/2015/04/17/computer-science-rant/"
hide_frontmatter: false
---

Computer Science. Where do I start? Basics? Algorithms? Languages? Theory? Hardware? Software? API? Design Patterns? The lists go on and on. But I think the easiest place to start is with either Design Patterns or Algorithms.    

## Basics of Computer Science

Numbers are the basics of computer science. The computer runs by processing numbers at nanosecond speeds — everything from the words on this page to the colors of the pixels on the screen. They are all numbers associated with some other formation of numbers displayed for the user. This process of association starts on the operating system's kernel and hard disk. Groups of data move into main memory and are then processed one by one. Sometimes the processor handles them in groups called warps. Other times they split across multiple processors and execute simultaneously. In programming, the basics of Computer Science cover several distinct areas. Academic curricula in computer science include the following areas of study:

### Academic curricula in computer science include the following areas of study:

* Structured and Object Oriented programming[47]
* Data structures[48]
* Analysis of Algorithms[49]
* Formal languages[50] and compiler construction[51]
* Computer Graphics Algorithms[52]
* Sorting and Searching[53]
* Numerical Methods,[54] Optimization and Statistics[55]
* Artificial Intelligence[56] and Machine Learning[57]

## Structured Programming
Structured programming involves block statements, iterative procedures, and conditional statements. It is a style of programming that improves the clarity, quality, and development time of computer programs. Block (Sequence), Conditional (Selection), and for/while loop (Iterative) statements are the three basic paradigms of structural programming. It is considered a subset of procedural programming that enforces a logical structure on the program to make it more readable and efficient.   

Sequence — ordered statements or subroutines executed in sequence.
Selection — one or more programs executing depending on a condition. If the condition is met, the program executes; otherwise nothing happens, or an alternative execution runs.    
Iteration — executes a portion of a program a specific number of times before continuing in program control flow.    


## Conditions

Almost everything I've encountered in computer science is conditional. Is this greater than that? Is this true or false? Does this string match the other one? Is there a portion of this string inside of the other one? Is this object equal to this other one? Over and over again.    
When I face such problems, I always identify the conditions before thinking about implementation. Underline the conditions so you can do error checking during control flow. How else do you arrive at the proper solution? You would just have to guess. I feel this is an integral part of computer science and problem solving: how do I solve the problem as you're asking me to? How do I meet your requirements for what "right" looks like? How do I get you the best result?     
The word "if" usually signals a conditional. "If this number is greater, then do this" is a perfect example of an "if" statement. It tells you how the if statement will form: `if (number is greater) { then do this }`. The problem with these statements is that they don't just end there. They become more and more complex as the functionality does. The larger the idea and the more intricate the logic, the more cryptic the if statement. I also have to think carefully about implementing large portions of an idea when they grow too complex. "Otherwise" usually signals an else statement, and more than three ifs in a row signals a `switch()` statement. But this only works on basic boolean logic puzzles. You don't encounter them often in the real world. When you do find one, it feels like finding $100 on the street — a good feeling, but rare.      

## Data Structures

Data structures hold all the information you'll ever need in OOP (Object Oriented Programming). What makes them interesting is what you can do with them and how to implement them. There are three data types: primitive, composite, or abstract.     
Primitive data types are the bare bones, including boolean, integer, and character types. There are also floating point numbers, which represent decimal-valued numbers, doubles, and enumerated types. Enumerated types are useful because you can assign your own values to these specific "named" types — though this depends entirely on which language you are using and what you are using it for.     
Composite types are collections of other types and the containers you can store them in. Arrays, records, Unions, and Tagged Unions fall into this class. A Union appears to be a way of storing multiple variable access points for the same object: if one is active, the other is not. You can set and reset them as often as you'd like, just like the cells within an array. All of these seem to be of the container variety and have their memory allocated at compile time.     


## Business Rules 
We need a definition around business rules surrounding money at work. Right now there isn't an implementation for that model, but what actually is going to happen if we do that?     
We don't know which methods coordinate with billing specifically.
We could stub out the existing methods that haven't been implemented yet and use those as the flags coordinating with the billing items.    


What am I reading about today? Clojure. From what I've gathered, Clojure is a server-side functional language used for web programming. Awk is a language that processes text well. I grabbed a JavaScript cookbook, but I don't know what I'm going to do with it yet. I've been trying to think of a good project to work on incrementally and learn from, but I suppose anything I tackle in the software industry will serve that purpose.     
During work, I had to learn more about CSS cursor items. While doing that I was also reading about full-stack developers, and one thing they say is: find the fundamental bottlenecks in every system — what prevents infinity? But I feel like all of these things are distracting me from what I really want to do.      
I want to build the audio recorder for the web, with its controller displayable. I've been working on it for some time now. The organization of the whole thing is the trouble with it. So let's work on that.      
I ended up messing with CSS and HTML objects and didn't get very much scripting done for functionality. But it was nice to go back and mess with basic HTML. All of the new tools help with everything, but if you don't know how to write HTML and CSS manually, you're stuck for web programming.     
Everything done with frameworks tries to accomplish the exact tasks I was doing. Learning a new framework takes time, and I already know CSS/HTML reasonably well — not mastery, but I'm working on both. I think developing the audio controls is a good start. Then I can get into voice recognition and recording. That sounds like a beautiful avenue. We'll see how things progress.    
I was working through the computer vision with Python book during class. We were going over textures and how to represent and detect them in images. I'm not sure I really care about them, but I should — they'll most likely be on the test, and they have significance for games and 3D images that look realistic. I then started doing some coding practice and started up my work for imprev. Practice makes perfect, right? Then why do I feel so bad at what I'm doing? Probably fear, and what it all could mean.      

#### What did I do today? 

Today was a weird day. I got into work late and worked on a routing issue with Alex; it seemed like no big deal once I showed it to him. But I did learn a bit about figuring out trigger events and how they're being routed. The whole pubSub thing turns out to be just a way for us to call the router without actually calling it. Once I modified that, I started working on figuring out how to modify the notification area of campaign events to give the event text spaces. This was extremely difficult to follow. I couldn't figure out where each item was going, how the data was looking, and what was causing the truncation. It turns out most of this happened on the CSS side of things.    
Using `white-space: pre-wrap`, I can add spaces to the HTML area and have the text wrap. My computer then crashed before I could check anything in, so I worked on other things. I practiced creating Backbone.js applications but didn't get very far when a JSON issue stopped me. I couldn't get my JSON file to load because of a local file error with parsing data. I spent a great deal of time trying to figure this one out and find a solution to getting the JSON data into the browser. The XMLHttpRequest cannot be created from a local file — it wants a hosted file to grab the data from.     
So if I am parsing data from a remote source instead of my local machine, it works. Why is that? I heard it's a security issue for Mozilla, and you can run Google Chrome with local file access, but I'm not sure why they wouldn't initially allow JSON data upload. Possibly because people might upload different file types that could be unacceptable and hack into the browser. So my progress was thwarted by these occurrences.     

#### So what's working and what's not?
##### What's working?
* Writing down what I've been doing 
* Making reminders in my phone
* Doing a coding problem every day
* Exercising
* Meditating
* Reading at night

#### What's not working
* inconsistencies
* Random projects
* Oversleeping
* Having no definite plan
* messy house


Hmmm....
