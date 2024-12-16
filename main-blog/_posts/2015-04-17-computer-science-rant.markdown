Computer Science. Where do I start? Basics? Algorithms? Languages? Theory? Hardware? Software? API? Design Patterns? The lists go on and on. But I think that the easiest place to start is with either Design Patterns or Algorithms.    

## Basics of Computer Science

Numbers are the basics of computer science. Processing numbers at nano second speeds is how the computer’s run. Everything from the words on this page to the colors of the pixels on the screen. They are all numbers associated with some other formation of numbers displayed for the user. This process of association starts on the operating system’s kernel and hard disk. Groups of data are moved into main memory and then processed one by one. Sometimes they are processed in groups called warps. Other times they are split amongst multiple processors and executed at the same time. In regards to programming, there are a couple different areas that the basics of Computer Science cover. Academic curricula in computer science include the follow   

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
Structured programming involves block statements, iterative procedures, and conditional statements. It is a style of programming that improves the clarity, quality, and development time of computer programs. Block (Sequence), Conditional (Selection), and for/while loop (Iterative) statements are the three basic paradigms of structural programming theorem. It is considered a subset of procedural programming that enforces a logical structure upon the writing of the program to make it more readable and efficient.   

Sequence—ordered statements or subroutines executed in sequence
Selection—one or numbered programs executing depending upon a certain condition. If the condition is met, the program executes, otherwise nothing is done or there can be an alternative execution prescribed.    
Iteration—executes a portion of a program a specific number of times before continuing on in program control flow.    


## Conditions

Almost everything that I’ve encountered in computer science is conditional. Is this greater than this? is this true? is this false? Does this string match to the other one? Is there a portion of this string inside of the other one? Is this object equal to this other one. Over and over again.    
When faced with such problems, I always try and identify the conditions before even starting to think of implementation. But I’m guessing that’s what a lot of people do in that regard. Underline the conditions so that they can do error checking during their control flow. How else would you come out with the proper solution? You would just have to guess. I feel this is an integral part of Comp. Sci. and problem solving. How do I solve the problem in the way in which you are asking me to? How do I meet your requirements upon what “right” looks like? How do I get you the best result?     
Usually the word “if” gives away a conditional to me. "If this number is greater, then do this” is a perfect example of a great “if” statement. It tells you how the If statement is going to get formed. if (number is greater) { then do this }. The problem with these sorts of statements is that they don’t just end here. They become more and more complex as the functionality does. The larger the idea and more intricate, the more cryptic the if statement. I then also have to wonder about implementating large portions of an idea if they are too great in complexity. Otherwise usually denotes an else statement, and more than three ifs in a row means a switch( ) statement. But this only works on basic boolean logic puzzles. There’s not an extensive usage for these in real world. If you come across one, then you feel like you’ve just found $100.00 on the street. It’s a good feeling, but they don’t come often.      

## Data Structures

Data structures hold all the information you’ll ever need in OOP (Object Oriented Programming). What makes them so interesting to me is what you can do with them, and how to implement them. There are three data types: primitive, composite, or abstract.     
Primitive Data types are the bare bones, including boolean, integer, character types. There are also Floating point numbers, which represent decimal valued numbers, doubles, and Enumerated types. Enumerated types are fun because you can assign your own values to these specific “named” types. But this is completely dependent upon which language you are using and what are you using it for.     
Composite types are collections of other types and what you can store them in. Arrays, records, Unions, and Tagged Unions are contained in this class. I’m not too sure of what Unions or tagged Unions are used for, but it seems that a union is a way of storing multiple variable access points for the same object. If one of these is active, the other is not active. You can set and reset them as often as you’d like, just like the cells within an array. All of these seem to be of the container variety and have their memory allocated at compile time.     


