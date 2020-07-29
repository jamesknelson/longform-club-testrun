
Q: how to make navigate return a promise that resolves when
   the last route is rendered, and any suspended components inside
   it have rendered too?
A: it looks like `useEffect()` runs before the lazy child component
   has completely rendered in legacy mode, but in blocking/concurrent
   modes the useEffect waits until the child has rendered. however,
   a <Suspense> creates a boundary on this, so you can only wait until
   everything outside of a <Suspense> has finished... but this kinda
   makes sense
=> for legacy mode apps, we'll want to emulate suspense at the
   `useRouter` level by outputting an old route and location.
   we may want this for blocking mode apps too.
=> we won't want to resolve a `navigate()` promise until after we've
   an effect has run on our `useRouter` after returning our non-pending
   state. we don't worry about suspenses inside a nested <Suspense>
   as an effect on the `useRouter` means that content for the latest
   URL has been rendered at some level of the app.

Q: if a direct child of this component suspends on the initial
   render, and there's a Suspense outside of this component, will
   this component keep its state?
A: https:codesandbox.io/s/boring-chatelet-5tulo?file=/src/App.js
   yes in legacy mode, no in blocking/concurrent mode
   as such, a `useRouter` rendering a pending child without a
   <Suspense> will break if state is stored in component state.

Q: if `useRouter` state is stored at a higher level than `useRouter`
   and passed down through context, will the initial content stay
   rendered while we're waiting for initial render using partial
   hydration?
A: no. changes to context cause a re-render.

Q: HTTP status and headers must be sent before content, requiring us to
   compute the full route before starting to stream the App's React content.
   Combined with the fact that routers should memoize responses by request,
   During SSR, the app should never suspend during rendering -- at least
   due to the router.

   However, on the client, it is possible that some routing code -- e.g.
   a heavily code-split route -- may take longer to resolve than on the
   server, triggering a Suspense's fallback on the client that wasn't
   triggered on the server.

   The questions:

   1. In legacy mode, if a promise is thrown on the initial render on
      the client that wasn't thrown on the server, but a <Suspense> catches
      it, what happens?
   A: you can't SSR a <Suspense> in legacy mode at all. The SSR-rendered
      content inside the <Suspense> gets nuked.

   2. What about in blocking mode?
   A: The server-rendered content stays until the file loads!
      https:codesandbox.io/s/infallible-albattani-20ig7?file=/src/index.js

   NOTE: see Dan's examples at:
   - https:mobile.twitter.com/dan_abramov/status/1200111677833973760
   - https:codesandbox.io/s/floral-worker-xwbwv

Q: if a component with pending content inside a child <Suspense> changes
   state, but keeps rendered element referentially equal, does
   content get nuked?
A: no. beware: it *does* nuke if deep equal, but not referentially equal
   https:codesandbox.io/s/reverent-chatelet-81b66?file=/src/App.js

Q: if an element inside a <Suspense> disappears after causing a suspense
   during partial hydration, does the content inside that <Suspense> get
   nuked?
A: nope.
   https:codesandbox.io/s/affectionate-sea-yyl8m?file=/src/App.js

