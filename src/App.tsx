import { History, Location } from 'history'
import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'

import { AppLayout } from 'components/appLayout'

import { NavigationContext } from 'contexts/navigationContext'

import Join from 'routes/join'
import Landing from 'routes/landing'
import Legal from 'routes/legal'
import Login from 'routes/login'
import NotFound from 'routes/404'
import Profile from 'routes/profile'
import RecoverAccount from 'routes/recoverAccount'
import Settings from 'routes/settings'

import { normalizeLocation } from 'utils/normalizeLocation'

function getRoute(location: Location) {
  switch (location.pathname.slice(1).split('/')[0]) {
    case '':
      return <Landing />

    case 'join':
      return <Join />

    case 'legal':
      return <Legal />

    case 'login':
      return <Login />

    case 'profile':
      return <Profile />

    case 'recover':
      return <RecoverAccount />

    case 'settings':
      return <Settings />

    default:
      return <NotFound />
  }
}

interface AppProps {
  history: History
}

function App(props: AppProps) {
  const { history } = props
  const [location, setLocation] = useState(normalizeLocation(history.location))

  const navigationContext = useMemo(
    () => ({
      location,
      navigate: (path: string) => history.push(path),
    }),
    [history, location],
  )

  useEffect(() => {
    const unlisten = history.listen(({ location }) => {
      const normalizedLocation = normalizeLocation(location)
      if (normalizedLocation.pathname !== location.pathname) {
        history.replace(normalizedLocation)
      } else {
        setLocation(normalizedLocation)
      }
    })

    return unlisten
  }, [history])

  return (
    <NavigationContext.Provider value={navigationContext}>
      <AppLayout>{getRoute(location)}</AppLayout>
    </NavigationContext.Provider>
  )
}

export default App
