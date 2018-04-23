const sport = require('../controllers/sport')

module.exports = app => {
  app.route('/api/sport')
    .get(sport.query)
    .post(sport.save)

  app.route('/api/sport/:sportId([0-9a-fA-F]{24})')
    .get(sport.fetch)
    .delete(sport.delete)
}