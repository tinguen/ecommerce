import React, { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { updateUsername } from '../redux/reducers/users'
import { history } from '../redux'

const LoginView = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const dispatch = useDispatch()
  const user = useSelector((s) => s.user.user)
  const location = useLocation()

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
        if (rememberMe) localStorage.setItem('token', data.token)
        if (location && location.state && location.state.direction === 'GO_BACK') {
          history.goBack()
        } else {
          history.push('/profile')
        }
      } catch (er) {
        setErr(true)
      }
    }
    authenticateUser()
  }

  return (
    <div className="flex flex-auto justify-center items-center">
      <div className="card">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <h1 className="self-center">Login</h1>
          <input
            className="input-view flex-auto"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="input-view"
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex flex-wrap m-2">
            <div>
              <input
                type="checkbox"
                className="m-2 cursor-pointer"
                id="remember-me"
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="remember-me" className="m-2 cursor-pointer text-sm">
                Remember me
              </label>
            </div>
            <Link to="/signup" className="text-sm hover:underline self-center">
              Signup
            </Link>
          </div>
          <button type="submit" id="search-button" className="button block">
            Login
          </button>
          <div className="text-red-800">{err ? 'Wrong username or password' : ''}</div>
          <div>{user.firstName ? `Hello, ${user.firstName}` : ''}</div>
        </form>
      </div>
    </div>
  )
}

LoginView.propTypes = {}

export default LoginView
