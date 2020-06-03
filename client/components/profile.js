import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import Order from './order'
import { getProducts } from '../redux/reducers/products'

const Profile = (props) => {
  const { product } = props
  const dispatch = useDispatch()
  const [orders, setOrders] = useState([])
  const user = useSelector((s) => s.user.user)
  const products = useSelector((s) => s.product.products)
  const baseUrl = window.location.origin

  useEffect(() => {
    dispatch(getProducts())
    async function makeOrder() {
      if (!user.id) return
      try {
        const { data } = await axios.get(`${baseUrl}/api/v1/orders/user/${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        setOrders(data)
        console.log(data)
      } catch (er) {
        console.log(er)
      }
    }
    makeOrder()
  }, [])

  return (
    <div className="card flex flex-col flex-wrap justify-between">
      <div className="flex flex-wrap">
        <img
          alt="User img"
          src={user.imageId ? `${baseUrl}/api/v1/images/${product.imageId}` : 'images/noimage.png'}
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
  )
}

Profile.propTypes = {}

export default Profile
