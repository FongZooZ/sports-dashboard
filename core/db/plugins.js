/**
 * Mark new object as new
 * @param {Object} schema Mongoose schema
 */
module.exports.wasNew = schema => {
  schema.pre('save', next => {
    this.wasNew = this.isNew
    next()
  })

  schema.post('save', function () {
    if (this.wasNew) {

    }
  })
}

/**
 * Save created and modified time
 * @param {Object} schema Mongoose schema
 */
module.exports.lastModified = (schema) => {
  schema.add({
    createdAt: { type: Date, default: Date.now },
    modifiedAt: Date
  })
}