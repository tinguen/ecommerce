import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getProducts, clearProducts } from '../redux/reducers/products'
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
    if (Object.keys(cart).length === 0 && cart.constructor === Object) return () => {}
    // console.log(products)
    // console.log('products cart')
    dispatch(getProducts())
    return () => dispatch(clearProducts())
  }, [])
  useEffect(() => {
    // console.log(products.length)
    if ((Object.keys(cart).length === 0 && cart.constructor === Object) || !products.length) return
    // console.log('total cart')
    dispatch(getTotal())
  }, [cart, products])


  return (
    <div className="">
      {Object.keys(cart).map((productId) => {
        const product = products.filter((p) => p.id === productId)[0]
        // const f = () => (product ? <Product key={productId} product={product} /> : <div />)
        return product ? <Product key={productId} product={product} /> : <div key={productId} />
        // <Product
        //   key={productId}
        //   product={product}
        // />
      })}
      <div className="card">
        <div className="text-right">Total: {total}</div>
      </div>
    </div>
  )
}

CartView.propTypes = {}

export default CartView
