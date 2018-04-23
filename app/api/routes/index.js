const { loadRoutes } = require('../../../core/libs/utils')

module.exports = (app, addon) => {
  loadRoutes(__dirname, app, addon)
}