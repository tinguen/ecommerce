import React, { useState, useEffect } from 'react'
import { Link, Switch, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { history } from '../redux'
import { logout } from '../redux/reducers/users'

const Header = (props) => {
  // eslint-disable-next-line no-unused-vars
  const {
    center = { path: '/', title: 'Shop' },
    middle = { path: '/cart', title: 'Cart' },
    right = { path: '/logout', title: 'Logout' },
    left = { path: '/create', title: 'Add new product' }
  } = props
  const [middleLink, setMiddleLink] = useState(middle)
  const [leftLink, setLeftLink] = useState(left)
  const [isCategoryHovered, setIsCategoryHovered] = useState(false)
  const [categories, setCategories] = useState([])
  const isLogged = useSelector((s) => s.user.isLogged)
  const cart = useSelector((s) => s.user.user.cart)
  const dispatch = useDispatch()
  useEffect(() => {
    if (!isLogged) {
      setMiddleLink({ path: '/signup', title: 'Sign up' })
      setLeftLink({ path: '/login', title: 'Login' })
    } else {
      setMiddleLink(middle)
      setLeftLink(left)
    }
  }, [isLogged])

  useEffect(() => {
    const baseUrl = window.location.origin
    axios
      .get(`${baseUrl}/api/v1/products/category`)
      .then(({ data }) => setCategories(data))
      .catch((err) => console.log(err))
  }, [])

  return (
    <header className="bg-white sm:flex p-6 mb-2 shadow">
      <div className="sm:flex items-center flex-1">
        <div className="">
          <Link to={center.path} className="header-text header-text-border focus:outline-none">
            {center.title}
          </Link>
        </div>
        <Switch>
          <Route exact path="/">
            <button
              type="button"
              onMouseEnter={() => setIsCategoryHovered(true)}
              onMouseLeave={() => setIsCategoryHovered(false)}
              className="relative focus:outline-none border-none"
            >
              <div className="header-text w-32 text-left">Category</div>
              <ul className={`${isCategoryHovered ? 'absolute' : 'hidden'} w-auto bg-white`}>
                {categories.map((category) => {
                  return (
                    <li key={category} className="pl-2 pr-2">
                      {category}
                    </li>
                  )
                })}
              </ul>
            </button>
          </Route>
        </Switch>
      </div>
      <nav className="flex flex-col-reverse sm:flex-row sm:justify-end sm:items-center flex-auto">
        <div>
          <button
            type="button"
            onClick={() => {
              history.push(leftLink.path)
            }}
            className="header-text header-text-border focus:outline-none"
          >
            {leftLink.title}
          </button>
        </div>
        {!isLogged ? (
          <div>
            <button
              type="button"
              onClick={() => {
                history.push(middleLink.path)
              }}
              className="header-text header-text-border focus:outline-none"
            >
              {middleLink.title}
            </button>
          </div>
        ) : (
          ''
        )}
        <span className="relative">
          <button
            type="button"
            onClick={() => {
              history.push('/cart')
            }}
            className="header-text header-text-border focus:outline-none"
          >
            <span className="relative">
              Cart
              <div className="absolute text-xs text-center align-middle w-3 h-4 rounded-full bg-red-600 text-white -top-2 -right-3">
                {cart.length}
              </div>
            </span>
          </button>
        </span>
        {isLogged ? (
          <div>
            <button
              type="button"
              onClick={() => {
                dispatch(logout())
                localStorage.removeItem('token')
              }}
              className="header-text header-text-border focus:outline-none"
            >
              {right.title}
            </button>
          </div>
        ) : (
          ''
        )}
      </nav>
    </header>
  )
}

Header.propTypes = {}

export default Header
