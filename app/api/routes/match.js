const match = require('../controllers/match')

module.exports = app => {
  app.route('/api/match')
    .get(match.query)
    .post(match.save)

  app.route('/api/match/:matchId([0-9a-fA-F]{24})')
    .get(match.fetch)
    .delete(match.delete)
}