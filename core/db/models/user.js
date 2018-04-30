const mongoose = require('mongoose')
const crypto = require('crypto')
const _ = require('lodash')

const {
  lastModified
} = require('../plugins')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: String,
  email: String,
  hashed_password: String,
  salt: String
})

UserSchema.plugin(lastModified)

UserSchema.virtual('password').set(function(password) {
  this._password = password
  this.salt = this.makeSalt()
  this.hashed_password = this.hashPassword(password)
}).get(function() {
  return this._password
})

UserSchema.virtual('secretKey').get(function() {
  return this.hashPassword('user_secret_key')
})

UserSchema.methods = {
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64')
  },
  hashPassword: function(password) {
    if (!password || !this.salt) return ''
    var salt = new Buffer(this.salt, 'base64')
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64')
  },
  authenticate: function(password) {
    return this.hashPassword(password) === this.hashed_password
  },
  strip: function() {
    return _.pick(this, ['_id', 'username', 'email'])
  }
}

module.exports = mongoose.model('User', UserSchema, 'User')