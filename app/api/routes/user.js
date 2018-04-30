const user = require('../controllers/user')

module.exports = (app, passport) => {
  app.route('/api/users')
    .post(user.create)

  app.post('/api/users/login', passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/login' }))
}