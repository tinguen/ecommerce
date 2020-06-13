/* eslint-disable no-param-reassign */
const mongoose = require('mongoose')

const { Schema } = mongoose

const cartSchema = new Schema({
  productId: { type: mongoose.Types.ObjectId },
  counter: { type: Number, default: 0 }
})

const schema = new Schema({
  email: {  type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String },
  hash: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  imageId: { type: mongoose.Types.ObjectId },
  cart: [cartSchema],
  role: { type: String, default: 'USER', required: true },
  isAuthenticated: { type: Boolean, default: true, required: true },
  authToken: { type: String, unique: true, required: true }
})

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    delete ret._id
    delete ret.hash
    delete ret.password
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

module.exports = mongoose.model('User', schema)
