require('dotenv').config()

const options = {
  port: process.env.PORT,
  app: process.env.APP,
  env: process.env.NODE_ENV,
  isSocketsEnabled: process.env.ENABLE_SOCKETS,
  connectionString: process.env.CONNECTION_STRING,
  secret: process.env.SECRET,
  sendgrid_api: process.env.SENDGRID_API_KEY,
  sendgrid_from: process.env.SENDGRID_FROM
}

export default options
