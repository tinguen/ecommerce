/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-throw-literal */
/* eslint-disable consistent-return */
/* eslint-disable no-return-await */
import mongoose from 'mongoose'

const db = require('../_helpers/db')

const { Product, Order } = db

async function getAll() {
  return await Product.find({ isDeleted: false, isChanged: false })
}

async function getByChunks(page = 1, limit = 10) {
  return await Product.find({ isDeleted: false, isChanged: false })
    .skip((page - 1) * limit)
    .limit(limit)
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

async function getByCategorySize(category) {
  return await Product.find({ category, isDeleted: false, isChanged: false }).countDocuments()
}

async function getByCategoryInChunks(category, page = 1, limit = 5) {
  return await Product.find({ category, isDeleted: false, isChanged: false })
    .skip((page - 1) * limit)
    .limit(limit)
}

async function getByCategories(categories) {
  return await Product.find({ category: categories, isDeleted: false, isChanged: false })
}

async function getByCategoriesSize(categories) {
  return await Product.find({
    category: categories,
    isDeleted: false,
    isChanged: false
  }).countDocuments()
}

async function getByCategoriesInChunks(categories, page = 1, limit = 5) {
  return await Product.find({ category: categories, isDeleted: false, isChanged: false })
    .skip((page - 1) * limit)
    .limit(limit)
}

async function getCategories() {
  return await Product.distinct('category', { isChanged: false, isDeleted: false })
}

async function getById(id) {
  return await Product.findById(id)
}

async function getByIds(ids) {
  return await Product.find({ _id: ids })
}

async function getByUser(id) {
  return await Product.find({
    owner: mongoose.Types.ObjectId(id),
    isDeleted: false,
    isChanged: false
  })
}

async function create(productParam) {
  function validURL(str) {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ) // fragment locator
    return !!pattern.test(str)
  }
  // validate
  if (await Product.findOne({ title: productParam.title, isDeleted: false, isChanged: false })) {
    throw new Error(`Title "${productParam.title}" is already taken`)
  }

  productParam.isDeleted = false
  productParam.isChanged = false
  if (productParam.nextId) delete productParam.nextId
  if (!(productParam.imageUrl && validURL(productParam.imageUrl))) delete productParam.imageUrl
  const product = new Product(productParam)
  if (productParam.imageId) product.imageId = mongoose.Types.ObjectId(productParam.imageId)

  // save user
  if (await Product.findOne({ title: productParam.title, isDeleted: false, isChanged: false })) {
    throw new Error(`Title "${productParam.title}" is already taken`)
  }
  await product.save()
  return product
}

async function update(id, productParam) {
  const product = await Product.findById(id)

  // validate
  if (!product) throw new Error('Product not found')
  if (
    product.title !== productParam.title &&
    (await Product.findOne({ title: productParam.title, isDeleted: false, isChanged: false }))
  ) {
    throw new Error(`Title "${productParam.title}" is already taken`)
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

async function getSize() {
  return await Product.find({ isDeleted: false, isChanged: false }).countDocuments()
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
  getAllAndFromOrders,
  getByIds,
  getByChunks,
  getByCategoryInChunks,
  getByCategoriesInChunks,
  getSize,
  getByCategorySize,
  getByCategoriesSize
}
