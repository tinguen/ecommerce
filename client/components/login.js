import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { updateUsername } from '../redux/reducers/users'
import { history } from '../redux'

const LoginView = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(false)
  const firstUpdate = useRef(true)
  const dispatch = useDispatch()
  const user = useSelector((s) => s.user.user)

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }
    if (
      !err &&
      props.location &&
      props.location.state &&
      props.location.state.direction === 'GO_BACK'
    ) {
      history.goBack()
    }
  }, [err])

  function handleSubmit(e) {
    e.preventDefault()
    async function authenticateUser() {
      const baseUrl = window.location.origin
      try {
        const { data } = await axios.post(`${baseUrl}/api/v1/users/authenticate`, {
          username,
          password
        })
        setErr(false)
        dispatch(updateUsername(data))
        localStorage.setItem('token', data.token)
        if (
          props.location &&
          props.location.state &&
          props.location.state.direction === 'GO_BACK'
        ) {
          history.goBack()
        }
      } catch (er) {
        setErr(true)
      }
    }
    authenticateUser()
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>

        <label htmlFor="username">Username</label>
        <input
          className="input-view"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />

        <label htmlFor="password">Password</label>
        <input
          className="input-view"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />

        <button type="submit" id="search-button" className="button">
          Login
        </button>
        <div className="text-red-800">{err ? 'Wrong username or password' : ''}</div>
        <div>{user.firstName ? `Hello, ${user.firstName}` : ''}</div>
      </form>
    </div>
  )
}

LoginView.propTypes = {}

export default LoginView
