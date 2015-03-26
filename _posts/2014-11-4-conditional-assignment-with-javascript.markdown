---
title: "Conditional Assignment with JavaScript"
date: 2014-11-4 09:07:00
layout: post
categories: jQuery JavaScript Collision Detection
---

The other day while working on a recreation of chess with a few of my 
cohort mates here at the [NSS](http://nashvillesoftwareschool.com/), I had to constantly find out if,
in a 2-dimensional array, if a cell exists. If the outer array did not
exist though, the program would fail if I tried to grab the inner array
from the undefined value.

<span class="more"></span>

So `2dArray[invalidValue][somOtherValue]` would crash my JavaScript. 
Instead of setting up an if statement to check if they outer array exists
and then the inner aray exists every time I wished to operate on the grid,
i wrote the following little function.

```javascript
function cellExists(x,y){
  return 2dArray[y] && 2dArray[y][x];
}
```

Now when this function receives an invalid grid cell, it will return false
without crashing the program, but to my surprise it will return the actual
cell of `x` and `y` instead of true if the cell exists. This actually
ended up being more useful for me, because many times I was just checking 
to see if a cell exists so I could grab a property out of it.
So grabbing that property could more simply be...


```javascript
function getSomeProp(x,y){
  2dArray[y] && 2dArray[y][x] && 2dArray[y][x].someProp;
}
```

You can also use boolean values like this when assigning variables. If you
`&&` it will return the last value if both values of true and if you use 
`||` it will return the first value if it is true, or the second value if
the first is false, or false if neither are. Below I have some examples.

 
```javascript
var foo = someFlag && someVal;
//only sets foo to someVal if someFlag is true
var bar = falseValue || trueValue;
//falsValue is false, so it sets bar to trueValue
var baz = baz || "value not found"
//if baz is undefined or a false value,
//sets itself to "value not found"
```
