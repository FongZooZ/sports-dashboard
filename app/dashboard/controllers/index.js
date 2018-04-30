const mongoose = require('mongoose')

const Match = mongoose.model('Match')

const homepage = require('../views/home.marko')
const matchpage = require('../views/match.marko')

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

const watch = async (req, res, next) => {
  const { matchId } = req.params
  if (!matchId) return next()

  let match
  try {
    match = await Match.findOne({_id: matchId, status: Match.status.active})
  } catch (err) {
    return next(err)
  }

  if (!match) return next()

  res.marko(matchpage, {match})
}

module.exports = {
  home,
  watch
}