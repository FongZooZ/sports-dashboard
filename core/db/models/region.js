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

const RegionSchema = new Schema({
  name: String,
  logo: String,
  keywords: [String],
  description: String,
  status: { type: String, enum: _.values(statics.status) }
})

RegionSchema.statics = statics

RegionSchema.plugin(lastModified)

module.exports = mongoose.model('Region', RegionSchema, 'Region')