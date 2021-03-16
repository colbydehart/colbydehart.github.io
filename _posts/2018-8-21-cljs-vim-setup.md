---
layout: post
published: true
title: Setting up Neovim for CLJS
date: 2018-8-21
categories: ClojureScript Vim
---

In this post I'll show you how i set up Neovim for ClojureScript
development. First of all make sure you have the latest version of
[Neovim][neovim], [lein][lein], and [clojure][clojure].

Next you need to install [vim-fireplace][fireplace]. I use 
[vim-plug][plug] so my setup looks like this

```
Plug 'tpope/vim-fireplace'
" autoconnect to repls
Plug 'tpope/vim-classpath'
" static support for lein.
Plug 'tpope/vim-salve'
```

In the fireplace readme, it says to also set up [cider-nrepl][cider],
so we also go ahead and set up that by editing `~/.lein/profiles.clj`
so it looks like this:

```clojure
{:user {:plugins [[cider/cider-nrepl "0.18.0"]]}}
```

Setting this up in this file will allow us to use cider in every
project. Next we need to set up [Piggieback][piggieback]. We
also need to edit `profiles.clj` to add the dependencies for 
piggieback, so the whole file now looks like this:

```
{:user {:plugins [[cider/cider-nrepl "0.18.0"]]
        :dependencies [[cider/piggieback "0.3.8"]]
        :repl-options {:nrepl-middleware [cider.piggieback/wrap-cljs-repl]}}}

```

Now we need to go into a ClojureScript project. You can create 
new CLJS project with live-reloading using the 
[Figwheel template][figwheel].

```sh
lein new figwheel-main my-app
```

Move into the directory and start a repl.

```sh
cd my-app
lein repl
```

Next we need to start a ClojureScript repl with Piggieback.
Just run this code in the Clojure repl.

```
user=> (do (require 'cljs.repl.nashorn) (cider.piggieback/cljs-repl (cljs.repl.nashorn/repl-env)))
```

Now, if everything has been setup properly, when you open vim
you should be autoconnected to the REPL. If not you might need 
to run the `:Connect` and/or `:Piggieback` commands. (see the
[fireplace][fireplace] docs if you get tripped up here)

You will also need to run a figwheel repl in another terminal
to get live code reloading while you develop. 

```
lein fig:build
```

[neovim]:https://neovim.io
[lein]:https://leiningen.org/
[clojure]:https://clojure.org/
[fireplace]:https://github.com/tpope/vim-fireplace
[plug]:https://github.com/junegunn/vim-plug
[cider]:https://github.com/clojure-emacs/cider-nrepl
[piggieback]:https://github.com/nrepl/piggieback
[figwheel]:https://rigsomelight.com/figwheel-main-template/
