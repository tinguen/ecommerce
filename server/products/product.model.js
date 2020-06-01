/* eslint-disable no-param-reassign */
const mongoose = require('mongoose')

const { Schema } = mongoose

const schema = new Schema({
  title: { type: String, unique: true, required: true },
  category: { type: String, required: true },
  currency: { type: String, required: true },
  imageId: {
    type: mongoose.Types.ObjectId,
    default: mongoose.Types.ObjectId('5ed525528033af10fcc9ce5b')
  },
  createdDate: { type: Date, default: Date.now },
  price: { type: Number, required: true }
})

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    delete ret._id
  }
})

module.exports = mongoose.model('Product', schema)
