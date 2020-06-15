/* eslint-disable no-param-reassign */
const mongoose = require('mongoose')

const { Schema } = mongoose

const replySchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  productId: { type: mongoose.Types.ObjectId, required: true },
  reviewId: { type: mongoose.Types.ObjectId, required: true },
  userId: { type: mongoose.Types.ObjectId, required: true },
  hasBought: { type: Boolean, required: true, default: false },
  createdDate: { type: Date, default: Date.now, required: true }
})

const schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  productId: { type: mongoose.Types.ObjectId, required: true },
  userId: { type: mongoose.Types.ObjectId, required: true },
  createdDate: { type: Date, default: Date.now, required: true },
  hasBought: { type: Boolean, required: true, default: false },
  stars: { type: Number, required: true },
  description: { type: String },
  likes: { type: [mongoose.Types.ObjectId], required: true },
  dislikes: { type: [mongoose.Types.ObjectId], required: true },
  replies: { type: [replySchema] }
})

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    delete ret._id
  }
})

replySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    delete ret._id
  }
})

module.exports = mongoose.model('Review', schema)
