const user = require('../controllers/user')

module.exports = app => {
  app.route('/api/users')
    .post(user.create)
}