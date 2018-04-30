const mongoose = require('mongoose')
const pagination = require('pagination')

const Region = mongoose.model('Region')

module.exports.query = async (req, res, next) => {
  const sort = req.query.sort || '-createdAt'
  let page = Number(req.query.page) || 1
  let limit = Number(req.query.limit) || 10

  if (req.query.all) {
    page = 1
    limit = 0
  }

  let skip = (page - 1) * limit || 0

  let regions, total
  try {
    const cond = {status: Region.status.active}
    regions = await Region.find(cond).sort(sort).skip(skip).limit(limit)
    total = await Region.count(cond)
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
    data: regions,
    paginator: paginator.getPaginationData(),
    page, limit, skip, sort
  }

  res.json(results)
}

module.exports.save = async (req, res, next) => {
  // Validate request body
  req.check('name', 'region_name_empty').notEmpty()
  req.check('description', 'region_description_empty').notEmpty()

  const errors = req.validationErrors()

  if (errors) return res.status(400).json({ errors })

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