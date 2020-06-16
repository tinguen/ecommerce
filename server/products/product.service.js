/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-throw-literal */
/* eslint-disable consistent-return */
/* eslint-disable no-return-await */
// import config from '../config'

// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')
import mongoose from 'mongoose'

// const img = require('../images/images.controller')

const db = require('../_helpers/db')

const { Product, Order } = db

async function getAll() {
  return await Product.find({ isDeleted: false, isChanged: false })
}

async function getAllAndFromOrders(userId) {
  const orders = await Order.find({ userId })
  const products = await Product.find({ isDeleted: false, isChanged: false })
  if (!orders.length) return products
  const productsIds = orders
    .map((order) =>
      order.cart.reduce((acc, rec) => {
        return [...acc, rec.productId]
      }, [])
    )
    .flat()
  const productsFromOrders = await Product.find({
    $or: [{ isDeleted: true }, { isChanged: true }],
    _id: productsIds
  })
  return [...products, ...productsFromOrders]
}

async function getByCategory(category) {
  return await Product.find({ category, isDeleted: false, isChanged: false })
}

async function getByCategories(categories) {
  return await Product.find({ category: categories, isDeleted: false, isChanged: false })
}

async function getCategories() {
  return await Product.distinct('category', { isChanged: false, isDeleted: false })
}

async function getById(id) {
  return await Product.findById(id)
}

async function getByUser(id) {
  return await Product.find({
    owner: mongoose.Types.ObjectId(id),
    isDeleted: false,
    isChanged: false
  })
}

async function create(productParam) {
  // validate
  if (await Product.findOne({ title: productParam.title, isDeleted: false, isChanged: false })) {
    throw `Title "${productParam.title}" is already taken`
  }

  productParam.isDeleted = false
  productParam.isChanged = false
  if (productParam.nextId) delete productParam.nextId
  const product = new Product(productParam)
  if (productParam.imageId) product.imageId = mongoose.Types.ObjectId(productParam.imageId)

  // save user
  await product.save()
  return product
}

async function update(id, productParam) {
  const product = await Product.findById(id)

  // validate
  if (!product) throw 'Product not found'
  if (
    product.title !== productParam.title &&
    (await Product.findOne({ title: productParam.title, isDeleted: false, isChanged: false }))
  ) {
    throw `Title "${productParam.title}" is already taken`
  }
  const p = { ...product, ...productParam }
  const newProduct = create(p)
  product.isChanged = true
  product.nextId = newProduct.id
  await product.save()
}

async function _delete(id, userId) {
  const product = await Product.findById(id)
  if (!product) throw new Error('Invalid product id')
  if (product.owner.toString() !== userId) throw new Error('Invalid token')
  product.isDeleted = true
  await product.save()
  // eslint-disable-next-line eqeqeq
  // if (product.owner.toString() === userId) {
  //   if (product.imageId) {
  //     await img.delete(
  //       { params: { id: product.imageId }, user: { sub: userId } },
  //       { send: () => {} },
  //       (e) => {
  //         if (e) throw e
  //       }
  //     )
  //   }
  //   await Product.findByIdAndRemove(id)
  // } else {
  //   throw 'Invalid token'
  // }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  getCategories,
  getByCategory,
  getByCategories,
  getByUser,
  getAllAndFromOrders
}
