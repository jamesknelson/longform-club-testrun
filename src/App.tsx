import { History, Path, parsePath } from 'history'
import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'

import { AppLayout } from 'components/appLayout'

import { NavigationContext } from 'contexts/navigationContext'

import { getRouteMatchAndRedirect } from 'utils/routing'

import indexRouter from './routers'

interface AppProps {
  history: History
  initialRoute: React.ReactElement | null
}

function App(props: AppProps) {
  const { history, initialRoute } = props
  const [navigationState, setNavigationState] = useState({
    location: history.location as Path,
    route: initialRoute,
  })

  const [currentUser, setCurrentUser] = useState(null)

  const navigationContext = useMemo(
    () => ({
      ...navigationState,
      navigate: (path: string) =>
        history.push({ search: '', hash: '', ...parsePath(path) }),
    }),
    [history, navigationState],
  )

  useEffect(() => {
    const [route, redirectLocation] = getRouteMatchAndRedirect(
      indexRouter,
      history.location,
      {
        currentUser: null,
      },
    )
    if (redirectLocation) {
      history.replace(redirectLocation)
    }
    setNavigationState({
      location: redirectLocation || history.location,
      route: route,
    })

    const unlisten = history.listen(({ location }) => {
      const [route, redirectLocation] = getRouteMatchAndRedirect(
        indexRouter,
        location,
        {
          // TODO
          currentUser: null,
        },
      )
      if (redirectLocation) {
        history.replace(redirectLocation)
      }
      setNavigationState({
        location: redirectLocation || location,
        route: route,
      })
    })

    return unlisten
  }, [currentUser, history])

  return (
    <NavigationContext.Provider value={navigationContext}>
      <AppLayout>{navigationState.route}</AppLayout>
    </NavigationContext.Provider>
  )
}

export default App
