/* eslint-disable no-underscore-dangle */
const express = require('express')
const productService = require('./product.service')

const router = express.Router()

function getByUserId(req, res, next) {
  // console.log(req.user.sub)
  productService
    .getByUser(req.user.sub)
    .then((products) =>
      res.json(
        products.map((product) => {
          // eslint-disable-next-line no-param-reassign
          product.owner = null
          return product
        })
      )
    )
    .catch((err) => next(err))
}

function createProduct(req, res, next) {
  req.body.owner = req.user.sub
  productService
    .create(req.body)
    .then(() => res.json({}))
    .catch((err) => next(err))
}

function getByCategory(req, res, next) {
  productService
    .getByCategory(req.params.category)
    .then((products) => res.json(products))
    .catch((err) => next(err))
}

function getByCategories(req, res, next) {
  productService
    .getByCategory(req.body)
    .then((products) => res.json(products))
    .catch((err) => next(err))
}

function getCategories(req, res, next) {
  productService
    .getCategories()
    .then((categories) => res.json(categories))
    .catch((err) => next(err))
}

function getAll(req, res, next) {
  productService
    .getAll()
    .then((products) => res.json(products))
    .catch((err) => next(err))
}

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
    .delete(req.params.id, req.user.sub)
    .then(() => res.json({}))
    .catch((err) => next(err))
}

function getAllAndFromOrders(req, res, next) {
  productService
    .getAllAndFromOrders(req.user.sub)
    .then((products) => res.json(products))
    .catch((err) => next(err))
}

// routes
router.post('/create', createProduct)
router.get('/', getAll)
router.get('/all', getAllAndFromOrders)
router.get('/category/:category', getByCategory)
router.get('/category', getCategories)
router.post('/category', getByCategories)
router.get('/user', getByUserId)
router.get('/:id', getById)
router.put('/:id', update)
router.delete('/delete/:id', _delete)

module.exports = router
