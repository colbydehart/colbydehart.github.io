---
layout: post
categories: hack nashville hackathon
title: "Hack Nashville 6"
date: 2014-11-11 12:43:00
---

I just got back from [Hack Nashville][HN] this last weekend and had a blast.
I ended up partnering up with [Code for Nashville][CfN] with a few of my cohort
mates from Nashville Software School. We worked on a pretty neat app called 
NashViva.

<span class="more"></span>

The app was basically "A digital pocketknife for life in 
Nashville". You pick an area in Nashville and it populates a map
with information that you might find useful, like public wifi, parks, fire
departments, and bus stops. I ended up spending most of the time that I could
devote working with [Leaflet][Leaf], which is a JavaScript library for easily
making and manipulating maps. Making a map is as simple as making
a `#map` element in your HTML and then initializing. 

```javascript
//Initialize the map
var map = L.map('map').setView([36.165818, -86.784245], 13);
//Add the main layer so you can see the map
L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png').addTo(map);
```

There's a way to add markers and shapes and a plethora of plugins for it
from there, but those are the basics. You can check out the the project and 
code at [NashViva][NV].  It's not yet fully complete, but it's got a start
and we are hoping to build it out from here.  A ton of other great projects
got built over the weekend as well and it was great to be a part of it. I
plan on going next year and would encourage anyone interested in coding, 
robotics, or anything creative in the digital realm to check it out also. 

[HN]:http://hacknashville.com/
[CfN]:http://www.codefornashville.org/
[Leaf]:http://leafletjs.com/
[NV]:https://github.com/code-for-nashville/nashviva
