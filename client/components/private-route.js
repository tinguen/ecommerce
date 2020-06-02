import React from 'react'
import { Redirect, Route } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => {
  console.log(rest)
  const func = (props) =>
    localStorage.getItem('token') || rest.isLogged ? (
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

PrivateRoute.propTypes = {}

export default PrivateRoute
