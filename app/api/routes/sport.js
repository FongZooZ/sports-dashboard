const sport = require('../controllers/sport')
const auth = require('../../../core/middlewares/authorization')

module.exports = app => {
  app.route('/api/sports')
    .get(auth.requireLogin, sport.query)
    .post(auth.requireLogin, sport.save)

  app.route('/api/sports/:sportId([0-9a-fA-F]{24})')
    .get(auth.requireLogin, sport.fetch)
    .put(auth.requireLogin, sport.update)
    .delete(auth.requireLogin, sport.delete)
}