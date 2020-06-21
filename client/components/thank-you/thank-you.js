import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const ThankYou = () => {
  const { t, i18n } = useTranslation()
  const [translation, setTranslation] = useState(t('email', { returnObjects: true }))

  useEffect(() => {
    setTranslation(t('email', { returnObjects: true }))
  }, [t, i18n.language])

  return (
    <div className="flex">
      <div className="card card-margin">{translation.thankYouMsg}</div>
    </div>
  )
}

ThankYou.propTypes = {}

export default ThankYou
