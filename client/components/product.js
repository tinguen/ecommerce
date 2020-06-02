import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, removeFromCart } from '../redux/reducers/users'

const Product = (props) => {
  const { product } = props
  const dispatch = useDispatch()
  const counter = useSelector((s) => s.user.cart[product.id])
  const baseUrl = window.location.origin

  return (
    <div className="card flex flex-wrap justify-between">
      <div className="flex flex-wrap">
        <img
          alt="Product img"
          src={product.imageId ? `${baseUrl}/api/v1/images/${product.imageId}` : ''}
          style={{
            display: 'block'
          }}
          className="w-48 h-full flex-auto m-2"
        />
        <div className="m-2">
          <div>{product.title}</div>
          <div>{product.category}</div>
          <div>
            {product.price} {product.currency}
          </div>
        </div>
      </div>
      <div>
        <button
          type="submit"
          className={`button ${!counter ? 'absolute opacity-0 -z-10' : ''}`}
          onClick={() => {
            dispatch(removeFromCart(product.id))
          }}
        >
          Remove from cart
        </button>
        <div>{counter ? `${counter} ${product.title} in cart` : ''}</div>
        <button
          type="submit"
          className="button"
          onClick={() => {
            dispatch(addToCart(product.id))
          }}
        >
          Add to cart
        </button>
      </div>
    </div>
  )
}

Product.propTypes = {}

export default Product
