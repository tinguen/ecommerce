import React, { useEffect } from 'react'
// eslint-disable-next-line no-unused-vars
import { Switch, Route, Redirect, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Head from './head'
import Header from './header'
import RegisterView from './signup'
import LoginView from './login'
import CreateView from './create-product'
import ProductView from './main/products-view'
import CartView from './cart/cart'
import PrivateRoute from './private-route'
import Profile from './profile/profile'
import Checkout from './checkout'
import ThankYou from './thank-you/thank-you'
import Verify from './verify/verify'
import Product from './product/product'
import { getCurrentUser, fetchState } from '../redux/reducers/users'
import { fetchOnLoad, setLimit } from '../redux/reducers/products'
import { history } from '../redux'

const Home = () => {
  const [, i18n] = useTranslation()
  const dispatch = useDispatch()
  const isLogged = useSelector((s) => s.user.isLogged)
  const { language: lng } = useParams()
  const languages = 'en|ru|uk'

  useEffect(() => {
    const lngs = languages.split('|')
    if (!lngs.includes(i18n.language)) {
      i18n.changeLanguage('en')
      history.push('/en')
    }
  }, [i18n])

  useEffect(() => {
    let limit = 10
    const width = window.innerWidth
    if (width > 640) limit = 12
    dispatch(setLimit(limit))
    dispatch(fetchState())
    dispatch(getCurrentUser())
    dispatch(fetchOnLoad())
  }, [dispatch])

  useEffect(() => {
    i18n.changeLanguage(lng)
  }, [i18n, lng])

  return (
    <div className="bg-gray-200 min-h-screen">
      <Head title="Home" />
      <Header />
      <Switch>
        {/* <Route exact path="/" component={() => <ProductView />} /> */}
        <Route exact path={`/:lng(${languages})`}>
          <ProductView />
        </Route>
        <Route exact path="/">
          <Redirect to={`/${i18n.language}`} />
        </Route>
        <Route
          exact
          path="/:path"
          render={(props) => <Redirect to={`/${i18n.language}/${props.match.params.path}`} />}
        />
        <PrivateRoute
          exact
          path={`/:lng(${languages})/profile`}
          isLogged={isLogged}
          component={() => <Profile />}
        />
        <Route exact path={`/:lng(${languages})/signup`}>
          <RegisterView />
        </Route>
        <Route exact path={`/:lng(${languages})/login`}>
          <LoginView />
        </Route>
        <PrivateRoute
          exact
          path={`/:lng(${languages})/create`}
          isLogged={isLogged}
          component={() => <CreateView />}
        />
        <Route exact path={`/:lng(${languages})/cart`}>
          <CartView />
        </Route>
        <Route exact path={`/:lng(${languages})/checkout`}>
          <Checkout />
        </Route>
        <Route exact path={`/:lng(${languages})/thankyou`}>
          <ThankYou />
        </Route>
        <Route exact path={`/:lng(${languages})/verify/:token`}>
          <Verify />
        </Route>
        <Route exact path={`/:lng(${languages})/product/:id`}>
          <Product />
        </Route>
        {/* <Route
          exact
          path={`/:lng(${languages})/*`}
          render={(props) => <Redirect to={`${i18n.language}/${props.match.params[0]}`} />}
        /> */}
        <Route
          exact
          path="/:path/:secondPath"
          render={(props) => (
            <Redirect
              to={`/${i18n.language}/${props.match.params.path}/${props.match.params.secondPath}`}
            />
          )}
        />
      </Switch>
    </div>
  )
}

Home.propTypes = {}

export default Home
