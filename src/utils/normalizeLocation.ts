import { Location } from 'history'

export function normalizeLocation(location: Location): Location {
  let pathname = location.pathname

  if (pathname === '/' || pathname === '') {
    pathname = '/'
  } else {
    // Add leading slash
    pathname = pathname[0] !== '/' ? '/' + pathname : pathname

    // Strip trailing slash
    pathname =
      pathname[pathname.length - 1] === '/'
        ? pathname.slice(0, pathname.length - 1)
        : pathname
  }

  return location.pathname === pathname
    ? location
    : {
        ...location,
        pathname,
      }
}
