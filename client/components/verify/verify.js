import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

const Verify = () => {
  const { t, i18n } = useTranslation()
  const [translation, setTranslation] = useState(t('email', { returnObjects: true }))
  const { token } = useParams()
  const [msg, setMsg] = useState(translation.loading)

  useEffect(() => {
    setTranslation(t('email', { returnObjects: true }))
  }, [t, i18n.language])

  useEffect(() => {
    const baseUrl = window.location.origin
    axios
      .get(`${baseUrl}/api/v1/users/verify_email?token=${token}`)
      .then(() => setMsg(translation.verifyMsg))
      .catch(() => setMsg(translation.err))
  }, [token, translation.err, translation.verifyMsg])
  return <div>{msg}</div>
}

Verify.propTypes = {}

export default Verify
