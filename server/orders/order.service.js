/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-throw-literal */
/* eslint-disable consistent-return */
/* eslint-disable no-return-await */
// import config from '../config'

// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')
// import mongoose from 'mongoose'

const db = require('../_helpers/db')

const { Order, User, Product } = db

async function getAll() {
  return await Order.find()
}

async function getById(id) {
  return await Order.findById(id)
}

async function getByUserId(userId) {
  return await Order.find({ userId })
}

async function create(orderParam) {
  // validate
  if (!(await User.findById(orderParam.userId))) {
    throw `Invalid user. Logout and login again`
  }

  if (orderParam.cart && Array.isArray(orderParam.cart)) {
    for (let i = 0; i < orderParam.cart.length; i += 1) {
      const product = orderParam.cart[i]
      // eslint-disable-next-line no-await-in-loop
      if (!(await Product.findById(product.productId))) {
        throw `Invalid product. Clear the cart and add product again`
      }
    }
  }

  const order = new Order(orderParam)
  //   if (orderParam.imageId) product.imageId = mongoose.Types.ObjectId(productParam.imageId)

  // save order
  await order.save()
  // const res = await User.findById(user.id)
  // return {
  //   username: res.username,
  //   hash: res.hash
  // }
}

async function update(id, orderParam) {
  const order = await Order.findById(id)

  // validate
  if (!order) throw 'Order not found'

  Object.assign(order, orderParam)
  await order.save()
}

async function _delete(id) {
  await Order.findByIdAndRemove(id)
}

module.exports = {
  getAll,
  getById,
  getByUserId,
  create,
  update,
  delete: _delete
}
