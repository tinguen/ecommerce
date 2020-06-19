/* eslint-disable no-underscore-dangle */
import axios from 'axios'

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

function getByCategoryInChunks(req, res, next) {
  let page = 1
  let limit = 5
  if (req.query.page) {
    try {
      page = parseInt(req.query.page, 10)
    } catch (e) {
      next(new Error('Invalid page param at /category-chunk'))
    }
  }
  if (req.query.limit) {
    try {
      limit = parseInt(req.query.limit, 10)
    } catch (e) {
      next(new Error('Invalid limit param at /category-chunk'))
    }
  }
  productService
    .getByCategoryInChunks(req.params.category, page, limit)
    .then((products) => res.json(products))
    .catch((err) => next(err))
}

function getByCategories(req, res, next) {
  if (!req.query || !req.query.categories)
    next(new Error('No categories at products path /categories'))
  const categories = req.query.categories.split(',')
  productService
    .getByCategory(categories)
    .then((products) => res.json(products))
    .catch((err) => next(err))
}

function getByCategoriesInChunks(req, res, next) {
  if (!req.query || !req.query.categories)
    next(new Error('No categories at products path /categories'))
  const categories = req.query.categories.split(',')
  let page = 1
  let limit = 5
  if (req.query.page) {
    try {
      page = parseInt(req.query.page, 10)
    } catch (e) {
      next(new Error('Invalid page param at /category-chunk'))
    }
  }
  if (req.query.limit) {
    try {
      limit = parseInt(req.query.limit, 10)
    } catch (e) {
      next(new Error('Invalid limit param at /category-chunk'))
    }
  }
  productService
    .getByCategoriesInChunks(categories, page, limit)
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

function getCurrencyExchange(req, res, next) {
  const currencyExchangeUrl = 'https://api.exchangeratesapi.io/latest'
  const query = {
    symbols: req.params && req.params.symbols ? req.params.symbols : 'USD,CAD'
  }
  axios
    .get(currencyExchangeUrl, { params: query })
    .then(({ data: curr }) => res.json(curr))
    .catch((err) => next(err))
}

function getByIds(req, res, next) {
  if (!req.query || !req.query.id) next(new Error('No id at products path /id'))
  const ids = req.query.id.split(',')
  productService
    .getByIds(ids)
    .then((products) => (products ? res.json(products) : res.sendStatus(404)))
    .catch((err) => next(err))
}

function getByChunks(req, res, next) {
  // if (!req.query || !req.query.id) next(new Error('No id at products path /id'))
  // const ids = req.query.id.split(',')
  let page = 1
  let limit = 5
  if (req.query.page) {
    try {
      page = parseInt(req.query.page, 10)
    } catch (e) {
      next(new Error('Invalid page param at /chunks'))
    }
  }
  if (req.query.limit) {
    try {
      limit = parseInt(req.query.limit, 10)
    } catch (e) {
      next(new Error('Invalid limit param at /chunks'))
    }
  }
  productService
    .getByChunks(page, limit)
    .then((products) => (products ? res.json(products) : res.sendStatus(404)))
    .catch((err) => next(err))
}

function getSize(req, res, next) {
  productService
    .getSize()
    .then((size) => res.json({ size }))
    .catch((err) => next(err))
}

function getByCategorySize(req, res, next) {
  productService
    .getByCategorySize(req.params.category)
    .then((size) => res.json({ size }))
    .catch((err) => next(err))
}

function getCategoriesSize(req, res, next) {
  if (!req.query || !req.query.categories)
    next(new Error('No categories at products path /categories'))
  const categories = req.query.categories.split(',')
  productService
    .getByCategoriesSize(categories)
    .then((size) => res.json({ size }))
    .catch((err) => next(err))
}

// routes
router.post('/create', createProduct)
router.get('/', getAll)
router.get('/all', getAllAndFromOrders)
router.get('/chunks', getByChunks)
router.get('/size', getSize)
router.get('/category/:category', getByCategory)
router.get('/category/:category/size', getByCategorySize)
router.get('/category-chunks/:category', getByCategoryInChunks)
router.get('/category', getCategories)
router.get('/categories', getByCategories)
router.get('/categories/size', getCategoriesSize)
router.get('/categories-chunks', getByCategoriesInChunks)
router.get('/currency', getCurrencyExchange)
router.get('/id', getByIds)
router.get('/user', getByUserId)
router.get('/:id', getById)
router.put('/:id', update)
router.delete('/delete/:id', _delete)

module.exports = router
