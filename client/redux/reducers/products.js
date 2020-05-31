import axios from 'axios'

const initialState = { products: [] }
const SET_PRODUCT = 'SET_PRODUCT'
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCT: {
      return { ...state, products: action.products }
    }
    default:
      return state
  }
}

export function updateProducts(products) {
  return { type: SET_PRODUCT, products }
}

export function getProducts() {
  return (dispatch) => {
    const baseUrl = window.location.origin
    return axios
      .get(`${baseUrl}/api/v1/products`)
      .then(({ data }) => dispatch({ type: SET_PRODUCT, products: data }))
  }
}
