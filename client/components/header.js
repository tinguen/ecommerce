import React, { useState, useEffect } from 'react'
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
  }, [isLogged])

  return (
    <header className="bg-white sm:flex p-6 mb-2 shadow">
      <div className="sm:flex items-center flex-1">
        <div className="">
          <Link to={center.path} className="header-text header-text-border">
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
            className="header-text header-text-border"
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
              className="header-text header-text-border"
            >
              {middleLink.title}
            </button>
          </div>
        ) : (
          ''
        )}
        {/* <div className="header-text">
          <button
            type="button"
            onClick={() => {
              history.push(middleLink.path)
            }}
          >
            {middleLink.title}
          </button>
        </div> */}
        <span className="relative">
          <button
            type="button"
            onClick={() => {
              history.push('/cart')
            }}
            className="header-text header-text-border"
          >
            <span className="relative">
              Cart
              <div className="absolute text-xs text-center align-middle w-3 h-4 font-hairline rounded-full bg-red-600 text-white -top-2 -right-3">
                {cart.length}
              </div>
            </span>
          </button>
          {/* <div className="absolute text-xs text-center align-middle w-3 h-4 font-hairline rounded-full bg-red-600 text-white top-0 right-0">
            {cart.length}
          </div> */}
        </span>
        {isLogged ? (
          <div>
            <button
              type="button"
              onClick={() => {
                dispatch(logout())
                localStorage.removeItem('token')
              }}
              className="header-text header-text-border"
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
