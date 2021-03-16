---
layout: post
title: "Functional JavaScript with Lodash"
date: 2015-3-8
categories: lodash JavaScript functional programming
---
EDIT: I've redone my whole website since this post, so the game is no longer
on here, but you can check it out by looking at the code.

I've been getting into breaking functions down into 
smaller chunks and write more functional type JavaScript. 
This was prompted by wanting to learn and utilize [lodash](https://lodash.com/)
better as well as I have been teaching myself Python, which
highly values collection manipulation and more compressed, 
functional type methods. So inspired by pythonic coding, I
wrote a the classic game **snake** in Javascript with lodash.

You can see [the game here](https://github.com/colbydehart/colbydehart/blob/master/contents/app.js).
I will be referencing it throughout
the rest of the post. Now this post title is a bit misleading, the code I wrote
isn't super functional, but some parts of it do emphasize how utilizing set theory
can help write more concise code. Whatever, let's have a look.

First a super simple example, When the user presses a key on the page with snake,
I want to act upon it if it is an arrow key and return early otherwise.  This is
very easy in lodash.

{% highlight javascript %}
$(window).on('keydown', function(e){
    if(!_.contains([37, 38, 39, 40], e.keyCode))
        return;
    //38, 37, 40, 39 : up, left, down, right
{% endhighlight %}

`_.contains` is a lodash function that takes in an array and an item and
returns true if the array contains the item. So if the array
`[37, 38, 39, 40]` (The character codes of arrow keys) does 
not contain the keyCode of the event, return early. This is
much simpler than checking for each key with equality. Alright, 
more complicated/cooler example now.

My game of snake is based on a 16x16 grid. The snake and apple are just a
collection of x,y coordinates. I also keep track of the head of the snake and
the direction in a `dir` variable which is an x,y vector so if the snake was
moving up, the `dir` would be `[0,-1]` (Move horizontal 0 and vertically upwards 1)

Whenever the snake moves I have to see if the snake dies and restart the game. Here
is the code for that.

{% highlight javascript %}
var head = snake[snake.length-1],
    next = head.map(function(el, i){return el + dir[i]});
if( _.any(next, function(val){return val < 0 || val > 15}) ||
    _.any(snake,function(val){ return _.isEqual(next, val) })){
    //Kill that snake
{% endhighlight %}

So first I get the `next` position the snake will be moving to by mapping the
position of the `head` of the snake with the `dir` vector (in the map function, 
`el` is the coordinate and `dir[i]` will be the corresponding vector direction)

Next I check and see if the snake is about to go off the map. So the map is 16x16
with coordinates from 0 to 15, inclusive. So I use lodash's `any` method to see if
either of the coordinates of `next` are greater than 15 or less than 0. `_any` will
return true if any item in the collection satisfies the condition in the function, which
makes sense. 

Then I have to find out if the snake has run into itself, which would end the game. This
is a bit more complicated because I have to make sure the `next` coordinate is not
equal to any of the snake's body part's coordinates, but lodash makes this easy.

{% highlight javascript %}
_.any(snake,function(val){ return _.isEqual(next, val) })
{% endhighlight %}

lodash's `isEqual` gives us a deep equals so we can compare arrays
which is just awesome. With that known, it almost reads like English.
If `any` item in `snake` `isEqual` to the `next` coordinate, return true.
Okay, one more example.

{% highlight javascript %}
function styleAt(x, y){
    if(_.any(snake, function(e){return _.isEqual(e, [x,y])}))
        return '#74D13D';
    if(_.isEqual(apple, [x,y]))
        return '#ED9898';
    return '#ccc';
}

{% endhighlight %}

This function is for coloring each cell on the canvas, I pass in an x
and y, and the function returns green if it is a snake cell, red if it
is the apple cell, or grey if it is empty. The first `if` statement
checks to see if any element, `e` in the `snake` `isEqual` to the 
`[x,y]` coordinate. 

Hopefully these examples give you a few ideas on how you can use
lodash and JavaScript's built in collection methods like `_map` and
`reduce`. Set theory posits that through simple functions like these
that any one collection or set of data can be transformed into any other
set of data. That makes them very useful and I would encourage everyone
to make use of them. It will make your life much easier.
