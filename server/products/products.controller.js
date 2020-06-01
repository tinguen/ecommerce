/* eslint-disable no-underscore-dangle */
const express = require('express')
const productService = require('./product.sevice')

const router = express.Router()

function createProduct(req, res, next) {
  productService
    .create(req.body)
    .then(() => res.json({}))
    .catch((err) => next(err))
}

function getAll(req, res, next) {
  productService
    .getAll()
    .then((products) => res.json(products))
    .catch((err) => next(err))
}

// function getCurrent(req, res, next) {
//   productService
//     .getById(req.user.sub)
//     .then((user) => (user ? res.json(user) : res.sendStatus(404)))
//     .catch((err) => next(err))
// }

function getById(req, res, next) {
  productService
    .getById(req.params.id)
    .then((product) => (product ? res.json(product) : res.sendStatus(404)))
    .catch((err) => next(err))
}

function update(req, res, next) {
  productService
    .update(req.params.id, req.body)
    .then(() => res.json({}))
    .catch((err) => next(err))
}

function _delete(req, res, next) {
  productService
    .delete(req.params.id)
    .then(() => res.json({}))
    .catch((err) => next(err))
}

// routes
router.post('/create', createProduct)
router.get('/', getAll)
// router.get('/current', getCurrent)
router.get('/:id', getById)
router.put('/:id', update)
router.delete('/:id', _delete)

module.exports = router
