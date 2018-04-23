const region = require('../controllers/region')

module.exports = app => {
  app.route('/api/region')
    .get(region.query)
    .post(region.save)

  app.route('/api/region/:regionId([0-9a-fA-F]{24})')
    .get(region.fetch)
    .delete(region.delete)
}