import axios from 'axios'
import addCurrentPrice from '../../components/utils/product'

export const filterOptions = {
  category: {
    all: 'ALL'
  },
  sortBy: {
    initial: 'INITIAL',
    nameUp: 'NAME_UPWARDS',
    nameDown: 'NAME_DOWNWARDS',
    priceUp: 'PRICE_UPWARDS',
    priceDown: 'PRICE_DOWNWARDS'
  },
  sortOrder: {
    initial: 'INITIAL',
    byName: 'title',
    byPrice: 'price'
  },
  currency: {
    euro: 'EUR',
    dollar: 'USD',
    canadianDollar: 'CAD'
  },
  limit: 10,
  page: 1
}
const initialState = {
  products: [],
  displayProducts: [],
  currentCurrency: filterOptions.currency.euro,
  rates: {},
  filters: {
    category: filterOptions.category.all,
    sortBy: filterOptions.sortBy.initial,
    sortOrder: [],
    limit: 10,
    page: 1,
    currentSize: 0
  }
}
const SET_PRODUCT = 'SET_PRODUCT'
const SET_DISPLAY_PRODUCT = 'SET_DISPLAY_PRODUCT'
const CLEAR_PRODUCT = 'CLEAR_PRODUCT'
const SET_FILTER = 'SET_FILTER'
const SET_CURRENCY = 'SET_CURRENCY'
const SET_CURRENCY_RATES = 'SET_CURRENCY_RATES'
const SET_PAGE = 'SET_PAGE'
const SET_LIMIT = 'SET_LIMIT'
const SET_CURRENT_SIZE = 'SET_CURRENT_SIZE'
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
      return { ...state, filters: action.filters }
    }
    case SET_CURRENCY: {
      return { ...state, currentCurrency: action.currency }
    }
    case SET_CURRENCY_RATES: {
      return { ...state, rates: action.rates }
    }
    case SET_PAGE: {
      return { ...state, filters: { ...state.filters, page: action.page } }
    }
    case SET_LIMIT: {
      return { ...state, filters: { ...state.filters, limit: action.limit } }
    }
    case SET_CURRENT_SIZE: {
      return { ...state, filters: { ...state.filters, currentSize: action.currentSize } }
    }
    default:
      return state
  }
}

export function updateProducts(products) {
  return { type: SET_PRODUCT, products }
}

export function fetchCurrentSize() {
  return (dispatch, getState) => {
    const { category } = getState().product.filters
    const baseUrl = window.location.origin
    if (category === filterOptions.category.all) {
      return axios
        .get(`${baseUrl}/api/v1/products/size`)
        .then(({ data }) => dispatch({ type: SET_CURRENT_SIZE, currentSize: data.size }))
        .catch(() => {})
    }
    return axios
      .get(`${baseUrl}/api/v1/products/category/${category}/size`)
      .then(({ data }) => dispatch({ type: SET_CURRENT_SIZE, currentSize: data.size }))
      .catch(() => {})
  }
}

export function fetchProducts() {
  return (dispatch, getState) => {
    const baseUrl = window.location.origin
    const rate = getState().product.rates[getState().product.currentCurrency]
    const { limit } = getState().product.filters
    const { page } = getState().product.filters
    return axios
      .get(`${baseUrl}/api/v1/products/chunks`, { params: { limit, page } })
      .then(({ data }) => {
        dispatch({
          type: SET_PRODUCT,
          products: data.map((product) => ({
            ...product,
            currentPrice: (product.price * rate).toFixed(2)
          }))
        })
        dispatch(fetchCurrentSize())
      })
      .catch(() => {})
  }
}

