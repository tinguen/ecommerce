/* eslint-disable no-underscore-dangle */
const express = require('express')
const reviewService = require('./review.service')

const router = express.Router()

function getByUserId(req, res, next) {
  // console.log(req.user.sub)
  reviewService
    .getByUserId(req.user.sub)
    .then((reviews) => res.json(reviews))
    .catch((err) => next(err))
}

function createReview(req, res, next) {
  reviewService
    .create(req.body, req.user.sub)
    .then(() => res.json({}))
    .catch((err) => next(err))
}

function getByProductId(req, res, next) {
  reviewService
    .getByProductId(req.params.id)
    .then((reviews) => res.json(reviews))
    .catch((err) => next(err))
}

function getAll(req, res, next) {
  reviewService
    .getAll()
    .then((reviews) => res.json(reviews))
    .catch((err) => next(err))
}

function getById(req, res, next) {
  reviewService
    .getById(req.params.id)
    .then((product) => (product ? res.json(product) : res.sendStatus(404)))
    .catch((err) => next(err))
}

function update(req, res, next) {
  reviewService
    .update(req.params.id, req.body, req.user.sub)
    .then(() => res.json({}))
    .catch((err) => next(err))
}

function _delete(req, res, next) {
  reviewService
    .delete(req.params.id, req.user.sub)
    .then(() => res.json({}))
    .catch((err) => next(err))
}

function like(req, res, next) {
  reviewService
    .like(req.params.id, req.user.sub)
    .then(() => res.json({}))
    .catch((err) => next(err))
}

function dislike(req, res, next) {
  reviewService
    .dislike(req.params.id, req.user.sub)
    .then(() => res.json({}))
    .catch((err) => next(err))
}

// routes
router.post('/create', createReview)
router.get('/', getAll)
router.get('/user', getByUserId)
router.get('/product/:id', getByProductId)
router.post('/like/:id', like)
router.post('/dislike/:id', dislike)
router.get('/:id', getById)
router.put('/:id', update)
router.delete('/delete/:id', _delete)

module.exports = router
