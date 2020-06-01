import axios from 'axios'
import { history } from '../index'

const initialState = { user: {}, isLogged: false }
const SET_USERNAME = 'SET_USERNAME'
const LOGOUT = 'LOGOUT'
const ADD_TO_CART = 'ADD_TO_CART'
const REMOVE_FROM_CART = 'REMOVE_FROM_CART'
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USERNAME: {
      return { ...state, isLogged: true, user: action.user }
    }
    case LOGOUT: {
      return { ...state, user: {}, isLogged: false }
    }
    case ADD_TO_CART: {
      return { ...state, user: { ...state.user, cart: [...state.user.cart, action.id] } }
    }
    case REMOVE_FROM_CART: {
      const { cart } = state.user
      const index = cart.indexOf(action.id)
      if (!(index > -1)) return state
      const newCart = [...cart.slice(0, index), ...cart.slice(index + 1, cart.length)]
      return { ...state, user: { ...state.user, cart: newCart } }
    }
    default:
      return state
  }
}

export function updateUsername(user) {
  return { type: SET_USERNAME, user }
}

export function addToCart(productId) {
  return (dispatch, getState) => {
    const store = getState()
    if (!store.user.user.cart) {
      history.push('/login', { direction: 'GO_BACK' })
      return store.user
    }
    return dispatch({ type: ADD_TO_CART, id: productId })
  }
}

export function removeFromCart(productId) {
  return (dispatch, getState) => {
    const store = getState()
    if (!store.user.user.cart) {
      history.push({
        pathname: '/login',
        state: { direction: 'GO_BACK' }
      })
      return store.user
    }
    return dispatch({ type: REMOVE_FROM_CART, id: productId })
  }
}

export function getCurrentUser() {
  return (dispatch, getState) => {
    const store = getState()
    if (store.user.user && store.user.user.cart) return store.user
    const token = localStorage.getItem('token')
    if (!token) return store.user
    const baseUrl = window.location.origin
    const AuthStr = `Bearer ${token}`
    return axios
      .get(`${baseUrl}/api/v1/users/current`, { headers: { Authorization: AuthStr } })
      .then(({ data }) => dispatch({ type: SET_USERNAME, user: data }))
      .catch(() => localStorage.removeItem('token'))
  }
}

export function logout() {
  return { type: LOGOUT }
}