## Business Rules 
We need a definition around business rules surrounding money at work. Right now there isn’t an implementation for that model, but what actually is going to happen if we do that?     
we don’t know which methods coordinate with billing specifically.
we could stub out the existing methods that haven’t been implemented yet and use those as the flags coordinating with the billing items.    


What am I reading about today? Clojure? From what I’ve gathered today Clojure is server-side functional language that is used for web programming. That’s about as much as I learned from that. Awk is a language that can process text really well. And then I grabbed a JavaScript cookbook, but I don’t know what I’m going to do with it. I have been trying to think of a good project that I can work on incrementally and learn from. But I guess that anything that I tackle in the software industry will work out for that.     
During work, I had to learn more about CSS cursor items. And during it I was also reading more about full-stack developers and one of the things they say is find the fundamental bottleneckss in every system. What prevents infinity? There’s a pretty good list of things here . But I feel like all of these things are distracting me from what I really want to do.      
I want to build the Audio recorder for the web, with it’s controller displayable. I’ve been working on it for some time now. The whole organization of the thing is the trouble with it. So lets work on that.      
I ended up messing with CSS and html objects, didn’t get very much scripting done for functionality. But it was nice to go back thought and mess with basic html. All of the new tools help with everything, but I feel like if you don’t know how to enter in html and CSS manually, you’re kinda boned for web programming.     
Everything done with frameworks is trying to accomplish the exact tasks that I was doing. It’s just learning a new framework takes time and I already kinda know CSS/HTML. I’m no master at both by any means, but I am working on them both. I think that development of the audio controls is a good start. Then I can get into voice recognition and recording things. Sounds like a beautiful avenue for me to go down. We’ll see how things progress. Off to class now.    
I was working through some of the computer vision with python book during class. We were going over textures and how to represent them in images and detect them. I’m not sure if I really care about them, but I should because they will most likely be on the test. Plus they also have significance with games and 3D images, so that images look realistic. I then started doing some coding bat stuff and started up my work for imprev. Practice makes perfect correct? Then why do I feel so bad at what I’m doing? Probably based upon fear and what it all could mean.      

#### What did I do today? 

Today was a weird day. I got into work late, I worked on a routing issue with Alex and it seemed like no big deal once I showed it to him. But I did learn a bit about how to figure out trigger events and how they’re being routed. It seems that the whole pubSub things is just a way for us to call the router without actually calling it. Once that was modified I started working on figuring out how to modify the notificationArea of campaign events to give the event text spaces. This was extremely difficult to follow for me. I couldn’t for the life of me figure out where each item was going, how the data was looking and what was causing the truncation of it. It turns out that most of this was done on the CSS side of things.    
Using white-space: pre-wrap element, I can add in all of the spaces to the html area, and have the text wrap. My computer then decided that it was going to crash on me before I could check anything in and I worked on other things. I practiced creating backbone.js applications, but didn’t get very far when I was hung up on a JSON issue. I couldn’t get my json file to load because of some local file error with parsing data. I spend a great deal of time trying to figure this one out, and figure out a solution to how to get the JSON data into the browser at least. I came up short before my computer re-loaded. What I found is that the XMLHttpResponse cannot be created from local file. It wants a hosted file to grab the data from.     
So if I am parsing data from somewhere instead of from my lo9cal machine it works out. Why is that? I heard something bout it being a security issue for mozilla, and that you can run google chrome with local file access, but I’m unsure as to why they wouldn’t initially allow json data upload. Possibly because people might be able to upload different file types that may be unacceptable and hack into the browser. So my progress was thwarted by these occurrences. I don’t know why evernote does this. It lowered the text onto another line when it corrects it. This software is pretty buggy.     

#### So what’s working and what’s not?
##### What’s working?
* Writing down what I’ve been doing 
* Making reminders in my phone
* Doing a coding problem every day
* Exercising
* Meditating
* Reading at night

#### What’s not working
* inconsistencies
* Random projects
* Oversleeping
* Having no definite plan
* messy house


Hmmm....