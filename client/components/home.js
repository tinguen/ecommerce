import React, { useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Head from './head'
import Header from './header'
import RegisterView from './signup'
import LoginView from './login'
import CreateView from './create-product'
import ProductView from './products-view'
import CartView from './cart'
import { getCurrentUser } from '../redux/reducers/users'
// import wave from '../assets/images/wave.jpg'

const Home = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getCurrentUser())
  }, [])
  return (
    <div className="bg-blue-200 min-h-screen">
      <Head title="Home" />
      <Header />
      <Switch>
        {/* <Route exact path="/" component={() => <ProductView />} /> */}
        <Route exact path="/">
          <ProductView />
        </Route>
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
      </Switch>
    </div>
  )
}

Home.propTypes = {}

export default Home
