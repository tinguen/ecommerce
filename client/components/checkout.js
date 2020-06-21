import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { history } from '../redux'
import { clearCart } from '../redux/reducers/users'

const Checkout = () => {
  const { t, i18n } = useTranslation()
  const [translation, setTranslation] = useState(t('checkout', { returnObjects: true }))
  const dispatch = useDispatch()
  const user = useSelector((s) => s.user.user)
  const [address, setAddress] = useState('')
  const [lastname, setLastname] = useState('')
  const [firstname, setFirstname] = useState('')
  const userId = useSelector((s) => s.user.user.id)
  const token = useSelector((s) => s.user.user.token)
  const cart = useSelector((s) => s.user.user.cart)
  const [err, setErr] = useState(false)

  useEffect(() => {
    setTranslation(t('checkout', { returnObjects: true }))
  }, [t, i18n.language])

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
        setErr(true)
      }
    }
    makeOrder()
  }

  return (
    <div className="card card-margin">
      <form onSubmit={handleSubmit} className="flex flex-col flex-wrap">
        <h1>Checkout</h1>

        <label htmlFor="firstname">{translation.firstName}</label>
        <input
          className="input-view"
          name="firstname"
          placeholder={translation.firstName}
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />

        <label htmlFor="lastname">{translation.lastName}</label>
        <input
          className="input-view"
          name="lastname"
          placeholder={translation.lastName}
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />

        <label htmlFor="address">{translation.address}</label>
        <input
          className="input-view"
          name="address"
          placeholder={translation.address}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button type="submit" id="search-button" className="button">
          {translation.order}
        </button>
      </form>
      <div className="text-red-800">{err ? translation.err : ''}</div>
    </div>
  )
}

Checkout.propTypes = {}

export default Checkout
