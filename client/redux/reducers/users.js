import axios from 'axios'
import { history } from '../index'

const initialState = { user: {}, isLogged: false, cart: {}, total: 0 }
const SET_USERNAME = 'SET_USERNAME'
const LOGOUT = 'LOGOUT'
const ADD_TO_CART = 'ADD_TO_CART'
const REMOVE_FROM_CART = 'REMOVE_FROM_CART'
const FETCH_STATE = 'FETCH_STATE'
const SET_TOTAL = 'SET_TOTAL'
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USERNAME: {
      return { ...state, isLogged: true, user: action.user }
    }
    case LOGOUT: {
      return { ...state, user: {}, isLogged: false }
    }
    case ADD_TO_CART: {
      const cart = { ...state.cart }
      if (cart[action.id]) cart[action.id] += 1
      else cart[action.id] = 1
      return { ...state, user: { ...state.user, cart: [...state.user.cart, action.id] }, cart }
    }
    case REMOVE_FROM_CART: {
      const { cart: userCart } = state.user
      const index = userCart.indexOf(action.id)
      if (!(index > -1)) return state
      const cart = { ...state.cart }
      cart[action.id] -= 1
      const newCart = [...userCart.slice(0, index), ...userCart.slice(index + 1, userCart.length)]
      return { ...state, user: { ...state.user, cart: newCart }, cart }
    }
    case FETCH_STATE: {
      return { ...state }
    }
    case SET_TOTAL: {
      return { ...state, total: action.total }
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
    if (store.user.user && store.user.user.cart) return store
    const token = localStorage.getItem('token')
    if (!token) return store
    const baseUrl = window.location.origin
    const AuthStr = `Bearer ${token}`
    return axios
      .get(`${baseUrl}/api/v1/users/current`, { headers: { Authorization: AuthStr } })
      .then(({ data }) => {
        dispatch({ type: SET_USERNAME, user: data })
        return data
      })
      .catch(() => localStorage.removeItem('token'))
  }
}

export function logout() {
  return { type: LOGOUT }
}

export function fetchState() {
  return { type: FETCH_STATE }
}

export function getTotal() {
  return (dispatch, getState) => {
    const store = getState()
    const { cart } = store.user
    const { products } = store.product
    const getProduct = (id) => products.filter((product) => product.id === id)[0]
    const total = Object.entries(cart).reduce((acc, rec) => {
      return acc + getProduct(rec[0]).price * rec[1]
    }, 0)
    dispatch({ type: SET_TOTAL, total })
    return total
  }
}
