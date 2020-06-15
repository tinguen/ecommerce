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

const { Review, Order, Product } = db

async function getAll() {
  return await Review.find()
}

async function getById(id) {
  return await Review.findById(id)
}

async function getByUserId(userId) {
  return await Review.find({ userId })
}

async function getByProductId(productId) {
  return await Review.find({ productId })
}

async function create(reviewParam, userId) {
  // validate
  if (
    !reviewParam.firstName ||
    !reviewParam.lastName ||
    !reviewParam.productId ||
    !reviewParam.stars
  )
    throw new Error('Incomplete review')

  if (reviewParam.stars > 5 || reviewParam.stars < 0)
    throw new Error('Stars can`t be less than 0 or more than 5')
  const product = await Product.findById(reviewParam.productId)
  const { length } = await Review.find({ productId: reviewParam.productId })
  if (!product) throw new Error('Invalid product id')
  reviewParam.userId = userId
  reviewParam.hasBought = (await Order.find({ userId }))
    .map((order) => order.cart.map((p) => p.productId))
    .flat()
    .includes(reviewParam.productId)
  reviewParam.likes = []
  reviewParam.dislikes = []
  reviewParam.replies = []
  reviewParam.createdDate = Date.now()
  product.stars = ((product.stars * length + reviewParam.stars) / (length + 1)).toFixed(2)
  const review = new Review(reviewParam)
  review.stars = review.stars.toFixed(2)
  await product.save()
  await review.save()
}

async function update(id, reviewParam, userId) {
  const review = await Review.findById(id)
  if (review.userId.toString() !== userId) throw new Error(`No rights to update review ${id}`)
  if (reviewParam.stars > 5 || reviewParam.stars < 0)
    throw new Error('Stars can`t be less than 0 or more than 5')

  // validate
  if (!review) throw new Error('Review not found')
  review.firstName = reviewParam.firstName || review.firstName
  review.lastName = reviewParam.lastName || review.lastName
  review.description = reviewParam.description || review.description
  if (reviewParam.stars) {
    const length = await Review.find({ productId: reviewParam.productId }).length
    const product = await Product.findById(review.productId)
    product.stars = ((product.stars * length + reviewParam.stars - review.stars) / length).toFixed(
      2
    )
    review.stars = reviewParam.stars.toFixed(2)
  }
  await review.save()
}

async function _delete(id, userId) {
  const review = await Review.findById(id)
  if (review.userId.toString() !== userId) throw new Error(`No rights to update review ${id}`)
  await Review.findByIdAndRemove(id)
}

async function like(reviewId, userId) {
  const review = await Review.findById(reviewId)
  if (review.userId.toString() === userId)
    throw new Error(`No rights to like own review ${reviewId}`)
  if (!review.likes.includes(mongoose.Types.ObjectId(userId)))
    review.likes.push(mongoose.Types.ObjectId(userId))
  if (review.dislikes.includes(mongoose.Types.ObjectId(userId))) {
    const index = review.dislikes.indexOf(mongoose.Types.ObjectId(userId))
    review.dislikes = [
      ...review.dislikes.slice(0, index),
      ...review.dislikes.slice(index + 1, review.dislikes.length)
    ]
  }
  review.save()
}

async function dislike(reviewId, userId) {
  const review = await Review.findById(reviewId)
  if (review.userId.toString() === userId)
    throw new Error(`No rights to dislike own review ${reviewId}`)
  if (!review.dislikes.includes(mongoose.Types.ObjectId(userId)))
    review.dislikes.push(mongoose.Types.ObjectId(userId))
  if (review.likes.includes(mongoose.Types.ObjectId(userId))) {
    const index = review.likes.indexOf(mongoose.Types.ObjectId(userId))
    review.likes = [
      ...review.likes.slice(0, index),
      ...review.likes.slice(index + 1, review.likes.length)
    ]
  }
  review.save()
}

module.exports = {
  getAll,
  getById,
  getByUserId,
  create,
  update,
  delete: _delete,
  getByProductId,
  like,
  dislike
}
