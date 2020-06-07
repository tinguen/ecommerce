import React from 'react'

const Order = (props) => {
  const { order, products } = props
  const baseUrl = window.location.origin
  const getProduct = (id) => products.filter((product) => product.id === id)[0]
  const total = order.cart.reduce((acc, rec) => {
    return acc + getProduct(rec.productId).price * rec.counter
  }, 0)
  return (
    <div className="card card-margin flex flex-col flex-wrap justify-between">
      <div>
        <div>Your order {order.id}</div>
        <div>
          Name: {order.firstName} {order.lastName}
        </div>
        <div>Address: {order.address}</div>
        <div />
      </div>
      <div>Your cart:</div>
      {order.cart.map((pr) => {
        const product = products.filter((p) => p.id === pr.productId)[0]
        return (
          <div key={pr.productId} className="flex flex-wrap">
            <img
              alt="Product img"
              src={
                product.imageId
                  ? `${baseUrl}/api/v1/images/${product.imageId}`
                  : 'images/noimage.png'
              }
              className="w-48 h-48 m-2"
            />
            <div className="m-2">
              <div>
                {product.title} {product.category}
              </div>
              <div>Number of items: {pr.counter}</div>
              <div>
                Price: {product.price} {product.currency}
              </div>
              <div>
                Overall: {product.price * pr.counter} {product.currency}
              </div>
            </div>
          </div>
        )
      })}
      <div>Total: {total}</div>
    </div>
  )
}

Order.propTypes = {}

export default Order
