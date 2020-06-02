import config from '../config'

const mongoose = require('mongoose')

const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}
mongoose.connect(config.connectionString, connectionOptions)
mongoose.Promise = global.Promise

module.exports = {
  User: require('../users/user.model'),
  Product: require('../products/product.model'),
  Order: require('../orders/order.model')
}
