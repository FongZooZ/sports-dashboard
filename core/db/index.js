const mongoose = require('mongoose')

const { walk } = require('../libs/utils')

const appPath = process.cwd()

module.exports.init = () => {
  mongoose.set('debug', process.env.NODE_ENV != 'production')

  walk(`${appPath}/core/db/models/`, null, path => {
    const model = require(path)
    model.on('index', err => {
      if (err) {
        console.error(model.modelName)
        console.error(err)
      }
    })
  })
}