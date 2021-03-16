---
layout: post
title: "Make console apps with node"
categories: Node JavaScript CLI
date: 2015-4-24 10:17:00
---

So you've got an idea for the next `Ack`, but you don't know
how to write console applications! No worries, you can 
write console applications with JavaScript and publish them
to npm pretty easily. I recently did this with a project
called [sfold](https://www.npmjs.com/package/sfold) which allows you to quickly scaffold files
and folders for a project.

##Setup

First you need to make an empty directory and run `npm init`.
If you've never done this, it simply sets this directy up to
hold a node project and will create a `package.json` file. 
For the rest of this tutorial, let's assume we want to make a
console application called `salute` which takes in a name and
then prints to the console "Hello, your_name".

Let's now make a `main.js` file which will hold our
application. This will be the main file for our console app.
These are the full contents of the file.

{% highlight bash %}
#!/usr/bin/env node
'use strict';

console.log('Hello ' + process.argv[2]);
{% endhighlight %}

The first line is a [shebang](http://en.wikipedia.org/wiki/Shebang_%28Unix%29) which says that we should use
the `node` program to run this script. Then we just print to
the console the string "Hello " and the 3rd argument. The 
reason we want the 3rd is because when you call this from the
command line using npm, the first argument will be 'node' and 
the second will be the absolute path to your `main.js` file
so that when calling `salute colby`, the 3rd argument is
actually 'colby'. 

##Running it

Now we need to edit the `package.json` a little bit. Delete 
the property called 'main' and add one called 'bin' which
should look like this.

{% highlight json %}
{
    "name": "salute",
    ...
    "bin": {
        "salute": "main.js"
    },
    ...
}
{% endhighlight %}

The `bin` attribute contains key-value pairs where the key
is the name of the command called from the command line,
which we want to be salute. If you wanted to call your
application by typing 'say_name', you would change salute to
that here. And the value is the location of the script that 
will be run, which is just main.js for us. 

Now we need to hop back into your terminal. To test this, 
first we need to link this package, which will allow you to
run it locally. just run `npm link`. Now your app should be
linked to your system so you can just run `salute colby` and
it will print out "Hello, colby" back to you. Great! now we
need to publish it. 

##Publishing

If you haven't already, you need to go to the 
[npm website](https://www.npmjs.com/) and register an account.
Then from your terminal you can login with `npm login` with 
your credentials. After that, all you have to do is run 
`npm register ./` and your application will be publically 
available. All people will have to do is run 
`npm install --global salute` (or whatever you name your
app), and they can use your awesome command line application!