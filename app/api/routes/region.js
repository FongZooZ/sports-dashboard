const region = require('../controllers/region')

module.exports = app => {
  app.route('/api/regions')
    .get(region.query)
    .post(region.save)

  app.route('/api/regions/:regionId([0-9a-fA-F]{24})')
    .get(region.fetch)
    .put(region.update)
    .delete(region.delete)
}