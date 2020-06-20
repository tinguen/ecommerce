import React, { useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
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
// import wave from '../assets/images/wave.jpg'

const Home = () => {
  const dispatch = useDispatch()
  const isLogged = useSelector((s) => s.user.isLogged)
  // console.log(user)
  // const user = useSelector((s) => s.user.user)
  useEffect(() => {
    let limit = 10
    const width = window.innerWidth
    if (width > 640) limit = 12
    dispatch(setLimit(limit))
    dispatch(fetchState())
    dispatch(getCurrentUser())
    dispatch(fetchOnLoad())
  }, [dispatch])

  return (
    <div className="bg-gray-200 min-h-screen">
      <Head title="Home" />
      <Header />
      <Switch>
        {/* <Route exact path="/" component={() => <ProductView />} /> */}
        <Route exact path="/">
          <ProductView />
        </Route>
        <PrivateRoute exact path="/profile" isLogged={isLogged} component={() => <Profile />} />
        <Route exact path="/signup">
          <RegisterView />
        </Route>
        <Route exact path="/login">
          <LoginView />
        </Route>
        <Route exact path="/create">
          <CreateView />
        </Route>
        <Route exact path="/cart">
          <CartView />
        </Route>
        <Route exact path="/checkout">
          <Checkout />
        </Route>
        <Route exact path="/thankyou">
          <ThankYou />
        </Route>
        <Route exact path="/verify/:token">
          <Verify />
        </Route>
        <Route exact path="/product/:id">
          <Product />
        </Route>
      </Switch>
    </div>
  )
}

Home.propTypes = {}

export default Home
