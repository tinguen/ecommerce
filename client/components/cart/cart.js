import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { getTotal, clearCart } from '../../redux/reducers/users'
import { fetchCurrencyRates } from '../../redux/reducers/products'
import Product from './product'
import { history } from '../../redux'
import addCurrentPrice from '../utils/product'

const CartView = () => {
  const { t, i18n } = useTranslation()
  const [translation, setTranslation] = useState(t('cart', { returnObjects: true }))
  const dispatch = useDispatch()
  const [cartProducts, setCartProducts] = useState([])
  const userId = useSelector((s) => s.user.user.id)
  const token = useSelector((s) => s.user.user.token)
  const user = useSelector((s) => s.user.user)
  const total = useSelector((s) => s.user.total)
  const currency = useSelector((s) => s.product.currentCurrency)
  const products = useSelector((s) => s.product.products)
  const isLogged = useSelector((s) => s.user.isLogged)
  const { cart } = user

  useEffect(() => {
    setTranslation(t('cart', { returnObjects: true }))
  }, [t, i18n.language])

  useEffect(() => {
    // if (!products.length && !cart.length) return
    async function fetchCartProducts() {
      const baseUrl = window.location.origin
      const ids = cart
        .reduce((acc, rec) => {
          return `${acc}${rec.productId},`
        }, '')
        .slice(0, -1)
      try {
        const { data: prdts } = await axios.get(`${baseUrl}/api/v1/products/id`, {
          params: { id: ids }
        })
        setCartProducts(addCurrentPrice(prdts))
      } catch (e) {
        setCartProducts([])
        // history.push('/')
      }
    }
    dispatch(fetchCurrencyRates()).then(() => {
      fetchCartProducts()
      dispatch(getTotal())
    })
    // fetchCartProducts()
  }, [cart, dispatch, products])

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
  }, [cart, token, userId])

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
          {translation.clear}
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
            {translation.checkout}
          </button>
        ) : (
          ''
        )}
      </div>
      {cartProducts.map((product) => {
        return product ? (
          <Product key={product.productId} product={product} />
        ) : (
          <div key={product.productId} />
        )
      })}
      <div className="card card-margin">
        <div className="text-right">
          {translation.total}: {total} {currency}
        </div>
      </div>
    </div>
  )
}

CartView.propTypes = {}

export default CartView
