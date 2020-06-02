/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-throw-literal */
/* eslint-disable consistent-return */
/* eslint-disable no-return-await */
// import config from '../config'

// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')
import mongoose from 'mongoose'

const db = require('../_helpers/db')

const { Product } = db

async function getAll() {
  return await Product.find()
}

async function getById(id) {
  return await Product.findById(id)
}

async function create(productParam) {
  // validate
  if (await Product.findOne({ title: productParam.title })) {
    throw `Title "${productParam.title}" is already taken`
  }

  const product = new Product(productParam)
  if (productParam.imageId) product.imageId = mongoose.Types.ObjectId(productParam.imageId)

  // save user
  await product.save()
  // const res = await User.findById(user.id)
  // return {
  //   username: res.username,
  //   hash: res.hash
  // }
}

async function update(id, productParam) {
  const product = await Product.findById(id)

  // validate
  if (!product) throw 'Product not found'
  if (
    product.title !== productParam.title &&
    (await Product.findOne({ title: productParam.title }))
  ) {
    throw `Title "${productParam.title}" is already taken`
  }

  Object.assign(product, productParam)
  await product.save()
}

async function _delete(id) {
  await Product.findByIdAndRemove(id)
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete
}
