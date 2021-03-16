---
layout: post
title: "Using Jekyll Collections"
date: 2014-10-16 14:39:00
categories: jekyll collections
---
This blog is built on [Jekyll][1] which is a ruby static site generator. It 
compiles markdown and html into a bunch of flatfiles that I can throw up on 
GitHub, using [GitHub pages][ghpages] and have a blog in no time at all. Jekyll 
provides a way to compile a collection of posts (in a \_posts folder) into 
a list of posts using [liquid][liquid], their ruby template engine. You can
also make your own collections in jekyll with a little bit of configuration.

<span class="more"></span>

Jekyll's liquid engine can iterate through properties in your site in a way 
similar to handlebars or erb and looks like this for the index of my blog:

{% highlight html %}
{% raw %}
<ul>
	{% for post in site.posts %}
		<li>{{ "{{ post.title" }} }}<li>
	{% endfor %}
</ul>
{% endraw %}
{% endhighlight %}

You can also make your own collections that work similarly to the way posts does.
Jekyll is pretty well documented and their site shows how to get up and running
with custom collections easily. First you need to alter your `config.yml` and add
a line that defines a `collections` property and then the name of your collections
preceded by a hyphen and space underneath. For example:

{% highlight yaml %}
# Build settings
markdown: kramdown
highlighter: pygments

collections:
- projects
{% endhighlight %}

Note the hyphen and space before the collection name must be there or your
config.yml will not be parsed. This is because of how yaml handles hashes and
you can read about it more [here][yaml]. 
Now that this is done,you can create a folder in
the root directory of your site with the same name as your collection in your
`config.yml` preceded by an underscore, so for this example I would make my
collection folder be `_projects/`

Now I can go ahead and start putting markdown files in my `_projects` folder and
they will be accessible on my pages through the `site.projects` property as long
as I have two sets of 3 hyphens at the beginning of the markdown files for the 
yaml frontmatter, so this would be an example file called `_projects/example-project.md`

{% highlight html %}
---
title: "Example Project"
link: http://github.com/colbydehart/example-project
---
This is some text that explains what my cool project does and what technologies
i use to build it, this text is accessible through the `content` property and 
the properties in the front matter can be accessed via their names as well.
{% endhighlight %}

So now I have everything setup in my config and have made the collections in the 
correct folder folder. All that is left is to display the projects on a page.
I can go ahead and make a new html file at `portfolio/index.html` (note the 
lack of an underscore before this filename) and then iterate through the projects
like this:

{% highlight html %}
{% raw %}
---
permalink: /portfolio/
layout: default
title: Portfolio
---

<div class="portfolio">
  <h1 class="page-heading">Portfolio</h1>
	<p>These are some projects I have worked on in the past or am currently working on.</p>
	<ul>
		{% for project in site.projects %}
			<li>
				<a href="{{project.link}}">{{project.title}}</a>
				{{project.content}}
			</li>
		{% endfor %}
	</ul>
</div>
{% endraw %}
{% endhighlight %}

These collections are useful in that now, if I am working on a new project I want
to share on my website, I would only have to make a simple markdown file for it
to be shown with all the others. It also makes everything a little less cluttered
in my markup which is something I am a big fan of.

[1]:http://jekyllrb.com
[ghpages]:https://pages.github.com/
[liquid]:http://liquidmarkup.org/
[yaml]:http://www.yaml.org/YAML_for_ruby.html#collections