Q: in concurrent mode, if we use a transition on a link to a page whose
   content suspends inside a <Suspense> nested inside the `useRouter`
   component, does an effect in `useRouter` get called before the
   transition timeout gets triggered and a fallback rendered?`
A: depends on what the effect is on. if the effect is on location and
   that is what is changed inside the transition, then no.
   if the effect is on `isPending` for the same transition, yes.
   https:codesandbox.io/s/competent-shamir-40ugs?file=/src/App.js

Q: can you call `startTransition` within `startTransition`, and if so
   will both `pending` states become true?
A: not by the looks of it, at least not in the current release.
   this is something that might be worth filing an issue about.
   https:codesandbox.io/s/staging-silence-pp550?file=/src/App.js

Q: what happens if you call `startTransition` in blocking mode?
A: unfortunately it seems to call the passed in function without changing
   any behavior. I need a different way of detecting concurrent mode.
   https:codesandbox.io/s/cool-hoover-26isi?file=/src/App.js

TODO:
- put all these questions in a "Concurrent Mode Live Cheatsheet"

---

assuming good results from the above experiments:

- when using legacy mode, if you want async support with SSR, pass an
  initial response.
- `useRouter` needs to work without state until the initial effect
- `useRouter` can pass different contexts *until* the initial effect,
  but cannot pass different contexts between the times of
  the initial effect and the effect after the initial non-pending render.
- pending content can just be a `<SuspendWhilePending>` that throws a
  promise found on context
- `navigate` can return a promise which resolves on an effect that
  triggers after rendering a new content element
- we can call `startTransition` within `navigate`, and use this to return
  a `pending` variable from `useRouter` in concurrent mode, or emulate
  it in blocking/legacy modes
- for server side, use a plain async function `getInitialResponse` before
  `renderToStream`. We need to know the status before calling
  `renderToStream` in any case, so it doesn't make sense to try and do
  routing inside the react tree
- for initial route on client side, we don't want to `getInitialResponse`,
  as that'll force the client to wait until all code is loaded before any
  part of the app becomes active. Instead, we want progressive hydration,
  which means that the app should `useRouter`.
- as state can't be stored in blocking/concurrent-modes until the initial
  effect is called, `useRouter` must be able to work with only mutable state
  stored in the environment context -- at least until the initial effect is
  called.
- as changes to context passed down by `useRouter` can cause server rendered
  content to be nuked, `useRouter` can't pass update router content context
  until the first non-pending response has been rendered.
- changes to request/authentication should not be made until the initial
  non-pending route has been rendered, as it'll cause incomplete
  <Suspense> components to lose their initial content. as a result, we need
  to support an `onReady` callback to be called once the initial response
  has been rendered.
- ideally, we'd also make sure that bottom-level content has been rendered
  before calling `onReady`, as its possible for non-routing code to suspend,
  and prevent the initial client-side render of the content
- as a result of all this, it needs to be okay for router functions to be
  called multiple times with the same request. if a router function returns
  a pending response, calling the same router function with the same request
  after the pending promised has resolved should return a *different*
  response.
- we'll want to pass in a key down from a higher level, allowing router
  caches to distinguish between different requests in a SSR environment
- its okay to update the context if the actual request location changes,
  as that means the user has navigated, and nuking the initial content
  now may make sense.

---

the router should generally be at the top level, outside the navbar, because
the "current url" and route loading indicator are only available after the
router is called.
=> there's no need to separately export `useRequest`/`useResponse`.
=> but it may well make things clearer to create separate hooks internally.

if you need to render the navbar before some of the request is available,
e.g. before auth state is available, then you can put a `transformResponse`
outside of a `transformRequest`, and put content of everything except the
navbar inside a <Suspense>.

it probably make sense to export a <Router router onReady> component which
just renders the content and makes everything else available on context,
being careful to not update the context until the initial non-pending
response is rendered.

------

NOTE: after a pending response's promise resolves, we need to re-render
everything from the `useRouter` down, as each parent router may need
access to the new parts of the response, e.g. the status if it exists.

if there's no suspense between the thrown promise and `useRouter`, then
it'll be re-rendered from scratch. however, if there *is* a suspense
(or if we're in legacy mode), it'll need to be manually re-rendered through
a state update.

if we *do* need to schedule an update using a state change, we want to
make sure that the promise in the deeper component doesn't resolve until
the `useRouter` state has updated.

the issue is that re-rendering the <Suspense> with different props/context
nuke the initial content.

=> context needs to be designed so that it doesn't need an updates from its
   original pending value until a complete response is available
=> routers should be designed to not change content props based on async
   child responses

Q: how do we avoid nuking initial content in nested <Suspense>es after the
   router itself has hydrated, and subsequent updates result in new content
   elements?
A: during hydration, we leave content updates to suspense. each async router
   renders a <Wrapper> element that never changes for the duration of a
   single request. When rendered, it throws a promise until its content is
   ready, at which point it starts rendering its child's content.

---

Q: on the server, if `initialResponse` is provided (which it needs to be at
   least for the moment as suspense doesn't work during server rendering),
   then the initial render will have access to any headers/etc. that the
   endpoint adds to the response. however, on the client, these won't become
   available until the response goes non-pending.

   This opens up a possibility of the server/client rendering different
   things, as the client hook initially may return a different response to
   that of the server hook.

   Another situation where this issue can occur is in `transformResponse`.
   Here, if the dev sets the content to be conditional based on the child
   response, the content can change.

   How can we prevent this? It feels like we probably don't actually want to
   return the full Response object from useRouter at all, and probably want
   some way of verifying that the developer isn't making content vay based
   on child response. Maybe instead of `transformResponse`, we want
   `transformContent: (content, req) => content`
   and
   `injectResponse: (req) => partialResponse`
   basically because we never want the user to be able to make the response
   at one level vary based on the response at a deeper level.

   Is there a way to specify route metadata at the route level, and have
   it accessible during SSR and at the top level, without causing partial
   hydration issues?

A: responses aren't returned. instead, a mutable response is passed as the
   second argument to the router. the router returns content, and should
   always return the same content for the same request. when a response
   is still pending, the router mutates the `pending` promise on the response.
   When not in concurrent mode, the router just doesn't update
   the returned content until it's no longer waiting for a pending response.

   this makes the entire API simpler. routers really are just req => content,
   and they only need to be called once for each request; pending promises
   cause `useRouter` to check for another pending promise, but they don't
   require the router to be re-run. this means they don't even need to be
   memoized, although memoizing things like the transformRequest function
   using `memoizeRequestFunction` makes sense, as it'll allow async functions
   to be skipped if possible when the request updates due to something that
   is unrelated to the function, e.g. an auth update. but something like
   `transformContent` is no longer necessary; just use a function. and
   something like synchronously adding auth info can be done with a plain
   function too.
