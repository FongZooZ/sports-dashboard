const index = require('../controllers')
const { loadRoutes } = require('../../../core/libs/utils')
const dashboard = require('../views/dashboard.marko')

module.exports = (app, addon) => {
  app.route('/')
    .get(index.home)

  app.route('/watch/:matchId([0-9a-fA-F]{24})')
    .get(index.watch)

  app.route('/dashboard')
    .get((req, res, next) => {
      res.marko(dashboard)
    })

  loadRoutes(__dirname, app, addon)
}