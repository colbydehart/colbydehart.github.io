---
title: "Writing Node Scripts"
date: 2015-2-24
layout: post
categories: node scripts npm
---

You can write simple scripts in your `package.json` for your projects that
will run simple commands like `jshint *.js` or `karma start`, but you can 
also write your own js scripts and run them with node so that 
`npm run new_post` will run `node ./scripts/new_post.js` for anything you
need.

Here is the simple script I wrote to make a new post in 
[Wintersmith](http://wintersmith.io/). 

{% highlight javascript %}
var fs = require('fs'),
    prompt = require('prompt'),
    path = require('path'),
    changeCase = require('change-case');

prompt = prompt.start();

prompt.get(['title'], function(err, result) {
    var title = result.title
        cleanTitle = changeCase.snake(title); 

    fs.mkdirSync('contents/articles/' + cleanTitle);

    var content = '---\n';
    content += 'title: "' + title + '"\n'
    content += 'author: colby-dehart\n'
    content += 'template: article.jade\n'
    content += 'date: ' + printDate() + '\n'
    content += '---\n'

    fs.writeFileSync(
        'contents/articles/' + cleanTitle + '/index.markdown',
        content
    );
});

function printDate(){
    var d = new Date(),
        res = '';

    res += d.getFullYear() + '-';
    res += (d.getMonth()+1) + '-';
    res += (d.getDate()+1);

    return res;
}
{% endhighlight %}

I prompt the user (myself) for a title, then create a directory
that is named the title in snake case. Then I create some Yaml 
front matter for the post and write it in a file in the new folder
called `index.markdown`. I have this script loaded in a folder in my
root named `scripts` and then in my package.json I have.

{% highlight json %}
"scripts": {
    "new_post": "node bin/new_post"
}
{% endhighlight %}

Now whenever I want to make a new post, i just run `npm run new_post` and
I am prompted for a title and all of the directory making and front matter
generation is handled for me. Using this method is great for one-off tasks
that wouldn't necessarily make sense in an automated task runner like gulp.
