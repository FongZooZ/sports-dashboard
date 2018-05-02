const mongoose = require('mongoose')
const pagination = require('pagination')
const _ = require('lodash')

const Match = mongoose.model('Match')
const Sport = mongoose.model('Sport')

module.exports.query = async (req, res, next) => {
  const sort = req.query.sort || '-createdAt'
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit || 0

  let matches, total
  try {
    const cond = {status: Match.status.active}
    matches = await Match.find(cond)
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
      }).sort(sort).skip(skip).limit(limit)
    total = await Match.count(cond)
  } catch (err) {
    return next(err)
  }

  const paginator = new pagination.SearchPaginator({
    prelink: req.url,
    current: page,
    rowsPerPage: limit,
    totalResult: total,
  })

  const results = {
    data: matches,
    paginator: paginator.getPaginationData(),
    page, limit, skip, sort
  }

  res.json(results)
}

module.exports.save = async (req, res, next) => {
  // Validate request body
  req.check('name', 'match_name_empty').notEmpty()
  req.check('description', 'match_description_empty').notEmpty()
  req.check('region', 'region_empty').notEmpty()
  req.check('sport', 'sport_empty').notEmpty()
  req.check('startAt', 'start_time_empty').notEmpty()
  req.check('streamUrl', 'stream_url_empty').notEmpty()

  let sportInstance
  if (req.body.sport) {
    try {
      sportInstance = await Sport.findOne({_id: req.body.sport})
    } catch (err) {
      return next(err)
    }
    if (sportInstance && !sportInstance.isIndividual) {
      req.check('logo1', 'logo1_empty').notEmpty()
      req.check('logo2', 'logo2_empty').notEmpty()
      req.check('team1Info', 'team1_info_empty').notEmpty()
      req.check('team2Info', 'team2_info_empty').notEmpty()
    }
  }

  const errors = req.validationErrors()

  if (errors) return res.status(400).json({ errors })

  let keywords
  if (req.body.keywords) {
    keywords = req.body.keywords.map(keyword => keyword.trim())
  }

  let pickFields = ['name', 'description', 'region', 'sport', 'startAt']
  if (!sportInstance.isIndividual) pickFields = pickFields.concat(['logo1', 'logo2', 'team1Info', 'team2Info'])
  const matchData = _.pick(req.body, pickFields)

  let match = new Match({...matchData, keywords})

  try {
    await match.save()
    match = await Match.findOne({_id: match._id}).populate({
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