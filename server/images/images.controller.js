/* eslint-disable no-underscore-dangle */
import upload from '../_helpers/upload'

const express = require('express')
const mongoose = require('mongoose')
const db = require('../_helpers/db')

const { Product } = db

const router = express.Router()
// const { gfs} = db

let gfs

mongoose.connection.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'photos'
  })
})

const uploadFile = async (req, res, next) => {
  try {
    await upload(req, res)

    if (!req.file) {
      res.status(400)
      return res.send({ message: `You must select a file.` })
    }

    return res.send({ message: `Success`, id: req.file.id })
  } catch (error) {
    return next(error)
  }
}

// eslint-disable-next-line no-unused-vars
function getFile(req, res, next) {
  gfs
    .openDownloadStream(mongoose.Types.ObjectId(req.params.id))
    .on('error', (err) => next(err))
    .pipe(res)
    .on('error', (err) => next(err))
}

// eslint-disable-next-line import/prefer-default-export
export async function _delete(req, res, next) {
  const product = await Product.findOne({
    owner: mongoose.Types.ObjectId(req.user.sub),
    imageId: mongoose.Types.ObjectId(req.params.id)
  })
  if (!product) next(new Error('No admin rights'))
  else {
    try {
      await gfs.delete(mongoose.Types.ObjectId(req.params.id))
      product.imageId = null
      await product.save()
      res.send({})
    } catch (err) {
      next(err)
    }
  }
}

// routes
router.post('/upload', uploadFile)
router.get('/:id', getFile)
router.delete('/delete/:id', _delete)

module.exports = router
const myModule = module.exports
myModule.delete = _delete
