// Utilities for Express app

const fs = require('fs')
const path = require('path')

const config = require('../config')

/**
 * Load any route in `cwd` and apply those to the app. No exception!
 * @param {String} cwd Current working directory
 * @param {Any} args Arguments
 */
const loadRoutes = (cwd, ...args) => {
  const files = fs.readdirSync(cwd)
  for (let index in files) {
    const file = files[index]
    if (file === 'index.js') continue
    // skip non-javascript files
    if (path.extname(file) != '.js') continue

    const route = require(path.resolve(cwd, path.basename(file)))

    if (typeof route === 'function') {
      route(...args)
    }
  }
}

/**
 * Walk modules path and callback for each file
 * @param {String} modulesPath Path of modules directory
 * @param {String} excludeDir Directory to be excluded
 * @param {Function} callback Callback function
 */
const walk = (modulesPath, excludeDir, callback) => {
  fs.readdirSync(modulesPath).forEach(file => {
    var newPath = path.join(modulesPath, file)
    var stat = fs.statSync(newPath)
    if (stat.isFile() && /(.*)\.(js|coffee)$/.test(file)) {
      callback(newPath)
    } else if (stat.isDirectory() && file !== excludeDir) {
      walk(newPath, excludeDir, callback)
    }
  })
}

module.exports = {
  loadRoutes,
  walk
}