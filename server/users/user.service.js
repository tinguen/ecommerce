/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-throw-literal */
/* eslint-disable consistent-return */
/* eslint-disable no-return-await */
import config from '../config'

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../_helpers/db')

const { User } = db

async function authenticate({ username, password }) {
  const user = await User.findOne({ username })
  if (user && bcrypt.compareSync(password, user.hash)) {
    const token = jwt.sign({ sub: user.id }, process.env.SECRET || config.secret)
    return {
      ...user.toJSON(),
      token
    }
  }
}

async function getAll() {
  return await User.find()
}

async function getById(id) {
  return await User.findById(id)
}

async function create(userParam) {
  // validate
  if (await User.findOne({ username: userParam.username })) {
    throw `Username "${userParam.username}" is already taken`
  }

  const user = new User(userParam)

  // hash password
  if (userParam.password) {
    user.hash = bcrypt.hashSync(userParam.password, 10)
  }

  // save user
  await user.save()
  // const res = await User.findById(user.id)
  // return {
  //   username: res.username,
  //   hash: res.hash
  // }
}

async function update(id, userParam) {
  const user = await User.findById(id)

  // validate
  if (!user) throw 'User not found'
  if (
    user.username !== userParam.username &&
    (await User.findOne({ username: userParam.username }))
  ) {
    throw `Username "${userParam.username}" is already taken`
  }

  // hash password if it was entered
  if (userParam.password) {
    userParam.hash = bcrypt.hashSync(userParam.password, 10)
  }

  // copy userParam properties to user
  Object.assign(user, userParam)
  // if (userParam.cart) user.push(userParam.cart)
  // user.cart.push('a')
  // if (userParam.cart) {
  //   if (Array.isArray(userParam.cart)) {
  //     user.pushAll(userParam.cart)
  //   } else {
  //     user.push(userParam.cart)
  //   }
  // }

  await user.save()
}

async function _delete(id) {
  await User.findByIdAndRemove(id)
}

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete
}
