require('marko/node-require')

const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const errorHandler = require('errorhandler')
process.env.PWD = process.env.PWD || process.cwd()
const http = require('http')
const path = require('path')
const os = require('os')
const helmet = require('helmet')
const mongoose = require('mongoose')
const expressValidator = require('express-validator')
const markoExpress = require('marko/express')
const morgan = require('morgan')
const moment = require('moment')

const config = require('./core/config')
const db = require('./core/db')
const { registerStaticPath } = require('./core/libs/utils')

const app = express()
const port = process.env.NODE_ENV == 'production' ? 80 : 3000

db.init()

app.set('port', port)
app.disable('x-powered-by')
app.locals.moment = moment

app.use(morgan('combined'))
app.use(helmet({ frameguard: false }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(compression())
app.use(expressValidator({ errorFormatter: (param, msg, value) => {
  return {
    type: 'ValidationError',
    code: param,
    message: msg
  }
}}))

const staticDir = path.join(__dirname, 'public')
app.use('/public', express.static(staticDir))

registerStaticPath(app, express)

//enable res.marko(template, data)
app.use(markoExpress())

require('./app/api/routes')(app)
require('./app/dashboard/routes')(app)

// Show nicer errors when in dev mode
if (process.env.NODE_ENV != 'production') app.use(errorHandler())

const main = async () => {
  try {
    await mongoose.connect(config.db.host, config.db.options)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }

  http.createServer(app).listen(port, () => {
    console.log(`Sports Dashboard is now running at http://${os.hostname()}:${port}`)
  })
}

main()