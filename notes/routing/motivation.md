The Question:

  What has `useRouter` got going over Next.js that it makes sense to create *and
  maintain* a whole separate project?

The Answers:

- `useRouter` allows for declarative redirects, declarative authenticated
  pages, declarative layouts without modifying the <App> component. 

- `useRouter` can be used within both CRA and Next.js, making it possible to
  start an app with CRA, and move to Next when it makes sense
  (I'd need to find or create a next adapter for the history package)

- `useRouter` allows control over where code is split

- `useRouter` allows for a cleaner system for adding layout code to multiple
  pages

- `useRouter` lets you eject from Next


---

Comparison

RRL
---

## RRL positives

- allows for different routing behavior on client side and server
  side. this means that e.g. even if the server doesn't know about user
  authentication (which improves caching), we can still implement declarative
  redirects using routers on the client.

- allows for routes to depend on information stored in React state.

- doesn't need to send a request to the API as getServerSideProps, reducing
  latency on navigation
- allows for non-serializable initial props, e.g. react elements
  (note, this is why `getRoute` cannot be called within any of Next.js's
   getter methods -- they can't handle React elements!)

- removes the need to specify Next `as` props on links/navigation
- `usePendingRequest` is easy to use, and also integrates with React Suspense
  and concurrent mode
- gives you access to a route's content element, w/ the request at
  the time it was created baked in -- making transitions easier

- makes it a *whole* lot easier to eject and go your own way.


## RRL negatives

- increases time to onboard new engineers familiar with next
- requires a way to map URLs to next routes

- cannot act as an implicit page cache; fetched data needs to be cached
  elsewhere if you don't want to it to refresh on the smallest change on
  any change to the request, including auth/hash/query changes.


Next
----

## Next.js positives

- Many engineers already know how to use it


## Next.js negatives

- getInitialProps must return a serializable object, and must return the final
  initial props for the initial request on both the server *and* the client.
  This makes it difficult to render a cacheable request on the server, and then
  update that after re-rendering on the client.

- The result of getInitialProps can't depend on information stored in React
  state. This means that if auth state is stored within React, it's inaccessible
  from within `getInitialProps`

- (confirm) Route loading status only reflects getInitialProps, and requires
  manual use of the events
- forgetting to pass an `as` prop can result in the entire app being reloaded
  without any obvious warning
- creating trees of redirects to help people navigate by url is unintuitive

---

Definitely want my routing to be based on RRL.

It's a pity there's no easy way to do static-rendering-with-server-fallback.
It's probably possible to do this using raw Vercel, but I'm not sure how to
do so with Next.js. Maybe I could create an issue asking about this?

 => Already merged!
    https://github.com/vercel/next.js/issues/15637
    It does not let you send 404 or redirect, but this seems to be planned:
    https://github.com/vercel/next.js/issues/11646

In any case... for now if I want to be able to send 404/redirects, I need to
use plain old SSR, and if I want to be able to use urql to precache queries
in my routes, I need to use getInitialProps over getServerSideProps.

And I *do* want to be able to use redirects, as I want people to be able to
redirect people from alias to word.