import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getProducts } from '../redux/reducers/products'
import { getTotal } from '../redux/reducers/users'
import Product from './product'

const CartView = () => {
  //   const { products } = props
  //   const [err, setErr] = useState(false)
  const dispatch = useDispatch()
  const cart = useSelector((s) => s.user.cart)
  const total = useSelector((s) => s.user.total)
  const products = useSelector((s) => s.product.products)
  useEffect(() => {
    dispatch(getProducts())
  }, [])

  useEffect(() => {
    dispatch(getTotal())
  }, [cart])

  return (
    <div className="">
      {Object.keys(cart).map((productId) => {
        return (
          <Product
            key={productId}
            product={products.filter((product) => product.id === productId)[0]}
          />
        )
      })}
      <div className="card">
        <div className="text-right">Total: {total}</div>
      </div>
    </div>
  )
}

CartView.propTypes = {}

export default CartView
