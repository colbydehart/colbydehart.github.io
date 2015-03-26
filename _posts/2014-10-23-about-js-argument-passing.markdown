---
title: "About JavaScript argument passing"
date: 2014-10-23 10:38:00
layout: post
categories: Javascript argument passing
---

Recently while writing some funky JavaScript code, I noticed an 
interesting behavior in relation to function arguments. Passing
in variables containing primitive values as arguments will not
allow the function to change the value of the variable. However,
a function that takes in an object as argument has the ability to 
alter its contents.

<span class="more"></span>

Take the following code for example...

{% highlight javascript %}
var primitiveVariable = 1,
    objectVariable = {value:1};
function mutate(someVariable){
  someVariable.value ? someVariable.value +=1 : someVariable +=1;
}

mutate(primitiveVariable);
mutate(objectVariable);

console.log(primitiveVariable);
//  logs 1, the original value
console.log(objectVariable.value);
// logs 2, which has been changed
{% endhighlight %}

This behaves this way because JavaScript does not pass arguments
as reference or value every time. It follows a convention called
[call by sharing][callBy]. This basically means that the whole value
of a variable passed in cannot be changed, but the properties of
a variable passed in can be changed. It's a bit confusing, but it
basically boils down to two points.

- If you attempt to replace the entire contents of an argument
  variable in a function, it will not change the variable outside
  of that function's scope.
- If you change a property or method on an argument variable in a
  function, it will propagate outside the functions scope and change
  the variable globally.

[callBy]:http://en.wikipedia.org/wiki/Evaluation_strategy#Call_by_sharing
