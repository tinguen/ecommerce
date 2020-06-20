import React, { useState } from 'react'
import axios from 'axios'
import { history } from '../redux'

const RegisterView = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [lastname, setLastname] = useState('')
  const [firstname, setFirstname] = useState('')
  const [password, setPassword] = useState('')
  // const firstUpdate = useRef(true)
  const [err, setErr] = useState(false)
  function handleSubmit(e) {
    e.preventDefault()
    async function createUser() {
      const baseUrl = window.location.origin
      try {
        await axios.post(`${baseUrl}/api/v1/users/register`, {
          email,
          username,
          lastName: lastname,
          firstName: firstname,
          password
        })
        setErr(false)
        history.push('/thankyou')
      } catch (er) {
        setErr(true)
      }
    }
    createUser()
  }

  return (
    <div className="flex flex-auto justify-center items-center">
      <div className="card card-margin overflow-auto">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <h1>Sign Up For An Account</h1>

          <label htmlFor="email" className="ml-2">
            Email
          </label>
          <input
            className="input-view"
            name="email"
            placeholder="example@example.com"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="username" className="ml-2">
            Username
          </label>
          <input
            className="input-view"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="password" className="ml-2">
            Password
          </label>
          <input
            className="input-view"
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="firstname" className="ml-2">
            First Name
          </label>
          <input
            className="input-view"
            name="firstname"
            placeholder="Tin"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />

          <label htmlFor="lastname" className="ml-2">
            Last Name
          </label>
          <input
            className="input-view"
            name="lastname"
            placeholder="Nhuen"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />

          <button type="submit" id="search-button" className="button">
            Sign up
          </button>
        </form>
        <div className="text-red-800">{err ? 'Username is taken' : ''}</div>
      </div>
    </div>
  )
}

RegisterView.propTypes = {}

export default RegisterView
