const region = require('../controllers/region')
const auth = require('../../../core/middlewares/authorization')

module.exports = app => {
  app.route('/api/regions')
    .get(auth.requireLogin, region.query)
    .post(auth.requireLogin, region.save)

  app.route('/api/regions/:regionId([0-9a-fA-F]{24})')
    .get(auth.requireLogin, region.fetch)
    .put(auth.requireLogin, region.update)
    .delete(auth.requireLogin, region.delete)
}