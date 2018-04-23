const layout = require('../views/layout.marko')

module.exports.list = async (req, res, next) => {
  res.marko(layout)
}

module.exports.detail = async (req, res, next) => {

}