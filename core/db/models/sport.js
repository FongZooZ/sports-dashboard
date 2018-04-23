const mongoose = require('mongoose')
const _ = require('lodash')

const { lastModified } = require('../plugins')

const Schema = mongoose.Schema
const statics = {
  status: {
    active: 'active',
    removed: 'removed'
  }
}

const SportSchema = new Schema({
  name: String,
  logo: String,
  description: String,
  isIndividual: Boolean,
  status: { type: String, enum: _.values(statics.status), default: statics.status.active }
})

SportSchema.statics = statics

SportSchema.plugin(lastModified)

module.exports = mongoose.model('Sport', SportSchema, 'Sport')