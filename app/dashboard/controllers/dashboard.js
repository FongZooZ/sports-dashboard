const mongoose = require('mongoose')

const loginTemplate = require('../views/login.marko')

const User = mongoose.model('User')

const login = async (req, res, next) => {
  let count = 0
  try {
    count = await User.count()
  } catch (err) {
    return next(err)
  }
  if (!count) return res.redirect('/register')

  res.marko(loginTemplate)
}

module.exports = {
  login
}