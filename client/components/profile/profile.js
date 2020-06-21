import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Order from './order'
import Product from './product'
import history from '../../redux/history'
import addCurrentPrice from '../utils/product'

const Profile = (props) => {
  const { t, i18n } = useTranslation()
  const [translation, setTranslation] = useState(t('profile', { returnObjects: true }))
  const { product } = props
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [ownProducts, setOwnProducts] = useState([])
  const [openTab, setOpenTab] = useState(1)
  const user = useSelector((s) => s.user.user)
  const baseUrl = window.location.origin

  useEffect(() => {
    setTranslation(t('profile', { returnObjects: true }))
  }, [t, i18n.language])

  useEffect(() => {
    async function fetchProducts() {
      if (!user.id) return
      try {
        const { data } = await axios.get(`${baseUrl}/api/v1/products/all`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        setProducts(data)
      } catch (er) {
        history.push('/')
      }
    }
    async function fetchOrders() {
      if (!user.id) return
      try {
        const { data } = await axios.get(`${baseUrl}/api/v1/orders/user/${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        setOrders(data)
      } catch (er) {
        history.push('/')
      }
    }
    async function fetchOwnProducts() {
      if (!user.id) return
      try {
        const { data } = await axios.get(`${baseUrl}/api/v1/products/user/`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        setOwnProducts(data.map((p) => addCurrentPrice(p)))
      } catch (er) {
        history.push('/')
      }
    }
    fetchProducts()
    fetchOrders()
    fetchOwnProducts()
  }, [baseUrl, user.id, user.token])

  return (
    <div>
      <ul className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row" role="tablist">
        <li className="-mb-px ml-2 mr-2 last:mr-0 flex-auto text-center">
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
            {translation.general}
          </a>
        </li>
        <li
          className={`-mb-px mr-2 last:mr-0 flex-auto text-center ${
            orders.length ? 'block' : 'hidden'
          }`}
        >
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
            {translation.orders}
          </a>
        </li>
        <li
          className={`-mb-px mr-2 last:mr-0 flex-auto text-center ${
            ownProducts.length ? 'block' : 'hidden'
          }`}
        >
          <a
            className={`text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ${
              openTab === 3 ? `text-white bg-gray-900` : `text-gray-600 bg-white`
            }`}
            onClick={(e) => {
              e.preventDefault()
              setOpenTab(3)
            }}
            data-toggle="tab"
            href="#link3"
            role="tablist"
          >
            {translation.products}
          </a>
        </li>
      </ul>
      <div className="card card-margin flex flex-col flex-wrap justify-between">
        <div className={`flex flex-wrap ${openTab === 1 ? 'block' : 'hidden'}`}>
          <img
            alt="User img"
            src={
              user.imageId ? `${baseUrl}/api/v1/images/${product.imageId}` : '/images/noimage.png'
            }
            className="w-48 h-48 m-2"
          />
          <div className="m-2">
            <div>
              {translation.username}: {user.username}
            </div>
            <div>
              {translation.name}: {user.firstName} {user.lastName}
            </div>
          </div>
        </div>
        <div className={`flex flex-col ${openTab === 2 ? 'block' : 'hidden'}`}>
          {translation.ordersMsg}:
          {orders.map((order) => {
            return <Order key={order.id} order={order} products={products} />
          })}
        </div>
        <div
          className={`flex flex-col flex-wrap justify-between ${
            openTab === 3 && ownProducts.length ? 'block' : 'hidden'
          }`}
        >
          <Link to="/create">
            <span className="hover:underline">Add new products</span>
          </Link>
          <div>{ownProducts.length ? 'Your products:' : ''}</div>
          <div className="flex flex-col">
            {ownProducts.map((p) => {
              return (
                <Product
                  key={p.id}
                  product={p}
                  ownProducts={ownProducts}
                  setOwnProducts={setOwnProducts}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

Profile.propTypes = {}

export default Profile
