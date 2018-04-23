const mongoose = require('mongoose')

const { lastModified } = require('../plugins')

const Schema = mongoose.Schema

const MatchSchema = new Schema({
  name: String,
  keywords: [String],
  description: String,
  streamUrl: String,
  region: { type: Schema.ObjectId, ref: 'Region' },
  sport: { type: Schema.ObjectId, ref: 'Sport' },
  startAt: Date
})

MatchSchema.plugin(lastModified)

module.exports = mongoose.model('Match', MatchSchema, 'Match')