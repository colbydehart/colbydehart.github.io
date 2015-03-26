--- 
title: "Testing Angular Apps pt.1"
date: 2015-01-06 09:23:56
layout: post
categories: angular testing mocha karma
---

Recently I've been diving into developing applications with [AngularJS](https://angularjs.org/). 
I've been building my capstone project for NSS with it and it has been going great.
At first I had a few hiccups trying to test it, but Google has made Angular
easy to test once you figure out the basics of injecting your modules into your tests.

I'm going to assume you've set up karma and mocha and focus on how to use Angular
in your tests. if you haven't there are many tutorials out there to show you how 
to set up a test environment and you can also check out my 
[GitHub repo](https://github.com/colbydehart/when) for an idea of how I have mine configured.

So here is the factory I am going to test. I'm started with a factory because angular controllers are
a bit more complicated to test, but I will go over them in part 2 of this.

<style>.gist{height:250px; overflow:scroll}</style>
<script src="https://gist.github.com/colbydehart/af8eb58fa72f50904a58.js"></script>

This factory handles creating and merging calendars for participants of a group event.
Now to test it, we need to include this module in our test. This is pretty easy as
long as you have included angular-mocks in your Karma config.

{% highlight javascript %}
//calFactory.spec.js
Describe('Calendar Factory', function(){
  beforeEach(module('calFactory'));
  ...
{% endhighlight %}

So here we use the function `module` provided my angular-mocks to inject the module.
now we need to use Angular's injector to give us our actual factory.

{% highlight javascript %}
var $cal;
beforeEach(inject(function(cal) {
  $cal = cal;
}));
it("should exist", function(){
  $cal.should.exist;
});
{% endhighlight %}

The inject function will give us access to the Angular injector, just like in the
initialization function of a controller or factory. Here we inject `cal`, which is
our factory and assign it to a variable that we can use in our tests. Then our first
test just makes sure we have successfully injected our factory. This test actually does
more than just that. If our module breaks or our factory is unable to be built, then the
test will fail. A simple test like this for all of your modules will be able to quickly alert
you if your app breaks. But we want more than that, so let's test some functionality.

{% highlight javascript %}
function createCal() {
  var firstDay = new Date(),
      firstDayHolder = _.cloneDeep(firstDay),
      nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate()+7);
  return $cal.newCal(firstDay, nextWeek);
}

var calendar;
beforeEach(function() {
  calendar = createCal();
});

it("should create calendars", function(){
  calendar.length.should.equal(7);
  calendar[0].should.have.keys('noon', 'morning', 'night', 'date');
});
it("should be able to make date objects", function(){
  var dates = $cal.convertDates(calendar);
  dates[0].should.be.an.instanceOf(Date);
});
{% endhighlight %}

So I make a utility function to create a week long calendar with my factory. 
Then I test that it creates the proper lengt calendar with the correct keys.
Then i check the `convertDates` method correctly gives me Date objects.

This is a fairly simple example, but shows how to inject Angular into your tests.
I will post a second part to this post that will show how to inject controllers 
properly and also how to handle async code.
