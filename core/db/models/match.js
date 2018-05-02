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
  logo1: String,
  logo2: String,
  team1Info: String,
  team2Info: String,
  startAt: Date,
  status: { type: String, enum: _.values(statics.status), default: statics.status.active },
  isIndividual: Boolean
})

MatchSchema.statics = statics

MatchSchema.plugin(lastModified)

MatchSchema.index({ name: 1 })
MatchSchema.index({ createdAt: -1 })
MatchSchema.index({ status: 'text' })
MatchSchema.index({ startAt: -1 })
MatchSchema.index({ region: 1 })
MatchSchema.index({ sport: 1 })

module.exports = mongoose.model('Match', MatchSchema, 'Match')