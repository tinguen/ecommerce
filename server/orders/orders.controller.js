/* eslint-disable no-underscore-dangle */
const express = require('express')
const orderService = require('./order.service')

const router = express.Router()

function createOrder(req, res, next) {
  orderService
    .create(req.body)
    .then(() => res.json({}))
    .catch((err) => next(err))
}

function getAll(req, res, next) {
  orderService
    .getAll()
    .then((orders) => res.json(orders))
    .catch((err) => next(err))
}

// function getCurrent(req, res, next) {
//   productService
//     .getById(req.user.sub)
//     .then((user) => (user ? res.json(user) : res.sendStatus(404)))
//     .catch((err) => next(err))
// }

function getById(req, res, next) {
  orderService
    .getById(req.params.id)
    .then((order) => (order ? res.json(order) : res.sendStatus(404)))
    .catch((err) => next(err))
}

function getByUserId(req, res, next) {
  orderService
    .getByUserId(req.params.id)
    .then((order) => (order ? res.json(order) : res.sendStatus(404)))
    .catch((err) => next(err))
}

function update(req, res, next) {
  orderService
    .update(req.params.id, req.body)
    .then(() => res.json({}))
    .catch((err) => next(err))
}

function _delete(req, res, next) {
  orderService
    .delete(req.params.id)
    .then(() => res.json({}))
    .catch((err) => next(err))
}

// routes
router.post('/create', createOrder)
router.get('/', getAll)
// router.get('/current', getCurrent)
router.get('/:id', getById)
router.get('/:id', getByUserId)
router.put('/:id', update)
router.delete('/:id', _delete)

module.exports = router
