const { loadRoutes } = require('../../../core/libs/utils')

module.exports = (app, addon) => {
  app.route('/')
    .get((req, res, next) => res.redirect('/region'))

  loadRoutes(__dirname, app, addon)
}