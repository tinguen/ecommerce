import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Rating from 'react-rating'
import { addToCart, removeFromCart, setCounterCart } from '../../redux/reducers/users'
import Review from './review'

const Product = (props) => {
  const { className = '' } = props
  const { id } = useParams()
  const [product, setProduct] = useState({})
  const [reviews, setReviews] = useState([])
  const prdt = useSelector((s) => s.user.user.cart.filter((p) => p.productId === id))
  const counter = prdt.length ? prdt[0].counter : 0
  const [innerCounter, setInnerCounter] = useState(counter || 0)
  const [openTab, setOpenTab] = useState(1)
  const dispatch = useDispatch()
  //   const user = useSelector((s) => s.user.user)
  const baseUrl = window.location.origin
  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data } = await axios.get(`${baseUrl}/api/v1/products/${id}`)
        setProduct(data)
      } catch (err) {
        console.log(err)
      }
    }
    async function fetchReviews() {
      try {
        const { data } = await axios.get(`${baseUrl}/api/v1/reviews/product/${id}`)
        setReviews(data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchProduct()
    fetchReviews()
  }, [baseUrl, id])
  useEffect(() => {
    setInnerCounter(counter || 0)
  }, [counter])
  return (
    <div className={classNames('card card-margin relative', className)}>
      <div className="absolute top-0 right-0 flex items-center">
        <div>{product.stars}</div>
        <img
          alt="Product img"
          src={`${baseUrl}/images/star.png`}
          className="w-4 h-4 object-cover inline-block ml-2 mr-2"
        />
      </div>
      <div className="flex flex-wrap justify-between">
        <div className="flex flex-wrap">
          <img
            alt="Star img"
            src={
              product.imageId
                ? `${baseUrl}/api/v1/images/${product.imageId}`
                : `${baseUrl}/images/noimage.png`
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
      <ul className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row" role="tablist">
        <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
          <a
            className={`text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ${
              openTab === 1 ? `text-white bg-gray-900` : `text-gray-600 bg-white`
            }`}
            onClick={(e) => {
              e.preventDefault()
              setOpenTab(1)
            }}
            data-toggle="tab"
            href="#link1"
            role="tablist"
          >
            Description
          </a>
        </li>
        <li className={`-mb-px mr-2 last:mr-0 flex-auto text-center `}>
          <a
            className={`text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ${
              openTab === 2 ? `text-white bg-gray-900` : `text-gray-600 bg-white`
            }`}
            onClick={(e) => {
              e.preventDefault()
              setOpenTab(2)
            }}
            data-toggle="tab"
            href="#link2"
            role="tablist"
          >
            Reviews
          </a>
        </li>
      </ul>
      <div className={`${openTab === 1 ? 'block' : 'hidden'} p-2 overflow-auto`} id="#link1">
        {product.description}
      </div>
      <div className={`${openTab === 2 ? 'block' : 'hidden'} p-2`} id="#link2">
        <Rating
          initialRating={1}
          emptySymbol={<img alt="Star img" src="/images/star-black.png" className="icon w-4 h-4" />}
          fullSymbol={<img alt="Star img" src="/images/star.png" className="icon w-4 h-4" />}
        />
        {reviews.map((review) => {
          return <Review key={review.id} review={review} />
        })}
      </div>
    </div>
  )
}

Product.propTypes = {}

export default Product