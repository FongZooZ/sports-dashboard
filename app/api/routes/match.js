const match = require('../controllers/match')
const auth = require('../../../core/middlewares/authorization')

module.exports = app => {
  app.route('/api/matches')
    .get(auth.requireLogin, match.query)
    .post(auth.requireLogin, match.save)

  app.route('/api/matches/:matchId([0-9a-fA-F]{24})')
    .get(auth.requireLogin, match.fetch)
    .put(auth.requireLogin, match.update)
    .delete(auth.requireLogin, match.delete)
}