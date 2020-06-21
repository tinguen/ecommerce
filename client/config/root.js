/* eslint-disable react/jsx-props-no-spreading */
import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { Switch, Route, Redirect, StaticRouter } from 'react-router-dom'

import store, { history } from '../redux'

import Home from '../components/home'
import DummyView from '../components/dummy-view'
import NotFound from '../components/404'
import i18n, { getLanguage } from './i18n'

import Startup from './startup'

const OnlyAnonymousRoute = ({ component: Component, ...rest }) => {
  const func = (props) =>
    !!rest.user && !!rest.user.name && !!rest.token ? (
      <Redirect to={{ pathname: '/' }} />
    ) : (
      <Component {...props} />
    )
  return <Route {...rest} render={func} />
}

const PrivateRoute = ({ component: Component, ...rest }) => {
  const func = (props) =>
    !!rest.user && !!rest.user.name && !!rest.token ? (
      <Component {...props} />
    ) : (
      <Redirect
        to={{
          pathname: '/login'
        }}
      />
    )
  return <Route {...rest} render={func} />
}

const types = {
  component: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string
  }),
  token: PropTypes.string
}

const defaults = {
  location: {
    pathname: ''
  },
  user: null,
  token: ''
}

OnlyAnonymousRoute.propTypes = types
PrivateRoute.propTypes = types

PrivateRoute.defaultProps = defaults
OnlyAnonymousRoute.defaultProps = defaults

const RouterSelector = (props) =>
  typeof window !== 'undefined' ? <ConnectedRouter {...props} /> : <StaticRouter {...props} />

const languages = 'en|ru|uk'

const RootComponent = (props) => {
  return (
    <Suspense fallback="loading">
      <Provider store={store}>
        <RouterSelector history={history} location={props.location} context={props.context}>
          <Startup>
            <Switch>
              <PrivateRoute exact path="/hidden-route" component={() => <DummyView />} />
              <Route exact path={`/:language(${languages})/`} component={() => <Home />} />
              <Route exact path={`/:language(${languages})/*`} component={() => <Home />} />
              <Route exact path="/*" component={() => <Home />} />
              <Route component={() => <NotFound />} />
            </Switch>
          </Startup>
        </RouterSelector>
      </Provider>
    </Suspense>
  )
}

export default RootComponent

export function changeLanguage(locale) {
  if (window.location.pathname === '/') {
    history.push(`/${locale}`)
  }
  history.push(window.location.pathname.replace(getLanguage(), locale))
  i18n.changeLanguage(locale)
}
