import util from 'util'
import multer from 'multer'
import GridFsStorage from 'multer-gridfs-storage'

const storage = new GridFsStorage({
  url: process.env.CONNECTION_STRING,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    // const match = ['image/png', 'image/jpeg']

    // if (match.indexOf(file.mimetype) === -1) {
    //   const filename = `${Date.now()}-bezkoder-${file.originalname}`
    //   return filename
    // }

    return {
      bucketName: 'photos',
      filename: `${Date.now()}-bezkoder-${file.originalname}`
    }
  }
})

const uploadFile = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      !file.mimetype.includes('jpeg') &&
      !file.mimetype.includes('jpg') &&
      !file.mimetype.includes('png') &&
      !file.mimetype.includes('gif')
    ) {
      return cb(null, false, new Error('Only images are allowed'))
    }
    return cb(null, true)
  }
}).single('file')
const uploadFilesMiddleware = util.promisify(uploadFile)
export default uploadFilesMiddleware
