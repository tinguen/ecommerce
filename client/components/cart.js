import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { getProducts, clearProducts } from '../redux/reducers/products'
import { getTotal, clearCart } from '../redux/reducers/users'
import Product from './product'
import { history } from '../redux'

const CartView = () => {
  const dispatch = useDispatch()
  const userId = useSelector((s) => s.user.user.id)
  const token = useSelector((s) => s.user.user.token)
  const user = useSelector((s) => s.user.user)
  const total = useSelector((s) => s.user.total)
  const products = useSelector((s) => s.product.products)
  const isLogged = useSelector((s) => s.user.isLogged)
  const { cart } = user
  useEffect(() => {
    // if (!cart.length) return () => {}
    dispatch(getProducts())
    return () => dispatch(clearProducts())
  }, [])

  useEffect(() => {
    if (!products.length) return
    dispatch(getTotal())
  }, [cart, products])

  useEffect(() => {
    async function updateCart() {
      if (!userId) return
      const baseUrl = window.location.origin
      await axios.put(
        `${baseUrl}/api/v1/users/${userId}`,
        { cart },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
    }
    updateCart()
  }, [cart])

  return (
    <div className="">
      <div className="card card-margin flex justify-end">
        <button
          type="button"
          className="button ml-2 mr-2 outline-none border-none"
          onClick={() => {
            dispatch(clearCart())
          }}
        >
          Clear
        </button>
        {isLogged ? (
          <button
            type="button"
            className="button ml-2 mr-2 outline-none border-none"
            disabled={!cart.length}
            onClick={() => {
              history.push('/checkout')
            }}
          >
            Checkout
          </button>
        ) : (
          ''
        )}
      </div>
      {cart.map((obj) => {
        const { productId } = obj
        const product = products.filter((p) => p.id === productId)[0]
        return product ? <Product key={productId} product={product} /> : <div key={productId} />
      })}
      <div className="card card-margin">
        <div className="text-right">Total: {total}</div>
      </div>
    </div>
  )
}

CartView.propTypes = {}

export default CartView
