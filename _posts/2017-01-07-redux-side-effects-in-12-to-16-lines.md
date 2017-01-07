---
layout: post
published: true
title: Redux Side Effects In 12 to 16 Lines
date: 2017-1-7
categories: React Redux JavaScript
---

I've been thinking (and perhaps overthinking) a bit about
my redux workflow. Specifically how to handle side effects,
such as async requests. I have used [redux-thunk][thunk] and
[redux-saga][saga] in the past. While they solve the problems
of async redux well, something never felt quite right and I
couldn't put my finger on it.

Last week I came across [this article][idiomatic] on Mark's
Dev Blog that made me realize why I don't like these solutions.
This, along with using [Elm][elm] for the last month or so, made
me seek out a simpler solution. I got turned onto [redux-loop][loop]
which was closer to what I wanted but was a bit bulky and also allows
batching actions, which I see as not so great (see [this tweet][tweet]).
So I started writing a blog post titled...

### Redux Side Effects Middleware in 12 lines

I was so young at this point. So foolish and bright-eyed.
I posted this untested snippet into slack at an attempt
to handle async actions like Commands in elm.
Here's the (totally nonsense) code.

```js
const cmdMiddleware = store => next => action => {
  const res = next(action)
  if (!Array.isArray(res)) return res
  let [ state, command ] = res
  if (typeof cmd === 'function') {
    Promise.resolve(command()).then(a => store.dispatch(a))
  } else if (Array.isArray(command)) {
    let [cmd, ...args] = command
    Promise.resolve(cmd(...args)).then(a => store.dispatch(a))
  }
  return state
}
```

You'll spot my error pretty quick. I forgot what the return value
of `next` is in a middleware, which is just the returned action and
not the updated state, also the return value of this function has
no bearing on state.

The middle of this function (lines 3-10) were where I was on
the right track. I wanted to be able to dispatch actions that
were one of three things:

- `state` - the updated state, just like normal
- `[state, cmd]` - the updated state and a command, which
  will return an action to be dispatched, possibly async through
  a promise
- `[state, [cmd, ...args]]` - same as before, but the cmd and args
  to be pass to it in an array.

I still needed to figure out how to intercept the actual reducer
though and not the dispatch function. With great hubris, i
titled a new blog post

### Redux Side Effects Enhancer in 16 lines

Here I actually made an example application using `create-react-app`
and tried a few things here, but then found out about the store's
`replaceReducer` and got pretty close

```js
const cmdEnhancer = createStore => (reducer, preloaded, enhancer) => {
  const store = createStore(reducer, preloaded, enhancer)
  store.replaceReducer((state, action) => {
    const next = reducer(state, action)
    if (!Array.isArray(next)) return next
    const [ newState, command ] = next
    if (typeof command === 'function') {
      Promise.resolve(command()).then(a => store.dispatch(a))
    } else if (Array.isArray(command)) {
      const [ cmd, ...args ] = command
      Promise.resolve(cmd(...args)).then(a => store.dispatch(a))
    }
    return newState
  })
  return store
}
```

Keyword here is _pretty close_. I loaded this enhancer into my
simple application and it worked! I could return commands in
my reducer that would get fired off. Everything worked exactly
as expected. I even began to publish my blog post and begin to
enjoy the rest of my weekend when I saw the error.

What happens when you use `combineReducers` or `reduceReducers`
or anything that a normal person using redux would use? This
enhancer assumes that you have a single reducer that returns one
of the three possible return types. I fiddled with the enhancer and
shut my laptop case. It was too complicated to do in any lines of
code worth bragging about. That is until I changed the title the
second time.

### Redux Side Effects in 14 Lines

I came back and discarded enhancers and middlewares. I realized
that I needed access to all of the user's reducers to make this
actually work. And the only place I thought of to do that would
be in the `reduceReducers` function. And then I came up with this.

```js
const reduceCommandReducers = (reducers, store) => {
  return (state, action) => reducers.reduce((s, r) =>{
    const next = r(s, action)
    if (!Array.isArray(next)) return next
    const [ newState, command ] = next
    if (typeof command === 'function') {
      Promise.resolve(command()).then(a => store.dispatch(a))
    } else if (Array.isArray(command)) {
      const [ cmd, ...args ] = command
      Promise.resolve(cmd(...args)).then(a => store.dispatch(a))
    }
    return newState
  }, state)
}
```

This works with multiple reducers. All the async actions dispatch
just as expected. You can achieve a similar approach with `combineReducers`
as well, I just was uninterested in doing it. The part of this that
is strange is that you have to reduce reducers after you create your
store and then use the `replaceReducer` function like so

```js
const store = createStore(state => state, {}, enhancer)
store.replaceReducer(reduceCommandReducers([...reducers], store))
```

This makes sense because you have to give your reducer access to
dispatch to let it produce more actions. This goes against
a lot of the main ideas of redux, but this pattern is
inherently such.

All of this goes with the same caveats in `redux-loop`.
Is it a good idea?  Maybe. Does it put side effects in your
reducers? absotively. I just wanted to see if I could get a
reasonable approach to async actions in an afternoon and learn
a bit more about enhancers and the `createStore` function.

I have put up a [repo][example] that uses this function just to
show that it works for a simple use case. It is probably broken.
It probably doesn't play well with other middlewares and reducers.
It most likely introduces some strange race conditions. I did
not test it and won't. The reason is that I had already figured
out how to do all of this much more simply.

### Redux Side Effects Middleware in 12 Lines: Redux

I forgot to mention my very first attempt at this was a middleware that put
the commands in the action creators and not the reducer, which
was much simpler and did not break the core tenets of redux.
You would basically dispatch an `[action, cmd]` pair instead
of just an action to get the same effect.

```js
const cmdMiddleware = store => next => action => {
  if (!Array.isArray(action)) return next(action)
  const [ act, command ] = action
  const res = next(act)
  if (typeof command === 'function') {
    Promise.resolve(command()).then(a => store.dispatch(a))
  } else if (Array.isArray(command)) {
    const [ cmd, ...args ] = command
    Promise.resolve(cmd(...args)).then(a => store.dispatch(a))
  }
  return res
}
```

This approach is probably better. You don't have to put side
effects in reducers. Putting async bits in action creators isn't
too far off from thunks/sagas that folks are already used to.
Also, it is 12 lines, which means I wouldn't have had to change
my post title. Three times.

[thunk]:http://google.com
[saga]:https://github.com/redux-saga/redux-saga
[idiomatic]:http://blog.isquaredsoftware.com/2017/01/idiomatic-redux-thoughts-on-thunks-sagas-abstraction-and-reusability/
[elm]:http://elm-lang.org/
[loop]:https://github.com/redux-loop/redux-loop
[tweet]:https://twitter.com/dan_abramov/status/800310397538619393
[example]:https://github.com/colbydehart/redux-recipe
