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
  const user = useSelector((s) => s.user.user)
  const dispatch = useDispatch()
  // function newHandleKeyPress(event) {
  //   handleKeyPress(event)
  //   if (event.charCode === 13) {
  //     history.push(`/${event.target.value}`)
  //   }
  // }
  useEffect(() => {
    if (!user.cart) {
      setMiddleLink({ path: '/signup', title: 'Sign up' })
      setLeftLink({ path: '/login', title: 'Login' })
    } else {
      setMiddleLink(middle)
      setLeftLink(left)
    }
  }, [user.cart])

  return (
    <header className="sm:flex bg-gray-900 p-6 mb-2 shadow-2xl">
      <div className="sm:flex items-center flex-1">
        <div className="header-text" id="repository-name">
          <Link to={center.path}>{center.title}</Link>
        </div>
        {/* <input
          id="username"
          type="text"
          onKeyPress={newHandleKeyPress}
          placeholder="username"
          className="m-2 p-1 bg-gray-200 w-40 pl-2 outline-none rounded-full bg-gray-800 text-white"
        /> */}
      </div>
      <nav className="flex flex-col-reverse sm:flex-row sm:justify-end sm:items-center flex-auto">
        <div className="header-text">
          <button
            type="button"
            onClick={() => {
              history.push(leftLink.path)
            }}
          >
            {leftLink.title}
          </button>
        </div>
        <div className="header-text">
          <button
            type="button"
            onClick={() => {
              history.push(middleLink.path)
            }}
          >
            {middleLink.title}
          </button>
        </div>
        {isLogged ? (
          <div className="header-text">
            <button
              type="button"
              onClick={() => {
                dispatch(logout())
                localStorage.removeItem('token')
              }}
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
