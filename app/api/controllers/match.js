const mongoose = require('mongoose')

const Match = mongoose.model('Match')

// TODO: filter with conditions on querystring
module.exports.query = async (req, res, next) => {
  let matchs
  try {
    const cond = {
      status: Match.status.active
    }
    matchs = await Match.find(cond)
      .populate({
        path: 'region',
        select: {
          name: 1
        }
      }).populate({
        path: 'sport',
        select: {
          name: 1
        }
      })
  } catch (err) {
    return next(err)
  }

  res.json(matchs)
}

module.exports.save = async (req, res, next) => {
  // Validate request body
  req.check('name', 'match_name_empty').notEmpty()
  req.check('description', 'match_description_empty').notEmpty()
  req.check('region', 'region_empty').notEmpty()
  req.check('sport', 'sport_empty').notEmpty()
  req.check('startAt', 'start_time_empty').notEmpty()

  const errors = req.validationErrors()

  if (errors) return res.status(400).json({ errors })

  let keywords
  if (req.body.keywords) {
    keywords = req.body.keywords.map(keyword => keyword.trim())
  }

  const { name, description, region, sport, startAt } = req.body

  const match = new Match({ name, description, region, sport, startAt, keywords })

  try {
    await match.save()
  } catch (err) {
    return next(err)
  }

  res.json(match)
}

module.exports.update = async (req, res, next) => {
  let match
  try {
    const cond = {
      _id: req.params.matchId,
      status: Match.status.active
    }
    match = await Match.findOne(cond)
  } catch (err) {
    return next(err)
  }

  if (!match) return res.status(400).json({ message: 'MATCH_NOT_FOUND' })

  Object.assign(match, req.body)

  try {
    await match.save()
  } catch (err) {
    return next(err)
  }

  res.json(match)
}

module.exports.fetch = async (req, res, next) => {
  let match
  try {
    const cond = {
      _id: req.params.matchId,
      status: Match.status.active
    }
    match = await Match.findOne(cond).populate({
      path: 'region',
      select: {
        name: 1
      }
    }).populate({
      path: 'sport',
      select: {
        name: 1
      }
    })
  } catch (err) {
    return next(err)
  }

  if (!match) return res.status(400).json({ message: 'MATCH_NOT_FOUND' })

  res.json(match)
}

module.exports.delete = async (req, res, next) => {
  let match
  try {
    const cond = {
      _id: req.params.matchId,
      status: Match.status.active
    }
    match = await Match.findOne(cond)
  } catch (err) {
    return next(err)
  }

  if (!match) return res.status(400).json({ message: 'MATCH_NOT_FOUND' })

  match.status = Match.status.removed
  try {
    await match.save()
  } catch (err) {
    return next(err)
  }

  res.json(match)
}