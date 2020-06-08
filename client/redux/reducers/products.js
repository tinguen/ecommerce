import axios from 'axios'

export const filterOptions = {
  category: {
    all: 'ALL'
  },
  sortBy: {
    nameUp: 'NAME_UPWARDS',
    nameDown: 'NAME_DOWNWARDS',
    priceUp: 'PRICE_UPWARDS',
    priceDown: 'PRICE_DOWNWARDS'
  }
}
const initialState = {
  products: [],
  displayProducts: [],
  filters: { category: filterOptions.category.all }
}
const SET_PRODUCT = 'SET_PRODUCT'
const SET_DISPLAY_PRODUCT = 'SET_DISPLAY_PRODUCT'
const CLEAR_PRODUCT = 'CLEAR_PRODUCT'
const SET_FILTER = 'SET_FILTER'
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCT: {
      const displayProducts = state.displayProducts.length
        ? state.displayProducts
        : [...action.products]
      return { ...state, products: action.products, displayProducts }
    }
    case SET_DISPLAY_PRODUCT: {
      return { ...state, displayProducts: action.displayProducts }
    }
    case CLEAR_PRODUCT: {
      return { ...state, ...initialState }
    }
    case SET_FILTER: {
      return { ...state, filter: action.filters }
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

export function setFilter(filters) {
  return { type: SET_FILTER, filters }
}

export function setDisplayProductsByCategory(category) {
  let categoryArr = []
  return (dispatch, getState) => {
    const store = getState()
    const { filter } = store.product
    if (!Array.isArray(category)) categoryArr = [category]
    else categoryArr = category
    const baseUrl = window.location.origin
    return axios
      .post(`${baseUrl}/api/v1/products/category`, categoryArr)
      .then(({ data }) => {
        dispatch({ type: SET_DISPLAY_PRODUCT, displayProducts: data })
        dispatch(setFilter({ ...filter, category }))
      })
      .catch((err) => console.log(err))
  }
}

export function clearProducts() {
  return { type: CLEAR_PRODUCT }
}
