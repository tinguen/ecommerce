/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-throw-literal */
/* eslint-disable consistent-return */
/* eslint-disable no-return-await */
import config from '../config'

const sgMail = require('@sendgrid/mail')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const db = require('../_helpers/db')

const { User } = db

function getEmailHtml(user, token) {
  const welcome = `<div>Hi, ${user.firstName} ${user.lastName}</div>`
  const verifyLink = `<a href="https://ecommerce-tinguen.herokuapp.com/verify/${token}">Click here to verify your email</a>`
  return welcome + verifyLink
}

async function authenticate({ username, password }) {
  const user = await User.findOne({ username, isAuthenticated: true })
  if (user && bcrypt.compareSync(password, user.hash)) {
    const token = jwt.sign({ sub: user.id }, process.env.SECRET || config.secret)
    return {
      ...user.toJSON(),
      token
    }
  }
}

async function getAll() {
  return await User.find({ isAuthenticated: true })
}

async function getById(id) {
  return await User.findById(id)
}

async function create(userParam) {
  // validate
  if (await User.findOne({ username: userParam.username })) {
    throw `Username "${userParam.username}" is already taken`
  }

  // if (await User.findOne({ username: userParam.username })) {
  //   throw `Username "${userParam.username}" is already taken`
  // }
  const seed = crypto.randomBytes(20)
  const authToken = crypto
    .createHash('sha1')
    .update(seed + userParam.email)
    .digest('hex')
  userParam.authToken = authToken
  userParam.isAuthenticated = false
  const user = new User(userParam)

  // hash password
  if (userParam.password) {
    user.hash = bcrypt.hashSync(userParam.password, 10)
  }

  // save user
  await user.save()

  // console.log(config.sendgrid)
  sgMail.setApiKey(config.sendgrid_api)
  const msg = {
    to: userParam.email,
    from: config.sendgrid_from,
    subject: 'ECommerce verification',
    text: authToken,
    html: getEmailHtml(user, authToken)
  }
  sgMail.send(msg).catch((e) => console.log(e))
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

  if (userParam.role) userParam.role = user.role
  if (userParam.isAuthenticated) userParam.isAuthenticated = user.isAuthenticated

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

async function verifyEmail(authToken) {
  const user = await User.findOne({ authToken })
  if (!user) throw new Error('Invalid auth token')
  user.isAuthenticated = true
  user.save()
}

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  verifyEmail
}
