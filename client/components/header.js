import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
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
  const ref = useRef()
  const [middleLink, setMiddleLink] = useState(middle)
  const [leftLink, setLeftLink] = useState(left)
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
    console.log(ref)
  }, [isLogged])

  return (
    <header ref={ref} className="bg-white sm:flex p-6 mb-2 shadow sm:sticky sm:top-0 z-10">
      <div className="sm:flex items-center flex-1">
        <div className="">
          <Link to={center.path} className="header-text header-text-border focus:outline-none">
            {center.title}
          </Link>
        </div>
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
