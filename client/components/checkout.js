import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { history } from '../redux'
import { clearCart } from '../redux/reducers/users'

const Checkout = () => {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.user.user)
  const [address, setAddress] = useState('')
  const [lastname, setLastname] = useState('')
  const [firstname, setFirstname] = useState('')
  const userId = useSelector((s) => s.user.user.id)
  const token = useSelector((s) => s.user.user.token)
  const cart = useSelector((s) => s.user.user.cart)
  // const firstUpdate = useRef(true)
  const [err, setErr] = useState(false)

  useEffect(() => {
    setFirstname(user.firstName || '')
    setLastname(user.lastName || '')
  }, [user])

  function handleSubmit(e) {
    e.preventDefault()
    async function makeOrder() {
      if (!userId) return
      const baseUrl = window.location.origin
      try {
        await axios.post(
          `${baseUrl}/api/v1/orders/create`,
          {
            address,
            lastName: lastname,
            firstName: firstname,
            cart
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        setErr(false)
        dispatch(clearCart())
        history.push('/profile')
      } catch (er) {
        console.log(er)
        setErr(true)
      }
    }
    makeOrder()
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="flex flex-col flex-wrap">
        <h1>Checkout</h1>

        <label htmlFor="firstname">First Name</label>
        <input
          className="input-view"
          name="firstname"
          placeholder="First Name"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />

        <label htmlFor="lastname">Last Name</label>
        <input
          className="input-view"
          name="lastname"
          placeholder="Last Name"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />

        <label htmlFor="address">Address</label>
        <input
          className="input-view"
          name="address"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button type="submit" id="search-button" className="button">
          Order
        </button>
      </form>
      <div className="text-red-800">
        {err ? 'We are very sorry. Please clear the cart and make order again!' : ''}
      </div>
    </div>
  )
}

Checkout.propTypes = {}

export default Checkout
