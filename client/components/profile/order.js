import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const Order = (props) => {
  const { t, i18n } = useTranslation()
  const [translation, setTranslation] = useState(t('profile', { returnObjects: true }).ordersTab)
  const { order, products } = props
  const baseUrl = window.location.origin
  const getProduct = (id) => products.filter((product) => product.id === id)[0]
  const total = order.cart.reduce((acc, rec) => {
    if (!products.length) return acc
    return acc + getProduct(rec.productId).price * rec.counter
  }, 0)

  useEffect(() => {
    setTranslation(t('profile', { returnObjects: true }).ordersTab)
  }, [t, i18n.language])

  return (
    <div className="m-2 p-2 border-solid border-2 flex flex-col flex-wrap justify-between">
      <div>
        <div>
          {translation.orderMsg} {order.id}
        </div>
        <div>
          {translation.name}: {order.firstName} {order.lastName}
        </div>
        <div>
          {translation.address}: {order.address}
        </div>
        <div />
      </div>
      <div>{translation.cart}:</div>
      {order.cart.map((pr) => {
        if (!products.length) return <div key={pr.productId} />
        const product = products.filter((p) => p.id === pr.productId)[0]
        const imageUrl = product.imageId
          ? `${baseUrl}/api/v1/images/${product.imageId}`
          : product.imageUrl
        return (
          <div key={pr.productId} className="flex flex-wrap">
            <img
              alt="Product img"
              src={imageUrl || '/images/noimage.png'}
              className="w-48 h-48 m-2"
            />
            <div className="m-2">
              <div>
                {product.title} {product.category}
              </div>
              <div>
                {translation.items}: {pr.counter}
              </div>
              <div>
                {translation.price}: {product.price} EUR
              </div>
              <div>
                {translation.overall}: {product.price * pr.counter} EUR
              </div>
            </div>
          </div>
        )
      })}
      <div>
        {translation.total}: {total} EUR
      </div>
    </div>
  )
}

Order.propTypes = {}

export default Order
