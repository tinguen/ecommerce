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
      <div className="card card-margin flex flex-col flex-wrap justify-between">
        <div className="flex flex-wrap">
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
        <div className="flex flex-col">
          {orders.map((order) => {
            return <Order key={order.id} order={order} products={products} />
          })}
        </div>
      </div>
      <div className="card card-margin flex flex-col flex-wrap justify-between">
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
  )
}

Profile.propTypes = {}

export default Profile
