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