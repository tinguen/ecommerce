import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, removeFromCart, setCounterCart } from '../redux/reducers/users'

const Product = (props) => {
  const { product } = props
  const dispatch = useDispatch()
  const counter = useSelector((s) => s.user.cart[product.id])
  const [innerCounter, setInnerCounter] = useState(counter || 0)
  const baseUrl = window.location.origin

  useEffect(() => {
    setInnerCounter(counter || 0)
  }, [counter])

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
      <div className="flex justify-center items-center">
        <button
          type="submit"
          // className={`button ${!counter ? 'absolute opacity-0 -z-10' : ''}`}
          className=""
          onClick={() => {
            dispatch(removeFromCart(product.id))
          }}
        >
          -
        </button>
        <input
          className="rounded-lg p-2 mt-2 mb-2 border-solid border-2 border-gray-300 w-8 h-8 outline-none flex-auto"
          name="counter"
          placeholder=""
          value={innerCounter}
          onChange={(e) => setInnerCounter(e.target.value)}
          onBlur={(e) => {
            // setInnerCounter(e.target.value)
            const diff = parseInt(e.target.value, 10) - (counter || 0)
            console.log(diff, typeof diff === 'number')
            // eslint-disable-next-line no-self-compare
            if (!(typeof diff === 'number' && diff === diff) || diff === 0) return
            // if (diff > 0) {
            //   new Array(diff).fill(0).forEach(() => dispatch(addToCart(product.id)))
            // } else if (diff < 0) {
            //   new Array(Math.abs(diff)).fill(0).forEach(() => dispatch(removeFromCart(product.id)))
            // }
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
