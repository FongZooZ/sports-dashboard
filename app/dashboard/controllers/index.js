const mongoose = require('mongoose')

const Match = mongoose.model('Match')

const homepage = require('../views/home.marko')

const home = async (req, res, next) => {
  let matches = []

  try {
    matches = await Match.find({status: Match.status.active}).sort({startAt: 1})
  } catch (err) {
    return next(err)
  }

  res.marko(homepage, {
    matches
  })
}

module.exports = {
  home
}