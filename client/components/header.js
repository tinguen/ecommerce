import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { history } from '../redux'
import { logout } from '../redux/reducers/users'
import { setCurrency, filterOptions } from '../redux/reducers/products'
import { changeLanguage } from '../config/root'

const Header = (props) => {
  const { t, i18n } = useTranslation()
  const [translation, setTranslation] = useState(t('header', { returnObjects: true }))
  const {
    center = { path: '/', title: translation.title },
    middle = { path: '/cart', title: translation.cart },
    right = { path: '/logout', title: translation.logout },
    left = { path: '/profile', title: translation.profile }
  } = props
  const [middleLink, setMiddleLink] = useState(middle)
  const [leftLink, setLeftLink] = useState(left)
  const isLogged = useSelector((s) => s.user.isLogged)
  const cart = useSelector((s) => s.user.user.cart)
  const currency = useSelector((s) => s.product.currentCurrency)
  const dispatch = useDispatch()
  const [languageDropdown, setLanguageDropdown] = useState(false)
  useEffect(() => {
    if (!isLogged) {
      setMiddleLink({ path: '/signup', title: translation.signUp })
      setLeftLink({ path: '/login', title: translation.login })
    } else {
      setMiddleLink(middle)
      setLeftLink(left)
    }
  }, [isLogged, translation.login, translation.signUp])

  useEffect(() => {
    setTranslation(t('header', { returnObjects: true }))
  }, [t, i18n.language])

  return (
    <header className="bg-white sm:flex p-6 mb-2 shadow sm:sticky sm:top-0 z-10">
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
            onClick={() => dispatch(setCurrency(filterOptions.currency.dollar))}
            className={`${currency === 'USD' ? 'underline' : ''} focus:outline-none m-2`}
          >
            USD
          </button>
          <button
            type="button"
            onClick={() => dispatch(setCurrency(filterOptions.currency.euro))}
            className={`${currency === 'EUR' ? 'underline' : ''} focus:outline-none m-2`}
          >
            EUR
          </button>
          <button
            type="button"
            onClick={() => dispatch(setCurrency(filterOptions.currency.canadianDollar))}
            className={`${currency === 'CAD' ? 'underline' : ''} focus:outline-none m-2`}
          >
            CAD
          </button>
        </div>
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
        <span className="">
          <button
            type="button"
            onClick={() => {
              history.push('/cart')
            }}
            className="header-text header-text-border focus:outline-none"
          >
            <span className="relative">
              {translation.cart}
              <div className="absolute text-xs text-center align-middle pl-1 pr-1 rounded-full bg-red-600 text-white -top-2 -right-4 shadow">
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
        <div className="relative inline-block text-left">
          <div>
            <span className="rounded-md shadow-sm">
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md pr-4 ml-2 py-2 bg-white text-sm leading-5 font-medium focus:outline-none text-gray-700 transition ease-in-out duration-150"
                id="options-menu"
                aria-haspopup="true"
                aria-expanded="true"
                onClick={() => setLanguageDropdown(!languageDropdown)}
              >
                {i18n.language}
              </button>
            </span>
          </div>
          <div
            className={`${
              languageDropdown ? 'block' : 'hidden'
            } absolute origin-top-right right-0 w-8 rounded-md shadow-lg mt-2`}
          >
            <div className="rounded-md bg-white shadow-xs">
              <button
                type="button"
                className="p-1 hover:underline"
                onClick={() => {
                  changeLanguage('ru')
                  setLanguageDropdown(!languageDropdown)
                }}
              >
                ru
              </button>
              <button
                type="button"
                className="p-1 hover:underline"
                onClick={() => {
                  changeLanguage('uk')
                  setLanguageDropdown(!languageDropdown)
                }}
              >
                uk
              </button>
              <button
                type="button"
                className="p-1 hover:underline"
                onClick={() => {
                  changeLanguage('en')
                  setLanguageDropdown(!languageDropdown)
                }}
              >
                en
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

Header.propTypes = {}

export default Header
