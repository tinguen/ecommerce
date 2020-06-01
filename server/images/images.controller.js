import upload from '../_helpers/upload'

const express = require('express')
const mongoose = require('mongoose')
// const db = require('../_helpers/db')

const router = express.Router()
// const { gfs} = db

let gfs

mongoose.connection.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'photos'
  })
  console.log('Connection Successful')
})

const uploadFile = async (req, res, next) => {
  try {
    await upload(req, res)

    console.log(req.file)
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

// routes
router.post('/upload', uploadFile)
router.get('/:id', getFile)

module.exports = router
