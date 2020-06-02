import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getProducts, clearProducts } from '../redux/reducers/products'
import Product from './product'

const ProductView = () => {
  //   const { products } = props
  //   const [err, setErr] = useState(false)
  const dispatch = useDispatch()
  const products = useSelector((s) => s.product.products)

  useEffect(() => {
    console.log(products)
    dispatch(getProducts())
    return () => dispatch(clearProducts())
  }, [])

  return (
    <div className="">
      {products.map((product) => {
        return <Product key={product.title} product={product} />
      })}
    </div>
  )
}

ProductView.propTypes = {}

export default ProductView
