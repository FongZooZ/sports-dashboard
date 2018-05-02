const user = require('../controllers/user')
const auth = require('../../../core/middlewares/authorization')

module.exports = (app, passport) => {
  app.route('/api/users')
    .post(user.register)

  app.route('/api/users/login')
    .post(passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/login' }))

  app.route('/api/users/logout')
    .get(auth.requireLogin, user.logout)
}