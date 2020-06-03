/* eslint-disable no-param-reassign */
const mongoose = require('mongoose')

const { Schema } = mongoose

const cartSchema = new Schema({
  productId: { type: mongoose.Types.ObjectId },
  counter: { type: Number, default: 0 }
})

const schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  userId: { type: mongoose.Types.ObjectId, required: true },
  cart: [cartSchema]
})

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    delete ret._id
  }
})

cartSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    delete ret._id
    delete ret.id
  }
})

module.exports = mongoose.model('Order', schema)
