const sport = require('../controllers/sport')

module.exports = app => {
  app.route('/api/sports')
    .get(sport.query)
    .post(sport.save)

  app.route('/api/sports/:sportId([0-9a-fA-F]{24})')
    .get(sport.fetch)
    .put(sport.update)
    .delete(sport.delete)
}