export function setSortBy(sortBy, sortOrder = []) {
  // const sortByOrder = (arr) => {
  //   if (!sortOrder.length) return arr
  //   sortOrder.reduce((acc, rec) => {

  //   }, 0)
  // }
  return (dispatch, getState) => {
    const { products } = getState().product
    let { displayProducts } = getState().product
    const { filters } = getState().product
    let sortOrderArr = sortOrder
    if (!Array.isArray(sortOrderArr)) sortOrderArr = [sortOrder]
    switch (sortBy) {
      case filterOptions.sortBy.initial: {
        if (
          filters.category === filterOptions.category.all ||
          filters.sortBy === filterOptions.sortBy.initial
        ) {
          // displayProducts = [...getState().product.displayProducts]
          displayProducts = [...products]
        }
        // else if (filters.sortBy === filterOptions.sortBy.initial) {
        //   displayProducts = [...products]
        // }
        else {
          displayProducts = [...products.filter((product) => product.category === filters.category)]
        }

        break
      }
      case filterOptions.sortBy.priceUp: {
        displayProducts.sort((first, second) => (first.price >= second.price ? 1 : -1))
        break
      }
      case filterOptions.sortBy.priceDown: {
        displayProducts.sort((first, second) => (first.price < second.price ? 1 : -1))
        break
      }
      case filterOptions.sortBy.nameUp: {
        displayProducts.sort((first, second) => first.title.localeCompare(second.title))
        break
      }
      case filterOptions.sortBy.nameDown: {
        displayProducts.sort((first, second) => second.title.localeCompare(first.title))
        break
      }
      default:
    }
    dispatch({ type: SET_DISPLAY_PRODUCT, displayProducts: [...displayProducts] })
    dispatch({ type: SET_FILTER, filters: { ...filters, sortBy, sortOrder } })
  }
}

export function setFilter(filters) {
  return { type: SET_FILTER, filters }
}

export function setDisplayProductsByCategory(category) {
  let categoryArr = []
  return (dispatch, getState) => {
    const { products } = getState().product
    const { filters } = getState().product
    if (category === filterOptions.category.all) {
      dispatch({ type: SET_DISPLAY_PRODUCT, displayProducts: products })
      dispatch(setSortBy(filters.sortBy))
      dispatch(setFilter({ ...filters, category }))
      return products.slice()
    }
    if (!Array.isArray(category)) categoryArr = [category]
    else categoryArr = category
    const baseUrl = window.location.origin
    const categories = categoryArr
      .reduce((acc, rec) => {
        return `${acc}${rec},`
      }, '')
      .slice(0, -1)
    const { limit } = getState().product.filters
    const { page } = getState().product.filters
    return axios
      .get(`${baseUrl}/api/v1/products/categories-chunks`, { params: { categories, limit, page } })
      .then(({ data }) => {
        dispatch({ type: SET_DISPLAY_PRODUCT, displayProducts: addCurrentPrice(data) })
        dispatch(setFilter({ ...filters, category }))
        dispatch(fetchCurrentSize())
        if (!filters.sortBy === filterOptions.sortBy.initial) dispatch(setSortBy(filters.sortBy))
      })
      .catch((err) => console.log(err))
  }
}

export function clearProducts() {
  return { type: CLEAR_PRODUCT }
}

export function setCurrency(currency) {
  return (dispatch, getState) => {
    if (Object.values(filterOptions.currency).includes(currency)) {
      const rate = getState().product.rates[currency]
      const { products } = getState().product
      const { displayProducts } = getState().product
      dispatch({ type: SET_CURRENCY, currency })
      dispatch({
        type: SET_PRODUCT,
        products: products.map((product) => ({
          ...product,
          currentPrice: (product.price * rate).toFixed(2)
        }))
      })
      dispatch({
        type: SET_DISPLAY_PRODUCT,
        displayProducts: displayProducts.map((product) => ({
          ...product,
          currentPrice: (product.price * rate).toFixed(2)
        }))
      })
    }
    dispatch({ type: '' })
  }
}

export function fetchCurrencyRates() {
  return (dispatch) => {
    const baseUrl = window.location.origin
    return axios
      .get(`${baseUrl}/api/v1/products/currency`)
      .then(({ data }) => {
        const rates = { ...data.rates }
        rates[filterOptions.currency.euro] = 1
        dispatch({ type: SET_CURRENCY_RATES, rates })
      })
      .catch(() => {})
  }
}

export function setPage(page) {
  return (dispatch, getState) => {
    dispatch({ type: SET_PAGE, page })
    const { category } = getState().product.filters
    if (category === filterOptions.category.all) {
      return dispatch(fetchProducts()).then(() => dispatch(setDisplayProductsByCategory(category)))
    }
    return dispatch(setDisplayProductsByCategory(category))
  }
}

export function setLimit(limit) {
  return { type: SET_LIMIT, limit }
}

export function fetchOnLoad() {
  return (dispatch) => {
    return dispatch(fetchCurrencyRates()).then(() => {
      dispatch(fetchProducts())
    })
  }
}
