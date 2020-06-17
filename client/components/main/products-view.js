import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Product from './product-view'
import FilterView from './filter'

const ProductView = () => {
  const products = useSelector((s) => s.product.displayProducts)
  const userId = useSelector((s) => s.user.user.id)
  const token = useSelector((s) => s.user.user.token)
  const cart = useSelector((s) => s.user.user.cart)

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
    <div className="block sm:flex">
      <FilterView />
      <div className="m-2 grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-g-center flex-auto">
        {products.map((product) => {
          return (
            <Product
              key={product.title}
              product={product}
              className="transform hover:scale-105 m-2 sm:m-0"
            />
          )
        })}
      </div>
    </div>
  )
}

ProductView.propTypes = {}

export default ProductView
