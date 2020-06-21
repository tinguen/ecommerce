import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import axios from 'axios'

import history from '../../redux/history'

const Product = (props) => {
  const { t, i18n } = useTranslation()
  const [translation, setTranslation] = useState(t('profile', { returnObjects: true }))
  const { product, className = '', ownProducts, setOwnProducts } = props
  const user = useSelector((s) => s.user.user)
  const baseUrl = window.location.origin
  const imageUrl = product.imageId
    ? `${baseUrl}/api/v1/images/${product.imageId}`
    : product.imageUrl

  useEffect(() => {
    setTranslation(t('profile', { returnObjects: true }))
  }, [t, i18n.language])

  function handleDeleteProduct() {
    async function deleteProduct() {
      if (!user.id) return
      try {
        await axios.delete(`${baseUrl}/api/v1/products/delete/${product.id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        const index = ownProducts.map((p) => p.id).indexOf(product.id)
        const ownP = [
          ...ownProducts.slice(0, index),
          ...ownProducts.slice(index + 1, ownProducts.length)
        ]
        setOwnProducts(ownP)
      } catch (er) {
        history.push('/')
      }
    }
    deleteProduct()
  }

  return (
    <div className={classNames('card m-2 flex flex-wrap justify-between', className)}>
      <div className="flex flex-wrap">
        <img
          alt="Product img"
          src={imageUrl || 'images/noimage.png'}
          className="w-48 h-48 object-cover m-2"
        />
        <div className="m-2">
          <div>{product.title}</div>
          <div>{product.category}</div>
          <div>
            {product.price} {'EUR'}
          </div>
          <div>{product.description}</div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <button type="button" onClick={handleDeleteProduct} className="btn">
          {translation.delete}
        </button>
      </div>
    </div>
  )
}

Product.propTypes = {}

export default Product
