const mongoose = require('mongoose')

const Region = mongoose.model('Region')

// TODO: filter with conditions on querystring
module.exports.query = async (req, res, next) => {
  let regions
  try {
    const cond = {
      status: Region.status.active
    }
    regions = await Region.find(cond)
  } catch (err) {
    return next(err)
  }

  res.json(regions)
}

module.exports.save = async (req, res, next) => {
  // Validate request body
  req.check('name', 'region_name_empty').notEmpty()
  req.check('description', 'region_description_empty').notEmpty()

  const errors = req.validationErrors()

  if (errors) return res.status(400).json({ errors })

  console.log(req.body)
  let keywords
  if (req.body.keywords) {
    keywords = req.body.keywords.map(keyword => keyword.trim())
  }

  const { name, description, logo } = req.body

  const region = new Region({ name, description, logo, keywords })

  try {
    await region.save()
  } catch (err) {
    return next(err)
  }

  res.json(region)
}

module.exports.update = async (req, res, next) => {
  let region
  try {
    const cond = {
      _id: req.params.regionId,
      status: Region.status.active
    }
    region = await Region.findOne(cond)
  } catch (err) {
    return next(err)
  }

  if (!region) return res.status(400).json({ message: 'REGION_NOT_FOUND' })

  Object.assign(region, req.body)

  try {
    await region.save()
  } catch (err) {
    return next(err)
  }

  res.json(region)
}

module.exports.fetch = async (req, res, next) => {
  let region
  try {
    const cond = {
      _id: req.params.regionId,
      status: Region.status.active
    }
    region = await Region.findOne(cond)
  } catch (err) {
    return next(err)
  }

  if (!region) return res.status(400).json({ message: 'REGION_NOT_FOUND' })

  res.json(region)
}

module.exports.delete = async (req, res, next) => {
  let region
  try {
    const cond = {
      _id: req.params.regionId,
      status: Region.status.active
    }
    region = await Region.findOne(cond)
  } catch (err) {
    return next(err)
  }

  if (!region) return res.status(400).json({ message: 'REGION_NOT_FOUND' })

  region.status = Region.status.removed
  try {
    await region.save()
  } catch (err) {
    return next(err)
  }

  res.json(region)
}