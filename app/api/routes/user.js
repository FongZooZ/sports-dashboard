const user = require('../controllers/user')

module.exports = (app, passport) => {
  app.route('/api/users')
    .post(user.create)

  app.route('/api/users/login')
    .post(passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/login' }))

  app.route('/api/users/logout')
    .get(user.logout)
}