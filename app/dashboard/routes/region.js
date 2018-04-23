const region = require('../controllers/region')

module.exports = app => {
  app.route('/region')
    .get(region.list)

  app.route('/region/:regionId([0-9a-fA-F]{24})/detail')
    .get(region.detail)
}