import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getProducts } from '../redux/reducers/products'
import Product from './product'

const CartView = () => {
  //   const { products } = props
  //   const [err, setErr] = useState(false)
  const dispatch = useDispatch()
  const user = useSelector((s) => s.user.user)
  const { cart } = user
  const products = useSelector((s) => s.product.products)
  const [cartObj, setCartObj] = useState({})
  useEffect(() => {
    dispatch(getProducts())
  }, [])

  useEffect(() => {
    if (!cart || !cart.length) {
      setCartObj({})
      return
    }
    const obj = {}
    if (!Array.isArray(cart)) return
    cart.forEach((id) => {
      if (!obj[id]) obj[id] = 1
      else obj[id] += 1
    })
    setCartObj(obj)
  }, [cart, products])

  return (
    <div className="">
      {Object.entries(cartObj).map(([productId, counter]) => {
        return (
          <Product
            key={productId}
            product={products.filter((product) => product.id === productId)[0]}
            cartCounter={counter}
          />
        )
      })}
    </div>
  )
}

CartView.propTypes = {}

export default CartView
