import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import Order from './order'
import Product from './product'

const Profile = (props) => {
  const { product } = props
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [ownProducts, setOwnProducts] = useState([])
  const [openTab, setOpenTab] = useState(1)
  const user = useSelector((s) => s.user.user)
  const baseUrl = window.location.origin

  useEffect(() => {
    async function getProducts() {
      if (!user.id) return
      try {
        const { data } = await axios.get(`${baseUrl}/api/v1/products/all`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        setProducts(data)
      } catch (er) {
        console.log(er)
      }
    }
    async function getOrders() {
      if (!user.id) return
      try {
        const { data } = await axios.get(`${baseUrl}/api/v1/orders/user/${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        setOrders(data)
      } catch (er) {
        console.log(er)
      }
    }
    async function getOwnProducts() {
      if (!user.id) return
      try {
        const { data } = await axios.get(`${baseUrl}/api/v1/products/user/`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        setOwnProducts(data)
      } catch (er) {
        console.log(er)
      }
    }
    getProducts()
    getOrders()
    getOwnProducts()
  }, [])

  return (
    <div>
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
            General
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
            Orders
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
            Your products
          </a>
        </li>
      </ul>
      <div className="card card-margin flex flex-col flex-wrap justify-between">
        <div className={`flex flex-wrap ${openTab === 1 ? 'block' : 'hidden'}`}>
          <img
            alt="User img"
            src={
              user.imageId ? `${baseUrl}/api/v1/images/${product.imageId}` : 'images/noimage.png'
            }
            className="w-48 h-48 m-2"
          />
          <div className="m-2">
            <div>Username: {user.username}</div>
            <div>
              Name: {user.firstName} {user.lastName}
            </div>
          </div>
        </div>
        <div className={`flex flex-col ${openTab === 2 ? 'block' : 'hidden'}`}>
          Your orders:
          {orders.map((order) => {
            return <Order key={order.id} order={order} products={products} />
          })}
        </div>
        <div
          className={`flex flex-col flex-wrap justify-between ${
            openTab === 3 && ownProducts.length ? 'block' : 'hidden'
          }`}
        >
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
