const { loadRoutes } = require('../../../core/libs/utils')
const layout = require('../views/layout.marko')

module.exports = (app, addon) => {
  app.route('/')
    .get((req, res, next) => {
      res.marko(layout)
    })

  loadRoutes(__dirname, app, addon)
}