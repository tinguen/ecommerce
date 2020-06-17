import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import { addToCart, removeFromCart, setCounterCart } from '../../redux/reducers/users'

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
    <div
      className={classNames(
        'card flex flex-col justify-between w-full h-full hover:shadow-2xl bg-gray-200',
        className
      )}
    >
      <div className="w-full h-0 pt-full relative">
        <img
          alt="Product img"
          src={
            product.imageId ? `${baseUrl}/api/v1/images/${product.imageId}` : 'images/noimage.png'
          }
          className="w-full h-full object-cover absolute top-0 left-0"
        />
      </div>
      <div className="">
        <div className="m-2">
          <div>
            <Link to={`/product/${product.id}`} className="hover:underline">
              {product.title}
            </Link>
          </div>
          <div>{product.category}</div>
          <div>
            {product.price} {product.currency}
          </div>

          <div>
            {product.stars}
            <img
              alt="Star img"
              src={`${baseUrl}/images/star.png`}
              className="w-4 h-4 object-cover inline-block mr-2"
            />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            // className={`button ${!counter ? 'absolute opacity-0 -z-10' : ''}`}
            className="m-2 p-2 h-auto rounded-lg bg-red-300 hover:bg-red-400 outline-none border-none w-8 h-8 text-center"
            onClick={() => {
              dispatch(removeFromCart(product.id))
            }}
          >
            -
          </button>
          <input
            className="w-8 rounded-lg p-2 mt-2 mb-2 border-solid border-2 border-gray-300 outline-none text-xs text-center"
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
            type="button"
            className="m-2 p-2 h-auto rounded-lg bg-green-300 hover:bg-green-400 outline-none border-none w-8 h-8 text-center"
            onClick={() => {
              dispatch(addToCart(product.id))
            }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}

Product.propTypes = {}

export default Product
