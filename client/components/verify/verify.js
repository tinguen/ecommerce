import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const Verify = () => {
  const { token } = useParams()
  const [msg, setMsg] = useState('Loading...')

  useEffect(() => {
    const baseUrl = window.location.origin
    axios
      .get(`${baseUrl}/api/v1/users/verify_email?token=${token}`)
      .then(() => setMsg('Your email has been verified. You can now log in!'))
      .catch(() => setMsg('Error ocurred'))
  }, [token])
  return <div>{msg}</div>
}

Verify.propTypes = {}

export default Verify
