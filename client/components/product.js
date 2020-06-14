import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import { addToCart, removeFromCart, setCounterCart } from '../redux/reducers/users'

const Product = (props) => {
  const { product, className = '' } = props
  const dispatch = useDispatch()
  const prdt = useSelector((s) => s.user.user.cart.filter((p) => p.productId === product.id))
  const counter = prdt.length ? prdt[0].counter : 0
  const [innerCounter, setInnerCounter] = useState(counter || 0)
  const baseUrl = window.location.origin

  useEffect(() => {
    setInnerCounter(counter || 0)
  }, [counter])

  return (
    <div className={classNames('card card-margin flex flex-wrap justify-between', className)}>
      <div className="flex flex-wrap">
        <img
          alt="Product img"
          src={
            product.imageId ? `${baseUrl}/api/v1/images/${product.imageId}` : 'images/noimage.png'
          }
          className="w-48 h-48 object-cover m-2"
        />
        <div className="m-2">
          <div>{product.title}</div>
          <div>{product.category}</div>
          <div>
            {product.price} {product.currency}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <button
          type="submit"
          // className={`button ${!counter ? 'absolute opacity-0 -z-10' : ''}`}
          className="m-2"
          onClick={() => {
            dispatch(removeFromCart(product.id))
          }}
        >
          -
        </button>
        <input
          className="rounded-lg p-2 mt-2 mb-2 border-solid border-2 border-gray-300 w-8 h-8 outline-none flex-auto text-xs text-center"
          name="counter"
          maxLength="2"
          value={innerCounter}
          onChange={(e) => setInnerCounter(e.target.value)}
          onBlur={(e) => {
            const diff = parseInt(e.target.value, 10) - (counter || 0)
            // eslint-disable-next-line no-self-compare
            if (!(typeof diff === 'number' && diff === diff)) return
            dispatch(setCounterCart(product.id, e.target.value))
          }}
        />
        <button
          type="submit"
          className="m-2"
          onClick={() => {
            dispatch(addToCart(product.id))
          }}
        >
          +
        </button>
      </div>
    </div>
  )
}

Product.propTypes = {}

export default Product
