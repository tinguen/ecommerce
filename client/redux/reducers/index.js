import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import user from './users'
import product from './products'

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    user,
    product
  })

export default createRootReducer
