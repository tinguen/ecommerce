import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Rating from 'react-rating'
import { addToCart, removeFromCart, setCounterCart } from '../../redux/reducers/users'
import { fetchCurrencyRates } from '../../redux/reducers/products'
import Review from './review'
import history from '../../redux/history'
import addCurrentPrice from '../utils/product'

const Product = (props) => {
  const { className = '' } = props
  const { id } = useParams()
  const [product, setProduct] = useState({})
  const [reviews, setReviews] = useState([])
  const prdt = useSelector((s) => s.user.user.cart.filter((p) => p.productId === id))
  const user = useSelector((s) => s.user.user)
  const currency = useSelector((s) => s.product.currentCurrency)
  const counter = prdt.length ? prdt[0].counter : 0
  const [innerCounter, setInnerCounter] = useState(counter || 0)
  const [openTab, setOpenTab] = useState(1)
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [description, setDescription] = useState('')
  const [stars, setStars] = useState(1)
  const [errMsg, setErrMsg] = useState('Empty firstname or lastname')
  const [err, setErr] = useState(false)
  const dispatch = useDispatch()
  const baseUrl = window.location.origin
  const imageUrl = product.imageId
    ? `${baseUrl}/api/v1/images/${product.imageId}`
    : product.imageUrl
  //   const user = useSelector((s) => s.user.user)
  const fetchReviews = useCallback(
    async function _fetchReviews() {
      try {
        const { data } = await axios.get(`${baseUrl}/api/v1/reviews/product/${id}`)
        setReviews(data.reverse())
      } catch (er) {
        history.push('/')
      }
    },
    [baseUrl, id]
  )

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data } = await axios.get(`${baseUrl}/api/v1/products/${id}`)
        setProduct(addCurrentPrice(data))
      } catch (er) {
        history.push('/')
      }
    }
    dispatch(fetchCurrencyRates()).then(() => fetchProduct())
    fetchReviews()
  }, [baseUrl, fetchReviews, id, currency, dispatch])
  useEffect(() => {
    setInnerCounter(counter || 0)
  }, [counter])

  // useEffect(() => {
  //   setProduct(addCurrentPrice(product))
  // }, [])

  function uploadReview() {
    if (!user.token) {
      setErrMsg('Please login to leave a review')
      setErr(true)
      return
    }
    if (!firstname || !lastname) {
      setErr(true)
      return
    }
    setErr(false)
    const review = { firstName: firstname, lastName: lastname, stars, productId: id }
    if (description) review.description = description
    axios
      .post(`${baseUrl}/api/v1/reviews/create`, review, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
      .then(() => {
        fetchReviews()
        setFirstname('')
        setLastname('')
        setDescription('')
      })
      .catch(() => setErr(true))
  }

  return (
    <div
      className={classNames(
        `card card-margin relative ${product.id ? 'block' : 'hidden'}`,
        className
      )}
    >
      <div className="absolute top-0 right-0 flex items-center">
        <div>{product.stars}</div>
        <img
          alt="Product img"
          src={`${baseUrl}/images/star.png`}
          className="w-4 h-4 object-cover inline-block ml-2 mr-2"
        />
      </div>
      <div className="sm:flex sm:flex-wrap justify-between">
        <div className="flex flex-wrap">
          <div className="w-full h-0 pt-full mt-4 mb-4 sm:m-0 relative sm:h-48 sm:w-48 sm:pt-0 sm:block">
            <img
              alt="Star img"
              src={imageUrl || `${baseUrl}/images/noimage.png`}
              className="w-full h-full absolute sm:w-48 sm:h-48 object-cover sm:mt-0 sm:block top-0 left-0"
            />
          </div>
          <div className="m-2">
            <div>{product.title}</div>
            <div>{product.category}</div>
            <div>
              {product.currentPrice} {currency}
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
        <div className={`${user.token ? 'block' : 'hidden'}`}>
          Leave your thoughts:{' '}
          <Rating
            initialRating={stars}
            emptySymbol={
              <img alt="Star img" src="/images/star-black.png" className="icon w-4 h-4" />
            }
            fullSymbol={<img alt="Star img" src="/images/star.png" className="icon w-4 h-4" />}
            onChange={(value) => setStars(value)}
          />
          <div className="flex flex-wrap">
            <input
              className="input-view"
              name="firstname"
              placeholder="First name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <input
              className="input-view"
              name="lastname"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>
          <label htmlFor="description" className="align-top">
            Description
          </label>
          <textarea
            className="input-view w-full"
            name="description"
            placeholder="Description"
            value={description}
            rows={5}
            cols={20}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className={`${err ? 'block' : 'hidden'} text-red-900`}>{errMsg}</div>
          <button type="button" className="button" onClick={uploadReview}>
            Post
          </button>
        </div>
        <div className={`${user.token ? 'hidden' : 'block'}`}>
          Please{' '}
          <Link to="/login" className="hover:underline">
            login
          </Link>{' '}
          to leave a review
        </div>
        {reviews.map((review) => {
          return <Review key={review.id} review={review} />
        })}
      </div>
    </div>
  )
}

Product.propTypes = {}

export default Product
