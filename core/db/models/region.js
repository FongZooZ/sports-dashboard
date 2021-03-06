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
  status: { type: String, enum: _.values(statics.status), default: statics.status.active }
})

RegionSchema.statics = statics

RegionSchema.plugin(lastModified)

RegionSchema.index({ name: 1 })
RegionSchema.index({ createdAt: -1 })
RegionSchema.index({ status: 'text' })

module.exports = mongoose.model('Region', RegionSchema, 'Region')