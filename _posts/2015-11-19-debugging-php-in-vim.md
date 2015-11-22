---
layout: post
tags: 
  - "null"
published: true
title: Remote Debugging PHP in vim
---


I love vim. Most people who use vim feel the same. It feels pure and simple. The commands make sense (after you learn them) and everything is configurable through plaintext files. It's not for some people but for me it's everything I need. Well, almost everything I need.

I tend to get envious of an IDE's integrated debugger when I really need it, so I went searching for how to get the same functionality in my vim set up. I quickly found [VDebug](https://github.com/joonty/vdebug) which also seems to be the only useful plugin for debugging in vim. I'm going to quickly walk through my setup for PHP debugging in vim (You can also use it for ruby, node, perl, and python though I have not tried these yet)

First, you need to install the plugin and configure a few settings. I have recently switched to neovim and have replaced Vundle with [Vim-Plug](https://github.com/junegunn/vim-plug), so my setup looks like this.

{% highlight vim %}
Plug 'joonty/vdebug'
let g:vdebug_options = {}
let g:vdebug_options["port"] = 9000
let g:vdebug_options["break_on_open"] = 0
{% endhighlight %}


I found that I had to initialize the options dictionary or I ran into problems assigning properties. I set the port to 9000 and turned off the `break_on_open` setting so that it doesn't break on the first line. I use vagrant and a virtual machine to do my PHP development so I need to tell vim how to map from my home filesystem to the virtual machine's. I have a line later on in my `.nvimrc` which sources a local config file so I can use project specific settings. 

{% highlight vim %}
"Local Vimrc
if filereadable("./.lnvimrc")
    execute "source ./.lnvimrc"
endif
{% endhighlight %}


So in my php project i have a `.lnvimrc` that looks like this

{% highlight vim %}
let g:vdebug_options["path_maps"] = {
\    "/vagrant": "/Users/colby/Code/project-directory"
\}
{% endhighlight %}


You will need to change the path to your project of course. Just to be clear, that is the location of the project on my virtual machine on the left and my host machine on the right. Okay, cool that's all you need on the vim side of things. You will now need to set some things up on the php side of things.

So `ssh` into your VM and install [XDebug](http://xdebug.org/). This is the php module that will allow remote debugging. On an ubuntu box, simply running `sudo apt-get install php5-xdebug` should be good enough. You need to go to the xdebug site for instructions for your particular distro. This should automatically create an file at "/etc/php5/conf.d/xdebug.ini" which you will need to add the following to.

{% highlight vim %}
zend_extension=/usr/lib/php5/20090626/xdebug.so
xdebug.remote_enable=on
xdebug.remote_handler=dbgp
xdebug.remote_host={your.host.ip.address}
xdebug.remote_port=9000
xdebug.remote_connect_back=on
{% endhighlight %}


The zend extension part should be autopopulated, don't copy the one above because the location of your `.so` file could be different depending on your version of php. You need to put your host machine's IP address in the `remote_host` parameter. You can get this just by running `ifconfig` (or ipconfig on Windows). Now you should be ready to debug! 

You can press `<F10>` to toggle a breakpoint in your code and then press `<F5>` to start the debugger, which will wait for 20 seconds for a connection. You will need to send a special signal in your request to tell PHP to start debugging. You can download a Chrome [XDebug Helper](https://chrome.google.com/webstore/detail/xdebug-helper/eadndfjplgieldjbigjakmdgkmoaaaoc?hl=en) plugin to toggle this, or just send a query string parameter of `XDEBUG_SESSION_START=1` in your request. After this, you should have a debugging window pop up in your editor and you can see the [VDebug](https://github.com/joonty/vdebug) docs for instructions on how to run through the script and evaluate code. Happy debugging!
