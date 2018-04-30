const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')

const User = mongoose.model('User')

const init = passport => {
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await User.findOne({username: username})
        if (!user) return done(null, false)
        if (user.hashed_password != user.hashPassword(password)) return done(null, false)
        return done(null, user.strip())
      } catch (err) {
        return done(err)
      }
    }
  ))

  passport.serializeUser((user, done) => done(null, user))

  passport.deserializeUser((user, done) => done(null, user))
}

module.exports = {
  init
}