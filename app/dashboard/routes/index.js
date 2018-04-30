const index = require('../controllers')
const dashboard = require('../controllers/dashboard')
const { loadRoutes } = require('../../../core/libs/utils')
const dashboardTemplate = require('../views/dashboard.marko')
const auth = require('../../../core/middlewares/authorization')

module.exports = (app, passport) => {
  app.route('/')
    .get(index.home)

  app.route('/watch/:matchId([0-9a-fA-F]{24})')
    .get(index.watch)

  app.route('/dashboard')
    .get(auth.requireLogin, (req, res, next) => {
      res.marko(dashboardTemplate)
    })

  app.route('/login')
    .get(dashboard.login)

  loadRoutes(__dirname, app, passport)
}