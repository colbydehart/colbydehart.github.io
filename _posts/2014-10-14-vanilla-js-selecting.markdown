---
title: "Vanilla Javascript Selecting"
date: 2014-10-14 15:34:00
layout: post
categories: JavaScript
---
Last week was my first week at [Nashville Software School][1] and so far it 
has been great. We have started out going through some basic HTML, CSS, 
and JavaScript as well as VIM, git, and the command line and I've picked up a 
few new things so far. One of those, which I hadn't before dealt with much, 
is using vanilla Javascript to select elements on the DOM

- `document.getElementById()`

Before coming to school I had only used jQuery for DOM selection and manipulation
and had completely skipped over any of the built-in document selection methods.
The first of these that I learned was `getElementById`. This method is pretty
self-explanatory, it traverses the DOM and grabs the first element with the
matching id. The interesting part is the `element` object it returns.  This 
object has properties like `classList`, `innerHTML`, and `style` that can be
directly edited.  Being used to setting properties with this with the abstracted
jQuery functions like `$('#nav-bar').toggleClass('hidden')`, it feels
a little dirty directly modifying DOM elements like this:

{% highlight javascript %}
var el = document.getElementById('toggleElement'),
		classes = el.className.split(' '),
		existingIndex = classes.indexOf('hidden');
if (existingIndex >= 0)
	classes.splice(existingIndex, 1);
else
	classes.push('hidden');

el.className = classes.join(' ');
{% endhighlight %}

This code was taken from [You Might Not Need jQuery][2], a site that shows vanilla
Javascript replacements for simple jQuery functions.

- `document.getElementsByClassName()`

This method grabs a group of elements that have the same class name, you can also
use the similar function `getElementsByTagName` for grabbing tags instead of 
classes. The interesting part of this one is that the object that it returns
is not an array, but an `HTMLCollection` object which does not have any of array's
methods. It can return the length and access objects with bracket notation like
a normal array. This can be worked around with a few unattractive solutions
 (like `[].splice.call(els, 0, 1);` for example).

- `document.querySelector()`

This is the real prize of `document`'s built-in selection functions. It grabs 
elements that match a CSS selector passed in as a string in the first argument
much like jQuery's `$()` function. It returns the same element object as `getElementById` and you can use `querySelectorAll()` to get a HTMLCollection instead. With
these selectors and the properties of their objects, it is trivial to remove the
need for jQuery quite a lot of the time it seems, which I suppose was the idea 
behind [YMNNJ][2]. This isn't for every situation, but it's certainly useful and
was interesting to learn about.

[1]:http://nashvillesoftwareschool.com
[2]:http://youmightnotneedjquery.com
