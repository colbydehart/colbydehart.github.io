---
title: "Testing Angular Apps pt.2"
date: 2015-01-20 09:43:00
layout: post
categories: karma angular testing mocha
---

Back again with pt. II of my Angular testing post. This time I
will show you how to create tests for controllers, generate a new
controller for each test, and how to test http requests. Alright,
lets get right into it.

So here is the controller we are going to be testing. It gets a
name from our location and handles posting a new calendar then
redirect.

<style>.gist{height:250px; overflow:scroll;}</style>
<script src="https://gist.github.com/colbydehart/157d80a9b715f78dd26e.js"></script>

So let's see how we want to get our controller into our tests. Now, what we actually
want is a function which creates a custom scope based on what we need to test, but this
isn't too hard in angular.

{% highlight javascript %}
//new.spec.js
Describe('New Calendar', function(){
  beforeEach(module('new'));
  var calFn, http, scope, loc;
  beforeEach(inject(function($controller, $httpBackend, $rootScope, $location) {
      http = $httpBackend;
      scope = $rootScope.$new()
      loc = $location;
      calFn = function(scp){
        return $controller('NewController', {$scope: scp})
      };
}));
{% endhighlight %}

So here we have injected `$rootScope` into the variable `scope`, which
will let us make new scope objects on the fly. We also made a function
which uses Angular's built-in `$controller` service so we can initialize
the controller with a different scope per test. let's make sure we can test
grabbing the name of the new cal out of the location first.

{% highlight javascript %}
it("Should pull the name from the location.", function () {
  loc.search({name:"Hello"});
  calFn(scope);
  expect(scope.event.name).to.equal("Hello");
})
{% endhighlight %}

In the controller, we grab the name from the query string and set it to the
`event` object's name. This is a great example of why we needed a function
that makes our controller, instead of initializing it in the `beforeEach`. We
need to be able to initialize the location before th controller is instantiated.
Then we call `calFn` which makes our controller and changes scope.event based
on the location we just made.

This is all good, but pretty simple. What if we want to test something more
complicated, like http requsts? Here we use `$httpBackend` to spoof a server
and make sure our controller is sending out the POST request.

{% highlight javascript %}
it("should post to server on scope.createEvent", function () {
  loc.search({name:"Hello"});
  calFn(scope);
  http.expectPOST('http://some.url', { name:'Hello', participants:{} })
  scope.createEvent;
})
{% endhighlight %}

We initialize the location and controller in the same way again, but then
we use `$httpBackend` with the `expectPOST` request. It takes in the arguments
of what URL we are expecting and the data that it is expecting us to post. We then
create the event and the $httpBackend will automatically assert our test for us.

This is a pretty example, $httpBackend can accept all kinds of requests, respond
with custom values or error, and has pretty good [documentation](https://docs.angularjs.org/api/ngMock/service/$httpBackend). From here you should be able to test all your controllers basic functionality and your http request.
