/* eslint-disable no-param-reassign */
const mongoose = require('mongoose')

const { Schema } = mongoose

const schema = new Schema({
  title: { type: String, unique: true, required: true },
  category: { type: String, required: true },
  currency: { type: String, default: 'UAH', required: true },
  imageId: {
    type: mongoose.Types.ObjectId
  },
  createdDate: { type: Date, default: Date.now },
  price: { type: Number, required: true },
  description: { type: String, default: 'No description', required: true },
  owner: { type: mongoose.Types.ObjectId, required: true },
  isDeleted: { type: Boolean, default: false, required: true },
  isChanged: { type: Boolean, default: false, required: true },
  nextId: { type: mongoose.Types.ObjectId }
})

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    delete ret._id
  }
})

module.exports = mongoose.model('Product', schema)
