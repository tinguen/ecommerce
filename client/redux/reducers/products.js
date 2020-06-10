import axios from 'axios'

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
  }
}
const initialState = {
  products: [],
  displayProducts: [],
  filters: {
    category: filterOptions.category.all,
    sortBy: filterOptions.sortBy.initial,
    sortOrder: []
  }
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
      return { ...state, filters: action.filters }
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
    console.log(category)
    if (category === filterOptions.category.all) {
      dispatch({ type: SET_DISPLAY_PRODUCT, displayProducts: products })
      dispatch(setSortBy(filters.sortBy))
      dispatch(setFilter({ ...filters, category }))
      return products.slice()
    }
    if (!Array.isArray(category)) categoryArr = [category]
    else categoryArr = category
    const baseUrl = window.location.origin
    return axios
      .post(`${baseUrl}/api/v1/products/category`, categoryArr)
      .then(({ data }) => {
        dispatch({ type: SET_DISPLAY_PRODUCT, displayProducts: data })
        dispatch(setFilter({ ...filters, category }))
        if (!filters.sortBy === filterOptions.sortBy.initial) dispatch(setSortBy(filters.sortBy))
      })
      .catch((err) => console.log(err))
  }
}

export function clearProducts() {
  return { type: CLEAR_PRODUCT }
}
