/* eslint-disable no-param-reassign */
const mongoose = require('mongoose')

const { Schema } = mongoose

const schema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String },
  hash: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  cart: { type: [String], required: true }
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

module.exports = mongoose.model('User', schema)
