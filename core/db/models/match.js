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

const MatchSchema = new Schema({
  name: String,
  keywords: [String],
  description: String,
  streamUrl: String,
  region: { type: Schema.ObjectId, ref: 'Region' },
  sport: { type: Schema.ObjectId, ref: 'Sport' },
  startAt: Date,
  status: { type: String, enum: _.values(statics.status), default: statics.status.active }
})

MatchSchema.statics = statics

MatchSchema.plugin(lastModified)

module.exports = mongoose.model('Match', MatchSchema, 'Match')