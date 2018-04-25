const match = require('../controllers/match')

module.exports = app => {
  app.route('/api/matches')
    .get(match.query)
    .post(match.save)

  app.route('/api/matches/:matchId([0-9a-fA-F]{24})')
    .get(match.fetch)
    .put(match.update)
    .delete(match.delete)
}