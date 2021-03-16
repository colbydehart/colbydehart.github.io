---
title: "Infinite Arrays in JavaScript"
date: 2014-10-30 09:15:00
layout: post
categories: JavaScript infinite arrays
---
Recently I was working on an implementation of [Conway's Game of Life][gol]
and I had to create an infinite grid made up of nested arrays. The 
problem that I soon ran into was hooking the Array's first element to its
last element, or tying it together so it looped.

I came up with the following helper function that will make an Array
behave like a fixed length loop of values.



{% highlight javascript %}
Array.prototype.get(index){
  return this.slice(index%this.length)[0];
}
{% endhighlight %}

This might look a little confusing to you, so I'll break it down. First
let me address the two goals of this function for it to successfully
make an array infinite.

- Selecting an element where index is -1, or less than the first element, 
  will give you the last element.
- Selecting an element where index is array.length, or greater than the last
  element, will give you the first element.

So the first thing to look here is the argument being passed into `slice`. This
is `index%this.length`. The modulo remainder of the index and the length of 
the array (referenced by `this` while we are inside of this function) will be
equal to the index that is passed in, **unless** it is greater than the index
of the last element, in which case it will loop back to the beginning of the 
array. Look at the following example to understand.

{% highlight javascript %}
var arr = [1,2,3];
2%arr.length;
// returns 2
3%arr.length;
// returns 0
7%arr.length;
// returns 1
{% endhighlight %}

The next piece of this puzzle is the `slice` function here. Slice returns an
array of the array it is called from starting at the first argument with an
optional length argument which we will not use. The reason we need slice is 
it already implements getting elements at indexes that are less than the first
element's index. For example, arr.slice(-1) will return a substring starting
at the last value of the array. Since this return value for slice is an array,
we need to take the first value, which will be the one we want, by adding 
`[0]` at the end. 

The one concern here is that the function will never return undefined, which 
is what we want, but just something to be wary about when using it. You can't
check if a value exists at a certain index with this because it will
**always** return a value in the array. Hope you find this useful and a 
few demonstrations of its behavior is below.

{% highlight javascript %}
var arr = ['My','very','eager','mother'];

arr.get(0);
//returns 'My'
arr.get(3);
//returns 'mother'
arr.get(4);
//returns 'My'
arr.get(-1);
//returns 'mother'
arr.get(6);
//returns 'eager'
arr.get(-3);
//returns 'very'

{% endhighlight %}

[gol]:http://en.wikipedia.org/wiki/Conway's_Game_of_Life
