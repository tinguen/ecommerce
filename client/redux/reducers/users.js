import axios from 'axios'
import { history } from '../index'

const initialState = { user: { cart: [] }, isLogged: false, cart: {}, total: 0 }
const SET_USERNAME = 'SET_USERNAME'
const LOGOUT = 'LOGOUT'
const SET_COUNTER_CART = 'SET_COUNTER_CART'
const ADD_TO_CART = 'ADD_TO_CART'
const REMOVE_FROM_CART = 'REMOVE_FROM_CART'
const CLEAR_CART = 'CLEAR_CART'
const FETCH_STATE = 'FETCH_STATE'
const SET_TOTAL = 'SET_TOTAL'
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USERNAME: {
      return { ...state, isLogged: true, user: action.user }
    }
    case LOGOUT: {
      return { ...state, user: { cart: [] }, isLogged: false }
    }
    case SET_COUNTER_CART: {
      let cart = [...state.user.cart]
      const index = cart.map((pr) => pr.productId).indexOf(action.id)
      if (index === -1 && action.counter === 0) return state
      if (index === -1) cart = [...cart, { productId: action.id, counter: action.counter }]
      if (action.counter > 0) cart[index] = { productId: action.id, counter: action.counter }
      if (action.counter === 0)
        cart = [...cart.slice(0, index, ...cart.slice(index + 1, cart.length))]
      return { ...state, user: { ...state.user, cart } }
    }
    case ADD_TO_CART: {
      let cart = [...state.user.cart]
      const index = cart.map((pr) => pr.productId).indexOf(action.id)
      if (index === -1) cart = [...cart, { productId: action.id, counter: 1 }]
      else {
        cart[index] = { ...cart[index], counter: cart[index].counter + 1 }
      }
      return { ...state, user: { ...state.user, cart } }
    }
    case REMOVE_FROM_CART: {
      const cart = [...state.user.cart]
      const index = cart.map((pr) => pr.productId).indexOf(action.id)
      if (index === -1) return state
      if (cart[index].counter === 1)
        return {
          ...state,
          user: {
            ...state.user,
            cart: [...cart.slice(0, index), ...cart.slice(index + 1, cart.length)]
          }
        }
      cart[index] = { ...cart[index], counter: cart[index].counter - 1 }
      return { ...state, user: { ...state.user, cart } }
    }
    case CLEAR_CART: {
      return { ...state, user: { ...state.user, cart: [] } }
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

export function setCounterCart(productId, newCounter) {
  return (dispatch, getState) => {
    const store = getState()
    if (!store.user.user.cart) {
      history.push('/login', { direction: 'GO_BACK' })
      return store.user
    }
    const counter = store.user.cart[productId]
    const diff = parseInt(newCounter, 10) - (counter || 0)
    if (!(typeof diff === 'number')) return counter
    return dispatch({ type: SET_COUNTER_CART, id: productId, counter: parseInt(newCounter, 10) })
  }
}

export function addToCart(productId) {
  return { type: ADD_TO_CART, id: productId }
}

export function removeFromCart(productId) {
  return { type: REMOVE_FROM_CART, id: productId }
}

export function clearCart() {
  return { type: CLEAR_CART }
}

export function getCurrentUser() {
  return (dispatch, getState) => {
    const store = getState()
    if (store.user.user && store.user.user.cart.length) return store
    const token = localStorage.getItem('token')
    if (!token) return store
    const baseUrl = window.location.origin
    const AuthStr = `Bearer ${token}`
    return axios
      .get(`${baseUrl}/api/v1/users/current`, { headers: { Authorization: AuthStr } })
      .then(({ data }) => {
        dispatch({ type: SET_USERNAME, user: { ...data, token } })
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
  return async (dispatch, getState) => {
    const store = getState()
    const { cart } = store.user.user
    const { products } = store.product
    // if (!products.length ) return store.product.total
    const getProduct = (id) => products.filter((product) => product.id === id)[0]
    const total = await cart.reduce(async (acc, rec) => {
      let product = getProduct(rec.productId)
      if (!product) {
        const baseUrl = window.location.origin
        try {
          const { data } = await axios.get(`${baseUrl}/api/v1/products/${rec.productId}`)
          product = data
        } catch (e) {
          product = { price: 0 }
        }
      }
      return acc + product.price * rec.counter
    }, 0)
    dispatch({ type: SET_TOTAL, total })
    return total
  }
}
