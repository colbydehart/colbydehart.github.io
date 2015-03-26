---
layout: post
title: "DOM Collision Detection"
categories: jquery javascript
date: 2014-12-4 10:17:00
---

I was working on a recreation of the Hasbro board game
[Battleship](https://github.com/colbydehart/battleship) in the browser. I had to check and make 
sure that when I was placing my ships in the game that 
they could not overlap, therefore had to figure out 
collision detection in the DOM.


This is the function in its entirety.

{% highlight javascript %}
function willCollide(block) {
  var top = block.offset().top,
      left = block.offset().left,
      right = left + block.width(),
      bottom = top + block.height(),
      result = false;
      
  $blocks.each(function(i, el){
    if($(this).attr('id') !== block.attr('id')){
      var blockLeft = $(this).offset().left,
          blockTop = $(this).offset().top,
          blockRight = shipLeft + $(this).width(),
          blockBottom = shipTop + $(this).height();
      if (!(top >= blockBottom || bottom <= blockTop ||
          left >= blockRight || right <= blockLeft)){
            result = true;
      }
    }
  });
  return result;
}
{% endhighlight %}

This function takes in a `block`, which is just a DOM
element (I'm using jQuery here). My blocks are just 
divs in this case. `willCollide` will return true if 
the piece is colliding with another block. 

The first few lines get the top, left, right, and 
bottom edges of the block and set them to variables
using the element's offset and dimensions.

After that, I'm looping through each block element
in `$blocks`. Each block has a unique id, so the if
statement will prevent me from checking my main block
against the others. If it is a unique block, I get the
top, left, right, and bottom exactly how I did at the 
top of the function. Then it gets a little weird with
this if statement:

{% highlight javascript %}
if (!(top >= blockBottom || bottom <= blockTop ||
    left >= blockRight || right <= blockLeft)){
      result = true;
}
{% endhighlight %}

Okay, so lets break this down. Since I'm comparing two
blocks and saying 'block' over and over again is going
to get confusing, i am going to call the main block 
that was passed into the function the mainBlock and the
block that is currently being compared in the for loop
the currentBlock. Alright.

{% highlight javascript %}
top >= blockBottom || bottom <= blockTop
{% endhighlight %}

Keep in mind that height increases as it goes
down in DOM coordinates. So we see if the top of the 
mainBlock is lower than the bottom of the currentBlock
or if the bottom of the mainBlock is higher than the 
top of the currentBlock. If either of these are true, 
than there is no way that the blocks could overlap 
each other vertically, but we don't know anything about
horizontal collision. That's where the next line comes in.

{% highlight javascript %}
(!(top >= blockBottom || bottom <= blockTop ||
left >= blockRight || right <= blockLeft))
{% endhighlight %}

The left and right check do the same as the top and bottom
then we wrap the whole conditional up in parenthesis a negate
it, basically saying, 'If there is no way that these two
elements are not going to collide, then they collide'. Then
we set the result accordingly and return it at the end of the 
function. It looks a little convoluted, but after you get a 
hang of the parts it is actually pretty simple.
