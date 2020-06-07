import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { getProducts, clearProducts } from '../redux/reducers/products'
import Product from './product-view'

const ProductView = () => {
  const dispatch = useDispatch()
  const products = useSelector((s) => s.product.products)
  const userId = useSelector((s) => s.user.user.id)
  const token = useSelector((s) => s.user.user.token)
  const cart = useSelector((s) => s.user.user.cart)
  useEffect(() => {
    dispatch(getProducts())
    return () => dispatch(clearProducts())
  }, [])

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
    <div className="m-2 grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-g-center">
      {products.map((product) => {
        return <Product key={product.title} product={product} />
      })}
    </div>
  )
}

ProductView.propTypes = {}

export default ProductView
