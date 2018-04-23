const mongoose = require('mongoose')

const Sport = mongoose.model('Sport')

// TODO: filter with conditions on querystring
module.exports.query = async (req, res, next) => {
  let sports
  try {
    const cond = {
      status: Sport.status.active
    }
    sports = await Sport.find(cond)
  } catch (err) {
    return next(err)
  }

  res.json(sports)
}

module.exports.save = async (req, res, next) => {
  // Validate request body
  req.check('name', 'sport_name_empty').notEmpty()
  req.check('description', 'sport_description_empty').notEmpty()
  req.check('isIndividual', 'is_individual_invalid').isBoolean()

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
    return next(err);
  }

  res.json(sport)
}