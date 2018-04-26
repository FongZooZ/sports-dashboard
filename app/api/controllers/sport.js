const mongoose = require('mongoose')
const pagination = require('pagination')

const Sport = mongoose.model('Sport')

module.exports.query = async (req, res, next) => {
  const sort = req.query.sort || '-createdAt'
  let page = Number(req.query.page) || 1
  let limit = Number(req.query.limit) || 10

  if (req.query.all) {
    page = 1
    limit = 0
  }

  let skip = (page - 1) * limit || 0

  let sports, total
  try {
    const cond = {status: Sport.status.active}
    sports = await Sport.find(cond).sort(sort).skip(skip).limit(limit)
    total = await Sport.count(cond)
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
    data: sports,
    paginator: paginator.getPaginationData(),
    page, limit, skip, sort
  }

  res.json(results)
}

module.exports.save = async (req, res, next) => {
  // Validate request body
  req.check('name', 'sport_name_empty').notEmpty()
  req.check('description', 'sport_description_empty').notEmpty()

  if (req.body.isIndividual) {
    req.check('isIndividual', 'is_individual_invalid').isBoolean()
  }

  const errors = req.validationErrors()

  if (errors) return res.status(400).json({ errors })

  const { name, logo, isIndividual, description } = req.body

  const sport = new Sport({ name, logo, isIndividual, description })

  try {
    await sport.save()
  } catch (err) {
    return next(err)
  }

  res.json(sport)
}

module.exports.update = async (req, res, next) => {
  let sport
  try {
    const cond = {
      _id: req.params.sportId,
      status: Sport.status.active
    }
    sport = await Sport.findOne(cond)
  } catch (err) {
    return next(err)
  }

  if (!sport) return res.status(400).json({ message: 'SPORT_NOT_FOUND' })

  Object.assign(sport, req.body)

  try {
    await sport.save()
  } catch (err) {
    return next(err)
  }

  res.json(sport)
}

module.exports.fetch = async (req, res, next) => {
  let sport
  try {
    const cond = {
      _id: req.params.sportId,
      status: Sport.status.active
    }
    sport = await Sport.findOne(cond)
  } catch (err) {
    return next(err)
  }

  if (!sport) return res.status(400).json({ message: 'SPORT_NOT_FOUND' })

  res.json(sport)
}

module.exports.delete = async (req, res, next) => {
  let sport
  try {
    const cond = {
      _id: req.params.sportId,
      status: Sport.status.active
    }
    sport = await Sport.findOne(cond)
  } catch (err) {
    return next(err)
  }

  if (!sport) return res.status(400).json({ message: 'SPORT_NOT_FOUND' })

  sport.status = Sport.status.removed
  try {
    await sport.save()
  } catch (err) {
    return next(err)
  }

  res.json(sport)
}